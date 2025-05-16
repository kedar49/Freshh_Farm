import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
import { useAuth, useUser } from "@clerk/clerk-react";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const { isLoaded, isSignedIn } = useAuth();
  const { user: clerkUser } = useUser();
  const [user, setUser] = useState(null);
  const [isSeller, setisSeller] = useState(null);
  const [showUserLogin, setShowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [searchQuary, setSearchQuary] = useState(""); // ✅ correct type (string)

  const featchProducts = async () => {
    setProducts(dummyProducts);
  };

  const addToCart = async (itemId) => {
    let cartData = { ...cartItems }; 
    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }
    setCartItems(cartData);
    toast.success("Item added to cart");
  };
  const updateCartItem = async (itemId, quantity) => {
    let cartData = structuredClone(cartItems);
    cartData[itemId] = quantity;
    setCartItems(cartData);
    toast.success("Item updated in cart");
  };

  const removeFromCart = async (itemId) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] -= 1;
      if (cartData[itemId] === 0) {
        delete cartData[itemId];
      }
    }
    setCartItems(cartData);
    toast.success("Item removed from cart");
  };

  const getCartItemsCount = () => {
    let totalCount = 0;
    for (const item in cartItems) {
      totalCount += cartItems[item];
    }
    return totalCount;
  };
  

  const getCartAmmount = () => {
    let totalAmmount = 0;
    for (const itemId in cartItems) {
      let itemInfo = products.find((product) => product._id === itemId);
      if (itemInfo && cartItems[itemId] > 0) {
        totalAmmount += itemInfo.offerPrice * cartItems[itemId];
      }
    }
    return Math.floor(totalAmmount * 100) / 100;
  };

  useEffect(() => {
    featchProducts();
  }, []);

  // Update user state when Clerk authentication changes
  useEffect(() => {
    if (isLoaded && isSignedIn && clerkUser) {
      setUser({
        name: clerkUser.firstName + ' ' + (clerkUser.lastName || ''),
        email: clerkUser.primaryEmailAddress?.emailAddress,
        id: clerkUser.id,
        imageUrl: clerkUser.imageUrl
      });
    } else if (isLoaded && !isSignedIn) {
      setUser(null);
    }
  }, [isLoaded, isSignedIn, clerkUser]);

  const value = {
    navigate,
    user,
    setUser,
    isSeller,
    setisSeller,
    showUserLogin,
    setShowUserLogin,
    products,
    addToCart,
    updateCartItem,
    removeFromCart,
    cartItems,
    searchQuary,
    setSearchQuary,
    getCartItemsCount,
    getCartAmmount
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
