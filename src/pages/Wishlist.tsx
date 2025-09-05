import React from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Heart, Trash2, ArrowLeft, ShoppingCart, Package, Truck, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { usePageSEO } from '@/hooks/useSEO';

const Wishlist: React.FC = () => {
  // Set SEO for wishlist page
  usePageSEO('wishlist');
  const { items, removeFromWishlist, loading } = useWishlist();
  const { addItem } = useCart();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-minecraft-dirt via-minecraft-stone to-minecraft-grass p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-16">
            <div className="w-16 h-16 border-4 border-minecraft-diamond/30 border-t-minecraft-diamond rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white font-minecraft text-lg">Loading your wishlist...</p>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-minecraft-dirt via-minecraft-stone to-minecraft-grass p-4">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <Link to="/products">
              <Button variant="ghost" className="text-white hover:text-white/80 font-minecraft">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </div>

          {/* Empty Wishlist */}
          <Card className="bg-white/95 backdrop-blur-xl border-2 border-minecraft-diamond/50 shadow-2xl">
            <CardContent className="p-12 text-center">
              <div className="w-24 h-24 bg-minecraft-diamond/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-12 h-12 text-minecraft-diamond" />
              </div>
              <h2 className="text-3xl font-minecraft text-gray-800 mb-4">Your Wishlist is Empty</h2>
              <p className="text-gray-600 font-minecraft text-lg mb-8">
                Start adding items to your wishlist to save them for later!
              </p>
              <Link to="/products">
                <Button className="bg-minecraft-grass hover:bg-minecraft-grass/90 text-white font-minecraft text-lg px-8 py-3">
                  Start Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const rarityColors = {
    common: "bg-muted text-muted-foreground",
    rare: "bg-minecraft-diamond text-primary-foreground",
    epic: "bg-purple-600 text-primary-foreground",
    legendary: "bg-minecraft-gold text-primary-foreground",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-minecraft-dirt via-minecraft-stone to-minecraft-grass p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-minecraft text-white drop-shadow-lg">My Wishlist</h1>
            <Badge className="bg-minecraft-diamond text-white font-minecraft text-lg px-4 py-2">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </Badge>
          </div>
          <Link to="/products">
            <Button variant="ghost" className="text-white hover:text-white/80 font-minecraft">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Wishlist Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="bg-white/95 backdrop-blur-xl border-2 border-minecraft-stone/50 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    {/* Product Image */}
                    <div className="w-24 h-24 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg border border-minecraft-stone/30"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <Badge className={`inline-block px-2 py-1 text-xs ${rarityColors[item.rarity]} capitalize mb-2`}>
                            {item.rarity}
                          </Badge>
                          <p className="text-sm text-muted-foreground font-minecraft uppercase tracking-wide">
                            {item.category}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFromWishlist(item.product_id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </div>
                      
                      <h3 className="text-lg font-minecraft font-semibold text-gray-800 mb-2 line-clamp-2">
                        {item.name}
                      </h3>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-minecraft font-bold text-minecraft-diamond">
                          ₹{item.price.toFixed(2)}
                        </span>
                        
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addItem({
                              name: item.name,
                              price: item.price,
                              image: item.image,
                            })}
                            className="border-minecraft-stone/50 hover:border-minecraft-diamond"
                          >
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            Add to Cart
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Summary */}
          <div className="space-y-6">
            <Card className="bg-white/95 backdrop-blur-xl border-2 border-minecraft-diamond/50 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-minecraft text-gray-800">Wishlist Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-minecraft">
                    <span>Total Items</span>
                    <span>{items.length}</span>
                  </div>
                  <div className="flex justify-between text-sm font-minecraft">
                    <span>Total Value</span>
                    <span className="text-minecraft-diamond">
                      ₹{items.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
                    </span>
                  </div>
                </div>

                <Separator className="border-minecraft-stone/30" />

                <div className="space-y-3">
                  <Button 
                    className="w-full bg-minecraft-grass hover:bg-minecraft-grass/90 text-white font-minecraft py-3"
                    onClick={() => {
                      // Add all items to cart
                      items.forEach(item => {
                        addItem({
                          name: item.name,
                          price: item.price,
                          image: item.image,
                        });
                      });
                    }}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Add All to Cart
                  </Button>
                  
                  <Link to="/products">
                    <Button variant="outline" className="w-full font-minecraft">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card className="bg-white/95 backdrop-blur-xl border-2 border-minecraft-stone/50 shadow-xl">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Heart className="w-4 h-4 text-minecraft-redstone" />
                    <span>Save items for later</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Package className="w-4 h-4 text-minecraft-diamond" />
                    <span>Track price changes</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Shield className="w-4 h-4 text-minecraft-grass" />
                    <span>Secure wishlist</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
