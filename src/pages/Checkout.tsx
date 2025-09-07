import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  MapPin, 
  Package, 
  ArrowLeft, 
  CheckCircle,
  Truck,
  Shield
} from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useOrder } from '@/contexts/OrderContext';
import { useAuth } from '@/contexts/AuthContext';
import { CreateOrderData, PaymentMethod } from '@/types/order';
import { getProductImage } from '@/lib/image-utils';
import LoadingSpinner from '@/components/LoadingSpinner';
import { usePageSEO } from '@/hooks/useSEO';

// Helper functions for input restrictions
const onlyChars = (value: string) => value.replace(/[^a-zA-Z\s]/g, '');
const onlyNumbers = (value: string) => value.replace(/[^0-9]/g, '');

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items: cartItems, totalPrice, totalItems, loading: cartLoading } = useCart();
  const { createOrder, updateOrderStatus, loading: orderLoading } = useOrder();
  
  // Set SEO for checkout page
  usePageSEO('cart', { title: 'Checkout - MineCraft Store' });

  // Form state
  const [formData, setFormData] = useState({
    // Shipping Address
    shippingName: '',
    shippingAddress: '',
    shippingCity: '',
    shippingState: '',
    shippingZip: '',
    shippingCountry: 'India',
    shippingPhone: '',
    
    // Billing Address
    billingName: '',
    billingAddress: '',
    billingCity: '',
    billingState: '',
    billingZip: '',
    billingCountry: 'India',
    
    // Payment
    paymentMethod: '' as PaymentMethod,
    
    // Order notes
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sameAsShipping, setSameAsShipping] = useState(true);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/checkout');
    }
  }, [user, navigate]);

  // Redirect if cart is empty
  useEffect(() => {
    if (!cartLoading && cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, cartLoading, navigate]);

  // Auto-fill billing address when same as shipping is checked
  useEffect(() => {
    if (sameAsShipping) {
      setFormData(prev => ({
        ...prev,
        billingName: prev.shippingName,
        billingAddress: prev.shippingAddress,
        billingCity: prev.shippingCity,
        billingState: prev.shippingState,
        billingZip: prev.shippingZip,
        billingCountry: prev.shippingCountry
      }));
    }
  }, [sameAsShipping, formData.shippingName, formData.shippingAddress, formData.shippingCity, formData.shippingState, formData.shippingZip, formData.shippingCountry]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Shipping address validation
    if (!formData.shippingName.trim()) newErrors.shippingName = 'Name is required';
    else if (!/^[a-zA-Z\s]+$/.test(formData.shippingName.trim())) newErrors.shippingName = 'Name must contain only letters and spaces';
    if (!formData.shippingAddress.trim()) newErrors.shippingAddress = 'Address is required';
    if (!formData.shippingCity.trim()) newErrors.shippingCity = 'City is required';
    else if (!/^[a-zA-Z\s]+$/.test(formData.shippingCity.trim())) newErrors.shippingCity = 'City must contain only letters and spaces';
    if (!formData.shippingState.trim()) newErrors.shippingState = 'State is required';
    else if (!/^[a-zA-Z\s]+$/.test(formData.shippingState.trim())) newErrors.shippingState = 'State must contain only letters and spaces';
    if (!formData.shippingZip.trim()) newErrors.shippingZip = 'ZIP code is required';
    else if (!/^\d+$/.test(formData.shippingZip.trim())) newErrors.shippingZip = 'ZIP code must contain only numbers';
    if (!formData.shippingPhone.trim()) newErrors.shippingPhone = 'Phone number is required';
    else if (!/^\d+$/.test(formData.shippingPhone.trim())) newErrors.shippingPhone = 'Phone number must contain only numbers';

    // Billing address validation (if not same as shipping)
    if (!sameAsShipping) {
      if (!formData.billingName.trim()) newErrors.billingName = 'Name is required';
      else if (!/^[a-zA-Z\s]+$/.test(formData.billingName.trim())) newErrors.billingName = 'Name must contain only letters and spaces';
      if (!formData.billingAddress.trim()) newErrors.billingAddress = 'Address is required';
      if (!formData.billingCity.trim()) newErrors.billingCity = 'City is required';
      else if (!/^[a-zA-Z\s]+$/.test(formData.billingCity.trim())) newErrors.billingCity = 'City must contain only letters and spaces';
      if (!formData.billingState.trim()) newErrors.billingState = 'State is required';
      else if (!/^[a-zA-Z\s]+$/.test(formData.billingState.trim())) newErrors.billingState = 'State must contain only letters and spaces';
      if (!formData.billingZip.trim()) newErrors.billingZip = 'ZIP code is required';
      else if (!/^\d+$/.test(formData.billingZip.trim())) newErrors.billingZip = 'ZIP code must contain only numbers';
    }

    // Payment method validation
    if (!formData.paymentMethod) {
      newErrors.paymentMethod = 'Please select a payment method';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string) => {
    let newValue = value;
    // Restrict input based on field
    if (
      field === 'shippingName' ||
      field === 'billingName' ||
      field === 'shippingCity' ||
      field === 'billingCity' ||
      field === 'shippingState' ||
      field === 'billingState'
    ) {
      newValue = onlyChars(value);
    }
    if (
      field === 'shippingPhone' ||
      field === 'billingPhone' ||
      field === 'shippingZip' ||
      field === 'billingZip'
    ) {
      newValue = onlyNumbers(value);
    }
    setFormData(prev => ({ ...prev, [field]: newValue }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (!validateForm()) {
      return;
    }

    try {
      const orderData: CreateOrderData = {
        items: cartItems.map(item => ({
          product_id: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        shipping_address: {
          name: formData.shippingName,
          address: formData.shippingAddress,
          city: formData.shippingCity,
          state: formData.shippingState,
          zip: formData.shippingZip,
          country: formData.shippingCountry,
          phone: formData.shippingPhone
        },
        billing_address: sameAsShipping ? {
          name: formData.shippingName,
          address: formData.shippingAddress,
          city: formData.shippingCity,
          state: formData.shippingState,
          zip: formData.shippingZip,
          country: formData.shippingCountry,
          phone: formData.shippingPhone
        } : {
          name: formData.billingName,
          address: formData.billingAddress,
          city: formData.billingCity,
          state: formData.billingState,
          zip: formData.billingZip,
          country: formData.billingCountry,
          phone: formData.shippingPhone // Use shipping phone for billing if not provided
        },
        payment_method: formData.paymentMethod,
        notes: formData.notes,
        total_amount: totalPrice
      };

      const order = await createOrder(orderData);
      
      if (order) {
        // Navigate to appropriate page based on payment method
        if (formData.paymentMethod === 'upi') {
          navigate(`/upi-payment/${order.id}`);
        } else {
          navigate(`/order-confirmation/${order.id}`);
        }
      }
    } catch (error) {
      console.error('Error creating order:', error);
      // You might want to show a toast notification here
    }
  };

  if (cartLoading) {
    return <LoadingSpinner />;
  }

  if (cartItems.length === 0) {
    return null; // Will redirect to cart
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-minecraft-dirt via-minecraft-stone to-minecraft-grass">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/cart')}
            className="text-white hover:text-white/80 font-minecraft mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
          </Button>
          
          <h1 className="text-4xl font-minecraft text-white mb-2">Checkout</h1>
          <p className="text-white/80 font-minecraft text-lg">
            Complete your order for {totalItems} item{totalItems !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          {/* Checkout Form */}
          <div className="xl:col-span-2 space-y-4 sm:space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Shipping Address */}
              <Card className="bg-white/95 backdrop-blur-xl border-2 border-minecraft-diamond/50">
                <CardHeader>
                  <CardTitle className="text-xl sm:text-2xl font-minecraft text-gray-800 flex items-center gap-2">
                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-minecraft-diamond" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <Label htmlFor="shippingName" className="text-gray-700 font-minecraft text-sm font-semibold">
                        Full Name *
                      </Label>
                      <Input
                        id="shippingName"
                        value={formData.shippingName}
                        onChange={(e) => handleInputChange('shippingName', e.target.value)}
                        className={`font-minecraft ${errors.shippingName ? 'border-red-500' : ''}`}
                        placeholder="Enter your full name"
                        inputMode="text"
                        pattern="[A-Za-z\s]*"
                        autoComplete="off"
                      />
                      {errors.shippingName && (
                        <p className="text-sm text-red-600 font-minecraft mt-1">{errors.shippingName}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="shippingPhone" className="text-gray-700 font-minecraft text-sm font-semibold">
                        Phone Number *
                      </Label>
                      <Input
                        id="shippingPhone"
                        value={formData.shippingPhone}
                        onChange={(e) => handleInputChange('shippingPhone', e.target.value)}
                        className={`font-minecraft ${errors.shippingPhone ? 'border-red-500' : ''}`}
                        placeholder="Enter your phone number"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        autoComplete="off"
                      />
                      {errors.shippingPhone && (
                        <p className="text-sm text-red-600 font-minecraft mt-1">{errors.shippingPhone}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="shippingAddress" className="text-gray-700 font-minecraft text-sm font-semibold">
                      Address *
                    </Label>
                    <Input
                      id="shippingAddress"
                      value={formData.shippingAddress}
                      onChange={(e) => handleInputChange('shippingAddress', e.target.value)}
                      className={`font-minecraft ${errors.shippingAddress ? 'border-red-500' : ''}`}
                      placeholder="Enter your address"
                    />
                    {errors.shippingAddress && (
                      <p className="text-sm text-red-600 font-minecraft mt-1">{errors.shippingAddress}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                    <div>
                      <Label htmlFor="shippingCity" className="text-gray-700 font-minecraft text-sm font-semibold">
                        City *
                      </Label>
                      <Input
                        id="shippingCity"
                        value={formData.shippingCity}
                        onChange={(e) => handleInputChange('shippingCity', e.target.value)}
                        className={`font-minecraft ${errors.shippingCity ? 'border-red-500' : ''}`}
                        placeholder="City"
                        inputMode="text"
                        pattern="[A-Za-z\s]*"
                        autoComplete="off"
                      />
                      {errors.shippingCity && (
                        <p className="text-sm text-red-600 font-minecraft mt-1">{errors.shippingCity}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="shippingState" className="text-gray-700 font-minecraft text-sm font-semibold">
                        State *
                      </Label>
                      <Input
                        id="shippingState"
                        value={formData.shippingState}
                        onChange={(e) => handleInputChange('shippingState', e.target.value)}
                        className={`font-minecraft ${errors.shippingState ? 'border-red-500' : ''}`}
                        placeholder="State"
                        inputMode="text"
                        pattern="[A-Za-z\s]*"
                        autoComplete="off"
                      />
                      {errors.shippingState && (
                        <p className="text-sm text-red-600 font-minecraft mt-1">{errors.shippingState}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="shippingZip" className="text-gray-700 font-minecraft text-sm font-semibold">
                        ZIP Code *
                      </Label>
                      <Input
                        id="shippingZip"
                        value={formData.shippingZip}
                        onChange={(e) => handleInputChange('shippingZip', e.target.value)}
                        className={`font-minecraft ${errors.shippingZip ? 'border-red-500' : ''}`}
                        placeholder="ZIP Code"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        autoComplete="off"
                      />
                      {errors.shippingZip && (
                        <p className="text-sm text-red-600 font-minecraft mt-1">{errors.shippingZip}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Billing Address */}
              <Card className="bg-white/95 backdrop-blur-xl border-2 border-minecraft-diamond/50">
                <CardHeader>
                  <CardTitle className="text-2xl font-minecraft text-gray-800 flex items-center gap-2">
                    <CreditCard className="w-6 h-6 text-minecraft-diamond" />
                    Billing Address
                  </CardTitle>
                  <CardDescription className="font-minecraft">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={sameAsShipping}
                        onChange={(e) => setSameAsShipping(e.target.checked)}
                        className="rounded"
                      />
                      Same as shipping address
                    </label>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!sameAsShipping && (
                    <>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="billingName" className="text-gray-700 font-minecraft text-sm font-semibold">
                            Full Name *
                          </Label>
                          <Input
                            id="billingName"
                            value={formData.billingName}
                            onChange={(e) => handleInputChange('billingName', e.target.value)}
                            className={`font-minecraft ${errors.billingName ? 'border-red-500' : ''}`}
                            placeholder="Enter billing name"
                            inputMode="text"
                            pattern="[A-Za-z\s]*"
                            autoComplete="off"
                          />
                          {errors.billingName && (
                            <p className="text-sm text-red-600 font-minecraft mt-1">{errors.billingName}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="billingAddress" className="text-gray-700 font-minecraft text-sm font-semibold">
                          Address *
                        </Label>
                        <Input
                          id="billingAddress"
                          value={formData.billingAddress}
                          onChange={(e) => handleInputChange('billingAddress', e.target.value)}
                          className={`font-minecraft ${errors.billingAddress ? 'border-red-500' : ''}`}
                          placeholder="Enter billing address"
                        />
                        {errors.billingAddress && (
                          <p className="text-sm text-red-600 font-minecraft mt-1">{errors.billingAddress}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="billingCity" className="text-gray-700 font-minecraft text-sm font-semibold">
                            City *
                          </Label>
                          <Input
                            id="billingCity"
                            value={formData.billingCity}
                            onChange={(e) => handleInputChange('billingCity', e.target.value)}
                            className={`font-minecraft ${errors.billingCity ? 'border-red-500' : ''}`}
                            placeholder="City"
                            inputMode="text"
                            pattern="[A-Za-z\s]*"
                            autoComplete="off"
                          />
                          {errors.billingCity && (
                            <p className="text-sm text-red-600 font-minecraft mt-1">{errors.billingCity}</p>
                          )}
                        </div>
                        
                        <div>
                          <Label htmlFor="billingState" className="text-gray-700 font-minecraft text-sm font-semibold">
                            State *
                          </Label>
                          <Input
                            id="billingState"
                            value={formData.billingState}
                            onChange={(e) => handleInputChange('billingState', e.target.value)}
                            className={`font-minecraft ${errors.billingState ? 'border-red-500' : ''}`}
                            placeholder="State"
                            inputMode="text"
                            pattern="[A-Za-z\s]*"
                            autoComplete="off"
                          />
                          {errors.billingState && (
                            <p className="text-sm text-red-600 font-minecraft mt-1">{errors.billingState}</p>
                          )}
                        </div>
                        
                        <div>
                          <Label htmlFor="billingZip" className="text-gray-700 font-minecraft text-sm font-semibold">
                            ZIP Code *
                          </Label>
                          <Input
                            id="billingZip"
                            value={formData.billingZip}
                            onChange={(e) => handleInputChange('billingZip', e.target.value)}
                            className={`font-minecraft ${errors.billingZip ? 'border-red-500' : ''}`}
                            placeholder="ZIP Code"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            autoComplete="off"
                          />
                          {errors.billingZip && (
                            <p className="text-sm text-red-600 font-minecraft mt-1">{errors.billingZip}</p>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Payment Method */}
              <Card className="bg-white/95 backdrop-blur-xl border-2 border-minecraft-diamond/50">
                <CardHeader>
                  <CardTitle className="text-2xl font-minecraft text-gray-800 flex items-center gap-2">
                    <CreditCard className="w-6 h-6 text-minecraft-diamond" />
                    Payment Method
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
                    {[
                      { value: 'upi', label: 'UPI Payment', icon: '📱', description: 'Pay via UPI ID' },
                      { value: 'cod', label: 'Cash on Delivery', icon: '💰', description: 'Pay when delivered' }
                    ].map((method) => (
                      <label
                        key={method.value}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          formData.paymentMethod === method.value
                            ? 'border-minecraft-diamond bg-minecraft-diamond/10'
                            : 'border-gray-300 hover:border-minecraft-diamond/50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.value}
                          checked={formData.paymentMethod === method.value}
                          onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                          className="sr-only"
                        />
                        <div className="text-center">
                          <div className="text-2xl mb-2">{method.icon}</div>
                          <div className="font-minecraft text-sm font-semibold">{method.label}</div>
                          <div className="font-minecraft text-xs text-gray-600 mt-1">{method.description}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                  {errors.paymentMethod && (
                    <p className="text-red-500 text-sm font-minecraft mt-2">{errors.paymentMethod}</p>
                  )}
                </CardContent>
              </Card>

              {/* Order Notes */}
              <Card className="bg-white/95 backdrop-blur-xl border-2 border-minecraft-diamond/50">
                <CardHeader>
                  <CardTitle className="text-2xl font-minecraft text-gray-800">
                    Order Notes (Optional)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md font-minecraft resize-none"
                    rows={3}
                    placeholder="Any special instructions for your order..."
                  />
                </CardContent>
              </Card>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="bg-white/95 backdrop-blur-xl border-2 border-minecraft-diamond/50 sticky top-8">
              <CardHeader>
                <CardTitle className="text-2xl font-minecraft text-gray-800 flex items-center gap-2">
                  <Package className="w-6 h-6 text-minecraft-diamond" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      <img
                        src={getProductImage(item.image, item.name)}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded border"
                      />
                      <div className="flex-1">
                        <h4 className="font-minecraft text-sm font-semibold text-gray-800">
                          {item.name}
                        </h4>
                        <p className="font-minecraft text-xs text-gray-600">
                          Qty: {item.quantity} × ₹{item.price}
                        </p>
                      </div>
                      <div className="font-minecraft text-sm font-semibold text-gray-800">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Order Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between font-minecraft text-sm">
                    <span>Subtotal:</span>
                    <span>₹{totalPrice.toFixed(2)}</span>
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
                    <span>₹{totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                {/* Security Badges */}
                <div className="flex items-center justify-center gap-4 pt-4">
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <Shield className="w-4 h-4" />
                    <span className="font-minecraft">Secure</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-600">
                    <Truck className="w-4 h-4" />
                    <span className="font-minecraft">Fast Delivery</span>
                  </div>
                </div>

                {/* Place Order Button */}
                <Button
                  onClick={handleSubmit}
                  disabled={orderLoading}
                  className="w-full bg-minecraft-diamond hover:bg-minecraft-diamond/90 text-white font-minecraft py-3 text-lg"
                >
                  {orderLoading ? (
                    <LoadingSpinner />
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Place Order - ₹{totalPrice.toFixed(2)}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
