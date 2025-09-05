import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Separator } from '../ui/separator';
import { 
  User, 
  Mail, 
  Calendar, 
  ShoppingCart, 
  Heart, 
  Settings, 
  LogOut, 
  Crown,
  Shield,
  Zap,
  Sparkles,
  Package
} from 'lucide-react';
import { Link } from 'react-router-dom';

const UserProfile: React.FC = () => {
  const { user, signOut } = useAuth();
  const { totalItems: cartItems } = useCart();
  const { items: wishlistItems } = useWishlist();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-minecraft-dirt via-minecraft-stone to-minecraft-grass p-4">
        <Card className="w-full max-w-md bg-white/95 backdrop-blur-xl border-2 border-minecraft-diamond/50 shadow-2xl">
          <CardContent className="p-6 text-center">
            <p className="text-gray-600 font-minecraft">Please log in to view your profile.</p>
            <Link to="/login">
              <Button className="mt-4">Go to Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const userInitials = `${user.user_metadata?.first_name?.[0] || ''}${user.user_metadata?.last_name?.[0] || ''}`;
  const joinDate = user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown';

  return (
    <div className="min-h-screen bg-gradient-to-br from-minecraft-dirt via-minecraft-stone to-minecraft-grass p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-minecraft-diamond/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-minecraft-grass/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-minecraft-redstone/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Floating Icons */}
      <div className="absolute top-20 left-20 animate-bounce delay-300">
        <Crown className="w-8 h-8 text-minecraft-diamond/30" />
      </div>
      <div className="absolute top-32 right-32 animate-bounce delay-700">
        <Shield className="w-6 h-6 text-minecraft-grass/30" />
      </div>
      <div className="absolute bottom-32 left-32 animate-bounce delay-1000">
        <Zap className="w-7 h-7 text-minecraft-redstone/30" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10 mt-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-minecraft text-white drop-shadow-lg mb-2">
            Your Profile
          </h1>
          <p className="text-white/80 font-minecraft text-lg">
            Manage your MineCraft Store account
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="bg-white/95 backdrop-blur-xl border-2 border-minecraft-diamond/50 shadow-2xl">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4">
                <Avatar className="w-24 h-24 border-4 border-minecraft-diamond/50">
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback className="bg-gradient-to-br from-minecraft-dirt via-minecraft-stone to-minecraft-grass text-white text-2xl font-minecraft">
                    {userInitials || 'U'}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-2xl font-minecraft text-gray-800">
                {user.user_metadata?.first_name} {user.user_metadata?.last_name}
              </CardTitle>
              <CardDescription className="text-gray-600 font-minecraft">
                @{user.user_metadata?.username || 'minecrafter'}
              </CardDescription>
              <Badge className="bg-minecraft-diamond text-white font-minecraft mt-2">
                <Crown className="w-3 h-3 mr-1" />
                Premium Member
              </Badge>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 text-gray-700">
                <Mail className="w-4 h-4 text-minecraft-redstone" />
                <span className="font-minecraft">{user.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Calendar className="w-4 h-4 text-minecraft-grass" />
                <span className="font-minecraft">Joined {joinDate}</span>
              </div>
              <Separator />
              <Button 
                onClick={handleSignOut} 
                disabled={isLoading}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-minecraft"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Signing Out...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </div>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-white/95 backdrop-blur-xl border-2 border-minecraft-grass/50 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-minecraft text-gray-800 flex items-center gap-2">
                <Zap className="w-5 h-5 text-minecraft-grass" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to="/cart">
                <Button variant="outline" className="w-full justify-start font-minecraft border-2 border-minecraft-grass/50 hover:border-minecraft-grass hover:bg-minecraft-grass/10">
                  <ShoppingCart className="w-4 h-4 mr-2 text-minecraft-grass" />
                  View Cart ({cartItems} items)
                </Button>
              </Link>
              <Link to="/wishlist">
                <Button variant="outline" className="w-full justify-start font-minecraft border-2 border-minecraft-diamond/50 hover:border-minecraft-diamond hover:bg-minecraft-diamond/10">
                  <Heart className="w-4 h-4 mr-2 text-minecraft-diamond" />
                  My Wishlist ({wishlistItems.length} items)
                </Button>
              </Link>
              <Link to="/orders">
                <Button variant="outline" className="w-full justify-start font-minecraft border-2 border-minecraft-gold/50 hover:border-minecraft-gold hover:bg-minecraft-gold/10">
                  <Package className="w-4 h-4 mr-2 text-minecraft-gold" />
                  My Orders
                </Button>
              </Link>
              <Link to="/products">
                <Button variant="outline" className="w-full justify-start font-minecraft border-2 border-minecraft-redstone/50 hover:border-minecraft-redstone hover:bg-minecraft-redstone/10">
                  <Sparkles className="w-4 h-4 mr-2 text-minecraft-redstone" />
                  Browse Products
                </Button>
              </Link>
              <Link to="/">
                <Button variant="outline" className="w-full justify-start font-minecraft border-2 border-minecraft-gold/50 hover:border-minecraft-gold hover:bg-minecraft-gold/10">
                  <Crown className="w-4 h-4 mr-2 text-minecraft-gold" />
                  Back to Home
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Account Stats */}
          <Card className="bg-white/95 backdrop-blur-xl border-2 border-minecraft-redstone/50 shadow-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-minecraft text-gray-800 flex items-center gap-2">
                <Settings className="w-5 h-5 text-minecraft-redstone" />
                Account Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-minecraft-diamond/10 rounded-lg border border-minecraft-diamond/20">
                <div className="text-2xl font-minecraft text-minecraft-diamond font-bold">{cartItems}</div>
                <div className="text-sm text-gray-600 font-minecraft">Cart Items</div>
              </div>
              <div className="text-center p-4 bg-minecraft-grass/10 rounded-lg border border-minecraft-grass/20">
                <div className="text-2xl font-minecraft text-minecraft-grass font-bold">{wishlistItems.length}</div>
                <div className="text-sm text-gray-600 font-minecraft">Wishlist Items</div>
              </div>
              <div className="text-center p-4 bg-minecraft-redstone/10 rounded-lg border border-minecraft-redstone/20">
                <div className="text-2xl font-minecraft text-minecraft-redstone font-bold">{cartItems + wishlistItems.length}</div>
                <div className="text-sm text-gray-600 font-minecraft">Total Items</div>
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
};

export default UserProfile;
