import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Eye, EyeOff, Mail, Lock, LogIn, Sparkles, Shield, Zap, Key } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const LoginForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/';

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setMessage(null);

    try {
      const { error } = await signIn(data.email, data.password);

      if (error) {
        setMessage({
          type: 'error',
          text: error.message || 'Login failed. Please check your credentials.',
        });
      } else {
        setMessage({
          type: 'success',
          text: 'Login successful! Redirecting...',
        });
        reset();
        // Automatically redirect to intended page or home page after successful login
        setTimeout(() => {
          navigate(redirectTo);
        }, 1500); // Give user a moment to see the success message
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'An unexpected error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // If your links are not working, make sure:
  // 1. The app is wrapped in <BrowserRouter> (or <HashRouter>) at the root level (usually in App.tsx or index.tsx).
  // 2. You are not using <a href="..."> but <Link to="..."> from react-router-dom.
  // 3. There are no overlays or parent elements with pointer-events: none or z-index issues covering the links.
  // 4. The routes for /register, /forgot-password, and / are defined in your router.
  // 5. You are not accidentally preventing default on click events for these links.

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-minecraft-dirt via-minecraft-stone to-minecraft-grass p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-minecraft-diamond/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-minecraft-grass/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-minecraft-redstone/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Floating Icons */}
      <div className="absolute top-20 left-20 animate-bounce delay-300">
        <Key className="w-8 h-8 text-minecraft-diamond/30" />
      </div>
      <div className="absolute top-32 right-32 animate-bounce delay-700">
        <Shield className="w-6 h-6 text-minecraft-grass/30" />
      </div>
      <div className="absolute bottom-32 left-32 animate-bounce delay-1000">
        <Zap className="w-7 h-7 text-minecraft-redstone/30" />
      </div>

      <Card className="w-full max-w-sm sm:max-w-md bg-white/95 backdrop-blur-xl border-2 border-minecraft-diamond/50 shadow-2xl relative z-10 transform hover:scale-[1.02] transition-all duration-300">
        {/* Glowing Border Effect */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-minecraft-diamond/20 via-minecraft-grass/20 to-minecraft-redstone/20 blur-xl opacity-50 pointer-events-none"></div>
        
        <CardHeader className="text-center space-y-3 sm:space-y-4 pb-4 sm:pb-6">
          {/* Animated Logo */}
          <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-minecraft-dirt via-minecraft-stone to-minecraft-grass border-4 border-minecraft-diamond/50 rounded-full flex items-center justify-center shadow-lg animate-pulse">
            <LogIn className="w-8 h-8 sm:w-10 sm:h-10 text-white drop-shadow-lg" />
          </div>
          
          <div className="space-y-1 sm:space-y-2">
            <CardTitle className="text-2xl sm:text-3xl font-minecraft text-gray-800 bg-gradient-to-r from-minecraft-diamond via-minecraft-grass to-minecraft-redstone bg-clip-text text-transparent">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-gray-600 font-minecraft text-base sm:text-lg">
              Sign in to your MineCraft Store account
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6 md:px-8 pb-6 sm:pb-8">
          {/* Admin redirect message */}
          {redirectTo.startsWith('/admin') && (
            <Alert className="border-2 border-blue-500 bg-blue-50 shadow-lg animate-in slide-in-from-top-2 duration-300">
              <Shield className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-700 font-minecraft">
                <strong>Admin Access Required!</strong> Please sign in to access the admin panel.
              </AlertDescription>
            </Alert>
          )}

          {message && (
            <Alert className={`border-2 ${message.type === 'error' ? 'border-red-500 bg-red-50' : 'border-green-500 bg-green-50'} shadow-lg animate-in slide-in-from-top-2 duration-300`}>
              <AlertDescription className={`${message.type === 'error' ? 'text-red-700' : 'text-green-700'} font-minecraft`}>
                {message.text}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
            {/* Email Field */}
            <div className="space-y-2 sm:space-y-3">
              <Label htmlFor="email" className="text-gray-700 font-minecraft text-sm font-semibold flex items-center gap-2">
                <Mail className="w-4 h-4 text-minecraft-redstone" />
                Email
              </Label>
              <div className="relative group">
                <Input
                  {...register('email')}
                  id="email"
                  type="email"
                  placeholder="steve@example.com"
                  className="pl-10 sm:pl-12 pr-4 py-2 sm:py-3 bg-white border-2 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-minecraft-redstone focus:bg-white transition-all duration-300 font-minecraft rounded-lg shadow-sm text-sm sm:text-base"
                />
                <Mail className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-minecraft-redstone/60 group-focus-within:text-minecraft-redstone transition-colors duration-300" />
              </div>
              {errors.email && (
                <p className="text-red-600 text-xs sm:text-sm font-minecraft animate-in slide-in-from-left-2 duration-300">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2 sm:space-y-3">
              <Label htmlFor="password" className="text-gray-700 font-minecraft text-sm font-semibold flex items-center gap-2">
                <Lock className="w-4 h-4 text-minecraft-diamond" />
                Password
              </Label>
              <div className="relative group">
                <Input
                  {...register('password')}
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pl-10 sm:pl-12 pr-10 sm:pr-12 py-2 sm:py-3 bg-white border-2 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-minecraft-diamond focus:bg-white transition-all duration-300 font-minecraft rounded-lg shadow-sm text-sm sm:text-base"
                />
                <Lock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-minecraft-diamond/60 group-focus-within:text-minecraft-diamond transition-colors duration-300" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-300 p-1 rounded hover:bg-gray-100"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-600 text-xs sm:text-sm font-minecraft animate-in slide-in-from-left-2 duration-300">{errors.password.message}</p>
              )}
            </div>

            {/* Forgot Password Link */}
            <div className="flex items-center justify-end">
              <Link 
                to="/forgot-password" 
                className="text-minecraft-diamond hover:text-minecraft-diamond/80 transition-colors font-minecraft text-sm font-semibold hover:underline flex items-center gap-1"
                tabIndex={0}
              >
                <Key className="w-3 h-3" />
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-minecraft-diamond via-minecraft-grass to-minecraft-redstone text-white hover:from-minecraft-diamond/90 hover:via-minecraft-grass/90 hover:to-minecraft-redstone/90 transition-all duration-300 font-minecraft text-sm sm:text-base md:text-lg py-3 sm:py-4 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:transform-none disabled:opacity-70"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Signing In...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Sign In
                </div>
              )}
            </Button>
          </form>

          {/* Links Section */}
          <div className="text-center space-y-4 pt-4">
            <div className="flex items-center justify-center space-x-1 text-gray-400">
              <div className="w-8 h-px bg-gray-300"></div>
              <span className="text-sm font-minecraft">or</span>
              <div className="w-8 h-px bg-gray-300"></div>
            </div>
            
            <p className="text-gray-600 font-minecraft text-sm">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="text-minecraft-diamond hover:text-minecraft-diamond/80 transition-colors font-minecraft font-semibold hover:underline"
                tabIndex={0}
              >
                Sign Up
              </Link>
            </p>
            
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors font-minecraft text-sm hover:underline"
              tabIndex={0}
            >
              <span>←</span> Back to Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
