import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '@clerk/clerk-react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { isSignedIn, getToken } = useAuth();
  const [cart, setCart] = useState({ items: [], couponCode: null });
  const [loading, setLoading] = useState(false);
  const [coupon, setCoupon] = useState(null);
  
  // Fetch cart on login
  useEffect(() => {
    if (isSignedIn) {
      fetchCart();
    } else {
      // Reset cart when logged out
      setCart({ items: [], couponCode: null });
      setCoupon(null);
    }
  }, [isSignedIn]);
  
  // Calculate cart totals
  const cartTotals = React.useMemo(() => {
    const subtotal = cart.items.reduce((sum, item) => {
      if (!item.savedForLater && item.productId) {
        return sum + (item.productId.offerPrice * item.quantity);
      }
      return sum;
    }, 0);
    
    // Calculate discount
    let discount = 0;
    if (coupon) {
      if (coupon.discountType === 'percentage') {
        discount = subtotal * (coupon.discountValue / 100);
      } else {
        discount = coupon.discountValue;
      }
    }
    
    const total = Math.max(subtotal - discount, 0);
    const itemCount = cart.items.filter(item => !item.savedForLater).reduce((sum, item) => sum + item.quantity, 0);
    
    return {
      subtotal,
      discount,
      total,
      itemCount,
      meetsMinimumOrder: total >= 50
    };
  }, [cart, coupon]);
  
  // Fetch cart from API
  const fetchCart = async () => {
    if (!isSignedIn) return;
    
    try {
      setLoading(true);
      const token = await getToken();
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cart`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Check for non-JSON responses (like HTML error pages)
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error(`Server returned non-JSON response: ${contentType}`);
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch cart');
      }
      
      const data = await response.json();
      setCart(data);
      
      // If there's a coupon code, fetch the coupon details
      if (data.couponCode) {
        fetchCouponDetails(data.couponCode);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast.error(`Could not load your cart: ${error.message}`);
      // Initialize empty cart on error to prevent UI issues
      setCart({ items: [], couponCode: null });
    } finally {
      setLoading(false);
    }
  };
  
  // Add item to cart
  const addToCart = async (productId, quantity = 1, variant = null) => {
    if (!isSignedIn) {
      toast.error('Please sign in to add items to your cart');
      return;
    }
    
    try {
      setLoading(true);
      const token = await getToken();
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cart/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ productId, quantity, variant })
      });
      
      if (!response.ok) throw new Error('Failed to add item to cart');
      
      const data = await response.json();
      setCart(data);
      toast.success('Added to cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Could not add item to cart');
    } finally {
      setLoading(false);
    }
  };
  
  // Update cart item
  const updateCartItem = async (itemId, updates) => {
    if (!isSignedIn) return;
    
    try {
      setLoading(true);
      const token = await getToken();
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cart/items/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });
      
      if (!response.ok) throw new Error('Failed to update cart');
      
      const data = await response.json();
      setCart(data);
      toast.success('Cart updated');
    } catch (error) {
      console.error('Error updating cart:', error);
      toast.error('Could not update cart');
    } finally {
      setLoading(false);
    }
  };
  
  // Remove item from cart
  const removeFromCart = async (itemId) => {
    if (!isSignedIn) return;
    
    try {
      setLoading(true);
      const token = await getToken();
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cart/items/${itemId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to remove item');
      
      const data = await response.json();
      setCart(data);
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Could not remove item');
    } finally {
      setLoading(false);
    }
  };
  
  // Save item for later
  const saveForLater = async (itemId, savedForLater = true) => {
    return updateCartItem(itemId, { savedForLater });
  };
  
  // Apply coupon
  const applyCoupon = async (code) => {
    if (!isSignedIn) return;
    
    try {
      setLoading(true);
      const token = await getToken();
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cart/apply-coupon`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ code })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to apply coupon');
      }
      
      const data = await response.json();
      setCart(data.cart);
      setCoupon(data.coupon);
      toast.success('Coupon applied');
    } catch (error) {
      console.error('Error applying coupon:', error);
      toast.error(error.message || 'Could not apply coupon');
    } finally {
      setLoading(false);
    }
  };
  
  // Remove coupon
  const removeCoupon = async () => {
    if (!isSignedIn) return;
    
    try {
      setLoading(true);
      const token = await getToken();
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/cart/remove-coupon`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to remove coupon');
      
      const data = await response.json();
      setCart(data);
      setCoupon(null);
      toast.success('Coupon removed');
    } catch (error) {
      console.error('Error removing coupon:', error);
      toast.error('Could not remove coupon');
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch coupon details
  const fetchCouponDetails = async (code) => {
    if (!isSignedIn) return;
    
    try {
      const token = await getToken();
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/coupons/${code}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        setCoupon(null);
        return;
      }
      
      const data = await response.json();
      setCoupon(data);
    } catch (error) {
      console.error('Error fetching coupon details:', error);
      setCoupon(null);
    }
  };
  
  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        coupon,
        cartTotals,
        addToCart,
        updateCartItem,
        removeFromCart,
        saveForLater,
        applyCoupon,
        removeCoupon,
        fetchCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;