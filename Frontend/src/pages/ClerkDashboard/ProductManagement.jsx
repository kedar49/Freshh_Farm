import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '@clerk/clerk-react';
import { 
  Plus, Search, Filter, Edit, Trash2, Eye, Image, Package, Tag, Box
} from 'lucide-react';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const { getToken } = useAuth();
  const navigate = useNavigate();
  
  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, []);
  
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      const queryParams = new URLSearchParams();
      
      if (searchQuery) queryParams.append('search', searchQuery);
      if (filterCategory) queryParams.append('category', filterCategory);
      
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/products?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (!response.ok) throw new Error('Failed to fetch products');
      
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Could not load products');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };
  
  // Handle delete product
  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    
    try {
      const token = await getToken();
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/products/${productToDelete._id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      if (!response.ok) throw new Error('Failed to delete product');
      
      // Remove product from state
      setProducts(products.filter(product => product._id !== productToDelete._id));
      toast.success('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Could not delete product');
    } finally {
      setShowDeleteModal(false);
      setProductToDelete(null);
    }
  };
  
  // Get category icon
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Fruits':
        return <Box className="text-orange-500" />;
      case 'Vegetables':
        return <Package className="text-green-500" />;
      case 'Organic':
        return <Tag className="text-teal-500" />;
      case 'Seasonal Bundles':
        return <Box className="text-primary" />;
      default:
        return <Box className="text-gray-500" />;
    }
  };
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Product Management</h1>
        <button
          onClick={() => navigate('/clerk-dashboard/products/new')}
          className="px-4 py-2 bg-primary text-white rounded-lg flex items-center hover:bg-primary-dark"
        >
          <Plus size={18} className="mr-2" />
          Add Product
        </button>
      </div>
      
      {/* Search and Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <form onSubmit={handleSearch} className="flex-1 min-w-[280px]">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
            <button
              type="submit"
              className="absolute right-2 top-1.5 px-2 py-1 bg-primary text-white text-sm rounded"
            >
              Search
            </button>
          </div>
        </form>
        
        <div className="flex items-center">
          <Filter size={18} className="mr-2 text-gray-500" />
          <select
            value={filterCategory}
            onChange={(e) => {
              setFilterCategory(e.target.value);
              fetchProducts();
            }}
            className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">All Categories</option>
            <option value="Fruits">Fruits</option>
            <option value="Vegetables">Vegetables</option>
            <option value="Organic">Organic</option>
            <option value="Seasonal Bundles">Seasonal Bundles</option>
          </select>
        </div>
      </div>
      
      {/* Products Table */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Package size={48} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-medium mb-2">No products found</h2>
          <p className="text-text-light mb-6">
            {searchQuery || filterCategory ? 
              'Try adjusting your search or filters' : 
              'Add your first product to get started'}
          </p>
          <button
            onClick={() => navigate('/clerk-dashboard/products/new')}
            className="px-4 py-2 bg-primary text-white rounded-lg"
          >
            Add New Product
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white shadow-card rounded-lg overflow-hidden">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-text-dark">Product</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-text-dark">Category</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-text-dark">Price</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-text-dark">Stock</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-text-dark">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <div className="w-10 h-10 flex-shrink-0 bg-gray-100 rounded overflow-hidden mr-3">
                        <img
                          src={product.imageUrls[0]}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium text-text-dark">{product.name}</div>
                        <div className="text-xs text-text-light">ID: {product._id.substring(0, 8)}...</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      {getCategoryIcon(product.category)}
                      <span className="ml-2">{product.category}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="font-medium">₹{product.offerPrice}</div>
                    {product.originalPrice > product.offerPrice && (
                      <div className="text-xs text-text-light line-through">₹{product.originalPrice}</div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.inStock > 10 
                        ? 'bg-green-100 text-green-800' 
                        : product.inStock > 0 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-red-100 text-red-800'
                    }`}>
                      {product.inStock > 0 ? product.inStock : 'Out of stock'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => navigate(`/products/${product.category}/${product._id}`)}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                        title="View Product"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => navigate(`/clerk-dashboard/products/edit/${product._id}`)}
                        className="p-1 text-green-600 hover:bg-green-50 rounded"
                        title="Edit Product"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setProductToDelete(product);
                          setShowDeleteModal(true);
                        }}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        title="Delete Product"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-4">
              Are you sure you want to delete <span className="font-medium">{productToDelete?.name}</span>? 
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setProductToDelete(null);
                }}
                className="px-4 py-2 border border-gray-300 text-text-dark rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProduct}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement; 