import React, { useState, useEffect } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { PlusCircle, Edit, Trash2, ChevronLeft, ChevronRight, Loader2, LayoutDashboard, Package, ShoppingBag, Users, Tag, Settings, ChevronDown, Menu, X, LogOut, BarChart2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppContext';
import { Routes, Route, Link } from 'react-router-dom';

const ClerkDashboard = () => {
  const { user: clerkUser } = useUser();
  const { isSignedIn, isLoaded, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAppContext();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const itemsPerPage = 10;
  
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate('/sign-in');
      return;
    }

    if (user && user.role !== 'clerk' && user.role !== 'admin') {
      toast.error('Unauthorized: Clerk access required');
      navigate('/');
      return;
    }
    
    // Fetch products
    fetchProducts();
  }, [isLoaded, isSignedIn, navigate, user]);
  
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = await clerkUser?.getToken();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setProducts(data.products);
      } else {
        throw new Error(data.message || 'Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };
  
  const deleteProduct = async (id) => {
    try {
      const token = await clerkUser?.getToken();
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete product');
      }
      
      setProducts(products.filter(product => product._id !== id));
      toast.success('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    }
  };
  
  // Pagination logic
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);
  
  // Navigation items
  const navItems = [
    {
      label: 'Dashboard',
      icon: <LayoutDashboard size={20} />,
      path: '/clerk-dashboard',
      exact: true
    },
    {
      label: 'Products',
      icon: <Package size={20} />,
      path: '/clerk-dashboard/products',
      subItems: [
        { label: 'All Products', path: '/clerk-dashboard/products' },
        { label: 'Add New', path: '/clerk-dashboard/products/new' },
        { label: 'Categories', path: '/clerk-dashboard/products/categories' }
      ]
    },
    {
      label: 'Orders',
      icon: <ShoppingBag size={20} />,
      path: '/clerk-dashboard/orders'
    },
    {
      label: 'Customers',
      icon: <Users size={20} />,
      path: '/clerk-dashboard/customers'
    },
    {
      label: 'Coupons',
      icon: <Tag size={20} />,
      path: '/clerk-dashboard/coupons'
    },
    {
      label: 'Analytics',
      icon: <BarChart2 size={20} />,
      path: '/clerk-dashboard/analytics'
    },
    {
      label: 'Settings',
      icon: <Settings size={20} />,
      path: '/clerk-dashboard/settings'
    }
  ];
  
  // Check if a path is active
  const isActive = (path) => {
    if (path === '/clerk-dashboard' && location.pathname === '/clerk-dashboard') {
      return true;
    }
    return location.pathname.startsWith(path) && path !== '/clerk-dashboard';
  };
  
  // Handle logout
  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };
  
  // Toggle sidebar on mobile
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-40">
        <button
          onClick={toggleMobileMenu}
          className="p-2 rounded-md text-gray-600 hover:bg-gray-200 focus:outline-none"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      
      {/* Sidebar for mobile */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-30 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={toggleMobileMenu}></div>
          <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
            <div className="h-full flex flex-col">
              <div className="flex items-center justify-between h-16 px-4 border-b">
                <Link to="/" className="flex items-center">
                  <span className="text-xl font-semibold text-primary">Freshh Farm</span>
                </Link>
                <button
                  onClick={toggleMobileMenu}
                  className="p-2 rounded-md text-gray-600 hover:bg-gray-200 focus:outline-none"
                >
                  <X size={20} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                <nav className="px-2 py-4 space-y-1">
                  {navItems.map((item) => (
                    <div key={item.label}>
                      <Link
                        to={item.path}
                        className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg ${isActive(item.path) ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                      >
                        {item.icon}
                        <span className="ml-3">{item.label}</span>
                      </Link>
                      
                      {item.subItems && (
                        <div className="ml-6 mt-1 space-y-1">
                          {item.subItems.map((subItem) => (
                            <Link
                              key={subItem.label}
                              to={subItem.path}
                              onClick={toggleMobileMenu}
                              className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                                location.pathname === subItem.path
                                  ? 'bg-gray-100 text-primary'
                                  : 'text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              <ChevronRight size={14} className="mr-2" />
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </nav>
              </div>

              <div className="p-4 border-t">
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100"
                >
                  <LogOut size={20} />
                  <span className="ml-3">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <div className="flex flex-col flex-grow bg-white pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <Link to="/" className="text-xl font-semibold text-primary">Freshh Farm</Link>
            </div>
            <nav className="mt-5 flex-1 px-2 space-y-1">
              {navItems.map((item) => (
                <div key={item.label}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                      isActive(item.path)
                        ? 'bg-primary text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {item.icon}
                    <span className="ml-3">{item.label}</span>
                    {item.subItems && <ChevronDown size={16} className="ml-auto" />}
                  </Link>
                  
                  {item.subItems && (
                    <div className="ml-6 mt-1 space-y-1">
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.label}
                          to={subItem.path}
                          className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                            location.pathname === subItem.path
                              ? 'bg-gray-100 text-primary'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <ChevronRight size={14} className="mr-2" />
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <LogOut size={20} />
              <span className="ml-3">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<DashboardOverview />} />
              <Route path="/products" element={<ProductManagement />} />
              <Route path="/products/new" element={<div>Add New Product</div>} />
              <Route path="/products/edit/:id" element={<div>Edit Product</div>} />
              <Route path="/products/categories" element={<div>Product Categories</div>} />
              <Route path="/orders" element={<div>Orders Management</div>} />
              <Route path="/customers" element={<div>Customer Management</div>} />
              <Route path="/coupons" element={<div>Coupon Management</div>} />
              <Route path="/analytics" element={<div>Analytics Dashboard</div>} />
              <Route path="/settings" element={<div>Settings</div>} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

// Dashboard Overview Component
const DashboardOverview = () => {
  // Sample data for dashboard
  const stats = [
    { label: 'Total Sales', value: '₹24,500', icon: <ShoppingBag size={24} className="text-blue-500" /> },
    { label: 'Products', value: '124', icon: <Package size={24} className="text-green-500" /> },
    { label: 'Customers', value: '45', icon: <Users size={24} className="text-purple-500" /> },
    { label: 'Orders', value: '18', icon: <ShoppingBag size={24} className="text-orange-500" /> }
  ];
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-card p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-gray-50">{stat.icon}</div>
              <div className="ml-4">
                <p className="text-sm font-medium text-text-light">{stat.label}</p>
                <p className="text-2xl font-semibold">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-card p-6">
          <h2 className="text-lg font-medium mb-4">Recent Orders</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left text-sm font-medium text-text-light">Order ID</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-text-light">Customer</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-text-light">Status</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-text-light">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">#ORD-001</td>
                  <td className="px-4 py-3 text-sm">John Doe</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Delivered</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right">₹1,200</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">#ORD-002</td>
                  <td className="px-4 py-3 text-sm">Jane Smith</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Processing</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right">₹850</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm">#ORD-003</td>
                  <td className="px-4 py-3 text-sm">Robert Johnson</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Shipped</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-right">₹2,400</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-card p-6">
          <h2 className="text-lg font-medium mb-4">Popular Products</h2>
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden">
                <img src="/placeholder-image.jpg" alt="Apple" className="w-full h-full object-cover" />
              </div>
              <div className="ml-4 flex-1">
                <h3 className="font-medium">Organic Apples</h3>
                <p className="text-sm text-text-light">₹120 per kg</p>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium">324 sold</span>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden">
                <img src="/placeholder-image.jpg" alt="Tomatoes" className="w-full h-full object-cover" />
              </div>
              <div className="ml-4 flex-1">
                <h3 className="font-medium">Fresh Tomatoes</h3>
                <p className="text-sm text-text-light">₹80 per kg</p>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium">245 sold</span>
              </div>
            </div>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden">
                <img src="/placeholder-image.jpg" alt="Carrots" className="w-full h-full object-cover" />
              </div>
              <div className="ml-4 flex-1">
                <h3 className="font-medium">Organic Carrots</h3>
                <p className="text-sm text-text-light">₹60 per kg</p>
              </div>
              <div className="text-right">
                <span className="text-sm font-medium">198 sold</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ClerkDashboard;