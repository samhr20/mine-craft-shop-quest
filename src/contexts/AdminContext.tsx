import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

interface AdminRole {
  id: string;
  name: string;
  permissions: {
    all?: boolean;
    products?: boolean;
    orders?: boolean;
    users?: boolean;
    analytics?: boolean;
  };
}

interface AdminUser {
  id: string;
  user_id: string;
  role_id: string;
  is_active: boolean;
  role: AdminRole;
}

interface AdminContextType {
  isAdmin: boolean;
  adminUser: AdminUser | null;
  adminRole: AdminRole | null;
  loading: boolean;
  hasPermission: (permission: string) => boolean;
  refreshAdminStatus: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

interface AdminProviderProps {
  children: React.ReactNode;
}

export const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [adminRole, setAdminRole] = useState<AdminRole | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const checkAdminStatus = async () => {
    if (!user) {
      setIsAdmin(false);
      setAdminUser(null);
      setAdminRole(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Check if user has admin privileges
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select(`
          *,
          role:admin_roles(*)
        `)
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single();

      if (adminError) {
        // Silently handle admin check errors for normal users
        setIsAdmin(false);
        setAdminUser(null);
        setAdminRole(null);
      } else if (adminData) {
        setIsAdmin(true);
        setAdminUser(adminData);
        setAdminRole(adminData.role);
      } else {
        setIsAdmin(false);
        setAdminUser(null);
        setAdminRole(null);
      }
    } catch (error) {
      // Silently handle all errors
      setIsAdmin(false);
      setAdminUser(null);
      setAdminRole(null);
    } finally {
      setLoading(false);
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!adminRole) return false;
    
    // Super admin has all permissions
    if (adminRole.permissions.all) return true;
    
    // Check specific permission
    return adminRole.permissions[permission as keyof typeof adminRole.permissions] === true;
  };

  const refreshAdminStatus = async () => {
    await checkAdminStatus();
  };

  // Check admin status when user changes
  useEffect(() => {
    checkAdminStatus();
  }, [user]);

  const value: AdminContextType = {
    isAdmin,
    adminUser,
    adminRole,
    loading,
    hasPermission,
    refreshAdminStatus,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};
