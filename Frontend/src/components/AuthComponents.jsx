import React, { useEffect } from 'react';
import { SignIn, SignUp, UserProfile, UserButton, useAuth } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// SignIn component with animation
export const SignInComponent = () => {
  return (
    <motion.div
      className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md flex items-center justify-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 60 }}
        transition={{ type: "spring", stiffness: 150, damping: 20 }}
      >
        <SignIn routing="path" path="/sign-in" />
      </motion.div>
    </motion.div>
  );
};

// SignUp component with animation
export const SignUpComponent = () => {
  return (
    <motion.div
      className="fixed inset-0 z-40 bg-black/60 backdrop-blur-md flex items-center justify-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 60 }}
        transition={{ type: "spring", stiffness: 150, damping: 20 }}
      >
        <SignUp routing="path" path="/sign-up" />
      </motion.div>
    </motion.div>
  );
};

// UserProfile component with animation
export const UserProfileComponent = () => {
  return (
    <motion.div
      className="mt-16 mb-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <UserProfile routing="path" path="/user-profile" />
    </motion.div>
  );
};

// UserButton component for the navbar
export const UserButtonComponent = () => {
  return (
    <UserButton 
      afterSignOutUrl="/"
      userProfileMode="navigation"
      userProfileUrl="/user-profile"
    />
  );
};

// Protected route component
export const ProtectedRoute = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate('/sign-in');
    }
  }, [isLoaded, isSignedIn, navigate]);

  if (!isLoaded) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return isSignedIn ? children : null;
};