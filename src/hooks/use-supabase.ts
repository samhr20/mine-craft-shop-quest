import { useState, useEffect } from 'react'
import { typedSupabase, Database } from '../lib/supabase'

type Product = Database['public']['Tables']['products']['Row']
type Category = Database['public']['Tables']['categories']['Row']

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const { data, error } = await typedSupabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setProducts(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products')
    } finally {
      setLoading(false)
    }
  }

  const addProduct = async (product: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await typedSupabase
        .from('products')
        .insert([product])
        .select()

      if (error) throw error
      if (data) {
        setProducts(prev => [data[0], ...prev])
      }
      return { success: true, data: data?.[0] }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add product')
      return { success: false, error: err instanceof Error ? err.message : 'Failed to add product' }
    }
  }

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    try {
      const { data, error } = await typedSupabase
        .from('products')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()

      if (error) throw error
      if (data) {
        setProducts(prev => prev.map(p => p.id === id ? data[0] : p))
      }
      return { success: true, data: data?.[0] }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product')
      return { success: false, error: err instanceof Error ? err.message : 'Failed to update product' }
    }
  }

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await typedSupabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) throw error
      setProducts(prev => prev.filter(p => p.id !== id))
      return { success: true }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product')
      return { success: false, error: err instanceof Error ? err.message : 'Failed to delete product' }
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return {
    products,
    loading,
    error,
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct
  }
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const { data, error } = await typedSupabase
        .from('categories')
        .select('*')
        .order('name', { ascending: true })

      if (error) throw error
      setCategories(data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  return {
    categories,
    loading,
    error,
    fetchCategories
  }
}
