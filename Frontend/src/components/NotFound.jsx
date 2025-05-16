import React from "react";
import { Link } from "react-router-dom";

export const Notfound = () => {
  return (
    <div className="bg-primary/10 min-h-screen flex flex-col items-center justify-center px-6">
      <h1 className="text-7xl font-extrabold text-primary-500 mb-4">404</h1>
      <h2 className="text-3xl font-medium text-gray-800 mb-6">
        Oops! Page Not Found
      </h2>
      <p className="text-base md:text-lg text-gray-600 mb-8 text-center max-w-[500px]">
        The page you are looking for does not exist or has been moved. Please
        check the URL or return to the homepage.
      </p>
      <Link
        to="/"
        className="bg-black text-white px-8 py-3 rounded-full shadow-lg hover:bg-gray-500 transition duration-300"
      >
        Go Back Home
      </Link>
    </div>
  );
};
