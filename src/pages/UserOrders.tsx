import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { 
  Search, 
  Filter, 
  Eye, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  X,
  ArrowLeft,
  Calendar,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  Hash,
  Camera,
  FileText,
  Copy,
  ExternalLink
} from 'lucide-react';
import { useOrder } from '@/contexts/OrderContext';
import { useAuth } from '@/contexts/AuthContext';
import { Order } from '@/types/order';
import LoadingSpinner from '@/components/LoadingSpinner';
import { usePageSEO } from '@/hooks/useSEO';

const UserOrders: React.FC = () => {
  const navigate = useNavigate();
  const { getUserOrders } = useOrder();
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Set SEO for user orders page
  usePageSEO('cart', { 
    title: 'My Orders | MineCraft Store',
    description: 'View and track your order history at MineCraft Store'
  });

  useEffect(() => {
    const loadOrders = async () => {
      if (!user) {
        console.log('No user found, redirecting to login');
        navigate('/login');
        return;
      }

      try {
        console.log('Loading orders for user:', user.id);
        setLoading(true);
        setError(null);
        
        // Add timeout to prevent infinite loading
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Request timeout')), 10000); // 10 second timeout
        });
        
        const userOrdersPromise = getUserOrders();
        const userOrders = await Promise.race([userOrdersPromise, timeoutPromise]) as Order[];
        
        console.log('Loaded orders:', userOrders);
        setOrders(userOrders);
      } catch (error) {
        console.error('Error loading orders:', error);
        setError('Failed to load orders. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [user, navigate]); // Removed getUserOrders from dependencies


  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending_payment_verification':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-purple-100 text-purple-800';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'returned':
        return 'bg-orange-100 text-orange-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending_payment_verification':
        return 'Payment Verification Pending';
      case 'confirmed':
        return 'Order Confirmed';
      case 'processing':
        return 'Processing';
      case 'shipped':
        return 'Shipped';
      case 'delivered':
        return 'Delivered';
      case 'returned':
        return 'Returned';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const getPaymentStatusColor = (order: Order) => {
    if (order.payment_method === 'upi') {
      if (order.status === 'pending_payment_verification') {
        return 'bg-yellow-100 text-yellow-800';
      } else if (['confirmed', 'processing', 'shipped', 'delivered'].includes(order.status)) {
        return 'bg-green-100 text-green-800';
      } else {
        return 'bg-red-100 text-red-800';
      }
    } else if (order.payment_method === 'cod') {
      if (order.status === 'delivered') {
        return 'bg-green-100 text-green-800';
      } else {
        return 'bg-blue-100 text-blue-800';
      }
    }
    return 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusText = (order: Order) => {
    if (order.payment_method === 'upi') {
      if (order.status === 'pending_payment_verification') {
        return 'Payment Verification Pending';
      } else if (['confirmed', 'processing', 'shipped', 'delivered'].includes(order.status)) {
        return 'Payment Verified';
      } else {
        return 'Payment Failed';
      }
    } else if (order.payment_method === 'cod') {
      if (order.status === 'delivered') {
        return 'Payment Received';
      } else {
        return 'Payment on Delivery';
      }
    }
    return 'Unknown';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const extractUPIDetails = (notes: string) => {
    if (!notes) return null;
    
    const transactionIdMatch = notes.match(/Transaction ID: ([A-Z0-9]+)/i);
    const hasScreenshot = notes.includes('Screenshot uploaded');
    const screenshotUrlMatch = notes.match(/Screenshot URL: ([^\s]+)/i);
    const screenshotUrl = screenshotUrlMatch ? screenshotUrlMatch[1] : null;
    
    return {
      transactionId: transactionIdMatch ? transactionIdMatch[1] : null,
      hasScreenshot,
      screenshotUrl
    };
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.status.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const copyOrderDetails = () => {
    if (!selectedOrder) return;
    
    const details = `Order #${selectedOrder.order_number}
Date: ${formatDate(selectedOrder.created_at)}
Status: ${getStatusText(selectedOrder.status)}
Payment: ${getPaymentStatusText(selectedOrder)}
Total: ₹${(selectedOrder.total_amount || 0).toFixed(2)}
Items: ${selectedOrder.order_items?.length || 0} item(s)`;
    
    navigator.clipboard.writeText(details);
  };


  if (!user) {
    return <LoadingSpinner />; // Show loading while checking authentication
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-minecraft-dirt via-minecraft-stone to-minecraft-grass">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-white hover:text-white/80 font-minecraft mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          
          <h1 className="text-4xl font-minecraft text-white mb-2">My Orders</h1>
          <p className="text-white/80 font-minecraft text-lg">
            Track and manage your order history
          </p>
          
        </div>

        {/* Search and Filter */}
        <Card className="bg-white/95 backdrop-blur-xl border-2 border-minecraft-diamond/50 mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by order number or status..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 font-minecraft"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg font-minecraft bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="pending_payment_verification">Payment Verification</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="returned">Returned</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="bg-red-50 border-red-200 mb-6">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 text-red-800">
                <X className="w-5 h-5" />
                <span className="font-minecraft font-semibold">Error</span>
              </div>
              <p className="text-red-700 font-minecraft mt-2">{error}</p>
              <Button
                onClick={() => window.location.reload()}
                className="mt-3 bg-red-600 hover:bg-red-700 text-white font-minecraft"
              >
                Retry
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Orders List */}
        {!error && filteredOrders.length === 0 ? (
          <Card className="bg-white/95 backdrop-blur-xl border-2 border-minecraft-diamond/50">
            <CardContent className="p-12 text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-minecraft text-gray-600 mb-2">No Orders Found</h3>
              <p className="text-gray-500 font-minecraft">
                {searchTerm || statusFilter !== 'all' 
                  ? 'No orders match your search criteria.' 
                  : 'You haven\'t placed any orders yet.'}
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Button
                  onClick={() => navigate('/')}
                  className="mt-4 bg-minecraft-diamond hover:bg-minecraft-diamond/90 text-white font-minecraft"
                >
                  Start Shopping
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="bg-white/95 backdrop-blur-xl border-2 border-minecraft-diamond/50 hover:border-minecraft-diamond transition-colors">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                        <h3 className="text-lg sm:text-xl font-minecraft font-semibold text-gray-800">
                          Order #{order.order_number}
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          <Badge className={`${getStatusColor(order.status)} font-minecraft text-xs`}>
                            {getStatusText(order.status)}
                          </Badge>
                          <Badge className={`${getPaymentStatusColor(order)} font-minecraft text-xs`}>
                            {getPaymentStatusText(order)}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm font-minecraft text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(order.created_at)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4" />
                          <span>{order.order_items?.length || 0} item(s)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4" />
                          <span className="font-semibold">₹{(order.total_amount || 0).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          console.log('Order data structure:', order);
                          console.log('Shipping address type:', typeof order.shipping_address);
                          console.log('Shipping address value:', order.shipping_address);
                          setSelectedOrder(order);
                          setShowDetails(true);
                        }}
                        variant="outline"
                        className="font-minecraft"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Order Details Modal */}
        {showDetails && selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-minecraft font-bold text-gray-800">
                    Order Details
                  </h2>
                  <div className="flex gap-2">
                    <Button
                      onClick={copyOrderDetails}
                      variant="outline"
                      size="sm"
                      className="font-minecraft"
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Details
                    </Button>
                    <Button
                      onClick={() => setShowDetails(false)}
                      variant="outline"
                      size="sm"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {/* Order Information */}
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg font-minecraft flex items-center gap-2">
                          <Hash className="w-5 h-5 text-minecraft-diamond" />
                          Order Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between font-minecraft text-sm">
                          <span className="text-gray-600">Order Number:</span>
                          <span className="font-semibold">#{selectedOrder.order_number}</span>
                        </div>
                        <div className="flex justify-between font-minecraft text-sm">
                          <span className="text-gray-600">Order Date:</span>
                          <span className="font-semibold">{formatDate(selectedOrder.created_at)}</span>
                        </div>
                        <div className="flex justify-between font-minecraft text-sm">
                          <span className="text-gray-600">Status:</span>
                          <Badge className={`${getStatusColor(selectedOrder.status)} font-minecraft`}>
                            {getStatusText(selectedOrder.status)}
                          </Badge>
                        </div>
                        <div className="flex justify-between font-minecraft text-sm">
                          <span className="text-gray-600">Payment Status:</span>
                          <Badge className={`${getPaymentStatusColor(selectedOrder)} font-minecraft`}>
                            {getPaymentStatusText(selectedOrder)}
                          </Badge>
                        </div>
                        <div className="flex justify-between font-minecraft text-sm">
                          <span className="text-gray-600">Payment Method:</span>
                          <span className="font-semibold">
                            {selectedOrder.payment_method === 'upi' ? 'UPI Payment' : 'Cash on Delivery'}
                          </span>
                        </div>
                        <div className="flex justify-between font-minecraft text-sm">
                          <span className="text-gray-600">Total Amount:</span>
                          <span className="font-semibold text-lg text-minecraft-diamond">
                            ₹{(selectedOrder.total_amount || 0).toFixed(2)}
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Customer Details */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg font-minecraft flex items-center gap-2">
                          <Phone className="w-5 h-5 text-minecraft-diamond" />
                          Customer Details
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center gap-2 font-minecraft text-sm">
                          <span className="text-gray-600">Name:</span>
                          <span className="font-semibold">
                            {selectedOrder.customer_name || 
                             (typeof selectedOrder.shipping_address === 'object' ? selectedOrder.shipping_address?.name : null) || 
                             'N/A'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 font-minecraft text-sm">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <span className="font-semibold">
                            {selectedOrder.customer_phone || 
                             (typeof selectedOrder.shipping_address === 'object' ? selectedOrder.shipping_address?.phone : null) || 
                             'N/A'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 font-minecraft text-sm">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <span className="font-semibold">
                            {selectedOrder.customer_email || 'N/A'}
                          </span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Shipping Address */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg font-minecraft flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-minecraft-diamond" />
                          Shipping Address
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="font-minecraft text-sm text-gray-700">
                          <p className="font-semibold">
                            {typeof selectedOrder.shipping_address === 'string' 
                              ? selectedOrder.shipping_address 
                              : selectedOrder.shipping_address?.name || selectedOrder.customer_name || 'N/A'}
                          </p>
                          {typeof selectedOrder.shipping_address === 'object' && selectedOrder.shipping_address?.address && (
                            <p>{selectedOrder.shipping_address.address}</p>
                          )}
                          <p className="text-gray-600">
                            PIN: {selectedOrder.shipping_pincode || 
                                  (typeof selectedOrder.shipping_address === 'object' ? selectedOrder.shipping_address?.zip : null) || 
                                  'N/A'}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Order Items & UPI Details */}
                  <div className="space-y-6">
                    {/* Order Items */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg font-minecraft flex items-center gap-2">
                          <Package className="w-5 h-5 text-minecraft-diamond" />
                          Order Items
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {selectedOrder.order_items && selectedOrder.order_items.length > 0 ? (
                            selectedOrder.order_items.map((item, index) => (
                              <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                <img
                                  src={item.product_image || `/api/placeholder/60/60`}
                                  alt={item.product_name}
                                  className="w-12 h-12 object-cover rounded border"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = '/api/placeholder/60/60';
                                  }}
                                />
                                <div className="flex-1">
                                  <h4 className="font-minecraft font-semibold text-sm text-gray-800">
                                    {item.product_name || 'Unknown Product'}
                                  </h4>
                                  <p className="font-minecraft text-xs text-gray-600">
                                    Quantity: {item.quantity || 0} × ₹{(item.price || 0).toFixed(2)}
                                  </p>
                                </div>
                                <div className="text-right">
                                  <p className="font-minecraft font-semibold text-sm text-minecraft-diamond">
                                    ₹{((item.price || 0) * (item.quantity || 0)).toFixed(2)}
                                  </p>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="p-4 text-center text-gray-500 font-minecraft">
                              No order items found
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* UPI Payment Details */}
                    {selectedOrder.payment_method === 'upi' && (() => {
                      const upiDetails = extractUPIDetails(selectedOrder.notes || '');
                      return upiDetails && (
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg font-minecraft flex items-center gap-2">
                              <CreditCard className="w-5 h-5 text-minecraft-diamond" />
                              UPI Payment Details
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            {upiDetails.transactionId && (
                              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                <div className="flex items-center gap-2 mb-1">
                                  <Hash className="w-4 h-4 text-blue-600" />
                                  <span className="font-minecraft text-sm font-semibold text-blue-800">Transaction ID</span>
                                </div>
                                <p className="font-minecraft text-sm text-blue-700">
                                  {upiDetails.transactionId}
                                </p>
                              </div>
                            )}
                            
                            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <Camera className="w-4 h-4 text-orange-600" />
                                <span className="font-minecraft text-sm font-semibold text-orange-800">Payment Screenshot</span>
                              </div>
                              {upiDetails.hasScreenshot ? (
                                <div className="space-y-2">
                                  <p className="font-minecraft text-sm text-orange-700">✅ Screenshot Uploaded</p>
                                  {upiDetails.screenshotUrl ? (
                                    <div className="mt-2">
                                      <img 
                                        src={upiDetails.screenshotUrl} 
                                        alt="Payment Screenshot" 
                                        className="w-full max-w-sm rounded-lg border border-orange-300 cursor-pointer hover:opacity-80 transition-opacity"
                                        onClick={() => window.open(upiDetails.screenshotUrl, '_blank')}
                                      />
                                      <p className="font-minecraft text-xs text-orange-600 mt-1">
                                        Click to view full size
                                      </p>
                                    </div>
                                  ) : (
                                    <div className="p-3 bg-orange-100 border border-orange-300 rounded-lg">
                                      <p className="font-minecraft text-sm text-orange-700">
                                        Screenshot uploaded but URL not available
                                      </p>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <p className="font-minecraft text-sm text-orange-700">❌ No Screenshot</p>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default UserOrders;
