import React, { useState, useEffect } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { 
  ArrowLeft, 
  Search, 
  Users, 
  UserPlus,
  Shield,
  Calendar,
  Mail,
  Crown,
  UserCheck,
  UserX,
  MoreHorizontal
} from 'lucide-react';
import { Link } from 'react-router-dom';
import AdminAccessGuard from '../components/AdminAccessGuard';
import AdminRoleSelector from '../components/AdminRoleSelector';
import { supabase } from '../lib/supabase';

interface User {
  id: string;
  email: string;
  created_at: string;
  user_metadata: {
    username?: string;
    first_name?: string;
    last_name?: string;
  };
  is_admin?: boolean;
  admin_role?: string;
}

const AdminUsers: React.FC = () => {
  const { isAdmin, hasPermission, loading } = useAdmin();
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{id: string, email: string} | null>(null);


  // Load users
  useEffect(() => {
    if (isAdmin && hasPermission('users')) {
      loadUsers();
    }
  }, [isAdmin, hasPermission]);

  useEffect(() => {
  }, [isAdmin, hasPermission]);

  // Filter users based on search and role
  useEffect(() => {
    let filtered = users;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.user_metadata?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.user_metadata?.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.user_metadata?.last_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by role
    if (selectedRole !== 'all') {
      if (selectedRole === 'admin') {
        filtered = filtered.filter(user => user.is_admin);
      } else if (selectedRole === 'user') {
        filtered = filtered.filter(user => !user.is_admin);
      }
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, selectedRole]);

  const loadUsers = async () => {
    try {
      setLoadingUsers(true);
      
      // Get all users from profiles table
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) {
        return;
      }

      // Get admin users
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select(`
          user_id,
          role:admin_roles(name)
        `);

      if (adminError) {
      }

      // Create a map of admin users
      const adminMap = new Map();
      if (adminData) {
        adminData.forEach(admin => {
          adminMap.set(admin.user_id, {
            is_admin: true,
            admin_role: admin.role?.name || 'admin'
          });
        });
      }

      // Combine profile data with admin status
      const usersWithAdminStatus = profilesData?.map(profile => ({
        id: profile.id,
        email: profile.email,
        created_at: profile.created_at,
        user_metadata: {
          username: profile.username,
          first_name: profile.first_name,
          last_name: profile.last_name
        },
        ...adminMap.get(profile.id)
      })) || [];

      setUsers(usersWithAdminStatus);
    } catch (error) {
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleMakeAdmin = (userId: string, email: string) => {
    setSelectedUser({ id: userId, email });
    setShowRoleSelector(true);
  };

  const handleRoleSelect = async (role: any) => {
    if (!selectedUser) return;

    try {

      // Check if user is already an admin
      const { data: existingAdmin, error: checkError } = await supabase
        .from('admin_users')
        .select('*')
        .eq('user_id', selectedUser.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        alert(`Failed to check existing admin status: ${checkError.message}`);
        return;
      }

      if (existingAdmin) {
        alert('User is already an admin!');
        setShowRoleSelector(false);
        setSelectedUser(null);
        return;
      }

      // Add user to admin_users table
      const { error } = await supabase
        .from('admin_users')
        .insert({
          user_id: selectedUser.id,
          role_id: role.id,
          is_active: true
        });

      if (error) {
        alert(`Failed to make user admin: ${error.message}`);
        return;
      }

      alert(`User is now a ${role.name}!`);
      await loadUsers(); // Reload users
    } catch (error) {
      alert(`Failed to make user admin: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setShowRoleSelector(false);
      setSelectedUser(null);
    }
  };

  const handleRemoveAdmin = async (userId: string, email: string) => {
    if (!window.confirm(`Are you sure you want to remove admin privileges from "${email}"?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('admin_users')
        .delete()
        .eq('user_id', userId);

      if (error) {
        alert('Failed to remove admin privileges. Please try again.');
        return;
      }

      alert('Admin privileges removed successfully!');
      await loadUsers(); // Reload users
    } catch (error) {
      alert('Failed to remove admin privileges. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getRoleBadge = (user: User) => {
    if (user.is_admin) {
      const roleColor = user.admin_role === 'super_admin' ? 'bg-minecraft-gold' : 
                       user.admin_role === 'admin' ? 'bg-minecraft-diamond' : 
                       'bg-minecraft-grass';
      return (
        <Badge className={`${roleColor} text-white font-minecraft`}>
          {user.admin_role || 'Admin'}
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="font-minecraft">
        User
      </Badge>
    );
  };

  return (
    <AdminAccessGuard requiredPermission="users">
    <div className="min-h-screen bg-gradient-to-br from-minecraft-dirt via-minecraft-stone to-minecraft-grass p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-minecraft text-white drop-shadow-lg mb-2">
                User Management
              </h1>
              <p className="text-white/80 font-minecraft text-lg">
                Manage user accounts and admin privileges
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link to="/admin">
                <Button variant="ghost" className="text-white hover:text-white/80 font-minecraft">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/95 backdrop-blur-xl border-2 border-minecraft-diamond/50 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-minecraft">Total Users</p>
                  <p className="text-3xl font-bold text-minecraft-diamond font-minecraft">
                    {users.length}
                  </p>
                </div>
                <Users className="w-8 h-8 text-minecraft-diamond/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-xl border-2 border-minecraft-grass/50 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-minecraft">Admin Users</p>
                  <p className="text-3xl font-bold text-minecraft-grass font-minecraft">
                    {users.filter(u => u.is_admin).length}
                  </p>
                </div>
                <Shield className="w-8 h-8 text-minecraft-grass/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-xl border-2 border-minecraft-redstone/50 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-minecraft">Regular Users</p>
                  <p className="text-3xl font-bold text-minecraft-redstone font-minecraft">
                    {users.filter(u => !u.is_admin).length}
                  </p>
                </div>
                <UserCheck className="w-8 h-8 text-minecraft-redstone/50" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/95 backdrop-blur-xl border-2 border-minecraft-gold/50 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-minecraft">New This Month</p>
                  <p className="text-3xl font-bold text-minecraft-gold font-minecraft">
                    {users.filter(u => {
                      const userDate = new Date(u.created_at);
                      const now = new Date();
                      return userDate.getMonth() === now.getMonth() && userDate.getFullYear() === now.getFullYear();
                    }).length}
                  </p>
                </div>
                <UserPlus className="w-8 h-8 text-minecraft-gold/50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="bg-white/95 backdrop-blur-xl border-2 border-minecraft-stone/50 shadow-xl mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search users by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 font-minecraft"
                  />
                </div>
              </div>
              <div className="md:w-48">
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full p-2 border border-minecraft-stone/30 rounded-md font-minecraft bg-white"
                >
                  <option value="all">All Users</option>
                  <option value="admin">Admin Users</option>
                  <option value="user">Regular Users</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="bg-white/95 backdrop-blur-xl border-2 border-minecraft-stone/50 shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl font-minecraft text-gray-800 flex items-center gap-2">
              <Users className="w-5 h-5 text-minecraft-diamond" />
              Users ({filteredUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-minecraft text-gray-800 mb-2">No Users Found</h3>
                <p className="text-muted-foreground font-minecraft">
                  {searchTerm || selectedRole !== 'all' 
                    ? 'Try adjusting your search or filter criteria.'
                    : 'No users have registered yet.'
                  }
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-minecraft-stone/20">
                      <th className="text-left p-4 font-minecraft text-gray-800">User</th>
                      <th className="text-left p-4 font-minecraft text-gray-800">Email</th>
                      <th className="text-left p-4 font-minecraft text-gray-800">Role</th>
                      <th className="text-left p-4 font-minecraft text-gray-800">Joined</th>
                      <th className="text-left p-4 font-minecraft text-gray-800">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b border-minecraft-stone/10 hover:bg-muted/20">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-minecraft-diamond/20 rounded-full flex items-center justify-center">
                              <Users className="w-5 h-5 text-minecraft-diamond" />
                            </div>
                            <div>
                              <p className="font-minecraft font-medium text-gray-800">
                                {user.user_metadata?.username || 
                                 `${user.user_metadata?.first_name || ''} ${user.user_metadata?.last_name || ''}`.trim() ||
                                 'User'}
                              </p>
                              <p className="text-sm text-muted-foreground font-minecraft">
                                ID: {user.id.slice(0, 8)}...
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            <span className="font-minecraft text-sm">{user.email}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          {getRoleBadge(user)}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground font-minecraft">
                              {formatDate(user.created_at)}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            {user.id !== currentUser?.id && hasPermission('users') && (
                              <>
                                {user.is_admin ? (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleRemoveAdmin(user.id, user.email)}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50 font-minecraft"
                                  >
                                    <UserX className="w-4 h-4 mr-1" />
                                    Remove Admin
                                  </Button>
                                ) : (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleMakeAdmin(user.id, user.email)}
                                    className="text-minecraft-grass hover:text-minecraft-grass/80 hover:bg-minecraft-grass/10 font-minecraft"
                                  >
                                    <Crown className="w-4 h-4 mr-1" />
                                    Make Admin
                                  </Button>
                                )}
                              </>
                            )}
                            {user.id === currentUser?.id && (
                              <Badge variant="outline" className="font-minecraft">
                                You
                              </Badge>
                            )}
                            {!hasPermission('users') && user.id !== currentUser?.id && (
                              <Badge variant="outline" className="font-minecraft text-gray-500">
                                No Permission
                              </Badge>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>

    {/* Role Selector Modal */}
    <AdminRoleSelector
      isOpen={showRoleSelector}
      onClose={() => {
        setShowRoleSelector(false);
        setSelectedUser(null);
      }}
      onSelect={handleRoleSelect}
      userEmail={selectedUser?.email || ''}
    />
    </AdminAccessGuard>
  );
};

export default AdminUsers;
