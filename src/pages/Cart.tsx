import React from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { ShoppingCart, Trash2, ArrowLeft, CreditCard, Package, Truck, Shield } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { usePageSEO } from '@/hooks/useSEO';

const Cart: React.FC = () => {
  // Set SEO for cart page
  usePageSEO('cart');
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice, loading } = useCart();

  const handleCheckout = () => {
    if (!user) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-minecraft-dirt via-minecraft-stone to-minecraft-grass p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-16">
            <div className="w-16 h-16 border-4 border-minecraft-diamond/30 border-t-minecraft-diamond rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white font-minecraft text-lg">Loading your cart...</p>
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

          {/* Empty Cart */}
          <Card className="bg-white/95 backdrop-blur-xl border-2 border-minecraft-diamond/50 shadow-2xl">
            <CardContent className="p-12 text-center">
              <div className="w-24 h-24 bg-minecraft-diamond/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="w-12 h-12 text-minecraft-diamond" />
              </div>
              <h2 className="text-3xl font-minecraft text-gray-800 mb-4">Your Cart is Empty</h2>
              <p className="text-gray-600 font-minecraft text-lg mb-8">
                Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-minecraft-dirt via-minecraft-stone to-minecraft-grass p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-minecraft text-white drop-shadow-lg">Shopping Cart</h1>
            <Badge className="bg-minecraft-diamond text-white font-minecraft text-lg px-4 py-2">
              {totalItems} {totalItems === 1 ? 'item' : 'items'}
            </Badge>
          </div>
          <Link to="/products">
            <Button variant="ghost" className="text-white hover:text-white/80 font-minecraft">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="xl:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="bg-white/95 backdrop-blur-xl border-2 border-minecraft-stone/50 shadow-xl">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                    {/* Product Image */}
                    <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg border border-minecraft-stone/30"
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0 w-full sm:w-auto">
                      <h3 className="text-base sm:text-lg font-minecraft font-semibold text-gray-800 mb-2 line-clamp-2">
                        {item.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-lg sm:text-xl md:text-2xl font-minecraft font-bold text-minecraft-diamond">
                          ₹{item.price.toFixed(2)}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.product_id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                        </Button>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.product_id, Math.max(1, item.quantity - 1))}
                          className="w-7 h-7 sm:w-8 sm:h-8 p-0 border-minecraft-stone/50 hover:border-minecraft-diamond text-sm"
                        >
                          -
                        </Button>
                        <span className="w-10 sm:w-12 text-center font-minecraft text-gray-700 text-sm sm:text-base">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                          className="w-7 h-7 sm:w-8 sm:h-8 p-0 border-minecraft-stone/50 hover:border-minecraft-diamond text-sm"
                        >
                          +
                        </Button>
                      </div>

                      {/* Item Total */}
                      <div className="text-right">
                        <div className="text-base sm:text-lg font-minecraft font-bold text-gray-800">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500 font-minecraft">
                          ₹{item.price.toFixed(2)} each
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Clear Cart Button */}
            <div className="text-right">
              <Button
                variant="outline"
                onClick={clearCart}
                className="text-red-600 border-red-300 hover:bg-red-50 font-minecraft"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Cart
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="bg-white/95 backdrop-blur-xl border-2 border-minecraft-diamond/50 shadow-xl">
              <CardHeader>
                <CardTitle className="text-xl font-minecraft text-gray-800">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Summary Items */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-minecraft">
                    <span>Subtotal ({totalItems} items)</span>
                    <span>₹{totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-minecraft">
                    <span>Shipping</span>
                    <span className="text-minecraft-grass">Free</span>
                  </div>
                  <div className="flex justify-between text-sm font-minecraft">
                    <span>Tax</span>
                    <span>₹{(totalPrice * 0.08).toFixed(2)}</span>
                  </div>
                </div>

                <Separator className="border-minecraft-stone/30" />

                {/* Total */}
                <div className="flex justify-between text-lg font-minecraft font-bold">
                  <span>Total</span>
                  <span className="text-minecraft-diamond">
                    ₹{(totalPrice * 1.08).toFixed(2)}
                  </span>
                </div>

                {/* Checkout Button */}
                <Button 
                  onClick={handleCheckout}
                  className="w-full bg-minecraft-grass hover:bg-minecraft-grass/90 text-white font-minecraft text-lg py-3"
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Proceed to Checkout
                </Button>

                {/* Shipping Info */}
                <div className="bg-minecraft-grass/10 border border-minecraft-grass/20 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-sm text-minecraft-grass font-minecraft">
                    <Truck className="w-4 h-4" />
                    <span>Free shipping on orders over ₹500</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <Card className="bg-white/95 backdrop-blur-xl border-2 border-minecraft-stone/50 shadow-xl">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Package className="w-4 h-4 text-minecraft-diamond" />
                    <span>Secure checkout</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Truck className="w-4 h-4 text-minecraft-grass" />
                    <span>Fast delivery</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Shield className="w-4 h-4 text-minecraft-redstone" />
                    <span>30-day returns</span>
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

export default Cart;