import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';
import { supabase } from '../lib/supabase';
import { Order, CreateOrderData, OrderContextType, OrderStatus } from '../types/order';

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (context === undefined) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};

interface OrderProviderProps {
  children: React.ReactNode;
}

export const OrderProvider: React.FC<OrderProviderProps> = ({ children }) => {
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

  const loadUserOrders = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*),
          order_status_history (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setOrders(data || []);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

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

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          order_number: orderNumber,
          total_amount: totalAmount,
          shipping_address: orderData.shipping_address,
          billing_address: orderData.billing_address || orderData.shipping_address, // Use shipping address as fallback
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
        // More detailed error information
        const errorMessage = `Order creation failed: ${orderError.message} (Code: ${orderError.code})`;
        throw new Error(errorMessage);
      }


      // Create order items
      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.product_id, // Use product_id, not cart item id
        product_name: item.name,
        price: item.price,
        product_image: item.image, // Store the product image URL
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
        // More detailed error logging
        const errorMessage = `Error getting order: ${error.message} (Code: ${error.code})`;
        console.error(errorMessage);
        
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
          *,
          order_items (*),
          order_status_history (*)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

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
        // More detailed error information
        const errorMessage = `Order status update failed: ${error.message} (Code: ${error.code})`;
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  };

  const cancelOrder = async (orderId: string, reason?: string): Promise<void> => {
    await updateOrderStatus(orderId, 'cancelled', reason);
  };

  // Helper function to generate order number
  const generateOrderNumber = async (): Promise<string> => {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
    
    // Get count of orders for today
    const { count } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString().slice(0, 10));

    const orderNumber = `${dateStr}-${String((count || 0) + 1).padStart(4, '0')}`;
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
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
};
