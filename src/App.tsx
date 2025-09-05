import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import LoginRequiredPopup from "./components/LoginRequiredPopup";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider, useCart } from "./contexts/CartContext";
import { WishlistProvider, useWishlist } from "./contexts/WishlistContext";
import { AdminProvider } from "./contexts/AdminContext";
import { OrderProvider } from "./contexts/OrderContext";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import Wishlist from "./pages/Wishlist";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminAddProduct from "./pages/AdminAddProduct";
import AdminEditProduct from "./pages/AdminEditProduct";
import AdminUsers from "./pages/AdminUsers";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminOrders from "./pages/AdminOrders";
import UserOrders from "./pages/UserOrders";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import UPIPayment from "./pages/UPIPayment";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const CartLoginPopup = () => {
  const { showLoginPopup, setShowLoginPopup } = useCart();
  
  return (
    <LoginRequiredPopup
      isOpen={showLoginPopup}
      onClose={() => setShowLoginPopup(false)}
      title="Login Required"
      message="Please log in to add items to your cart and continue shopping."
    />
  );
};

const WishlistLoginPopup = () => {
  const { showLoginPopup, setShowLoginPopup } = useWishlist();
  
  return (
    <LoginRequiredPopup
      isOpen={showLoginPopup}
      onClose={() => setShowLoginPopup(false)}
      title="Login Required"
      message="Please log in to add items to your wishlist and save your favorites."
    />
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
              <BrowserRouter>
          <ScrollToTop />
          <AuthProvider>
            <CartProvider>
              <CartLoginPopup />
              <WishlistProvider>
                <WishlistLoginPopup />
                <AdminProvider>
                  <OrderProvider>
                    <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/product/:id" element={<ProductDetail />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                                         <Route path="/profile" element={<Profile />} />
                     <Route path="/wishlist" element={<Wishlist />} />
                     <Route path="/orders" element={<UserOrders />} />
                     <Route path="/checkout" element={<Checkout />} />
                     <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
                     <Route path="/upi-payment/:orderId" element={<UPIPayment />} />
                     <Route path="/admin" element={<AdminDashboard />} />
                     <Route path="/admin/products" element={<AdminProducts />} />
                     <Route path="/admin/products/add" element={<AdminAddProduct />} />
                     <Route path="/admin/products/edit/:id" element={<AdminEditProduct />} />
                     <Route path="/admin/users" element={<AdminUsers />} />
                     <Route path="/admin/analytics" element={<AdminAnalytics />} />
                     <Route path="/admin/orders" element={<AdminOrders />} />
                     {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                    </Routes>
                  </OrderProvider>
                </AdminProvider>
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
