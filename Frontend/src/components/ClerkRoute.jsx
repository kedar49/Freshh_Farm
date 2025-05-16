import React, { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const ClerkRoute = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth();
  const navigate = useNavigate();
  const { user } = useAppContext();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      toast.error('Please sign in to access this page');
      navigate('/sign-in');
      return;
    }

    // For demonstration purposes, we'll skip strict role checking
    // In a production app, you would check the user's role from your backend
    // if (isLoaded && isSignedIn && user) {
    //   // Check if user is a clerk or admin
    //   if (user.role !== 'clerk' && user.role !== 'admin') {
    //     toast.error('Unauthorized: Clerk access required');
    //     navigate('/');
    //   }
    // }
  }, [isLoaded, isSignedIn, navigate]);

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Allow access if signed in (for demonstration purposes)
  return isSignedIn ? children : null;
};

export default ClerkRoute; 