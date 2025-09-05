import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAdmin } from '../contexts/AdminContext';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Shield, Lock, AlertTriangle, Crown } from 'lucide-react';

interface AdminAccessGuardProps {
  children: React.ReactNode;
  requiredPermission?: string;
  fallbackPath?: string;
}

const AdminAccessGuard: React.FC<AdminAccessGuardProps> = ({ 
  children, 
  requiredPermission,
  fallbackPath = "/"
}) => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, hasPermission, loading: adminLoading } = useAdmin();
  const [showUnauthorizedAlert, setShowUnauthorizedAlert] = useState(false);
  const location = useLocation();

  // Show unauthorized alert when user tries to access admin without permission
  useEffect(() => {
    if (!authLoading && !adminLoading) {
      if (!user) {
        // User not signed in - redirect to login
        return;
      }
      
      if (!isAdmin || (requiredPermission && !hasPermission(requiredPermission))) {
        // User is signed in but not authorized
        setShowUnauthorizedAlert(true);
        
        // Auto-hide alert after 5 seconds
        const timer = setTimeout(() => {
          setShowUnauthorizedAlert(false);
        }, 5000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [user, isAdmin, hasPermission, requiredPermission, authLoading, adminLoading]);

  // Show loading state
  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-minecraft-dirt via-minecraft-stone to-minecraft-grass flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-minecraft-diamond/30 border-t-minecraft-diamond rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-minecraft text-lg">Checking access permissions...</p>
        </div>
      </div>
    );
  }

  // User not signed in - redirect to login with return URL
  if (!user) {
    return (
      <Navigate 
        to={`/login?redirect=${encodeURIComponent(location.pathname)}`} 
        replace 
      />
    );
  }

  // User signed in but not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-minecraft-dirt via-minecraft-stone to-minecraft-grass flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Unauthorized Alert */}
          {showUnauthorizedAlert && (
            <Alert className="mb-6 border-red-500 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800 font-minecraft">
                <strong>Access Denied!</strong> You don't have admin privileges to access this page.
              </AlertDescription>
            </Alert>
          )}

          <Card className="bg-white/95 backdrop-blur-xl border-2 border-red-500/50 shadow-xl">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl font-minecraft text-red-600">
                Access Restricted
              </CardTitle>
              <CardDescription className="text-gray-600 font-minecraft">
                This area is only accessible to administrators
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center text-gray-700 font-minecraft">
                <p className="mb-2">You need admin privileges to access this page.</p>
                <p className="text-sm text-gray-500">
                  If you believe this is an error, please contact an administrator.
                </p>
              </div>
              
              <div className="flex flex-col gap-3">
                <Button 
                  onClick={() => window.history.back()}
                  variant="outline" 
                  className="w-full font-minecraft"
                >
                  Go Back
                </Button>
                <Button 
                  onClick={() => window.location.href = '/'}
                  className="w-full bg-minecraft-diamond hover:bg-minecraft-diamond/90 text-white font-minecraft"
                >
                  Return to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // User is admin but doesn't have required permission
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-minecraft-dirt via-minecraft-stone to-minecraft-grass flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Unauthorized Alert */}
          {showUnauthorizedAlert && (
            <Alert className="mb-6 border-orange-500 bg-orange-50">
              <Lock className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800 font-minecraft">
                <strong>Permission Required!</strong> You need "{requiredPermission}" permission to access this page.
              </AlertDescription>
            </Alert>
          )}

          <Card className="bg-white/95 backdrop-blur-xl border-2 border-orange-500/50 shadow-xl">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-orange-600" />
              </div>
              <CardTitle className="text-2xl font-minecraft text-orange-600">
                Permission Required
              </CardTitle>
              <CardDescription className="text-gray-600 font-minecraft">
                You need additional permissions to access this feature
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center text-gray-700 font-minecraft">
                <p className="mb-2">Required permission: <strong>{requiredPermission}</strong></p>
                <p className="text-sm text-gray-500">
                  Contact a super admin to grant you this permission.
                </p>
              </div>
              
              <div className="flex flex-col gap-3">
                <Button 
                  onClick={() => window.location.href = '/admin'}
                  className="w-full bg-minecraft-diamond hover:bg-minecraft-diamond/90 text-white font-minecraft"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Go to Admin Dashboard
                </Button>
                <Button 
                  onClick={() => window.location.href = '/'}
                  variant="outline" 
                  className="w-full font-minecraft"
                >
                  Return to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // User has access - render children
  return <>{children}</>;
};

export default AdminAccessGuard;
