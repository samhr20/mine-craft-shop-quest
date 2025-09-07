import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

// Cache for storing fetched data
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>();

// Cache TTL (Time To Live) in milliseconds
const CACHE_TTL = {
  products: 5 * 60 * 1000, // 5 minutes
  categories: 10 * 60 * 1000, // 10 minutes
  orders: 2 * 60 * 1000, // 2 minutes
  user: 5 * 60 * 1000, // 5 minutes
};

// Helper function to get cached data
const getCachedData = (key: string) => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < cached.ttl) {
    return cached.data;
  }
  cache.delete(key);
  return null;
};

// Helper function to set cached data
const setCachedData = (key: string, data: any, ttl: number) => {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl
  });
};

// Optimized products hook with caching
export const useOptimizedProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    const cacheKey = 'products';
    const cachedData = getCachedData(cacheKey);
    
    if (cachedData) {
      setProducts(cachedData);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setProducts(data || []);
      setCachedData(cacheKey, data || [], CACHE_TTL.products);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, loading, error, refetch: fetchProducts };
};

// Optimized categories hook with caching
export const useOptimizedCategories = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    const cacheKey = 'categories';
    const cachedData = getCachedData(cacheKey);
    
    if (cachedData) {
      setCategories(cachedData);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (fetchError) throw fetchError;

      setCategories(data || []);
      setCachedData(cacheKey, data || [], CACHE_TTL.categories);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, loading, error, refetch: fetchCategories };
};

// Optimized orders hook with pagination
export const useOptimizedOrders = (userId: string, limit: number = 10) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchOrders = useCallback(async (offset: number = 0, reset: boolean = false) => {
    const cacheKey = `orders_${userId}_${offset}`;
    const cachedData = getCachedData(cacheKey);
    
    if (cachedData && !reset) {
      if (reset) {
        setOrders(cachedData);
      } else {
        setOrders(prev => [...prev, ...cachedData]);
      }
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await supabase
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
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (fetchError) throw fetchError;

      const newOrders = data || [];
      setHasMore(newOrders.length === limit);
      
      if (reset) {
        setOrders(newOrders);
      } else {
        setOrders(prev => [...prev, ...newOrders]);
      }
      
      setCachedData(cacheKey, newOrders, CACHE_TTL.orders);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  }, [userId, limit]);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchOrders(orders.length, false);
    }
  }, [loading, hasMore, orders.length, fetchOrders]);

  const refetch = useCallback(() => {
    setOrders([]);
    fetchOrders(0, true);
  }, [fetchOrders]);

  useEffect(() => {
    if (userId) {
      fetchOrders(0, true);
    }
  }, [userId, fetchOrders]);

  return { orders, loading, error, hasMore, loadMore, refetch };
};

// Clear cache function
export const clearCache = (key?: string) => {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
};

// Preload critical data
export const preloadCriticalData = async () => {
  try {
    // Preload products and categories in parallel
    const [productsPromise, categoriesPromise] = await Promise.allSettled([
      supabase.from('products').select('*').limit(20),
      supabase.from('categories').select('*')
    ]);

    if (productsPromise.status === 'fulfilled') {
      setCachedData('products', productsPromise.value.data || [], CACHE_TTL.products);
    }

    if (categoriesPromise.status === 'fulfilled') {
      setCachedData('categories', categoriesPromise.value.data || [], CACHE_TTL.categories);
    }
  } catch (error) {
    console.error('Error preloading data:', error);
  }
};
