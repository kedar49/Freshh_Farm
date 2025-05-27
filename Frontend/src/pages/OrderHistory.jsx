import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Filter, Search, Package, Calendar, Clock, CreditCard, ChevronDown, ChevronUp } from 'lucide-react';

const OrderHistory = () => {
  const { getToken, isSignedIn } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // Fetch orders when component mounts
  useEffect(() => {
    if (isSignedIn) {
      fetchOrders();
    }
  }, [isSignedIn]);

  // Fetch orders from API
  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = await getToken();
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/my-orders`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError(error.message);
      toast.error(`Error loading orders: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Get filtered orders based on search, filter, sort
  const getFilteredOrders = () => {
    return orders
      .filter(order => {
        // Filter by status
        if (filterStatus !== 'all' && order.status !== filterStatus) {
          return false;
        }
        
        // Filter by search query (order ID or product name)
        if (searchQuery) {
          const orderIdMatch = order._id.toLowerCase().includes(searchQuery.toLowerCase());
          const productNameMatch = order.items.some(item => 
            item.productName && item.productName.toLowerCase().includes(searchQuery.toLowerCase())
          );
          
          if (!orderIdMatch && !productNameMatch) {
            return false;
          }
        }
        
        // Filter by date range
        if (dateRange.start && new Date(order.createdAt) < new Date(dateRange.start)) {
          return false;
        }
        
        if (dateRange.end && new Date(order.createdAt) > new Date(dateRange.end)) {
          return false;
        }
        
        return true;
      })
      .sort((a, b) => {
        // Sort by date
        if (sortOrder === 'newest') {
          return new Date(b.createdAt) - new Date(a.createdAt);
        } else {
          return new Date(a.createdAt) - new Date(b.createdAt);
        }
      });
  };

  // Toggle order details expanded view
  const toggleOrderDetails = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing':
        return 'bg-blue-100 text-blue-800';
      case 'Shipped':
        return 'bg-purple-100 text-purple-800';
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Reset all filters
  const resetFilters = () => {
    setFilterStatus('all');
    setSearchQuery('');
    setSortOrder('newest');
    setDateRange({ start: '', end: '' });
  };

  // Error state UI
  if (error) {
    return (
      <div className="py-10 px-4 max-w-7xl mx-auto text-center">
        <div className="mb-6 text-red-500">
          <AlertCircle size={48} className="mx-auto" />
        </div>
        <h2 className="text-2xl font-semibold mb-3">Error Loading Orders</h2>
        <p className="text-text-light mb-6">{error}</p>
        <button 
          onClick={fetchOrders}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
        >
          Try Again
        </button>
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
          <div className="flex items-center">
            <Link to="/" className="mr-4">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-2xl font-semibold text-text-dark">Order History</h1>
          </div>
        </div>
        
        {/* Search and filters */}
        <div className="bg-white rounded-lg shadow-card p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            
            {/* Status filter */}
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none"
              >
                <option value="all">All Statuses</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <Filter size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            
            {/* Date sorting */}
            <div className="relative">
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg appearance-none"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
              <Calendar size={18} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            
            {/* Reset filters */}
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-gray-100 text-text-dark rounded-lg hover:bg-gray-200"
            >
              Reset Filters
            </button>
          </div>
          
          {/* Date range filter */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-text-light mb-1">From</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm text-text-light mb-1">To</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>
        
        {/* Loading state */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-card p-8 flex flex-col items-center justify-center min-h-[300px]">
            <div className="w-16 h-16 border-4 border-gray-200 border-t-primary rounded-full animate-spin mb-4"></div>
            <p className="text-text-light">Loading your orders...</p>
          </div>
        ) : getFilteredOrders().length === 0 ? (
          <div className="bg-white rounded-lg shadow-card p-8 text-center min-h-[300px] flex flex-col items-center justify-center">
            <Package size={48} className="text-gray-300 mb-4" />
            <h2 className="text-xl font-semibold mb-2">No orders found</h2>
            <p className="text-text-light mb-6">
              {orders.length === 0 
                ? "You haven't placed any orders yet." 
                : "No orders match your search criteria."}
            </p>
            {orders.length === 0 && (
              <Link to="/products" className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">
                Browse Products
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {getFilteredOrders().map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow-card overflow-hidden">
                {/* Order header */}
                <div 
                  className="p-4 border-b flex flex-col md:flex-row md:items-center justify-between cursor-pointer"
                  onClick={() => toggleOrderDetails(order._id)}
                >
                  <div className="flex items-center mb-3 md:mb-0">
                    <div className="mr-4">
                      {expandedOrderId === order._id ? (
                        <ChevronUp size={20} className="text-gray-500" />
                      ) : (
                        <ChevronDown size={20} className="text-gray-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">Order #{order._id.slice(-8)}</p>
                      <div className="flex items-center text-sm text-text-light">
                        <Calendar size={14} className="mr-1" />
                        <span>{formatDate(order.createdAt)}</span>
                        <span className="mx-2">•</span>
                        <CreditCard size={14} className="mr-1" />
                        <span>{order.paymentMethod || 'Online Payment'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <span 
                      className={`${getStatusColor(order.status)} text-sm px-3 py-1 rounded-full mr-4`}
                    >
                      {order.status}
                    </span>
                    <span className="font-semibold">₹{order.totalAmount}</span>
                  </div>
                </div>
                
                {/* Order details (expanded) */}
                {expandedOrderId === order._id && (
                  <div className="p-4">
                    {/* Order Items */}
                    <div className="mb-6">
                      <h3 className="font-medium mb-3">Order Items</h3>
                      <div className="divide-y">
                        {order.items.map((item, index) => (
                          <div key={index} className="py-3 flex items-center">
                            <div className="w-12 h-12 bg-gray-100 rounded-md flex-shrink-0 overflow-hidden mr-3">
                              {item.productImage ? (
                                <img 
                                  src={item.productImage} 
                                  alt={item.productName} 
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                  <Package size={20} className="text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{item.productName}</p>
                              {item.variant && (
                                <p className="text-sm text-text-light">
                                  {item.variant.size ? 
                                    `Size: ${item.variant.size}` : 
                                    `Weight: ${item.variant.weight}`
                                  }
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <p className="font-medium">₹{item.price}</p>
                              <p className="text-sm text-text-light">Qty: {item.quantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Order tracking */}
                    <div className="mb-6">
                      <h3 className="font-medium mb-3">Order Tracking</h3>
                      <div className="relative pl-6 before:content-[''] before:absolute before:left-2 before:top-2 before:w-0.5 before:h-[calc(100%-16px)] before:bg-gray-200">
                        {[
                          { status: 'Ordered', date: order.createdAt, done: true },
                          { status: 'Processing', date: order.processingDate, done: ['Processing', 'Shipped', 'Delivered'].includes(order.status) },
                          { status: 'Shipped', date: order.shippedDate, done: ['Shipped', 'Delivered'].includes(order.status) },
                          { status: 'Delivered', date: order.deliveredDate, done: order.status === 'Delivered' }
                        ].map((step, index) => (
                          <div key={index} className="mb-4 last:mb-0">
                            <div className="flex items-center">
                              <div className={`w-4 h-4 rounded-full absolute left-0 ${
                                step.done ? 'bg-primary' : 'bg-gray-200'
                              }`}></div>
                              <div className="flex items-center">
                                <span className="font-medium">{step.status}</span>
                                {step.date && (
                                  <span className="ml-3 text-sm text-text-light">
                                    {formatDate(step.date)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Shipping & Payment */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Shipping Address */}
                      <div>
                        <h3 className="font-medium mb-3">Shipping Address</h3>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="font-medium">{order.shippingAddress?.name || 'Customer Name'}</p>
                          <p className="text-text-light">
                            {order.shippingAddress?.address || 'Shipping Address'}, 
                            {order.shippingAddress?.city || 'City'}, 
                            {order.shippingAddress?.state || 'State'} - 
                            {order.shippingAddress?.pincode || 'Pincode'}
                          </p>
                          <p className="text-text-light">Phone: {order.shippingAddress?.phone || 'Phone Number'}</p>
                        </div>
                      </div>
                      
                      {/* Payment Details */}
                      <div>
                        <h3 className="font-medium mb-3">Payment Details</h3>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <div className="flex justify-between mb-2">
                            <span className="text-text-light">Subtotal</span>
                            <span>₹{order.subtotal || order.totalAmount}</span>
                          </div>
                          {order.discount > 0 && (
                            <div className="flex justify-between mb-2">
                              <span className="text-text-light">Discount</span>
                              <span className="text-green-600">-₹{order.discount}</span>
                            </div>
                          )}
                          <div className="flex justify-between mb-2">
                            <span className="text-text-light">Shipping</span>
                            <span>{order.shippingFee ? `₹${order.shippingFee}` : 'Free'}</span>
                          </div>
                          <div className="flex justify-between font-semibold pt-2 border-t">
                            <span>Total</span>
                            <span>₹{order.totalAmount}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="mt-6 flex flex-wrap gap-3">
                      {order.status !== 'Delivered' && order.status !== 'Cancelled' && (
                        <button 
                          className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50"
                          onClick={() => {
                            /* Cancel order functionality would go here */
                            toast.error('Cancel order functionality not implemented yet');
                          }}
                        >
                          Cancel Order
                        </button>
                      )}
                      <button 
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
                        onClick={() => {
                          /* Download invoice functionality would go here */
                          toast.error('Download invoice functionality not implemented yet');
                        }}
                      >
                        Download Invoice
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default OrderHistory; 