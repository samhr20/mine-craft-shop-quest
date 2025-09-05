import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { X, LogIn, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LoginRequiredPopupProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
}

const LoginRequiredPopup: React.FC<LoginRequiredPopupProps> = ({
  isOpen,
  onClose,
  title = "Login Required",
  message = "Please log in to add items to your cart and continue shopping."
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-xl border-2 border-minecraft-diamond/50 shadow-2xl animate-in fade-in-0 zoom-in-95 duration-300">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-xl font-minecraft text-gray-800 flex items-center justify-center gap-2">
                <UserPlus className="w-5 h-5 text-minecraft-diamond" />
                {title}
              </CardTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <CardDescription className="text-gray-600 font-minecraft text-center">
            {message}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/login" onClick={onClose} className="flex-1">
              <Button className="w-full bg-minecraft-diamond hover:bg-minecraft-diamond/90 text-white font-minecraft">
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            </Link>
            <Link to="/register" onClick={onClose} className="flex-1">
              <Button variant="outline" className="w-full border-2 border-minecraft-grass hover:bg-minecraft-grass hover:text-white font-minecraft">
                <UserPlus className="w-4 h-4 mr-2" />
                Sign Up
              </Button>
            </Link>
          </div>
          <div className="text-center">
            <Button variant="ghost" onClick={onClose} className="text-gray-500 hover:text-gray-700 font-minecraft">
              Continue Shopping
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginRequiredPopup;
