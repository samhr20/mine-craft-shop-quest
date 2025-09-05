import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Smartphone, 
  Copy, 
  CheckCircle, 
  Clock, 
  ArrowLeft,
  QrCode,
  CreditCard,
  Truck,
  AlertCircle,
  Upload,
  X,
  Camera
} from 'lucide-react';
import { useOrder } from '@/contexts/OrderContext';
import { Order } from '@/types/order';
import LoadingSpinner from '@/components/LoadingSpinner';
import { usePageSEO } from '@/hooks/useSEO';
import { supabase } from '@/lib/supabase';
import QRCode from 'qrcode';

const UPIPayment: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const { getOrder, updateOrderStatus } = useOrder();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [transactionId, setTransactionId] = useState('');
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Your UPI ID
  const upiId = 'shubhamsaini8965@axl';

  // Set SEO for UPI payment page
  usePageSEO('cart', { 
    title: `UPI Payment - Order ${order?.order_number || ''} | MineCraft Store`,
    description: `Complete your payment for order ${order?.order_number || ''} using UPI`
  });

  useEffect(() => {
    const loadOrder = async () => {
      if (!orderId) {
        navigate('/');
        return;
      }

      try {
        setLoading(true);
        const orderData = await getOrder(orderId);
        if (orderData) {
          setOrder(orderData);
          // Generate QR code when order is loaded
          generateQRCode(orderData);
        } else {
          navigate('/');
        }
      } catch (error) {
        console.error('Error loading order:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId, getOrder, navigate]);

  const generateQRCode = async (orderData: Order) => {
    try {
      // Create UPI payment string
      const upiPaymentString = `upi://pay?pa=${upiId}&pn=MineCraft Store&am=${orderData.total_amount}&cu=INR&tn=Order ${orderData.order_number}`;
      
      // Generate QR code
      const qrCodeDataURL = await QRCode.toDataURL(upiPaymentString, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      
      setQrCodeUrl(qrCodeDataURL);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const copyUPIId = async () => {
    try {
      await navigator.clipboard.writeText(upiId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy UPI ID:', error);
    }
  };

  const copyAmount = async () => {
    if (order) {
      try {
        await navigator.clipboard.writeText(order.total_amount.toString());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Failed to copy amount:', error);
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (file.type.startsWith('image/')) {
        setScreenshot(file);
      } else {
        alert('Please upload an image file (PNG, JPG, etc.)');
      }
    }
  };

  const removeScreenshot = () => {
    setScreenshot(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePaymentConfirmed = async () => {
    if (!order) return;

    // Validate required fields
    if (!transactionId.trim()) {
      alert('Please enter the UPI transaction ID');
      return;
    }

    if (!screenshot) {
      alert('Please upload a screenshot of your payment');
      return;
    }

    try {
      let screenshotUrl = '';
      
      // Upload screenshot to Supabase storage
      if (screenshot) {
        const fileExt = screenshot.name.split('.').pop();
        const fileName = `payment-screenshots/${order.id}-${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('payment-screenshots')
          .upload(fileName, screenshot);

        if (uploadError) {
          console.error('Error uploading screenshot:', uploadError);
          // Continue without screenshot URL
        } else {
          // Get public URL
          const { data: urlData } = supabase.storage
            .from('payment-screenshots')
            .getPublicUrl(fileName);
          
          screenshotUrl = urlData.publicUrl;
        }
      }

      // Create payment details note with screenshot URL
      let paymentNote = `Payment submitted for verification. Transaction ID: ${transactionId}. Screenshot uploaded.`;
      if (screenshotUrl) {
        paymentNote += ` Screenshot URL: ${screenshotUrl}`;
      }
      
      // Update to pending verification status (not confirmed yet)
      await updateOrderStatus(order.id, 'pending_payment_verification', paymentNote);
      setPaymentConfirmed(true);
      
      // Redirect to order confirmation after 3 seconds
      setTimeout(() => {
        navigate(`/order-confirmation/${order.id}`);
      }, 3000);
    } catch (error) {
      console.error('Error updating order status:', error);
      // Show the actual error for debugging
      let errorMessage = 'Unknown error';
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null) {
        errorMessage = JSON.stringify(error);
      }
      alert(`Failed to submit payment details: ${errorMessage}`);
    }
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
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/checkout')}
            className="text-white hover:text-white/80 font-minecraft mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Checkout
          </Button>
          
          <h1 className="text-4xl font-minecraft text-white mb-2">UPI Payment</h1>
          <p className="text-white/80 font-minecraft text-lg">
            Complete your payment for Order #{order.order_number}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Payment Instructions */}
          <div className="space-y-6">
            {/* QR Code Payment Card */}
            <Card className="bg-white/95 backdrop-blur-xl border-2 border-minecraft-diamond/50">
              <CardHeader>
                <CardTitle className="text-2xl font-minecraft text-gray-800 flex items-center gap-2">
                  <QrCode className="w-6 h-6 text-minecraft-diamond" />
                  Scan QR Code to Pay
                </CardTitle>
                <CardDescription className="font-minecraft">
                  Scan the QR code with any UPI app to make payment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* QR Code */}
                {qrCodeUrl && (
                  <div className="flex justify-center">
                    <div className="p-4 bg-white rounded-lg border-2 border-gray-200">
                      <img 
                        src={qrCodeUrl} 
                        alt="UPI Payment QR Code" 
                        className="w-64 h-64"
                      />
                    </div>
                  </div>
                )}

                {/* Payment Details */}
                <div className="text-center space-y-2">
                  <p className="font-minecraft text-sm text-gray-600">Amount: <span className="font-semibold text-lg text-minecraft-diamond">₹{order?.total_amount.toFixed(2)}</span></p>
                  <p className="font-minecraft text-sm text-gray-600">Order: <span className="font-semibold">{order?.order_number}</span></p>
                </div>
                {/* UPI ID */}
                <div className="space-y-2">
                  <label className="text-sm font-minecraft text-gray-600 font-semibold">
                    UPI ID
                  </label>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border">
                    <span className="font-minecraft text-lg font-semibold text-gray-800 flex-1">
                      {upiId}
                    </span>
                    <Button
                      onClick={copyUPIId}
                      variant="outline"
                      size="sm"
                      className="font-minecraft"
                    >
                      {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                {/* Amount */}
                <div className="space-y-2">
                  <label className="text-sm font-minecraft text-gray-600 font-semibold">
                    Amount to Pay
                  </label>
                  <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border">
                    <span className="font-minecraft text-2xl font-bold text-minecraft-diamond flex-1">
                      ₹{order.total_amount.toFixed(2)}
                    </span>
                    <Button
                      onClick={copyAmount}
                      variant="outline"
                      size="sm"
                      className="font-minecraft"
                    >
                      {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                {/* Order Number */}
                <div className="space-y-2">
                  <label className="text-sm font-minecraft text-gray-600 font-semibold">
                    Reference (Order Number)
                  </label>
                  <div className="p-3 bg-gray-50 rounded-lg border">
                    <span className="font-minecraft text-lg font-semibold text-gray-800">
                      {order.order_number}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Instructions */}
            <Card className="bg-white/95 backdrop-blur-xl border-2 border-minecraft-diamond/50">
              <CardHeader>
                <CardTitle className="text-xl font-minecraft text-gray-800 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-minecraft-diamond" />
                  Payment Instructions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 font-minecraft text-gray-700">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-minecraft-diamond text-white rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <p>Open your UPI app (PhonePe, Google Pay, Paytm, etc.)</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-minecraft-diamond text-white rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <p>Enter our UPI ID: <span className="font-semibold">{upiId}</span></p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-minecraft-diamond text-white rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <p>Enter the exact amount: <span className="font-semibold">₹{order.total_amount.toFixed(2)}</span></p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-minecraft-diamond text-white rounded-full flex items-center justify-center text-sm font-bold">
                      4
                    </div>
                    <p>Add reference: <span className="font-semibold">{order.order_number}</span></p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-minecraft-diamond text-white rounded-full flex items-center justify-center text-sm font-bold">
                      5
                    </div>
                    <p>Complete the payment and click "I have paid" below</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary & Actions */}
          <div className="space-y-6">
            {/* Order Summary */}
            <Card className="bg-white/95 backdrop-blur-xl border-2 border-minecraft-diamond/50">
              <CardHeader>
                <CardTitle className="text-xl font-minecraft text-gray-800">
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between font-minecraft text-sm">
                    <span>Order Number:</span>
                    <span className="font-semibold">{order.order_number}</span>
                  </div>
                  <div className="flex justify-between font-minecraft text-sm">
                    <span>Total Amount:</span>
                    <span className="font-semibold text-lg">₹{order.total_amount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-minecraft text-sm">
                    <span>Payment Method:</span>
                    <Badge className="bg-blue-100 text-blue-800">UPI Payment</Badge>
                  </div>
                </div>

                <Separator />

                {/* Payment Confirmation Form */}
                {!paymentConfirmed ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center gap-2 text-yellow-800 font-minecraft">
                        <Clock className="w-4 h-4" />
                        <span className="font-semibold">Payment Pending</span>
                      </div>
                      <p className="text-sm text-yellow-700 font-minecraft mt-1">
                        Complete the payment and confirm below
                      </p>
                    </div>

                    {/* Payment Confirmation Form */}
                    <div className="space-y-4">
                      <Button
                        onClick={() => setShowPaymentForm(!showPaymentForm)}
                        className="w-full bg-minecraft-diamond hover:bg-minecraft-diamond/90 text-white font-minecraft py-3 text-lg"
                      >
                        <Camera className="w-5 h-5 mr-2" />
                        I have paid ₹{order.total_amount.toFixed(2)}
                      </Button>

                      {showPaymentForm && (
                        <Card className="bg-gray-50 border-2 border-minecraft-diamond/30">
                          <CardContent className="p-4 space-y-4">
                            <h4 className="font-minecraft font-semibold text-gray-800">Payment Confirmation</h4>
                            
                            {/* Transaction ID */}
                            <div>
                              <Label htmlFor="transactionId" className="text-sm font-minecraft text-gray-700 font-semibold">
                                UPI Transaction ID *
                              </Label>
                              <Input
                                id="transactionId"
                                value={transactionId}
                                onChange={(e) => setTransactionId(e.target.value)}
                                placeholder="Enter UPI transaction ID"
                                className="font-minecraft mt-1"
                              />
                            </div>

                            {/* Screenshot Upload */}
                            <div>
                              <Label className="text-sm font-minecraft text-gray-700 font-semibold">
                                Payment Screenshot *
                              </Label>
                              <div className="mt-2">
                                {screenshot ? (
                                  <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                                    <CheckCircle className="w-4 h-4 text-green-600" />
                                    <span className="font-minecraft text-sm text-green-800 flex-1">
                                      {screenshot.name}
                                    </span>
                                    <Button
                                      onClick={removeScreenshot}
                                      variant="outline"
                                      size="sm"
                                      className="text-red-600 hover:text-red-700"
                                    >
                                      <X className="w-4 h-4" />
                                    </Button>
                                  </div>
                                ) : (
                                  <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-minecraft-diamond transition-colors"
                                  >
                                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                    <p className="font-minecraft text-sm text-gray-600">
                                      Click to upload payment screenshot
                                    </p>
                                    <p className="font-minecraft text-xs text-gray-500 mt-1">
                                      PNG, JPG, or other image formats
                                    </p>
                                  </div>
                                )}
                                <input
                                  ref={fileInputRef}
                                  type="file"
                                  accept="image/*"
                                  onChange={handleFileUpload}
                                  className="hidden"
                                />
                              </div>
                            </div>

                            {/* Confirm Payment Button */}
                            <Button
                              onClick={handlePaymentConfirmed}
                              className="w-full bg-green-600 hover:bg-green-700 text-white font-minecraft"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Confirm Payment
                            </Button>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-800 font-minecraft">
                      <Clock className="w-4 h-4" />
                      <span className="font-semibold">Payment Submitted for Verification!</span>
                    </div>
                    <p className="text-sm text-blue-700 font-minecraft mt-1">
                      We have received your payment details. Our team will verify the payment within 24 hours and update your order status.
                    </p>
                    <p className="text-sm text-blue-600 font-minecraft mt-2">
                      You will receive an email notification once verified.
                    </p>
                    <p className="text-sm text-blue-600 font-minecraft mt-1">
                      Redirecting to order confirmation...
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Support Info */}
            <Card className="bg-white/95 backdrop-blur-xl border-2 border-minecraft-diamond/50">
              <CardHeader>
                <CardTitle className="text-lg font-minecraft text-gray-800">
                  Need Help?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm font-minecraft text-gray-600">
                  <p>• Make sure to send the exact amount</p>
                  <p>• Include the order number as reference</p>
                  <p>• Payment will be verified within 24 hours</p>
                  <p>• Contact support if you face any issues</p>
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

export default UPIPayment;
