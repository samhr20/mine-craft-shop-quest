import React, { useState, useEffect } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Package, 
  ArrowLeft,
  Eye,
  Filter,
  MoreHorizontal
} from 'lucide-react';
import { Link } from 'react-router-dom';
import AdminAccessGuard from '../components/AdminAccessGuard';
import { supabase } from '../lib/supabase';
import { getProductImage } from '../lib/image-utils';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string;
  stock: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

const AdminProducts: React.FC = () => {
  const { isAdmin, hasPermission, loading } = useAdmin();
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState<string[]>([]);


  // Load products and categories
  useEffect(() => {
    if (isAdmin && hasPermission('products')) {
      loadProducts();
      loadCategories();
    }
  }, [isAdmin, hasPermission]);

  // Filter products based on search and category
  useEffect(() => {
    let filtered = products;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory]);

  const loadProducts = async () => {
    try {
      setLoadingProducts(true);
      console.log('Loading products...', { isAdmin, hasPermission: hasPermission('products') });
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading products:', error);
        alert(`Error loading products: ${error.message}`);
        return;
      }

      console.log('Products loaded successfully:', data?.length || 0, 'products');
      setProducts(data || []);
    } catch (error) {
      console.error('Exception loading products:', error);
      alert(`Exception loading products: ${error}`);
    } finally {
      setLoadingProducts(false);
    }
  };

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('name')
        .order('name');

      if (error) {
        return;
      }

      setCategories(data?.map(cat => cat.name) || []);
    } catch (error) {
    }
  };

  const handleDeleteProduct = async (productId: string, productName: string) => {
    if (!window.confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) {
        alert('Failed to delete product. Please try again.');
        return;
      }

      // Reload products
      await loadProducts();
      alert('Product deleted successfully!');
    } catch (error) {
      alert('Failed to delete product. Please try again.');
    }
  };

  const formatPrice = (price: number) => {
    return `₹${price.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <AdminAccessGuard requiredPermission="products">
    <div className="min-h-screen bg-gradient-to-br from-minecraft-dirt via-minecraft-stone to-minecraft-grass p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-minecraft text-white drop-shadow-lg mb-2">
                Product Management
              </h1>
              <p className="text-white/80 font-minecraft text-lg">
                Manage your Minecraft products and inventory
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/admin">
                <Button variant="ghost" className="text-white hover:text-white/80 font-minecraft">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <Link to="/admin/products/add">
                <Button className="bg-minecraft-grass hover:bg-minecraft-grass/90 text-white font-minecraft">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/95 backdrop-blur-xl border-2 border-minecraft-diamond/50 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-minecraft">Total Products</p>
                  <p className="text-3xl font-bold text-minecraft-diamond font-minecraft">
                    {products.length}
                  </p>
                </div>
                <Package className="w-8 h-8 text-minecraft-diamond/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-xl border-2 border-minecraft-grass/50 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-minecraft">Featured Products</p>
                  <p className="text-3xl font-bold text-minecraft-grass font-minecraft">
                    {products.filter(p => p.is_featured).length}
                  </p>
                </div>
                <Eye className="w-8 h-8 text-minecraft-grass/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-xl border-2 border-minecraft-redstone/50 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-minecraft">Categories</p>
                  <p className="text-3xl font-bold text-minecraft-redstone font-minecraft">
                    {categories.length}
                  </p>
                </div>
                <Filter className="w-8 h-8 text-minecraft-redstone/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-xl border-2 border-minecraft-gold/50 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-minecraft">Total Value</p>
                  <p className="text-3xl font-bold text-minecraft-gold font-minecraft">
                    {formatPrice(products.reduce((sum, p) => sum + p.price, 0))}
                  </p>
                </div>
                <Package className="w-8 h-8 text-minecraft-gold/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="bg-white/95 backdrop-blur-xl border-2 border-minecraft-stone/50 shadow-xl mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 font-minecraft"
                  />
                </div>
              </div>
              <div className="md:w-48">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 border border-minecraft-stone/30 rounded-md font-minecraft bg-white"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card className="bg-white/95 backdrop-blur-xl border-2 border-minecraft-stone/50 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl font-minecraft text-gray-800 flex items-center gap-2">
              <Package className="w-5 h-5 text-minecraft-diamond" />
              Products ({filteredProducts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-minecraft text-gray-800 mb-2">No Products Found</h3>
                <p className="text-muted-foreground font-minecraft mb-4">
                  {searchTerm || selectedCategory !== 'all' 
                    ? 'Try adjusting your search or filter criteria.'
                    : 'Get started by adding your first product!'
                  }
                </p>
                {!searchTerm && selectedCategory === 'all' && (
                  <Link to="/admin/products/add">
                    <Button className="bg-minecraft-grass hover:bg-minecraft-grass/90 text-white font-minecraft">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Product
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-minecraft-stone/20">
                      <th className="text-left p-4 font-minecraft text-gray-800">Product</th>
                      <th className="text-left p-4 font-minecraft text-gray-800">Category</th>
                      <th className="text-left p-4 font-minecraft text-gray-800">Price</th>
                      <th className="text-left p-4 font-minecraft text-gray-800">Stock</th>
                      <th className="text-left p-4 font-minecraft text-gray-800">Featured</th>
                      <th className="text-left p-4 font-minecraft text-gray-800">Created</th>
                      <th className="text-left p-4 font-minecraft text-gray-800">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => (
                      <tr key={product.id} className="border-b border-minecraft-stone/10 hover:bg-muted/20">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={getProductImage(product.image_url, product.name)}
                              alt={product.name}
                              className="w-12 h-12 object-cover rounded border border-minecraft-stone/30"
                            />
                            <div>
                              <p className="font-minecraft font-medium text-gray-800">{product.name}</p>
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {product.description}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline" className="font-minecraft">
                            {product.category}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <span className="font-minecraft font-semibold text-minecraft-diamond">
                            {formatPrice(product.price)}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="font-minecraft">
                            {product.stock}
                          </span>
                        </td>
                        <td className="p-4">
                          {product.is_featured ? (
                            <Badge className="bg-minecraft-gold text-white font-minecraft">
                              Featured
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground font-minecraft">-</span>
                          )}
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-muted-foreground font-minecraft">
                            {formatDate(product.created_at)}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Link to={`/admin/products/edit/${product.id}`}>
                              <Button variant="outline" size="sm" className="font-minecraft">
                                <Edit className="w-4 h-4 mr-1" />
                                Edit
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteProduct(product.id, product.name)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 font-minecraft"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
    </AdminAccessGuard>
  );
};

export default AdminProducts;
