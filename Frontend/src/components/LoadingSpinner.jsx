import React from 'react';

const LoadingSpinner = ({ size = 'medium', message = 'Loading...', fullScreen = false }) => {
  // Define sizes
  const sizes = {
    small: {
      spinner: 'w-8 h-8 border-2',
      container: 'min-h-[200px]'
    },
    medium: {
      spinner: 'w-12 h-12 border-3',
      container: 'min-h-[300px]'
    },
    large: {
      spinner: 'w-16 h-16 border-4',
      container: 'min-h-[400px]'
    },
  };

  const sizeConfig = sizes[size] || sizes.medium;
  
  const containerClasses = fullScreen 
    ? "fixed inset-0 bg-white bg-opacity-90 z-50 flex flex-col items-center justify-center" 
    : `flex flex-col items-center justify-center ${sizeConfig.container}`;

  return (
    <div className={containerClasses}>
      <div 
        className={`${sizeConfig.spinner} border-gray-200 border-t-primary rounded-full animate-spin mb-4`}
        aria-label="Loading"
      ></div>
      {message && <p className="text-text-light">{message}</p>}
    </div>
  );
};

export default LoadingSpinner; 