import React from "react";
import "./index.css";
import Navbar from "./components/Navbar";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import { Toaster } from "react-hot-toast";
import Footer from "./components/Footer";
import { Notfound } from "./components/NotFound";
import { useAppContext } from "./context/AppContext";
import AllProduct from "./pages/AllProduct";
import ProductCategories from "./components/ProductCategories";

import { AnimatePresence } from "framer-motion";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import AddAddress from "./pages/AddAddress";
import { SignInComponent, SignUpComponent, UserProfileComponent, ProtectedRoute } from "./components/AuthComponents";
import ClerkDashboard from "./pages/ClerkDashboard";
import ClerkRoute from "./components/ClerkRoute";

const App = () => {
  const location = useLocation();
  const isSellerPath = location.pathname.includes("clerk-dashboard");
  const isAuthPath = location.pathname.includes("sign-in") || location.pathname.includes("sign-up");

  return (
    <div>
      {!isSellerPath && !isAuthPath && <Navbar />}
      <Toaster />

      <div className={`${isSellerPath ? "" : "px-6 md:px-16 lg:px-24 xl:px-32"}`}>
        
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<AllProduct />} />
            <Route path="/products/:category" element={<ProductCategories />} />
            <Route path="/products/:category/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
            <Route path="/add-address" element={<ProtectedRoute><AddAddress /></ProtectedRoute>} />
            <Route path="/sign-in/*" element={<SignInComponent />} />
            <Route path="/sign-up/*" element={<SignUpComponent />} />
            <Route path="/user-profile/*" element={<ProtectedRoute><UserProfileComponent /></ProtectedRoute>} />
            <Route path="/clerk-dashboard/*" element={<ClerkRoute><ClerkDashboard /></ClerkRoute>} />
            <Route path="*" element={<Notfound />} />
          </Routes>
        </AnimatePresence>
      </div>

      {!isSellerPath && <Footer />}
    </div>
  );
};

export default App;
