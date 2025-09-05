import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';
import { getProductImage } from '../lib/image-utils';

interface CartItem {
  id: string;
  product_id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id' | 'product_id' | 'quantity'>) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  totalPrice: number;
  loading: boolean;
  showLoginPopup: boolean;
  setShowLoginPopup: (show: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const { user } = useAuth();

  // Load cart from database when user changes
  useEffect(() => {
    if (user) {
      loadCartFromDatabase();
    } else {
      // Clear cart when user logs out
      setItems([]);
      setLoading(false);
    }
  }, [user]);

  const loadCartFromDatabase = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // First, let's see what the cart_items table structure looks like
      const { data: cartData, error: cartError } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id);

      if (cartError) {
        return;
      }


      if (cartData && cartData.length > 0) {
        // Get the product details for each cart item
        const productIds = cartData.map(item => item.product_id);

        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('id, name, price, image_url')
          .in('id', productIds);

        if (productsError) {
          return;
        }


        // Create a map of product_id to product data
        const productsMap = new Map(productsData.map(p => [p.id, p]));

        // Transform the data to match our CartItem interface
        const transformedItems: CartItem[] = cartData.map(cartItem => {
          const product = productsMap.get(cartItem.product_id);
          if (!product) {
            return null;
          }

          return {
            id: cartItem.id,
            product_id: cartItem.product_id,
            name: product.name,
            price: product.price,
            image: getProductImage(product.image_url, product.name), // Use image utility
            quantity: cartItem.quantity,
          };
        }).filter(Boolean) as CartItem[];

        setItems(transformedItems);
      } else {
        setItems([]);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (item: Omit<CartItem, 'id' | 'product_id' | 'quantity'>) => {
    if (!user) {
      setShowLoginPopup(true);
      return;
    }

    try {
      
      // Get product ID from products table first
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('id')
        .eq('name', item.name)
        .single();

      if (productError) {
        return;
      }


      // Check if item already exists in cart by product_id
      const existingItem = items.find(i => i.product_id === productData.id);
      
      if (existingItem) {
        // Update quantity if item exists
        await updateQuantity(productData.id, existingItem.quantity + 1);
      } else {
        // Insert new cart item
        const { error } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: productData.id,
            quantity: 1,
          });

        if (error) {
          return;
        }

        // Reload cart from database to update frontend
        await loadCartFromDatabase();
      }
    } catch (error) {
    }
  };

  const removeItem = async (productId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) {
        return;
      }

      // Reload cart from database
      await loadCartFromDatabase();
    } catch (error) {
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!user) return;

    if (quantity <= 0) {
      await removeItem(productId);
      return;
    }

    try {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) {
        return;
      }

      // Reload cart from database
      await loadCartFromDatabase();
    } catch (error) {
    }
  };

  const clearCart = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        return;
      }

      setItems([]);
    } catch (error) {
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  useEffect(() => {
  }, [items]);

  const value: CartContextType = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    loading,
    showLoginPopup,
    setShowLoginPopup,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
