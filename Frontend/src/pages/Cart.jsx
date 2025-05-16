import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { motion } from 'framer-motion';
import { Trash2, ShoppingBag, AlertCircle, Archive, ChevronRight, Truck, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@clerk/clerk-react';

const Cart = () => {
  const { cartItems, products, updateCartItem, removeFromCart, getCartItemsCount, getCartAmmount } = useAppContext();
  const loading = false;
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  
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
    
    setCouponLoading(true);
    // Coupon functionality not implemented in AppContext
    toast.error('Coupon functionality not available');
    setCouponLoading(false);
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
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
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
                
                <ul className="divide-y">
                  {activeItems.map((item) => (
                    <li key={item._id} className="p-4 hover:bg-gray-50">
                      <div className="flex items-center">
                        <div className="w-20 h-20 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
                          <img
                            src={item.productId.image?.[0]}
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
                          
                          {item.variant && (
                            <p className="text-sm text-text-light">
                              {item.variant.size ? 
                                `Size: ${item.variant.size}` : 
                                `Weight: ${item.variant.weight} ${item.productId.unit}`
                              }
                            </p>
                          )}
                          
                          <div className="mt-1 flex items-baseline">
                            <span className="font-semibold">₹{item.productId.offerPrice}</span>
                            {item.productId.price > item.productId.offerPrice && (
                              <span className="ml-2 text-sm text-text-light line-through">
                                ₹{item.productId.price}
                              </span>
                            )}
                          </div>
                          
                          <div className="mt-2 flex flex-wrap items-center gap-3">
                            <div className="flex items-center border border-gray-300 rounded-md">
                              <button
                                onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                                className="px-2 py-1 text-text-dark hover:bg-gray-100"
                              >
                                -
                              </button>
                              <span className="px-2 py-1 min-w-[36px] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                                className="px-2 py-1 text-text-dark hover:bg-gray-100"
                              >
                                +
                              </button>
                            </div>
                            
                            <button
                              onClick={() => saveForLater(item._id, true)}
                              className="text-primary text-sm hover:underline flex items-center"
                            >
                              <Archive size={14} className="mr-1" />
                              Save for later
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
                        
                        <div className="ml-4 text-right">
                          <span className="font-semibold text-text-dark">
                            ₹{(item.productId.offerPrice * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
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
                            src={item.productId.image?.[0]}
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
