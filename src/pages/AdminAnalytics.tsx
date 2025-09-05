import React, { useState, useEffect } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  ArrowLeft, 
  TrendingUp, 
  Users, 
  Package, 
  DollarSign,
  ShoppingCart,
  Heart,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Target
} from 'lucide-react';
import { Link } from 'react-router-dom';
import AdminAccessGuard from '../components/AdminAccessGuard';
import { supabase } from '../lib/supabase';

interface AnalyticsData {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  featuredProducts: number;
  totalCategories: number;
  userGrowth: Array<{
    month: string;
    count: number;
  }>;
  categoryDistribution: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
  priceDistribution: {
    under50: number;
    between50and100: number;
    between100and200: number;
    over200: number;
  };
  recentActivity: Array<{
    type: string;
    description: string;
    timestamp: string;
  }>;
}

const AdminAnalytics: React.FC = () => {
  const { isAdmin, hasPermission, loading } = useAdmin();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');


  // Load analytics data
  useEffect(() => {
    if (isAdmin && hasPermission('analytics')) {
      loadAnalyticsData();
    }
  }, [isAdmin, hasPermission, selectedPeriod]);

  const loadAnalyticsData = async () => {
    try {
      setLoadingAnalytics(true);

      // Get basic counts
      const [usersResult, productsResult, categoriesResult] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('categories').select('*', { count: 'exact', head: true })
      ]);

      // Get products with details
      const { data: productsData } = await supabase
        .from('products')
        .select('*');

      // Get users with creation dates
      const { data: usersData } = await supabase
        .from('profiles')
        .select('created_at')
        .order('created_at', { ascending: false });

      // Calculate user growth (last 6 months)
      const userGrowth = calculateUserGrowth(usersData || []);
      
      // Calculate category distribution
      const categoryDistribution = calculateCategoryDistribution(productsData || []);
      
      // Calculate price distribution
      const priceDistribution = calculatePriceDistribution(productsData || []);

      // Generate recent activity
      const recentActivity = generateRecentActivity(usersData || [], productsData || []);

      const analytics: AnalyticsData = {
        totalUsers: usersResult.count || 0,
        totalProducts: productsResult.count || 0,
        totalOrders: 0, // Will be implemented when orders table exists
        totalRevenue: 0, // Will be implemented when orders table exists
        featuredProducts: productsData?.filter(p => p.is_featured).length || 0,
        totalCategories: categoriesResult.count || 0,
        userGrowth,
        categoryDistribution,
        priceDistribution,
        recentActivity
      };

      setAnalyticsData(analytics);
    } catch (error) {
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const calculateUserGrowth = (users: any[]) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const currentDate = new Date();
    const growth = [];

    for (let i = 5; i >= 0; i--) {
      const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthUsers = users.filter(user => {
        const userDate = new Date(user.created_at);
        return userDate.getMonth() === targetDate.getMonth() && 
               userDate.getFullYear() === targetDate.getFullYear();
      }).length;

      growth.push({
        month: months[targetDate.getMonth()],
        count: monthUsers
      });
    }

    return growth;
  };

  const calculateCategoryDistribution = (products: any[]) => {
    const categoryCount: Record<string, number> = {};
    
    products.forEach(product => {
      categoryCount[product.category] = (categoryCount[product.category] || 0) + 1;
    });

    const total = products.length;
    return Object.entries(categoryCount).map(([category, count]) => ({
      category,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0
    })).sort((a, b) => b.count - a.count);
  };

  const calculatePriceDistribution = (products: any[]) => {
    return {
      under50: products.filter(p => p.price < 50).length,
      between50and100: products.filter(p => p.price >= 50 && p.price < 100).length,
      between100and200: products.filter(p => p.price >= 100 && p.price < 200).length,
      over200: products.filter(p => p.price >= 200).length
    };
  };

  const generateRecentActivity = (users: any[], products: any[]) => {
    const activities = [];

    // Add recent user registrations
    users.slice(0, 3).forEach(user => {
      activities.push({
        type: 'user',
        description: 'New user registered',
        timestamp: user.created_at
      });
    });

    // Add recent product additions
    products.slice(0, 2).forEach(product => {
      activities.push({
        type: 'product',
        description: `New product added: ${product.name}`,
        timestamp: product.created_at
      });
    });

    return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 5);
  };

  const formatPrice = (price: number) => {
    return `₹${price.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AdminAccessGuard requiredPermission="analytics">
    <div className="min-h-screen bg-gradient-to-br from-minecraft-dirt via-minecraft-stone to-minecraft-grass p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-minecraft text-white drop-shadow-lg mb-2">
                Analytics Dashboard
              </h1>
              <p className="text-white/80 font-minecraft text-lg">
                Insights and performance metrics for your Minecraft store
              </p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="p-2 border border-minecraft-stone/30 rounded-md font-minecraft bg-white/95"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <Link to="/admin">
                <Button variant="ghost" className="text-white hover:text-white/80 font-minecraft">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/95 backdrop-blur-xl border-2 border-minecraft-diamond/50 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-minecraft">Total Users</p>
                  <p className="text-3xl font-bold text-minecraft-diamond font-minecraft">
                    {analyticsData.totalUsers.toLocaleString()}
                  </p>
                </div>
                <Users className="w-8 h-8 text-minecraft-diamond/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-xl border-2 border-minecraft-grass/50 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-minecraft">Total Products</p>
                  <p className="text-3xl font-bold text-minecraft-grass font-minecraft">
                    {analyticsData.totalProducts.toLocaleString()}
                  </p>
                </div>
                <Package className="w-8 h-8 text-minecraft-grass/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-xl border-2 border-minecraft-redstone/50 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-minecraft">Featured Products</p>
                  <p className="text-3xl font-bold text-minecraft-redstone font-minecraft">
                    {analyticsData.featuredProducts.toLocaleString()}
                  </p>
                </div>
                <Target className="w-8 h-8 text-minecraft-redstone/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-xl border-2 border-minecraft-gold/50 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-minecraft">Categories</p>
                  <p className="text-3xl font-bold text-minecraft-gold font-minecraft">
                    {analyticsData.totalCategories.toLocaleString()}
                  </p>
                </div>
                <PieChart className="w-8 h-8 text-minecraft-gold/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts and Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* User Growth Chart */}
          <Card className="bg-white/95 backdrop-blur-xl border-2 border-minecraft-diamond/50 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-minecraft text-gray-800 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-minecraft-diamond" />
                User Growth (Last 6 Months)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.userGrowth.map((month, index) => (
                  <div key={month.month} className="flex items-center justify-between">
                    <span className="font-minecraft text-gray-800">{month.month}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 bg-muted/20 rounded-full h-2">
                        <div 
                          className="bg-minecraft-diamond h-2 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${Math.max(10, (month.count / Math.max(...analyticsData.userGrowth.map(m => m.count))) * 100)}%` 
                          }}
                        />
                      </div>
                      <span className="font-minecraft font-semibold text-minecraft-diamond w-8 text-right">
                        {month.count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card className="bg-white/95 backdrop-blur-xl border-2 border-minecraft-grass/50 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-minecraft text-gray-800 flex items-center gap-2">
                <PieChart className="w-5 h-5 text-minecraft-grass" />
                Product Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.categoryDistribution.map((category, index) => (
                  <div key={category.category} className="flex items-center justify-between">
                    <span className="font-minecraft text-gray-800">{category.category}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 bg-muted/20 rounded-full h-2">
                        <div 
                          className="bg-minecraft-grass h-2 rounded-full transition-all duration-500"
                          style={{ width: `${category.percentage}%` }}
                        />
                      </div>
                      <span className="font-minecraft font-semibold text-minecraft-grass w-12 text-right">
                        {category.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Price Distribution and Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Price Distribution */}
          <Card className="bg-white/95 backdrop-blur-xl border-2 border-minecraft-redstone/50 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-minecraft text-gray-800 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-minecraft-redstone" />
                Price Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-minecraft text-gray-800">Under ₹50</span>
                  <Badge className="bg-minecraft-grass text-white font-minecraft">
                    {analyticsData.priceDistribution.under50} products
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-minecraft text-gray-800">₹50 - ₹100</span>
                  <Badge className="bg-minecraft-diamond text-white font-minecraft">
                    {analyticsData.priceDistribution.between50and100} products
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-minecraft text-gray-800">₹100 - ₹200</span>
                  <Badge className="bg-minecraft-redstone text-white font-minecraft">
                    {analyticsData.priceDistribution.between100and200} products
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-minecraft text-gray-800">Over ₹200</span>
                  <Badge className="bg-minecraft-gold text-white font-minecraft">
                    {analyticsData.priceDistribution.over200} products
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="bg-white/95 backdrop-blur-xl border-2 border-minecraft-gold/50 shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-minecraft text-gray-800 flex items-center gap-2">
                <Activity className="w-5 h-5 text-minecraft-gold" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'user' ? 'bg-minecraft-diamond' : 'bg-minecraft-grass'
                    }`} />
                    <div className="flex-1">
                      <p className="font-minecraft text-gray-800 text-sm">
                        {activity.description}
                      </p>
                      <p className="text-xs text-muted-foreground font-minecraft">
                        {formatDate(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </AdminAccessGuard>
  );
};

export default AdminAnalytics;
