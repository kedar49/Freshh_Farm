import React from 'react';
import { ClerkProvider } from '@clerk/clerk-react';
// Import the dark theme correctly
import { dark } from '@clerk/themes';

// Your Clerk publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const ClerkConfig = ({ children }) => {
  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      appearance={{
        baseTheme: dark,
        elements: {
          formButtonPrimary: 'bg-primary hover:bg-primary-dull',
          card: 'bg-white/90 backdrop-blur-sm shadow-xl border border-gray-200 rounded-2xl',
          headerTitle: 'text-3xl font-semibold text-center text-gray-800',
          headerSubtitle: 'text-gray-600',
          socialButtonsBlockButton: 'border border-gray-300 hover:bg-gray-100',
          formFieldInput: 'mt-1 px-4 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary',
          footerActionLink: 'text-primary font-medium cursor-pointer hover:underline'
        }
      }}
    >
      {children}
    </ClerkProvider>
  );
};

export default ClerkConfig;
