import React, { useState, useEffect } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  TrendingUp, 
  Settings, 
  Plus,
  Eye,
  Shield,
  Crown
} from 'lucide-react';
import { Link } from 'react-router-dom';
import AdminAccessGuard from '../components/AdminAccessGuard';
import { supabase } from '../lib/supabase';

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  featuredProducts: number;
  recentUsers: Array<{
    id: string;
    email: string;
    created_at: string;
    user_metadata: any;
  }>;
  recentProducts: Array<{
    id: string;
    name: string;
    price: number;
    category: string;
    created_at: string;
  }>;
}

const AdminDashboard: React.FC = () => {
  const { isAdmin, adminRole, hasPermission, loading } = useAdmin();
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    featuredProducts: 0,
    recentUsers: [],
    recentProducts: []
  });
  const [statsLoading, setStatsLoading] = useState(true);

  // Load dashboard statistics
  useEffect(() => {
    if (isAdmin) {
      loadDashboardStats();
    }
  }, [isAdmin]);

  const loadDashboardStats = async () => {
    try {
      setStatsLoading(true);

      // Get total users count from profiles table
      const { count: usersCount, error: usersError } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      if (usersError) {
      }

      // Get total products count
      const { count: productsCount, error: productsError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      if (productsError) {
      }

      // Get featured products count
      const { count: featuredCount, error: featuredError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('is_featured', true);

      if (featuredError) {
      }

      // Get recent users (last 5) from profiles
      const { data: recentUsers, error: recentUsersError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (recentUsersError) {
      }

      // Get recent products (last 5)
      const { data: recentProducts, error: recentProductsError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (recentProductsError) {
      }


      setStats({
        totalUsers: usersCount || 0,
        totalProducts: productsCount || 0,
        totalOrders: 0, // Will be implemented when orders table exists
        totalRevenue: 0, // Will be implemented when orders table exists
        featuredProducts: featuredCount || 0,
        recentUsers: recentUsers || [],
        recentProducts: recentProducts || []
      });
    } catch (error) {
    } finally {
      setStatsLoading(false);
    }
  };

  return (
    <AdminAccessGuard>
    <div className="min-h-screen bg-gradient-to-br from-minecraft-dirt via-minecraft-stone to-minecraft-grass p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-minecraft text-white drop-shadow-lg mb-2">
                Admin Dashboard
              </h1>
              <p className="text-white/80 font-minecraft text-lg">
                Welcome back, {user?.user_metadata?.username || 'Admin'}!
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-minecraft-diamond text-white font-minecraft text-lg px-4 py-2">
                {adminRole?.name || 'Admin'}
              </Badge>
              <Link to="/">
                <Button variant="ghost" className="text-white hover:text-white/80 font-minecraft">
                  Back to Store
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="bg-white/95 backdrop-blur-xl border-2 border-minecraft-diamond/50 shadow-xl">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground font-minecraft">Total Users</p>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-minecraft-diamond font-minecraft">
                    {stats.totalUsers.toLocaleString()}
                  </p>
                </div>
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-minecraft-diamond/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-xl border-2 border-minecraft-grass/50 shadow-xl">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground font-minecraft">Total Products</p>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-minecraft-grass font-minecraft">
                    {stats.totalProducts.toLocaleString()}
                  </p>
                </div>
                <Package className="w-6 h-6 sm:w-8 sm:h-8 text-minecraft-grass/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-xl border-2 border-minecraft-redstone/50 shadow-xl">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground font-minecraft">Total Orders</p>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-minecraft-redstone font-minecraft">
                    {stats.totalOrders.toLocaleString()}
                  </p>
                </div>
                <ShoppingCart className="w-6 h-6 sm:w-8 sm:h-8 text-minecraft-redstone/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-xl border-2 border-minecraft-gold/50 shadow-xl">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground font-minecraft">Total Revenue</p>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-minecraft-gold font-minecraft">
                    ₹{stats.totalRevenue.toLocaleString()}
                  </p>
                </div>
                <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-minecraft-gold/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-xl border-2 border-purple-500/50 shadow-xl">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground font-minecraft">Featured Products</p>
                  <p className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-600 font-minecraft">
                    {stats.featuredProducts}/6
                  </p>
                </div>
                <Eye className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Quick Actions */}
          <Card className="bg-white/95 backdrop-blur-xl border-2 border-minecraft-grass/50 shadow-xl">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl font-minecraft text-gray-800 flex items-center gap-2">
                <Settings className="w-4 h-4 sm:w-5 sm:h-5 text-minecraft-grass" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-3">
              {hasPermission('products') && (
                <Link to="/admin/products">
                  <Button variant="outline" className="w-full justify-start font-minecraft border-2 border-minecraft-grass/50 hover:border-minecraft-grass hover:bg-minecraft-grass/10 text-sm sm:text-base">
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-2 text-minecraft-grass" />
                    Add New Product
                  </Button>
                </Link>
              )}
              
          
              
              {hasPermission('users') && (
                <Link to="/admin/users">
                  <Button variant="outline" className="w-full justify-start font-minecraft border-2 border-minecraft-diamond/50 hover:border-minecraft-diamond hover:bg-minecraft-diamond/10">
                    <Users className="w-4 h-4 mr-2 text-minecraft-diamond" />
                    Manage Users
                  </Button>
                </Link>
              )}
              
              {hasPermission('orders') && (
                <Link to="/admin/orders">
                  <Button variant="outline" className="w-full justify-start font-minecraft border-2 border-minecraft-redstone/50 hover:border-minecraft-redstone hover:bg-minecraft-redstone/10">
                    <ShoppingCart className="w-4 h-4 mr-2 text-minecraft-redstone" />
                    View Orders
                  </Button>
                </Link>
              )}
              
              {hasPermission('analytics') && (
                <Link to="/admin/analytics">
                  <Button variant="outline" className="w-full justify-start font-minecraft border-2 border-minecraft-gold/50 hover:border-minecraft-gold hover:bg-minecraft-gold/10">
                    <TrendingUp className="w-4 h-4 mr-2 text-minecraft-gold" />
                    View Analytics
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-white/95 backdrop-blur-xl border-2 border-minecraft-diamond/50 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-minecraft text-gray-800 flex items-center gap-2">
                <Eye className="w-5 h-5 text-minecraft-diamond" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                <h4 className="font-minecraft font-semibold text-gray-800 mb-2">Recent Users</h4>
                <div className="space-y-2">
                  {stats.recentUsers.slice(0, 3).map((user) => {
                    // Try to get username from user_metadata, fallback to email prefix, then 'User'
                    const username =
                      user.user_metadata?.username ||
                      user.user_metadata?.full_name ||
                      user.email?.split('@')[0] ||
                      'User';
                    return (
                      <div key={user.id} className="flex items-center justify-between p-2 bg-muted/20 rounded">
                        <div>
                          <p className="text-sm font-minecraft font-medium">
                            {username}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(user.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">New</Badge>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h4 className="font-minecraft font-semibold text-gray-800 mb-2">Recent Products</h4>
                <div className="space-y-2">
                  {stats.recentProducts.slice(0, 3).map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-2 bg-muted/20 rounded">
                      <div>
                        <p className="text-sm font-minecraft font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          ₹{product.price} • {product.category}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">New</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Info */}
        <Card className="bg-white/95 backdrop-blur-xl border-2 border-minecraft-gold/50 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl font-minecraft text-gray-800 flex items-center gap-2">
              <Crown className="w-5 h-5 text-minecraft-gold" />
              Admin Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-minecraft-diamond/10 rounded-lg border border-minecraft-diamond/20">
                <Shield className="w-8 h-8 text-minecraft-diamond mx-auto mb-2" />
                <p className="text-sm text-muted-foreground font-minecraft">Role</p>
                <p className="text-lg font-bold text-minecraft-diamond font-minecraft capitalize">
                  {adminRole?.name || 'Admin'}
                </p>
              </div>
              
              <div className="text-center p-4 bg-minecraft-grass/10 rounded-lg border border-minecraft-grass/20">
                <Users className="w-8 h-8 text-minecraft-grass mx-auto mb-2" />
                <p className="text-sm text-muted-foreground font-minecraft">Permissions</p>
                <p className="text-lg font-bold text-minecraft-grass font-minecraft">
                  {Object.keys(adminRole?.permissions || {}).filter(key => adminRole?.permissions[key as keyof typeof adminRole.permissions]).length}
                </p>
              </div>
              
              <div className="text-center p-4 bg-minecraft-redstone/10 rounded-lg border border-minecraft-redstone/20">
                <TrendingUp className="w-8 h-8 text-minecraft-redstone mx-auto mb-2" />
                <p className="text-sm text-muted-foreground font-minecraft">Status</p>
                <p className="text-lg font-bold text-minecraft-redstone font-minecraft">
                  Active
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </AdminAccessGuard>
  );
};

export default AdminDashboard;
