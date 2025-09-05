import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  CheckCircle, 
  Package, 
  Truck, 
  MapPin, 
  CreditCard,
  ArrowLeft,
  Home,
  ShoppingBag,
  Calendar,
  Hash,
  Clock
} from 'lucide-react';
import { useOrder } from '@/contexts/OrderContext';
import { Order } from '@/types/order';
import { getProductImage } from '@/lib/image-utils';
import LoadingSpinner from '@/components/LoadingSpinner';
import { usePageSEO } from '@/hooks/useSEO';

const OrderConfirmation: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { getOrder } = useOrder();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  // Set SEO for order confirmation page
  usePageSEO('cart', { 
    title: `Order Confirmation - ${order?.order_number || 'Order'} | MineCraft Store`,
    description: `Your order ${order?.order_number || ''} has been confirmed. Thank you for your purchase!`
  });

  useEffect(() => {
    const loadOrder = async () => {
      if (!orderId) {
        navigate('/');
        return;
      }

      try {
        setLoading(true);
        
        // Try to load the order, with retries if needed
        let orderData = await getOrder(orderId);
        
        // If order not found, wait a bit and try again (in case of timing issues)
        if (!orderData) {
          await new Promise(resolve => setTimeout(resolve, 1000));
          orderData = await getOrder(orderId);
        }
        
        if (orderData) {
          setOrder(orderData);
        } else {
          // Show error instead of redirecting immediately
          alert('Order not found. Please check your order history.');
          navigate('/');
        }
      } catch (error) {
        console.error('Error loading order:', error);
        alert('Error loading order. Please try again.');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId, getOrder, navigate]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_payment_verification': return 'bg-orange-100 text-orange-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-purple-100 text-purple-800';
      case 'shipped': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'returned': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (order: Order) => {
    // For UPI orders
    if (order.payment_method === 'upi') {
      if (order.status === 'pending_payment_verification') {
        return 'bg-orange-100 text-orange-800';
      }
      if (order.status === 'confirmed' || order.status === 'shipped' || order.status === 'delivered') {
        return 'bg-green-100 text-green-800';
      }
    }
    
    // For COD orders
    if (order.payment_method === 'cod') {
      if (order.status === 'delivered') {
        return 'bg-green-100 text-green-800';
      }
      return 'bg-yellow-100 text-yellow-800'; // Pending until delivery
    }
    
    return 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusText = (order: Order) => {
    // For UPI orders
    if (order.payment_method === 'upi') {
      if (order.status === 'pending_payment_verification') {
        return 'Payment Verification Pending';
      }
      if (order.status === 'confirmed' || order.status === 'shipped' || order.status === 'delivered') {
        return 'Payment Verified';
      }
    }
    
    // For COD orders
    if (order.payment_method === 'cod') {
      if (order.status === 'delivered') {
        return 'Payment Collected';
      }
      return 'Payment on Delivery';
    }
    
    return 'Payment Pending';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!order) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-minecraft-dirt via-minecraft-stone to-minecraft-grass">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          {order.status === 'pending_payment_verification' ? (
            <>
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-12 h-12 text-orange-600" />
              </div>
              <h1 className="text-4xl font-minecraft text-white mb-2">Payment Submitted!</h1>
              <p className="text-white/80 font-minecraft text-lg">
                Your payment details have been submitted for verification.
              </p>
              <p className="text-white/60 font-minecraft text-sm mt-2">
                We will verify your payment within 24 hours and update your order status.
              </p>
            </>
          ) : (
            <>
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h1 className="text-4xl font-minecraft text-white mb-2">Order Confirmed!</h1>
              <p className="text-white/80 font-minecraft text-lg">
                Thank you for your purchase. Your order has been successfully placed.
              </p>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Information */}
            <Card className="bg-white/95 backdrop-blur-xl border-2 border-minecraft-diamond/50">
              <CardHeader>
                <CardTitle className="text-2xl font-minecraft text-gray-800 flex items-center gap-2">
                  <Hash className="w-6 h-6 text-minecraft-diamond" />
                  Order Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-minecraft text-gray-600">Order Number</label>
                    <p className="font-minecraft text-lg font-semibold text-gray-800">
                      {order.order_number}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-minecraft text-gray-600">Order Date</label>
                    <p className="font-minecraft text-lg font-semibold text-gray-800">
                      {formatDate(order.created_at)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-minecraft text-gray-600">Order Status</label>
                    <Badge className={`font-minecraft ${getStatusColor(order.status)}`}>
                      {order.status === 'pending_payment_verification' 
                        ? 'Payment Verification Pending' 
                        : order.status === 'processing'
                        ? 'Processing'
                        : order.status === 'shipped'
                        ? 'Shipped'
                        : order.status === 'delivered'
                        ? 'Delivered'
                        : order.status === 'returned'
                        ? 'Returned'
                        : order.status === 'cancelled'
                        ? 'Cancelled'
                        : order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-minecraft text-gray-600">Payment Status</label>
                    <Badge className={`font-minecraft ${getPaymentStatusColor(order)}`}>
                      {getPaymentStatusText(order)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card className="bg-white/95 backdrop-blur-xl border-2 border-minecraft-diamond/50">
              <CardHeader>
                <CardTitle className="text-2xl font-minecraft text-gray-800 flex items-center gap-2">
                  <Package className="w-6 h-6 text-minecraft-diamond" />
                  Order Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.order_items?.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                      <img
                        src={item.product_image || getProductImage(`/products/${item.product_name.toLowerCase().replace(/\s+/g, '-')}.png`, item.product_name)}
                        alt={item.product_name}
                        className="w-16 h-16 object-cover rounded border"
                        onError={(e) => {
                          // Fallback to a default image if the product image fails to load
                          e.currentTarget.src = '/images/placeholder-product.png';
                        }}
                      />
                      <div className="flex-1">
                        <h4 className="font-minecraft text-lg font-semibold text-gray-800">
                          {item.product_name}
                        </h4>
                        <p className="font-minecraft text-sm text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-minecraft text-lg font-semibold text-gray-800">
                          ₹{item.total_price.toFixed(2)}
                        </p>
                        <p className="font-minecraft text-sm text-gray-600">
                          ₹{item.product_price.toFixed(2)} each
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card className="bg-white/95 backdrop-blur-xl border-2 border-minecraft-diamond/50">
              <CardHeader>
                <CardTitle className="text-2xl font-minecraft text-gray-800 flex items-center gap-2">
                  <MapPin className="w-6 h-6 text-minecraft-diamond" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="font-minecraft text-gray-800">
                  <p className="font-semibold text-lg">{order.customer_name}</p>
                  <p>{order.shipping_address}</p>
                  <p>PIN: {order.shipping_pincode}</p>
                  <p className="mt-2 text-sm text-gray-600">Phone: {order.customer_phone}</p>
                  <p className="text-sm text-gray-600">Email: {order.customer_email}</p>
                </div>
              </CardContent>
            </Card>

            {/* Payment Information */}
            <Card className="bg-white/95 backdrop-blur-xl border-2 border-minecraft-diamond/50">
              <CardHeader>
                <CardTitle className="text-2xl font-minecraft text-gray-800 flex items-center gap-2">
                  <CreditCard className="w-6 h-6 text-minecraft-diamond" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 font-minecraft text-gray-800">
                  <div className="flex justify-between">
                    <span>Payment Method:</span>
                    <span className="font-semibold capitalize">
                      {order.payment_method.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Amount:</span>
                    <span className="font-semibold text-lg">₹{order.total_amount.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-white/95 backdrop-blur-xl border-2 border-minecraft-diamond/50 sticky top-8">
              <CardHeader>
                <CardTitle className="text-xl font-minecraft text-gray-800">
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between font-minecraft text-sm">
                    <span>Subtotal:</span>
                    <span>₹{order.total_amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-minecraft text-sm">
                    <span>Shipping:</span>
                    <span className="text-green-600">FREE</span>
                  </div>
                  <div className="flex justify-between font-minecraft text-sm">
                    <span>Tax:</span>
                    <span>₹0.00</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-minecraft text-lg font-bold">
                    <span>Total:</span>
                    <span>₹{order.total_amount.toFixed(2)}</span>
                  </div>
                </div>

                {/* Next Steps */}
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-minecraft font-semibold text-gray-800 mb-3">What's Next?</h4>
                  <div className="space-y-2 text-sm font-minecraft text-gray-600">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Order confirmed and processing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                      <span>We'll prepare your items</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                      <span>Shipment tracking details</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                      <span>Delivery to your address</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-4">
                  <Link to="/orders" className="block">
                    <Button className="w-full bg-minecraft-diamond hover:bg-minecraft-diamond/90 text-white font-minecraft">
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      View All Orders
                    </Button>
                  </Link>
                  
                  <Link to="/products" className="block">
                    <Button variant="outline" className="w-full font-minecraft">
                      Continue Shopping
                    </Button>
                  </Link>
                  
                  <Link to="/" className="block">
                    <Button variant="ghost" className="w-full font-minecraft">
                      <Home className="w-4 h-4 mr-2" />
                      Back to Home
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderConfirmation;
