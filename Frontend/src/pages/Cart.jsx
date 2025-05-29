import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';
import { Trash2, ShoppingBag, AlertCircle, Archive, ChevronRight, Truck, ArrowLeft, Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@clerk/clerk-react';
import LoadingSpinner from '../components/LoadingSpinner';
import QuantitySelector from '../components/QuantitySelector';

const Cart = () => {
  const { cartItems, products, updateCartItem, removeFromCart, getCartItemsCount, getCartAmmount } = useAppContext();
  const loading = false;
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  const [error, setError] = useState(null);
  
  // Get cart items from AppContext
  const cartItemsArray = Object.entries(cartItems).map(([productId, quantity]) => {
    const product = products.find(p => p._id === productId);
    return { productId: product, quantity, _id: productId };
  }).filter(item => item.productId && item.quantity > 0);
  
  const activeItems = cartItemsArray;
  const savedItems = [];
  
  // Handle coupon application
  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }
    
    try {
      setCouponLoading(true);
      // Coupon functionality not implemented in AppContext
      toast.error('Coupon functionality not available');
    } catch (error) {
      console.error('Error applying coupon:', error);
      toast.error('Could not apply coupon. Please try again.');
    } finally {
      setCouponLoading(false);
    }
  };
  
  // Handle quantity change
  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
    } else {
      updateCartItem(itemId, newQuantity);
    }
  };
  
  // Handle checkout button
  const handleCheckout = () => {
    const total = getCartAmmount();
    if (total < 50) {
      toast.error('Minimum order value is ₹50');
      return;
    }
    
    navigate('/checkout');
  };
  
  // Handle Saved for Later operations
  const moveToCart = (itemId) => {
    // Save for later not implemented in AppContext
    toast.error('Save for later not available');
  };
  
  if (loading) {
    return <LoadingSpinner message="Loading your cart..." />;
  }
  
  if (error) {
    return (
      <div className="py-10 px-4 max-w-7xl mx-auto text-center">
        <div className="mb-6 text-red-500">
          <AlertCircle size={48} className="mx-auto" />
        </div>
        <h2 className="text-2xl font-semibold mb-3">Error Loading Cart</h2>
        <p className="text-text-light mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
        >
          Try Again
        </button>
      </div>
    );
  }
  
  if (!isSignedIn) {
    return (
      <div className="py-12 px-4 max-w-7xl mx-auto text-center">
        <div className="mb-6">
          <ShoppingBag size={64} className="mx-auto text-gray-300" />
        </div>
        <h1 className="text-2xl font-semibold mb-3">Your cart is waiting</h1>
        <p className="text-text-light mb-6">Please sign in to view your cart and complete your purchase</p>
        <Link to="/sign-in" className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark inline-block">
          Sign In
        </Link>
      </div>
    );
  }
  
  if (getCartItemsCount() === 0) {
    return (
      <div className="py-12 px-4 max-w-7xl mx-auto text-center">
        <div className="mb-6">
          <ShoppingBag size={64} className="mx-auto text-gray-300" />
        </div>
        <h1 className="text-2xl font-semibold mb-3">Your cart is empty</h1>
        <p className="text-text-light mb-6">Looks like you haven't added any products to your cart yet</p>
        <Link to="/products" className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark inline-block">
          Browse Products
        </Link>
      </div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="py-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-text-dark">Your Cart</h1>
          <Link to="/products" className="text-primary flex items-center">
            <ArrowLeft size={16} className="mr-1" />
            Continue Shopping
          </Link>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {activeItems.length > 0 ? (
              <div className="bg-white rounded-lg shadow-card overflow-hidden mb-6">
                <div className="p-4 border-b">
                  <h2 className="font-semibold flex items-center">
                    <ShoppingBag size={18} className="mr-2" />
                    Cart Items ({activeItems.length})
                  </h2>
                </div>
                
                <div className="divide-y">
                  {activeItems.map((item) => (
                    <motion.div
                      key={item._id}
                      className="flex items-center gap-4 p-4 border-b border-gray-100"
                    >
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={item.productId.imageUrls?.[0]}
                            alt={item.productId.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>

                      <div className="flex-1">
                        <h3 className="font-medium text-lg mb-1">
                          {item.productId.name}
                        </h3>
                        <p className="text-text-light text-sm mb-2">
                          {item.productId.description?.substring(0, 60)}...
                        </p>
                        
                        {item.variant && (
                          <div className="text-sm text-primary mb-2">
                            Size: {item.variant.size} | Weight: {item.variant.weight}
                          </div>
                        )}

                        <div className="flex items-center gap-4">
                          <div className="text-lg font-semibold text-green-600">
                            ₹{item.productId.offerPrice}
                          </div>
                          {item.productId.originalPrice > item.productId.offerPrice && (
                            <div className="text-sm text-text-light line-through">
                              ₹{item.productId.originalPrice}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-3">
                        <QuantitySelector 
                          quantity={item.quantity}
                          onIncrease={() => updateCartItem(item.productId._id, item.quantity + 1)}
                          onDecrease={() => updateCartItem(item.productId._id, item.quantity - 1)}
                          onRemove={() => removeFromCart(item.productId._id)}
                        />
                        
                        <div className="text-right">
                          <div className="text-lg font-semibold">
                            ₹{(item.productId.offerPrice * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-card p-6 text-center mb-6">
                <div className="mb-4">
                  <ShoppingBag size={40} className="mx-auto text-gray-300" />
                </div>
                <h3 className="font-medium mb-2">Your cart is empty</h3>
                <p className="text-text-light text-sm mb-4">Add items to your cart to continue shopping</p>
                <Link to="/products" className="text-primary hover:underline">
                  Browse Products
                </Link>
              </div>
            )}
            
            {/* Saved for Later Items */}
            {savedItems.length > 0 && (
              <div className="bg-white rounded-lg shadow-card overflow-hidden">
                <div className="p-4 border-b">
                  <h2 className="font-semibold flex items-center">
                    <Archive size={18} className="mr-2" />
                    Saved for Later ({savedItems.length})
                  </h2>
                </div>
                
                <ul className="divide-y">
                  {savedItems.map((item) => (
                    <li key={item._id} className="p-4 hover:bg-gray-50">
                      <div className="flex items-center">
                        <div className="w-16 h-16 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
                          <img
                            src={item.productId.imageUrls?.[0]}
                            alt={item.productId.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        
                        <div className="ml-4 flex-1">
                          <Link 
                            to={`/products/${item.productId.category}/${item.productId._id}`}
                            className="font-medium text-text-dark hover:text-primary transition-colors"
                          >
                            {item.productId.name}
                          </Link>
                          
                          <div className="mt-1">
                            <span className="font-semibold">₹{item.productId.offerPrice}</span>
                          </div>
                          
                          <div className="mt-2 flex flex-wrap items-center gap-3">
                            <button
                              onClick={() => moveToCart(item._id)}
                              className="text-primary text-sm hover:underline flex items-center"
                            >
                              <ShoppingBag size={14} className="mr-1" />
                              Move to cart
                            </button>
                            
                            <button
                              onClick={() => removeFromCart(item._id)}
                              className="text-error text-sm hover:underline flex items-center"
                            >
                              <Trash2 size={14} className="mr-1" />
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-card overflow-hidden sticky top-24">
              <div className="p-4 border-b">
                <h2 className="font-semibold">Order Summary</h2>
              </div>
              
              <div className="p-4">
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-text-light">Subtotal ({getCartItemsCount()} items)</span>
                    <span>₹{getCartAmmount()}</span>
                  </div>
                  
                  <div className="border-t pt-3 flex justify-between font-semibold">
                    <span>Total</span>
                    <span>₹{getCartAmmount()}</span>
                  </div>
                </div>
                
                {getCartAmmount() >= 50 ? (
                  <div className="text-success text-sm flex items-center mb-4">
                    <Truck size={16} className="mr-2" />
                    Eligible for Cash on Delivery
                  </div>
                ) : (
                  <div className="text-warning text-sm flex items-center mb-4">
                    <AlertCircle size={16} className="mr-2" />
                    Add ₹{(50 - getCartAmmount())} more to place an order
                  </div>
                )}
                
                {/* Coupon Code Form */}
                <form onSubmit={handleApplyCoupon} className="mb-4">
                  <div className="flex">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="Enter coupon code"
                      className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                    <button
                      type="submit"
                      disabled={couponLoading}
                      className="bg-primary text-white px-4 py-2 rounded-r-md hover:bg-primary-dark disabled:opacity-50"
                    >
                      {couponLoading ? 'Applying...' : 'Apply'}
                    </button>
                  </div>
                </form>
                
                <button
                  onClick={handleCheckout}
                  disabled={activeItems.length === 0 || getCartAmmount() < 50}
                  className={`w-full py-3 rounded-lg flex items-center justify-center ${
                    activeItems.length === 0 || getCartAmmount() < 50
                      ? 'bg-gray-300 cursor-not-allowed text-text-dark'
                      : 'bg-primary hover:bg-primary-dark text-white'
                  }`}
                >
                  Proceed to Checkout
                  <ChevronRight size={18} className="ml-1" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Cart;
