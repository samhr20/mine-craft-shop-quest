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
import { Mail, ArrowLeft, Sparkles, Shield, Zap, Key } from 'lucide-react';
import { Link } from 'react-router-dom';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const { resetPassword } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    setMessage(null);

    try {
      const { error } = await resetPassword(data.email);

      if (error) {
        setMessage({
          type: 'error',
          text: error.message || 'Failed to send reset email. Please try again.',
        });
      } else {
        setMessage({
          type: 'success',
          text: 'Password reset email sent! Please check your inbox and follow the instructions.',
        });
        reset();
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
            <Key className="w-10 h-10 text-white drop-shadow-lg" />
          </div>
          
          <div className="space-y-2">
            <CardTitle className="text-3xl font-minecraft text-gray-800 bg-gradient-to-r from-minecraft-diamond via-minecraft-grass to-minecraft-redstone bg-clip-text text-transparent">
              Reset Password
            </CardTitle>
            <CardDescription className="text-gray-600 font-minecraft text-lg">
              Enter your email to receive reset instructions
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
            {/* Email Field */}
            <div className="space-y-3">
              <Label htmlFor="email" className="text-gray-700 font-minecraft text-sm font-semibold flex items-center gap-2">
                <Mail className="w-4 h-4 text-minecraft-redstone" />
                Email Address
              </Label>
              <div className="relative group">
                <Input
                  {...register('email')}
                  id="email"
                  type="email"
                  placeholder="steve@example.com"
                  className="pl-12 pr-4 py-3 bg-white border-2 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-minecraft-redstone focus:bg-white transition-all duration-300 font-minecraft rounded-lg shadow-sm"
                />
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-minecraft-redstone/60 group-focus-within:text-minecraft-redstone transition-colors duration-300" />
              </div>
              {errors.email && (
                <p className="text-red-600 text-sm font-minecraft animate-in slide-in-from-left-2 duration-300">{errors.email.message}</p>
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
                  Sending Reset Email...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Send Reset Email
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
            
            <Link 
              to="/login" 
              className="inline-flex items-center gap-2 text-minecraft-diamond hover:text-minecraft-diamond/80 transition-colors font-minecraft font-semibold hover:underline"
              tabIndex={0}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
            
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

export default ForgotPasswordForm;
