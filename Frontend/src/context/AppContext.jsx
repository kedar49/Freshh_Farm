import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";
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
  const [searchQuery, setSearchQuery] = useState(""); // Fixed typo
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products`);
      const data = await response.json();
      if (data.success) {
        setProducts(data.products);
      } else {
        throw new Error(data.message || 'Failed to fetch products');
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      setError(error.message);
      toast.error('Failed to load products');
      // Fallback to empty array if API fails
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (itemId) => {
    if (!isSignedIn) {
      toast.error("Please sign in to add items to cart");
      navigate("/sign-in");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cart/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await clerkUser?.getToken()}`
        },
        body: JSON.stringify({
          productId: itemId,
          quantity: 1
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to add item to cart');
      }

      // Update local cart state from API response
      const cartItemsMap = {};
      data.items?.forEach(item => {
        cartItemsMap[item.productId] = item.quantity;
      });
      setCartItems(cartItemsMap);
      toast.success("Item added to cart");
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error(error.message || 'Failed to add item to cart');
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    if (!isSignedIn) {
      toast.error("Please sign in to update cart");
      return;
    }

    try {
      setLoading(true);
      // Find the cart item by productId
      const cartItem = Object.keys(cartItems).find(id => id === itemId);
      if (!cartItem) {
        throw new Error('Item not found in cart');
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cart/items/${cartItem}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await clerkUser?.getToken()}`
        },
        body: JSON.stringify({ quantity })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update cart item');
      }

      // Update local cart state
      const cartItemsMap = {};
      data.items?.forEach(item => {
        cartItemsMap[item.productId] = item.quantity;
      });
      setCartItems(cartItemsMap);
      toast.success("Cart updated");
    } catch (error) {
      console.error('Failed to update cart:', error);
      toast.error(error.message || 'Failed to update cart');
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    if (!isSignedIn) {
      toast.error("Please sign in to remove items");
      return;
    }

    try {
      setLoading(true);
      const cartItem = Object.keys(cartItems).find(id => id === itemId);
      if (!cartItem) {
        throw new Error('Item not found in cart');
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cart/items/${cartItem}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${await clerkUser?.getToken()}`
        }
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to remove item from cart');
      }

      // Update local cart state
      const cartItemsMap = {};
      data.items?.forEach(item => {
        cartItemsMap[item.productId] = item.quantity;
      });
      setCartItems(cartItemsMap);
      toast.success("Item removed from cart");
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      toast.error(error.message || 'Failed to remove item');
    } finally {
      setLoading(false);
    }
  };

  const loadUserCart = async () => {
    if (!isSignedIn || !clerkUser) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cart`, {
        headers: {
          'Authorization': `Bearer ${await clerkUser.getToken()}`
        }
      });

      const data = await response.json();
      if (response.ok && data.items) {
        const cartItemsMap = {};
        data.items.forEach(item => {
          cartItemsMap[item.productId] = item.quantity;
        });
        setCartItems(cartItemsMap);
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
    }
  };

  const getCartItemsCount = () => {
    let totalCount = 0;
    for (const item in cartItems) {
      totalCount += cartItems[item];
    }
    return totalCount;
  };
  
  const getCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      let itemInfo = products.find((product) => product._id === itemId);
      if (itemInfo && cartItems[itemId] > 0) {
        totalAmount += itemInfo.offerPrice * cartItems[itemId];
      }
    }
    return Math.floor(totalAmount * 100) / 100;
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Load user cart when authenticated
  useEffect(() => {
    if (isLoaded && isSignedIn && clerkUser) {
      loadUserCart();
    }
  }, [isLoaded, isSignedIn, clerkUser]);

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
      setCartItems({}); // Clear cart when user signs out
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
    loading,
    error,
    addToCart,
    updateCartItem,
    removeFromCart,
    cartItems,
    searchQuery,
    setSearchQuery,
    getCartItemsCount,
    getCartAmount,
    fetchProducts
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
