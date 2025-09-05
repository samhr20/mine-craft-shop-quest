import React, { useState, useEffect } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { 
  ArrowLeft, 
  Save, 
  Package,
  Tag,
  Eye,
  Hash
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import ImageUpload from '../components/ui/image-upload';
import AdminAccessGuard from '../components/AdminAccessGuard';

interface Category {
  id: string;
  name: string;
}

const AdminAddProduct: React.FC = () => {
  const { isAdmin, hasPermission, loading } = useAdmin();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image_url: '',
    stock: '',
    is_featured: false,
    rarity: 'common'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});


  // Load categories
  useEffect(() => {
    if (isAdmin && hasPermission('products')) {
      loadCategories();
    }
  }, [isAdmin, hasPermission]);

  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) {
        return;
      }

      setCategories(data || []);
    } catch (error) {
    } finally {
      setLoadingCategories(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Product description is required';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.stock || parseInt(formData.stock) < 0) {
      newErrors.stock = 'Valid stock quantity is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      // If making this product featured, check if we need to remove oldest featured product
      if (formData.is_featured) {
        const { data: featuredProducts, error: featuredError } = await supabase
          .from('products')
          .select('id, created_at')
          .eq('is_featured', true)
          .order('created_at', { ascending: true });

        if (featuredError) {
        } else if (featuredProducts && featuredProducts.length >= 6) {
          // Remove the oldest featured product
          const oldestFeatured = featuredProducts[0];
          const { error: updateError } = await supabase
            .from('products')
            .update({ is_featured: false })
            .eq('id', oldestFeatured.id);

          if (updateError) {
          } else {
          }
        }
      }

      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        category: formData.category,
        image_url: formData.image_url.trim() || 'placeholder.jpg',
        stock: parseInt(formData.stock),
        is_featured: formData.is_featured,
        rarity: formData.rarity
      };


      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select();

      if (error) {
        alert(`Failed to create product: ${error.message}`);
        return;
      }

      alert('Product created successfully!');
      navigate('/admin/products');
    } catch (error) {
      alert(`Failed to create product: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <AdminAccessGuard requiredPermission="products">
    <div className="min-h-screen bg-gradient-to-br from-minecraft-dirt via-minecraft-stone to-minecraft-grass p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-minecraft text-white drop-shadow-lg mb-2">
                Add New Product
              </h1>
              <p className="text-white/80 font-minecraft text-lg">
                Create a new Minecraft product for your store
              </p>
            </div>
            <Link to="/admin/products">
              <Button variant="ghost" className="text-white hover:text-white/80 font-minecraft">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Products
              </Button>
            </Link>
          </div>
        </div>

        {/* Add Product Form */}
        <Card className="bg-white/95 backdrop-blur-xl border-2 border-minecraft-grass/50 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl font-minecraft text-gray-800 flex items-center gap-2">
              <Package className="w-5 h-5 text-minecraft-grass" />
              Product Information
            </CardTitle>
            <CardDescription className="font-minecraft">
              Fill in the details for your new Minecraft product
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Product Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="font-minecraft text-gray-800">
                  Product Name *
                </Label>
                <div className="relative">
                  <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="name"
                    type="text"
                    placeholder="e.g., Diamond Sword"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`pl-10 font-minecraft ${errors.name ? 'border-red-500' : ''}`}
                  />
                </div>
                {errors.name && (
                  <p className="text-sm text-red-600 font-minecraft">{errors.name}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="font-minecraft text-gray-800">
                  Description *
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe your product..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className={`font-minecraft ${errors.description ? 'border-red-500' : ''}`}
                  rows={4}
                />
                {errors.description && (
                  <p className="text-sm text-red-600 font-minecraft">{errors.description}</p>
                )}
              </div>

              {/* Price and Stock Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Price */}
                <div className="space-y-2">
                  <Label htmlFor="price" className="font-minecraft text-gray-800">
                    Price (₹) *
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground font-minecraft">₹</span>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="0.00"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      className={`pl-8 font-minecraft ${errors.price ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.price && (
                    <p className="text-sm text-red-600 font-minecraft">{errors.price}</p>
                  )}
                </div>

                {/* Stock */}
                <div className="space-y-2">
                  <Label htmlFor="stock" className="font-minecraft text-gray-800">
                    Stock Quantity *
                  </Label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="stock"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={formData.stock}
                      onChange={(e) => handleInputChange('stock', e.target.value)}
                      className={`pl-10 font-minecraft ${errors.stock ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.stock && (
                    <p className="text-sm text-red-600 font-minecraft">{errors.stock}</p>
                  )}
                </div>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category" className="font-minecraft text-gray-800">
                  Category *
                </Label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className={`w-full p-2 pl-10 border border-minecraft-stone/30 rounded-md font-minecraft bg-white ${errors.category ? 'border-red-500' : ''}`}
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.category && (
                  <p className="text-sm text-red-600 font-minecraft">{errors.category}</p>
                )}
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label className="font-minecraft text-gray-800">
                  Product Image
                </Label>
                <ImageUpload
                  value={formData.image_url}
                  onChange={(value) => handleInputChange('image_url', value)}
                  placeholder="Upload product image or enter URL"
                />
                <p className="text-sm text-muted-foreground font-minecraft">
                  Upload an image file or enter a URL. Leave empty to use placeholder image.
                </p>
              </div>

              {/* Rarity Selection */}
              <div className="space-y-2">
                <Label htmlFor="rarity" className="font-minecraft text-gray-800">
                  Rarity *
                </Label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <select
                    id="rarity"
                    value={formData.rarity}
                    onChange={(e) => handleInputChange('rarity', e.target.value)}
                    className="w-full p-2 pl-10 border border-minecraft-stone/30 rounded-md font-minecraft bg-white"
                  >
                    <option value="common">Common (Gray)</option>
                    <option value="rare">Rare (Blue)</option>
                    <option value="epic">Epic (Purple)</option>
                    <option value="legendary">Legendary (Gold)</option>
                  </select>
                </div>
                <p className="text-sm text-muted-foreground font-minecraft">
                  Choose the rarity level for this product
                </p>
              </div>

              {/* Featured Product */}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="is_featured"
                  checked={formData.is_featured}
                  onChange={(e) => handleInputChange('is_featured', e.target.checked)}
                  className="w-4 h-4 text-minecraft-grass border-minecraft-stone/30 rounded focus:ring-minecraft-grass"
                />
                <Label htmlFor="is_featured" className="font-minecraft text-gray-800 flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Featured Product
                </Label>
              </div>
              <p className="text-sm text-muted-foreground font-minecraft">
                Featured products appear prominently on the homepage. Only 6 products can be featured at a time. Adding a new featured product will automatically remove the oldest one.
              </p>

              {/* Submit Button */}
              <div className="flex justify-end gap-4 pt-6">
                <Link to="/admin/products">
                  <Button type="button" variant="outline" className="font-minecraft">
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-minecraft-grass hover:bg-minecraft-grass/90 text-white font-minecraft"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Create Product
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
    </AdminAccessGuard>
  );
};

export default AdminAddProduct;
