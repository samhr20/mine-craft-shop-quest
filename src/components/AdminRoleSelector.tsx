import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { X, Crown, Shield, User } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AdminRole {
  id: string;
  name: string;
  permissions: {
    all?: boolean;
    products?: boolean;
    users?: boolean;
    analytics?: boolean;
    orders?: boolean;
  };
}

interface AdminRoleSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (role: AdminRole) => void;
  userEmail: string;
}

const AdminRoleSelector: React.FC<AdminRoleSelectorProps> = ({
  isOpen,
  onClose,
  onSelect,
  userEmail
}) => {
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadRoles();
    }
  }, [isOpen]);

  const loadRoles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('admin_roles')
        .select('*')
        .order('name');

      if (error) {
        return;
      }

      setRoles(data || []);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (roleName: string) => {
    switch (roleName.toLowerCase()) {
      case 'super_admin':
        return <Crown className="w-5 h-5 text-minecraft-gold" />;
      case 'admin':
        return <Shield className="w-5 h-5 text-minecraft-diamond" />;
      default:
        return <User className="w-5 h-5 text-minecraft-grass" />;
    }
  };

  const getRoleColor = (roleName: string) => {
    switch (roleName.toLowerCase()) {
      case 'super_admin':
        return 'border-minecraft-gold/50 bg-minecraft-gold/10 hover:bg-minecraft-gold/20';
      case 'admin':
        return 'border-minecraft-diamond/50 bg-minecraft-diamond/10 hover:bg-minecraft-diamond/20';
      default:
        return 'border-minecraft-grass/50 bg-minecraft-grass/10 hover:bg-minecraft-grass/20';
    }
  };

  const getRoleDescription = (roleName: string) => {
    switch (roleName.toLowerCase()) {
      case 'super_admin':
        return 'Full access to all features including user management, admin controls, and system settings.';
      case 'admin':
        return 'Can manage products and orders. Cannot manage other users or admin settings.';
      default:
        return 'Limited access to specific features.';
    }
  };

  const getPermissionBadges = (permissions: AdminRole['permissions']) => {
    const badges = [];
    if (permissions.all) {
      badges.push(<Badge key="all" className="bg-minecraft-gold text-white">All Permissions</Badge>);
    } else {
      Object.entries(permissions).forEach(([key, value]) => {
        if (value) {
          badges.push(
            <Badge key={key} variant="outline" className="text-xs">
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </Badge>
          );
        }
      });
    }
    return badges;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl bg-white/95 backdrop-blur-xl border-2 border-minecraft-diamond/50 shadow-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-minecraft text-gray-800 flex items-center gap-2">
                <Crown className="w-6 h-6 text-minecraft-diamond" />
                Select Admin Role
              </CardTitle>
              <CardDescription className="font-minecraft text-lg">
                Choose the role for <strong>{userEmail}</strong>
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-4 border-minecraft-diamond/30 border-t-minecraft-diamond rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 font-minecraft">Loading roles...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {roles.map((role) => (
                <div
                  key={role.id}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-lg ${getRoleColor(role.name)}`}
                  onClick={() => onSelect(role)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getRoleIcon(role.name)}
                      <div>
                        <h3 className="font-minecraft font-semibold text-gray-800 text-lg">
                          {role.name.replace('_', ' ').toUpperCase()}
                        </h3>
                        <p className="text-sm text-gray-600 font-minecraft mt-1">
                          {getRoleDescription(role.name)}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {getPermissionBadges(role.permissions)}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="font-minecraft"
                    >
                      Select
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminRoleSelector;
