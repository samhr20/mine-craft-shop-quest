import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Lock, ArrowLeft, Sparkles, Shield, Zap, Key, CheckCircle, AlertTriangle } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

const ResetPasswordForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [isValidToken, setIsValidToken] = useState(false);
  const [isProcessing, setIsProcessing] = useState(true);
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const checkResetToken = async () => {
      try {
        
        // Check if we have error parameters from Supabase (expired/invalid link)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const error = hashParams.get('error');
        const errorCode = hashParams.get('error_code');
        const errorDescription = hashParams.get('error_description');
        
        if (error || errorCode) {
          // Handle error cases from Supabase
          let errorMessage = 'Invalid reset link. Please request a new password reset.';
          
          if (errorCode === 'otp_expired') {
            errorMessage = 'This password reset link has expired. This can happen if the link was clicked too late or if there are configuration issues. Please request a new reset link.';
          } else if (error === 'access_denied') {
            errorMessage = 'Access denied. This reset link is invalid or has been used. Please request a new password reset.';
          } else if (errorDescription) {
            errorMessage = decodeURIComponent(errorDescription);
          }
          
          setMessage({
            type: 'error',
            text: errorMessage,
          });
          setIsValidToken(false);
          setIsProcessing(false);
          return;
        }
        
        // Check if we have the necessary parameters from Supabase
        // Supabase sends tokens in the hash fragment, not query parameters
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = hashParams.get('type');
        
        
        if (type === 'recovery' && accessToken && refreshToken) {
          // Set the session with the recovery tokens
          const { error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          
          if (sessionError) {
            setMessage({
              type: 'error',
              text: 'Invalid or expired reset link. Please request a new one.',
            });
            setIsValidToken(false);
          } else {
            setIsValidToken(true);
          }
        } else {
          setMessage({
            type: 'error',
            text: 'Invalid reset link. Please request a new password reset.',
          });
          setIsValidToken(false);
        }
      } catch (error) {
        setMessage({
          type: 'error',
          text: 'Error processing reset link. Please try again.',
        });
        setIsValidToken(false);
      } finally {
        setIsProcessing(false);
      }
    };

    checkResetToken();
  }, [searchParams]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    setIsLoading(true);
    setMessage(null);

    try {
      // Update the user's password
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (error) {
        setMessage({
          type: 'error',
          text: error.message || 'Failed to update password. Please try again.',
        });
      } else {
        setMessage({
          type: 'success',
          text: 'Password updated successfully! Redirecting to login...',
        });
        reset();
        
        // Redirect to login after successful password reset
        setTimeout(() => {
          navigate('/login');
        }, 2000);
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

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-minecraft-dirt via-minecraft-stone to-minecraft-grass p-4">
        <Card className="w-full max-w-md bg-white/95 backdrop-blur-xl border-2 border-minecraft-diamond/50 shadow-2xl">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 border-4 border-minecraft-diamond/30 border-t-minecraft-diamond rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-minecraft">Verifying reset link...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isValidToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-minecraft-dirt via-minecraft-stone to-minecraft-grass p-4">
        <Card className="w-full max-w-md bg-white/95 backdrop-blur-xl border-2 border-red-500/50 shadow-2xl">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-xl font-minecraft text-gray-800 mb-2">Reset Link Issue</h3>
            <p className="text-gray-600 font-minecraft mb-4">
              {message?.text || 'This password reset link is invalid or has expired.'}
            </p>
            
            {/* Additional Help Text */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4 text-left">
              <p className="text-sm text-yellow-800 font-minecraft">
                <strong>💡 Tip:</strong> If you're clicking the link immediately after receiving the email, 
                there might be a configuration issue. Try requesting a new reset link.
              </p>
            </div>
            
            <div className="space-y-3">
              <Link to="/forgot-password">
                <Button className="w-full bg-minecraft-diamond text-white hover:bg-minecraft-diamond/90">
                  Request New Reset
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" className="w-full">
                  Back to Login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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

      <Card className="w-full max-w-md bg-white/95 backdrop-blur-xl border-2 border-minecraft-diamond/50 shadow-2xl relative z-10 transform hover:scale-[1.02] transition-all duration-300">
        {/* Glowing Border Effect */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-minecraft-diamond/20 via-minecraft-grass/20 to-minecraft-redstone/20 blur-xl opacity-50 pointer-events-none"></div>
        
        <CardHeader className="text-center space-y-4 pb-6">
          {/* Animated Logo */}
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-minecraft-dirt via-minecraft-stone to-minecraft-grass border-4 border-minecraft-diamond/50 rounded-full flex items-center justify-center shadow-lg animate-pulse">
            <CheckCircle className="w-10 h-10 text-white drop-shadow-lg" />
          </div>
          
          <div className="space-y-2">
            <CardTitle className="text-3xl font-minecraft text-gray-800 bg-gradient-to-r from-minecraft-diamond via-minecraft-grass to-minecraft-redstone bg-clip-text text-transparent">
              Set New Password
            </CardTitle>
            <CardDescription className="text-gray-600 font-minecraft text-lg">
              Enter your new password below
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6 px-8 pb-8">
          {message && (
            <Alert className={`border-2 ${message.type === 'error' ? 'border-red-500 bg-red-50' : 'border-green-500 bg-green-50'} shadow-lg animate-in slide-in-from-top-2 duration-300`}>
              <AlertDescription className={`${message.type === 'error' ? 'text-red-700' : 'text-green-700'} font-minecraft`}>
                {message.text}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* New Password Field */}
            <div className="space-y-3">
              <Label htmlFor="password" className="text-gray-700 font-minecraft text-sm font-semibold flex items-center gap-2">
                <Lock className="w-4 h-4 text-minecraft-diamond" />
                New Password
              </Label>
              <div className="relative group">
                <Input
                  {...register('password')}
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pl-12 pr-12 py-3 bg-white border-2 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-minecraft-diamond focus:bg-white transition-all duration-300 font-minecraft rounded-lg shadow-sm"
                />
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-minecraft-diamond/60 group-focus-within:text-minecraft-diamond transition-colors duration-300" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-300 p-1 rounded hover:bg-gray-100"
                >
                  {showPassword ? <Lock className="w-4 h-4" /> : <Key className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-600 text-sm font-minecraft animate-in slide-in-from-left-2 duration-300">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-3">
              <Label htmlFor="confirmPassword" className="text-gray-700 font-minecraft text-sm font-semibold flex items-center gap-2">
                <Lock className="w-4 h-4 text-minecraft-diamond" />
                Confirm Password
              </Label>
              <div className="relative group">
                <Input
                  {...register('confirmPassword')}
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pl-12 pr-12 py-3 bg-white border-2 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-minecraft-diamond focus:bg-white transition-all duration-300 font-minecraft rounded-lg shadow-sm"
                />
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-minecraft-diamond/60 group-focus-within:text-minecraft-diamond transition-colors duration-300" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-300 p-1 rounded hover:bg-gray-100"
                >
                  {showConfirmPassword ? <Lock className="w-4 h-4" /> : <Key className="w-4 h-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-600 text-sm font-minecraft animate-in slide-in-from-left-2 duration-300">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-minecraft-diamond via-minecraft-grass to-minecraft-redstone text-white hover:from-minecraft-diamond/90 hover:via-minecraft-grass/90 hover:to-minecraft-redstone/90 transition-all duration-300 font-minecraft text-lg py-4 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:transform-none disabled:opacity-70"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Updating Password...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Update Password
                </div>
              )}
            </Button>
          </form>

          {/* Links Section */}
          <div className="text-center space-y-4 pt-4">
            <Link 
              to="/login" 
              className="inline-flex items-center gap-2 text-minecraft-diamond hover:text-minecraft-diamond/80 transition-colors font-minecraft font-semibold hover:underline"
              tabIndex={0}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPasswordForm;
