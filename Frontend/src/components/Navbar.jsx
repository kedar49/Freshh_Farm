import React, { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppContext } from "../context/AppContext";
import { UserButtonComponent } from "./AuthComponents";
import { useAuth } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { Package } from "lucide-react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef(null);

  const {
    user,
    navigate,
    searchQuary,
    setSearchQuary,
    getCartItemsCount,
  } = useAppContext();
  
  const { isSignedIn, isLoaded } = useAuth();

  // Clerk handles logout functionality

  useEffect(() => {
    if (searchQuary.length > 0) {
      navigate("/products");
    }
  }, [searchQuary]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearch(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="h-20 flex items-center justify-between px-4 md:px-16 lg:px-24 border-b bg-white relative">
      {/* Logo */}
      <NavLink to="/" onClick={() => setMenuOpen(false)}>
        <img className="h-14 md:h-20" src={assets.logo} alt="logo" />
      </NavLink>

      {/* Desktop Menu */}
      <div className="hidden sm:flex items-center gap-8">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/products">All Products</NavLink>
        <NavLink to="/">Contact</NavLink>

        {/* Search */}
        <div className="flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
          <input
            onChange={(e) => setSearchQuary(e.target.value)}
            className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
            type="text"
            placeholder="Search products"
          />
          <img src={assets.search_icon} alt="search_icon" className="h-4 w-4" />
        </div>

        {/* Cart Icon */}
        <div
          className="relative cursor-pointer"
          onClick={() => navigate("/cart")}
        >
          <img src={assets.nav_cart_icon} alt="cart" className="w-6" />
          
            <span className="absolute -top-2 -right-3 text-xs text-white bg-red-500 w-[18px] h-[18px] rounded-full flex items-center justify-center">
              {getCartItemsCount() || 0}
            </span>
          
        </div>

        {/* Clerk User Button */}
        {isLoaded && (
          isSignedIn ? (
            <div className="flex items-center gap-2">
              <NavLink to="/user-profile" className="text-sm hover:text-primary">
                My Profile
              </NavLink>
              {/* Show clerk dashboard link for clerks and admins */}
              {user && (user.role === 'clerk' || user.role === 'admin') && (
                <NavLink to="/clerk-dashboard" className="text-sm bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md">
                  Clerk Dashboard
                </NavLink>
              )}
              <Link to="/order-history" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <Package size={16} />
                Order History
              </Link>
              <UserButtonComponent />
            </div>
          ) : (
            <NavLink to="/sign-in" className="px-6 py-2 bg-primary text-white rounded-full">
              Login
            </NavLink>
          )
        )}
      </div>

      {/* Mobile Icons */}
      <div className="flex sm:hidden items-center gap-4">
        {!showSearch && (
          <button onClick={() => setShowSearch(true)}>
            <img src={assets.search_icon} alt="search" className="h-6 w-6" />
          </button>
        )}
        <div
          className="relative cursor-pointer"
          onClick={() => navigate("/cart")}
        >
          <img src={assets.nav_cart_icon} alt="cart" className="h-6 w-6" />
          <span className="absolute -top-2 -right-3 text-xs text-white bg-red-500 w-[18px] h-[18px] rounded-full flex items-center justify-center">
            {getCartItemsCount() || 0}
          </span>
        </div>
        <button onClick={() => setMenuOpen(!menuOpen)}>
          <img src={assets.menu_icon} alt="menu" className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile Search */}
      {showSearch && (
        <div
          ref={searchRef}
          className="absolute top-[70px] left-0 w-full px-4 sm:hidden z-40"
        >
          <div className="flex items-center border border-gray-300 px-3 rounded-full bg-white shadow">
            <input
              autoFocus
              onChange={(e) => setSearchQuary(e.target.value)}
              className="py-2 px-3 w-full outline-none bg-transparent placeholder-gray-500 text-sm"
              type="text"
              placeholder="Search products..."
            />
            <img
              src={assets.search_icon}
              alt="search_icon"
              className="h-4 w-4"
            />
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-[70px] left-0 w-full bg-white shadow-md py-5 px-4 flex flex-col gap-3 text-sm sm:hidden z-30">
          <NavLink to="/" onClick={() => setMenuOpen(false)}>
            Home
          </NavLink>
          <NavLink to="/products" onClick={() => setMenuOpen(false)}>
            All Products
          </NavLink>
          <NavLink to="/" onClick={() => setMenuOpen(false)}>
            Contact
          </NavLink>
          
          {/* Mobile clerk dashboard link */}
          {isSignedIn && user && (user.role === 'clerk' || user.role === 'admin') && (
            <NavLink to="/clerk-dashboard" onClick={() => setMenuOpen(false)} className="text-green-600 font-medium">
              Clerk Dashboard
            </NavLink>
          )}

          {isLoaded && !isSignedIn ? (
            <NavLink 
              to="/sign-in"
              onClick={() => setMenuOpen(false)}
              className="px-6 py-2 mt-2 bg-primary hover:bg-primary-dull text-white rounded-full text-sm"
            >
              Login
            </NavLink>
          ) : (
            <div className="mt-2">
              <Link to="/order-history" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <Package size={16} />
                Order History
              </Link>
              <UserButtonComponent />
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
