import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';
import { supabase } from '../lib/supabase';
import { Order, CreateOrderData, OrderContextType, OrderStatus } from '../types/order';

const OptimizedOrderContext = createContext<OrderContextType | undefined>(undefined);

export const useOptimizedOrder = () => {
  const context = useContext(OptimizedOrderContext);
  if (context === undefined) {
    throw new Error('useOptimizedOrder must be used within an OptimizedOrderProvider');
  }
  return context;
};

interface OptimizedOrderProviderProps {
  children: React.ReactNode;
}

export const OptimizedOrderProvider: React.FC<OptimizedOrderProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const { items: cartItems, clearCart } = useCart();
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);

  // Load user orders when user changes
  useEffect(() => {
    if (user) {
      loadUserOrders();
    } else {
      setOrders([]);
      setCurrentOrder(null);
    }
  }, [user]);

  const loadUserOrders = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Optimized query - only fetch essential data first
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          order_number,
          status,
          total_amount,
          payment_method,
          created_at,
          order_items (
            id,
            product_name,
            quantity,
            price,
            total_price
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20); // Limit to recent 20 orders

      if (error) {
        throw error;
      }

      setOrders(data || []);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const createOrder = async (orderData: CreateOrderData): Promise<Order> => {
    if (!user) {
      throw new Error('User must be logged in to create an order');
    }

    if (cartItems.length === 0) {
      throw new Error('Cart is empty');
    }

    try {
      setLoading(true);

      // Calculate total amount
      const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      // Generate order number
      const orderNumber = await generateOrderNumber();

      // Set initial status based on payment method
      let initialStatus: string;
      let initialPaymentStatus: string;
      
      if (orderData.payment_method === 'upi') {
        initialStatus = 'pending_payment_verification';
        initialPaymentStatus = 'pending';
      } else { // COD
        initialStatus = 'confirmed';
        initialPaymentStatus = 'pending'; // Payment on delivery
      }

      // Create order with optimized data structure
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          order_number: orderNumber,
          total_amount: totalAmount,
          shipping_address: orderData.shipping_address,
          billing_address: orderData.billing_address || orderData.shipping_address,
          shipping_pincode: orderData.shipping_pincode,
          customer_name: orderData.customer_name,
          customer_phone: orderData.customer_phone,
          customer_email: orderData.customer_email,
          payment_method: orderData.payment_method,
          notes: orderData.notes,
          status: initialStatus,
          payment_status: initialPaymentStatus
        })
        .select()
        .single();

      if (orderError) {
        const errorMessage = `Order creation failed: ${orderError.message} (Code: ${orderError.code})`;
        throw new Error(errorMessage);
      }

      // Create order items with batch insert
      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.name,
        price: item.price,
        product_price: item.price,
        total_price: item.price * item.quantity,
        product_image: item.image,
        quantity: item.quantity
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        // If order items creation fails, delete the order
        await supabase.from('orders').delete().eq('id', order.id);
        const errorMessage = `Order items creation failed: ${itemsError.message} (Code: ${itemsError.code})`;
        throw new Error(errorMessage);
      }

      // Clear cart after successful order creation
      await clearCart();

      // Set current order
      setCurrentOrder(order);

      // Refresh orders list
      await loadUserOrders();

      return order;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getOrder = async (orderId: string): Promise<Order | null> => {
    if (!user) return null;

    try {
      // Check if order is already in our local state
      const localOrder = orders.find(order => order.id === orderId);
      if (localOrder) {
        return localOrder;
      }

      // Fetch full order details if not in local state
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*),
          order_status_history (*)
        `)
        .eq('id', orderId)
        .eq('user_id', user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Order not found
        }
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error getting order:', error);
      return null;
    }
  };

  const getUserOrders = async (): Promise<Order[]> => {
    if (!user) return [];
    
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          order_number,
          status,
          total_amount,
          payment_method,
          created_at,
          order_items (
            id,
            product_name,
            quantity,
            price,
            total_price
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50); // Limit to 50 most recent orders

      if (error) {
        throw error;
      }

      const userOrders = data || [];
      setOrders(userOrders);
      return userOrders;
    } catch (error) {
      console.error('Error loading user orders:', error);
      return [];
    }
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus, notes?: string): Promise<void> => {
    if (!user) {
      throw new Error('User must be logged in');
    }

    try {
      const { error } = await supabase
        .from('orders')
        .update({
          status,
          notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) {
        const errorMessage = `Order status update failed: ${error.message} (Code: ${error.code})`;
        throw new Error(errorMessage);
      }

      // Update local state
      setOrders(prev => prev.map(order => 
        order.id === orderId 
          ? { ...order, status, notes, updated_at: new Date().toISOString() }
          : order
      ));
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  };

  const cancelOrder = async (orderId: string, reason?: string): Promise<void> => {
    await updateOrderStatus(orderId, 'cancelled', reason);
  };

  // Optimized order number generation
  const generateOrderNumber = async (): Promise<string> => {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    
    // Generate a unique order number with timestamp and random component
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    
    let orderNumber = `${dateStr}-${timestamp}-${random}`;
    
    // Check if this order number already exists (very unlikely but safety check)
    let attempts = 0;
    while (attempts < 3) { // Reduced attempts for better performance
      const { data: existingOrder } = await supabase
        .from('orders')
        .select('id')
        .eq('order_number', orderNumber)
        .single();
      
      if (!existingOrder) {
        break; // Order number is unique
      }
      
      // If it exists, generate a new one
      const newRandom = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
      orderNumber = `${dateStr}-${timestamp}-${newRandom}`;
      attempts++;
    }
    
    return orderNumber;
  };

  const value: OrderContextType = {
    orders,
    currentOrder,
    loading,
    createOrder,
    getOrder,
    getUserOrders,
    updateOrderStatus,
    cancelOrder
  };

  return (
    <OptimizedOrderContext.Provider value={value}>
      {children}
    </OptimizedOrderContext.Provider>
  );
};
