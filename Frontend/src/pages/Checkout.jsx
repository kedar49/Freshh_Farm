import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useAuth, useUser } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, CreditCard, Truck, Check, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/LoadingSpinner';

const Checkout = () => {
  const { cartItems, products, getCartItemsCount, getCartAmount } = useAppContext();
  const { isSignedIn } = useAuth();
  const { user: clerkUser } = useUser();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [addresses, setAddresses] = useState([]);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Get cart items from AppContext
  const cartItemsArray = Object.entries(cartItems).map(([productId, quantity]) => {
    const product = products.find(p => p._id === productId);
    return { productId: product, quantity, _id: productId };
  }).filter(item => item.productId && item.quantity > 0);

  useEffect(() => {
    if (!isSignedIn) {
      navigate('/sign-in');
      return;
    }

    if (getCartItemsCount() === 0) {
      navigate('/cart');
      return;
    }

    // Load user addresses (this would be from an API in a real app)
    setAddresses([
      {
        _id: '1',
        fullName: 'John Doe',
        street: '123 Main Street',
        city: 'Bangalore',
        state: 'Karnataka',
        postalCode: '560001',
        phoneNumber: '9876543210',
        isDefault: true
      }
    ]);
    setSelectedAddress('1');
  }, [isSignedIn, navigate, getCartItemsCount]);

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }

    try {
      setLoading(true);
      const token = await clerkUser?.getToken();
      
      const orderData = {
        items: cartItemsArray.map(item => ({
          productId: item.productId._id,
          quantity: item.quantity,
          price: item.productId.offerPrice
        })),
        totalAmount: getCartAmount(),
        addressId: selectedAddress,
        paymentMethod,
        status: 'Order Placed'
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error('Failed to place order');
      }

      const result = await response.json();
      setOrderPlaced(true);
      toast.success('Order placed successfully!');
      
      // Clear cart after successful order
      // This would be handled by the AppContext in a real implementation
      
      setTimeout(() => {
        navigate('/order-history');
      }, 3000);

    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (orderPlaced) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-screen flex items-center justify-center bg-gray-50"
      >
        <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check size={32} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">Order Placed Successfully!</h2>
          <p className="text-gray-600 mb-4">
            Thank you for your order. You will receive a confirmation email shortly.
          </p>
          <p className="text-sm text-gray-500">
            Redirecting to order history...
          </p>
        </div>
      </motion.div>
    );
  }

  const deliveryFee = getCartAmount() >= 500 ? 0 : 40;
  const total = getCartAmount() + deliveryFee;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="py-8 max-w-7xl mx-auto"
    >
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/cart')}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-semibold">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Address */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <MapPin size={20} className="mr-2" />
              Delivery Address
            </h2>
            
            {addresses.map((address) => (
              <div
                key={address._id}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedAddress === address._id
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedAddress(address._id)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium">{address.fullName}</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {address.street}, {address.city}, {address.state} - {address.postalCode}
                    </p>
                    <p className="text-gray-600 text-sm">Phone: {address.phoneNumber}</p>
                    {address.isDefault && (
                      <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded mt-2">
                        Default
                      </span>
                    )}
                  </div>
                  <input
                    type="radio"
                    checked={selectedAddress === address._id}
                    onChange={() => setSelectedAddress(address._id)}
                    className="mt-1"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Payment Method */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <CreditCard size={20} className="mr-2" />
              Payment Method
            </h2>
            
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="COD"
                  checked={paymentMethod === 'COD'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="mr-3"
                />
                <span>Cash on Delivery</span>
              </label>
              
              <label className="flex items-center text-gray-400">
                <input
                  type="radio"
                  value="ONLINE"
                  disabled
                  className="mr-3"
                />
                <span>Online Payment (Coming Soon)</span>
              </label>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold mb-4">Order Items</h2>
            
            <div className="space-y-4">
              {cartItemsArray.map((item) => (
                <div key={item._id} className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden">
                    <img
                      src={item.productId.imageUrls?.[0]}
                      alt={item.productId.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.productId.name}</h3>
                    <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">₹{item.productId.offerPrice * item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border p-6 sticky top-8">
            <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span>Subtotal ({getCartItemsCount()} items)</span>
                <span>₹{getCartAmount()}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
              </div>
              
              {getCartAmount() < 500 && (
                <div className="text-sm text-gray-600 bg-yellow-50 p-2 rounded">
                  <AlertCircle size={16} className="inline mr-1" />
                  Add ₹{500 - getCartAmount()} more for free delivery
                </div>
              )}
              
              <div className="border-t pt-3">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>
            </div>

            <div className="mb-4 p-3 bg-gray-50 rounded flex items-center text-sm">
              <Truck size={16} className="mr-2 text-green-600" />
              <span>Expected delivery in 2-3 days</span>
            </div>
            
            <button
              onClick={handlePlaceOrder}
              disabled={loading || !selectedAddress}
              className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span className="ml-2">Placing Order...</span>
                </>
              ) : (
                `Place Order - ₹${total}`
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Checkout; 