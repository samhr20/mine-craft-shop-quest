import React, { useState, useEffect } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { 
  ArrowLeft, 
  Search, 
  Package, 
  Calendar,
  User,
  MapPin,
  CreditCard,
  Eye,
  Filter,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  Camera,
  FileText,
  Info,
  Phone,
  Mail,
  Hash
} from 'lucide-react';
import { Link } from 'react-router-dom';
import AdminAccessGuard from '../components/AdminAccessGuard';
import { supabase } from '../lib/supabase';
import LoadingSpinner from '../components/LoadingSpinner';

interface Order {
  id: string;
  order_number: string;
  status: string;
  total_amount: number;
  payment_method: string;
  payment_status: string;
  created_at: string;
  user_id: string;
  shipping_address: string | { name: string; address: string; city: string; state: string; zip: string; country: string; phone?: string; };
  shipping_pincode: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  notes: string;
  order_items: any[];
}

const AdminOrders: React.FC = () => {
  const { isAdmin, hasPermission, loading } = useAdmin();
  const { user: currentUser } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (isAdmin && hasPermission('orders')) {
      loadOrders();
    }
  }, [isAdmin, hasPermission]);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter, paymentFilter]);

  const loadOrders = async () => {
    try {
      setLoadingOrders(true);
      
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .order('created_at', { ascending: false });

      if (ordersError) {
        return;
      }

      setOrders(ordersData || []);
    } catch (error) {
      // Silently handle errors
    } finally {
      setLoadingOrders(false);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    // Filter by payment method
    if (paymentFilter !== 'all') {
      filtered = filtered.filter(order => order.payment_method === paymentFilter);
    }

    setFilteredOrders(filtered);
  };

  // FLEXIBLE STATUS SYSTEM - All order statuses
  const getSimpleStatus = (order: Order) => {
    switch (order.status) {
      case 'pending_payment_verification':
        return {
          step: 1,
          label: 'Verify Payment',
          color: 'bg-orange-100 text-orange-800',
          icon: <Camera className="w-4 h-4" />,
          description: 'Customer paid via UPI, needs verification'
        };
      
      case 'confirmed':
        return {
          step: 2,
          label: 'Confirmed',
          color: 'bg-blue-100 text-blue-800',
          icon: <CheckCircle className="w-4 h-4" />,
          description: order.payment_method === 'cod' ? 'Order confirmed, payment on delivery' : 'Payment verified, ready to process'
        };
      
      case 'processing':
        return {
          step: 3,
          label: 'Processing',
          color: 'bg-purple-100 text-purple-800',
          icon: <Package className="w-4 h-4" />,
          description: 'Order is being prepared for shipment'
        };
      
      case 'shipped':
        return {
          step: 4,
          label: 'Shipped',
          color: 'bg-indigo-100 text-indigo-800',
          icon: <Package className="w-4 h-4" />,
          description: 'Order shipped, in transit'
        };
      
      case 'delivered':
        return {
          step: 5,
          label: 'Delivered',
          color: 'bg-green-100 text-green-800',
          icon: <CheckCircle className="w-4 h-4" />,
          description: 'Order delivered successfully'
        };
      
      case 'returned':
        return {
          step: 0,
          label: 'Returned',
          color: 'bg-yellow-100 text-yellow-800',
          icon: <Package className="w-4 h-4" />,
          description: 'Order has been returned'
        };
      
      case 'cancelled':
        return {
          step: 0,
          label: 'Cancelled',
          color: 'bg-red-100 text-red-800',
          icon: <XCircle className="w-4 h-4" />,
          description: 'Order was cancelled'
        };
      
      default:
        return {
          step: 1,
          label: 'Unknown',
          color: 'bg-gray-100 text-gray-800',
          icon: <Clock className="w-4 h-4" />,
          description: 'Order status unknown'
        };
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
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
    
    // Try to extract screenshot URL if it exists
    const screenshotUrlMatch = notes.match(/Screenshot URL: ([^\s]+)/i);
    const screenshotUrl = screenshotUrlMatch ? screenshotUrlMatch[1] : null;
    
    return {
      transactionId: transactionIdMatch ? transactionIdMatch[1] : null,
      hasScreenshot,
      screenshotUrl
    };
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      // Get the current order to check payment method
      const currentOrder = orders.find(o => o.id === orderId);
      if (!currentOrder) {
        alert('Order not found');
        return;
      }

      // Update payment status based on new order status and payment method
      let newPaymentStatus = currentOrder.payment_status;
      
      if (currentOrder.payment_method === 'upi') {
        if (newStatus === 'confirmed') {
          newPaymentStatus = 'paid'; // UPI payment verified
        }
      } else if (currentOrder.payment_method === 'cod') {
        if (newStatus === 'delivered') {
          newPaymentStatus = 'paid'; // COD payment collected on delivery
        }
      }

      const { error } = await supabase
        .from('orders')
        .update({ 
          status: newStatus,
          payment_status: newPaymentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) {
        alert(`Failed to update order status: ${error.message}`);
        return;
      }

      // Reload orders
      await loadOrders();
      alert('Order status updated successfully!');
    } catch (error) {
      alert('Failed to update order status. Please try again.');
    }
  };

  if (loading || loadingOrders) {
    return <LoadingSpinner />;
  }

  return (
    <AdminAccessGuard>
      <div className="min-h-screen bg-gradient-to-br from-minecraft-dirt via-minecraft-stone to-minecraft-grass">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <Link to="/admin">
              <Button
                variant="ghost"
                className="text-white hover:text-white/80 font-minecraft mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            
            <h1 className="text-4xl font-minecraft text-white mb-2">Order Management</h1>
            <p className="text-white/80 font-minecraft text-lg">
              Manage and track customer orders
            </p>
          </div>

          {/* Filters */}
          <Card className="bg-white/95 backdrop-blur-xl border-2 border-minecraft-diamond/50 mb-6">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search orders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 font-minecraft"
                  />
                </div>

                {/* Status Filter - FLEXIBLE LOGIC */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="p-2 border border-gray-300 rounded-lg font-minecraft"
                >
                  <option value="all">All Orders</option>
                  <option value="pending_payment_verification">Verify Payment</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="returned">Returned</option>
                  <option value="cancelled">Cancelled</option>
                </select>

                {/* Payment Filter */}
                <select
                  value={paymentFilter}
                  onChange={(e) => setPaymentFilter(e.target.value)}
                  className="p-2 border border-gray-300 rounded-lg font-minecraft"
                >
                  <option value="all">All Payment Methods</option>
                  <option value="upi">UPI</option>
                  <option value="cod">Cash on Delivery</option>
                </select>

                {/* Export Button */}
                <Button className="bg-minecraft-diamond hover:bg-minecraft-diamond/90 text-white font-minecraft">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* SIMPLIFIED ORDERS GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredOrders.map((order) => {
              const simpleStatus = getSimpleStatus(order);
              const upiDetails = extractUPIDetails(order.notes || '');
              
              return (
                <Card key={order.id} className="bg-white/95 backdrop-blur-xl border-2 border-minecraft-diamond/50">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg font-minecraft text-gray-800">
                          Order #{order.order_number}
                        </CardTitle>
                        <CardDescription className="font-minecraft text-sm text-gray-600">
                          {formatDate(order.created_at)}
                        </CardDescription>
                      </div>
                      {/* SINGLE CLEAR STATUS BADGE */}
                      <Badge className={`${simpleStatus.color} font-minecraft flex items-center gap-1`}>
                        {simpleStatus.icon}
                        {simpleStatus.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* ORDER SUMMARY */}
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-minecraft text-sm text-gray-600">Total Amount:</span>
                        <span className="font-minecraft text-xl font-bold text-minecraft-diamond">₹{order.total_amount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="font-minecraft text-sm text-gray-600">Payment:</span>
                        <span className="font-minecraft text-sm font-semibold">{order.payment_method.toUpperCase()}</span>
                      </div>
                    </div>

                    {/* CUSTOMER INFO */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 font-minecraft text-sm">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="font-semibold">{order.customer_name || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2 font-minecraft text-sm text-gray-600">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span>
                          {typeof order.shipping_address === 'string' 
                            ? order.shipping_address 
                            : order.shipping_address?.address || 'N/A'
                          }
                        </span>
                      </div>
                    </div>

                    {/* UPI PAYMENT DETAILS - SIMPLIFIED */}
                    {order.payment_method === 'upi' && order.status === 'pending_payment_verification' && upiDetails && (
                      <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Camera className="w-4 h-4 text-orange-600" />
                          <span className="font-minecraft text-sm font-semibold text-orange-800">Payment Details</span>
                        </div>
                        <div className="space-y-1 text-xs font-minecraft">
                          {upiDetails.transactionId && (
                            <div className="text-orange-700">
                              <strong>Transaction ID:</strong> {upiDetails.transactionId}
                            </div>
                          )}
                          <div className="text-orange-700">
                            <strong>Screenshot:</strong> {upiDetails.hasScreenshot ? '✅ Uploaded' : '❌ Missing'}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* STATUS DROPDOWN - Flexible order management */}
                    <div className="space-y-2">
                      <div>
                        <label className="text-sm font-minecraft text-gray-600 mb-1 block">
                          Order Status:
                        </label>
                        <select
                          value={order.status}
                          onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-lg font-minecraft text-sm focus:ring-2 focus:ring-minecraft-diamond focus:border-minecraft-diamond"
                        >
                          <option value="pending_payment_verification">Verify Payment</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="returned">Returned</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                      
                      {/* DETAIL BUTTON */}
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full font-minecraft"
                        onClick={() => {
                          setSelectedOrder(order);
                          setShowDetails(true);
                        }}
                      >
                        <Info className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      
                      {/* Status-specific messages */}
                      {order.status === 'delivered' && (
                        <div className="text-center p-2 bg-green-50 border border-green-200 rounded-lg">
                          <p className="font-minecraft text-sm text-green-600">
                            ✅ Order Completed! 
                            {order.payment_method === 'cod' ? ' (Payment collected on delivery)' : ' (UPI payment verified)'}
                          </p>
                        </div>
                      )}
                      
                      {order.status === 'returned' && (
                        <div className="text-center p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="font-minecraft text-sm text-yellow-600">
                            📦 Order Returned - Process refund if needed
                          </p>
                        </div>
                      )}
                      
                      {order.status === 'cancelled' && (
                        <div className="text-center p-2 bg-red-50 border border-red-200 rounded-lg">
                          <p className="font-minecraft text-sm text-red-600">
                            ❌ Order Cancelled
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* No Orders Message */}
          {filteredOrders.length === 0 && (
            <Card className="bg-white/95 backdrop-blur-xl border-2 border-minecraft-diamond/50">
              <CardContent className="p-8 text-center">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-minecraft text-gray-800 mb-2">No Orders Found</h3>
                <p className="text-gray-600 font-minecraft">
                  {searchTerm || statusFilter !== 'all' || paymentFilter !== 'all'
                    ? 'Try adjusting your filters to see more orders.'
                    : 'No orders have been placed yet.'}
                </p>
              </CardContent>
            </Card>
          )}

          {/* FLEXIBLE SUMMARY STATS - All order statuses */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-white/95 backdrop-blur-xl border-2 border-minecraft-diamond/50">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-minecraft font-bold text-minecraft-diamond">
                  {orders.length}
                </div>
                <div className="text-sm font-minecraft text-gray-600">Total Orders</div>
              </CardContent>
            </Card>
            <Card className="bg-white/95 backdrop-blur-xl border-2 border-minecraft-diamond/50">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-minecraft font-bold text-orange-600">
                  {orders.filter(o => o.status === 'pending_payment_verification').length}
                </div>
                <div className="text-sm font-minecraft text-gray-600">Verify Payment</div>
              </CardContent>
            </Card>
            <Card className="bg-white/95 backdrop-blur-xl border-2 border-minecraft-diamond/50">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-minecraft font-bold text-blue-600">
                  {orders.filter(o => o.status === 'confirmed' || o.status === 'processing').length}
                </div>
                <div className="text-sm font-minecraft text-gray-600">In Progress</div>
              </CardContent>
            </Card>
            <Card className="bg-white/95 backdrop-blur-xl border-2 border-minecraft-diamond/50">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-minecraft font-bold text-green-600">
                  {orders.filter(o => o.status === 'delivered').length}
                </div>
                <div className="text-sm font-minecraft text-gray-600">Delivered</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ORDER DETAILS MODAL */}
        {showDetails && selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {/* Modal Header */}
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-minecraft text-gray-800">
                    Order Details - #{selectedOrder.order_number}
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDetails(false)}
                    className="font-minecraft"
                  >
                    ✕
                  </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Order Information */}
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg font-minecraft flex items-center gap-2">
                          <Hash className="w-5 h-5 text-minecraft-diamond" />
                          Order Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 font-minecraft text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Order Number:</span>
                          <span className="font-semibold">{selectedOrder.order_number}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Status:</span>
                          <Badge className={`${getSimpleStatus(selectedOrder).color} font-minecraft`}>
                            {getSimpleStatus(selectedOrder).label}
                          </Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Payment Method:</span>
                          <span className="font-semibold capitalize">{selectedOrder.payment_method}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Amount:</span>
                          <span className="font-semibold text-lg text-minecraft-diamond">₹{selectedOrder.total_amount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Order Date:</span>
                          <span className="font-semibold">{formatDate(selectedOrder.created_at)}</span>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Customer Information */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg font-minecraft flex items-center gap-2">
                          <User className="w-5 h-5 text-minecraft-diamond" />
                          Customer Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 font-minecraft text-sm">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="font-semibold">{selectedOrder.customer_name || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <span>{selectedOrder.customer_phone || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <span>{selectedOrder.customer_email || 'N/A'}</span>
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
                      <CardContent className="font-minecraft text-sm">
                        <div className="space-y-1">
                          <p className="font-semibold">{selectedOrder.customer_name}</p>
                          {typeof selectedOrder.shipping_address === 'string' ? (
                            <p>{selectedOrder.shipping_address}</p>
                          ) : (
                            <div>
                              <p>{selectedOrder.shipping_address?.name}</p>
                              <p>{selectedOrder.shipping_address?.address}</p>
                              <p>{selectedOrder.shipping_address?.city}, {selectedOrder.shipping_address?.state}</p>
                              <p>{selectedOrder.shipping_address?.country} - {selectedOrder.shipping_address?.zip}</p>
                              {selectedOrder.shipping_address?.phone && <p>Phone: {selectedOrder.shipping_address.phone}</p>}
                            </div>
                          )}
                          <p>PIN: {selectedOrder.shipping_pincode}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
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
                          {selectedOrder.order_items?.map((item) => (
                            <div key={item.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                              <div className="w-12 h-12 bg-gray-100 rounded border flex items-center justify-center">
                                <Package className="w-6 h-6 text-gray-400" />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-minecraft text-sm font-semibold text-gray-800">
                                  {item.product_name}
                                </h4>
                                <p className="font-minecraft text-xs text-gray-600">
                                  Qty: {item.quantity} × ₹{item.product_price}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-minecraft text-sm font-semibold text-gray-800">
                                  ₹{item.total_price.toFixed(2)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    {/* UPI Payment Details */}
                    {selectedOrder.payment_method === 'upi' && selectedOrder.status === 'pending_payment_verification' && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg font-minecraft flex items-center gap-2">
                            <Camera className="w-5 h-5 text-minecraft-diamond" />
                            UPI Payment Details
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {(() => {
                            const upiDetails = extractUPIDetails(selectedOrder.notes || '');
                            return (
                              <>
                                {upiDetails?.transactionId && (
                                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <div className="flex items-center gap-2 mb-1">
                                      <FileText className="w-4 h-4 text-blue-600" />
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
                                  {upiDetails?.hasScreenshot ? (
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
                              </>
                            );
                          })()}
                        </CardContent>
                      </Card>
                    )}

                    
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setShowDetails(false)}
                    className="font-minecraft"
                  >
                    Close
                  </Button>
                  <Button
                    className="bg-minecraft-diamond hover:bg-minecraft-diamond/90 text-white font-minecraft"
                    onClick={() => {
                      // Copy order details to clipboard
                      const addressText = typeof selectedOrder.shipping_address === 'string' 
                        ? selectedOrder.shipping_address 
                        : `${selectedOrder.shipping_address?.address}, ${selectedOrder.shipping_address?.city}, ${selectedOrder.shipping_address?.state} - ${selectedOrder.shipping_address?.zip}`;
                      const orderText = `Order #${selectedOrder.order_number}\nCustomer: ${selectedOrder.customer_name}\nPhone: ${selectedOrder.customer_phone}\nAddress: ${addressText}, PIN: ${selectedOrder.shipping_pincode}\nTotal: ₹${selectedOrder.total_amount.toFixed(2)}`;
                      navigator.clipboard.writeText(orderText);
                      alert('Order details copied to clipboard!');
                    }}
                  >
                    Copy Details
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminAccessGuard>
  );
};

export default AdminOrders;