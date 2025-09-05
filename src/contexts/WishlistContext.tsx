import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';
import { getProductImage } from '../lib/image-utils';

interface WishlistItem {
  id: string;
  product_id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  rarity: "common" | "rare" | "epic" | "legendary";
}

interface WishlistContextType {
  items: WishlistItem[];
  addToWishlist: (item: Omit<WishlistItem, 'id' | 'product_id'>) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  loading: boolean;
  showLoginPopup: boolean;
  setShowLoginPopup: (show: boolean) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

interface WishlistProviderProps {
  children: React.ReactNode;
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({ children }) => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const { user } = useAuth();

  // Load wishlist from database when user changes
  useEffect(() => {
    if (user) {
      loadWishlistFromDatabase();
    } else {
      // Clear wishlist when user logs out
      setItems([]);
      setLoading(false);
    }
  }, [user]);

  const loadWishlistFromDatabase = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // Get wishlist items
      const { data: wishlistData, error: wishlistError } = await supabase
        .from('wishlist_items')
        .select('*')
        .eq('user_id', user.id);

      if (wishlistError) {
        return;
      }


      if (wishlistData && wishlistData.length > 0) {
        // Get the product details for each wishlist item
        const productIds = wishlistData.map(item => item.product_id);

        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('id, name, price, image_url, category')
          .in('id', productIds);

        if (productsError) {
          return;
        }


        // Create a map of product_id to product data
        const productsMap = new Map(productsData.map(p => [p.id, p]));

        // Transform the data to match our WishlistItem interface
        const transformedItems: WishlistItem[] = wishlistData.map(wishlistItem => {
          const product = productsMap.get(wishlistItem.product_id);
          if (!product) {
            return null;
          }

          // Determine rarity based on price
          let rarity: "common" | "rare" | "epic" | "legendary" = "common";
          if (product.price >= 250) rarity = "legendary";
          else if (product.price >= 150) rarity = "epic";
          else if (product.price >= 50) rarity = "rare";

          return {
            id: wishlistItem.id,
            product_id: wishlistItem.product_id,
            name: product.name,
            price: product.price,
            image: getProductImage(product.image_url, product.name),
            category: product.category,
            rarity,
          };
        }).filter(Boolean) as WishlistItem[];

        setItems(transformedItems);
      } else {
        setItems([]);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = async (item: Omit<WishlistItem, 'id' | 'product_id'>) => {
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


      // Check if item already exists in wishlist
      const existingItem = items.find(i => i.product_id === productData.id);
      
      if (existingItem) {
        return;
      }

      // Insert new wishlist item
      const { error } = await supabase
        .from('wishlist_items')
        .insert({
          user_id: user.id,
          product_id: productData.id,
        });

      if (error) {
        return;
      }

      // Reload wishlist from database to update frontend
      await loadWishlistFromDatabase();
    } catch (error) {
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('wishlist_items')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) {
        return;
      }

      // Reload wishlist from database
      await loadWishlistFromDatabase();
    } catch (error) {
    }
  };

  const isInWishlist = (productId: string): boolean => {
    return items.some(item => item.product_id === productId);
  };

  useEffect(() => {
  }, [items]);

  const value: WishlistContextType = {
    items,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    loading,
    showLoginPopup,
    setShowLoginPopup,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};
