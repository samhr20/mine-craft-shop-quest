import React from 'react';
import UserProfile from '../components/auth/UserProfile';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from "../contexts/CartContext";
import { useWishlist } from "../contexts/WishlistContext";
import { Navigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-dirt-gradient flex items-center justify-center">
        <div className="text-primary-foreground font-minecraft text-xl">
          Loading...
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <UserProfile />;
};

export default Profile;
