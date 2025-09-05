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
import { Eye, EyeOff, User, Mail, Lock, UserCheck, Sparkles, Shield, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';


const registerSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters').max(20, 'Username must be less than 20 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const RegisterForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const { signUp } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setMessage(null);

    try {
      const result = await signUp(data.email, data.password, {
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
      });

      // FIX: Defensive check for error property
      if (result && result.error) {
        setMessage({
          type: 'error',
          text: result.error.message || 'Registration failed. Please try again.',
        });
      } else {
        setMessage({
          type: 'success',
          text: 'Registration successful! Please check your email to verify your account.',
        });
        reset();
        // Automatically redirect to login page after successful registration
        setTimeout(() => {
          navigate('/login');
        }, 2000); // Give user a moment to see the success message
      }
    } catch (err: any) {
      setMessage({
        type: 'error',
        text: err?.message || 'An unexpected error occurred. Please try again.',
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
        <Sparkles className="w-8 h-8 text-minecraft-diamond/30" />
      </div>
      <div className="absolute top-32 right-32 animate-bounce delay-700">
        <Shield className="w-6 h-6 text-minecraft-grass/30" />
      </div>
      <div className="absolute bottom-32 left-32 animate-bounce delay-1000">
        <Zap className="w-7 h-7 text-minecraft-redstone/30" />
      </div>

      <Card className="w-full max-w-lg bg-white/95 backdrop-blur-xl border-2 border-minecraft-diamond/50 shadow-2xl relative z-10 transform hover:scale-[1.02] transition-all duration-300">
        {/* Glowing Border Effect */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-minecraft-diamond/20 via-minecraft-grass/20 to-minecraft-redstone/20 blur-xl opacity-50"></div>

        <CardHeader className="text-center space-y-4 pb-6">
          {/* Animated Logo */}
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-minecraft-dirt via-minecraft-stone to-minecraft-grass border-4 border-minecraft-diamond/50 rounded-full flex items-center justify-center shadow-lg animate-pulse">
            <UserCheck className="w-10 h-10 text-white drop-shadow-lg" />
          </div>

          <div className="space-y-2">
            <CardTitle className="text-3xl font-minecraft text-gray-800 bg-gradient-to-r from-minecraft-diamond via-minecraft-grass to-minecraft-redstone bg-clip-text text-transparent">
              Join MineCraft Store
            </CardTitle>
            <CardDescription className="text-gray-600 font-minecraft text-lg">
              Create your account to start your adventure
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 px-8 pb-0 ">
          {message && (
            <Alert className={`border-2 ${message.type === 'error' ? 'border-red-500 bg-red-50' : 'border-green-500 bg-green-50'} shadow-lg animate-in slide-in-from-top-2 duration-300`}>
              <AlertDescription className={`${message.type === 'error' ? 'text-red-700' : 'text-green-700'} font-minecraft`}>
                {message.text}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label htmlFor="firstName" className="text-gray-700 font-minecraft text-sm font-semibold flex items-center gap-2">
                  <User className="w-4 h-4 text-minecraft-diamond" />
                  First Name
                </Label>
                <div className="relative group">
                  <Input
                    {...register('firstName')}
                    id="firstName"
                    placeholder="Steve"
                    className="pl-12 pr-4 py-3 bg-white border-2 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-minecraft-diamond focus:bg-white transition-all duration-300 font-minecraft rounded-lg shadow-sm"
                  />
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-minecraft-diamond/60 group-focus-within:text-minecraft-diamond transition-colors duration-300" />
                </div>
                {errors.firstName && (
                  <p className="text-red-600 text-sm font-minecraft animate-in slide-in-from-left-2 duration-300">{errors.firstName.message as string}</p>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="lastName" className="text-gray-700 font-minecraft text-sm font-semibold flex items-center gap-2">
                  <User className="w-4 h-4 text-minecraft-diamond" />
                  Last Name
                </Label>
                <div className="relative group">
                  <Input
                    {...register('lastName')}
                    id="lastName"
                    placeholder="Smith"
                    className="pl-12 pr-4 py-3 bg-white border-2 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-minecraft-diamond focus:bg-white transition-all duration-300 font-minecraft rounded-lg shadow-sm"
                  />
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-minecraft-diamond/60 group-focus-within:text-minecraft-diamond transition-colors duration-300" />
                </div>
                {errors.lastName && (
                  <p className="text-red-600 text-sm font-minecraft animate-in slide-in-from-left-2 duration-300">{errors.lastName.message as string}</p>
                )}
              </div>
            </div>

            {/* Username Field */}
            <div className="space-y-3">
              <Label htmlFor="username" className="text-gray-700 font-minecraft text-sm font-semibold flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-minecraft-grass" />
                Username
              </Label>
              <div className="relative group">
                <Input
                  {...register('username')}
                  id="username"
                  placeholder="steve_smith"
                  className="pl-12 pr-4 py-3 bg-white border-2 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-minecraft-grass focus:bg-white transition-all duration-300 font-minecraft rounded-lg shadow-sm"
                />
                <UserCheck className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-minecraft-grass/60 group-focus-within:text-minecraft-grass transition-colors duration-300" />
              </div>
              {errors.username && (
                <p className="text-red-600 text-sm font-minecraft animate-in slide-in-from-left-2 duration-300">{errors.username.message as string}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-3">
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
                  className="pl-12 pr-4 py-3 bg-white border-2 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-minecraft-redstone focus:bg-white transition-all duration-300 font-minecraft rounded-lg shadow-sm"
                />
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-minecraft-redstone/60 group-focus-within:text-minecraft-redstone transition-colors duration-300" />
              </div>
              {errors.email && (
                <p className="text-red-600 text-sm font-minecraft animate-in slide-in-from-left-2 duration-300">{errors.email.message as string}</p>
              )}
            </div>

            {/* Password Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
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
                    className="pl-12 pr-12 py-3 bg-white border-2 border-gray-300 text-gray-900 placeholder:text-gray-500 focus:border-minecraft-diamond focus:bg-white transition-all duration-300 font-minecraft rounded-lg shadow-sm"
                  />
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-minecraft-diamond/60 group-focus-within:text-minecraft-diamond transition-colors duration-300" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-300 p-1 rounded hover:bg-gray-100"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-600 text-sm font-minecraft animate-in slide-in-from-left-2 duration-300">{errors.password.message as string}</p>
                )}
              </div>

              <div className="space-y-3">
                <Label htmlFor="confirmPassword" className="text-gray-700 font-minecraft text-sm font-semibold flex items-center gap-2">
                  <Lock className="w-4 h-4 text-minecraft-diamond" />
                  Confirm
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
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-600 text-sm font-minecraft animate-in slide-in-from-left-2 duration-300">{errors.confirmPassword.message as string}</p>
                )}
              </div>
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
                  Creating Account...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Create Account
                </div>
              )}
            </Button>
          </form>
        </CardContent>
        
        
          <div className="text-center space-y-4 pt-4 pb-5  relative z-10">
            <div className="flex items-center justify-center space-x-1 text-gray-400">
              <div className="w-8 h-px bg-gray-300"></div>
              <span className="text-sm font-minecraft">or</span>
              <div className="w-8 h-px bg-gray-300"></div>
            </div>

            <p className="text-gray-600 font-minecraft text-sm">
              <span>
                Already have an account?{' '}
              </span>
              <Link
                to="/login"
                className="text-minecraft-diamond hover:text-minecraft-diamond/80 transition-colors font-minecraft font-semibold hover:underline relative z-20"
                tabIndex={0}
              >
                Sign In
              </Link>
            </p>

            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors font-minecraft text-sm hover:underline relative z-20"
              tabIndex={0}
            >
              <span>←</span> Back to Home
            </Link>
          </div>
      </Card>
    </div>
  );
};

export default RegisterForm;
