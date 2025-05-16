import React, { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import { Link, useParams } from "react-router-dom";
import { assets } from "../assets/assets";
import ProductCard from "../components/ProductCard";
import { motion } from "framer-motion";
import { useCart } from '../context/CartContext';
import { useAuth } from '@clerk/clerk-react';
import { Heart, ShoppingCart, Star, Truck, ArrowLeft, Leaf } from 'lucide-react';
import toast from 'react-hot-toast';

const ProductDetails = () => {
  const { products, navigate, addToCart } = useAppContext();
  const { id } = useParams();
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart: cartAddToCart } = useCart();
  const { isSignedIn, getToken } = useAuth();

  const productFromLocal = products.find((item) => item._id === id);

  useEffect(() => {
    if (products.length > 0 && product) {
      const sameCategory = products.filter(
        (item) => product.category === item.category && item._id !== id
      );
      setRelatedProducts(sameCategory.slice(0, 5));
    }
  }, [products, id]);

  useEffect(() => {
    if (product && product.image?.length > 0) {
      setThumbnail(product.image[0]);
    }
  }, [product]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`);
        
        if (!response.ok) {
          throw new Error('Product not found');
        }
        
        const data = await response.json();
        setProduct(data);
        
        // Set default variant if variants exist
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
        }
        
        // Record view for logged in users
        if (isSignedIn) {
          recordProductView(id);
        }
        
        // Fetch related products
        fetchRelatedProducts(data.category);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Could not load product details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id, isSignedIn]);
  
  // Record product view for logged in users
  const recordProductView = async (productId) => {
    try {
      const token = await getToken();
      await fetch(`${import.meta.env.VITE_API_URL}/api/users/record-view`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ productId })
      });
    } catch (error) {
      console.error('Error recording product view:', error);
    }
  };
  
  // Fetch related products
  const fetchRelatedProducts = async (category) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/products?category=${category}&limit=4`
      );
      
      if (!response.ok) throw new Error('Failed to fetch related products');
      
      const data = await response.json();
      // Filter out current product
      setRelatedProducts(data.filter(prod => prod._id !== id));
    } catch (error) {
      console.error('Error fetching related products:', error);
    }
  };
  
  // Handle "Add to Cart" action
  const handleAddToCart = () => {
    cartAddToCart(
      product._id, 
      quantity, 
      selectedVariant
    );
  };
  
  // Handle "Add to Wishlist" action
  const handleAddToWishlist = async () => {
    if (!isSignedIn) {
      toast.error('Please sign in to add items to your wishlist');
      return;
    }
    
    try {
      const token = await getToken();
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/users/wishlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ productId: product._id })
      });
      
      if (!response.ok) throw new Error('Failed to add to wishlist');
      
      toast.success('Added to wishlist');
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error('Could not add to wishlist');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-2xl font-semibold mb-4">Product Not Found</h2>
        <p className="text-text-light mb-6">The product you're looking for doesn't exist or has been removed.</p>
        <Link to="/products" className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">
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
      className="py-6"
    >
      <Link to={`/products/${product.category.toLowerCase()}`} className="flex items-center text-primary mb-6">
        <ArrowLeft size={18} className="mr-2" />
        <span>Back to {product.category}</span>
      </Link>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image Gallery */}
        <div>
          <div className="mb-4 rounded-xl overflow-hidden bg-gray-50 aspect-square">
            <img 
              src={product.imageUrls[selectedImage]} 
              alt={product.name} 
              className="w-full h-full object-contain"
            />
          </div>
          
          {product.imageUrls.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.imageUrls.map((img, i) => (
                <div 
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`cursor-pointer rounded-lg overflow-hidden border-2 ${
                    selectedImage === i ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt={`${product.name} ${i+1}`} className="w-full h-full object-cover aspect-square" />
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Product Info */}
        <div>
          <div className="mb-6">
            {product.isSeasonal && (
              <span className="inline-block bg-accent text-white text-xs font-medium px-2.5 py-1 rounded mb-2">
                In Season
              </span>
            )}
            {product.isOrganic && (
              <span className="inline-block bg-success text-white text-xs font-medium px-2.5 py-1 rounded ml-2 mb-2">
                <Leaf size={14} className="inline mr-1" /> Organic
              </span>
            )}
            
            <h1 className="text-3xl font-semibold text-text-dark">{product.name}</h1>
            
            <div className="flex items-center mt-2 space-x-1">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    fill={i < Math.floor(product.ratings?.average || 0) ? "currentColor" : "none"}
                    className={i < Math.floor(product.ratings?.average || 0) ? "text-accent" : "text-gray-300"}
                  />
                ))}
              </div>
              <span className="text-sm text-text-light ml-1">
                ({product.ratings?.count || 0} reviews)
              </span>
            </div>
          </div>
          
          <div className="mb-6">
            <div className="flex items-baseline">
              <span className="text-2xl font-bold text-text-dark">₹{product.offerPrice}</span>
              {product.originalPrice > product.offerPrice && (
                <span className="ml-2 text-text-light line-through">₹{product.originalPrice}</span>
              )}
              {product.originalPrice > product.offerPrice && (
                <span className="ml-2 text-sm text-success font-medium">
                  Save {Math.round(((product.originalPrice - product.offerPrice) / product.originalPrice) * 100)}%
                </span>
              )}
            </div>
            
            <p className="text-text-light mt-1">
              Price per {product.unit}
            </p>
          </div>
          
          {/* Variants if available */}
          {product.variants && product.variants.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-text-dark mb-2">Select Size/Weight:</h3>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedVariant(variant)}
                    className={`px-4 py-2 rounded-lg border ${
                      selectedVariant === variant
                        ? 'border-primary bg-primary text-white'
                        : 'border-gray-200 text-text-dark hover:border-primary'
                    }`}
                  >
                    {variant.size ? variant.size : `${variant.weight} ${product.unit}`}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Origin & Nutrition Info */}
          {(product.origin || product.nutritionInfo) && (
            <div className="mb-6">
              {product.origin && (
                <div className="mb-2">
                  <span className="font-medium text-text-dark">Origin: </span>
                  <span className="text-text-light">{product.origin}</span>
                </div>
              )}
              
              {product.nutritionInfo && (
                <div>
                  <span className="font-medium text-text-dark">Nutrition: </span>
                  <span className="text-text-light">{product.nutritionInfo}</span>
                </div>
              )}
            </div>
          )}
          
          {/* Stock Status */}
          <div className="mb-6">
            {product.inStock > 10 ? (
              <div className="text-success flex items-center">
                <div className="w-2 h-2 bg-success rounded-full mr-2"></div>
                <span>In Stock</span>
              </div>
            ) : product.inStock > 0 ? (
              <div className="text-warning flex items-center">
                <div className="w-2 h-2 bg-warning rounded-full mr-2"></div>
                <span>Limited Stock ({product.inStock} left)</span>
              </div>
            ) : (
              <div className="text-error flex items-center">
                <div className="w-2 h-2 bg-error rounded-full mr-2"></div>
                <span>Out of Stock</span>
              </div>
            )}
          </div>
          
          {/* Quantity Select */}
          <div className="mb-6">
            <label htmlFor="quantity" className="block text-sm font-medium text-text-dark mb-2">
              Quantity:
            </label>
            <div className="flex items-center">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-1 border border-gray-300 rounded-l-lg hover:bg-gray-100"
                disabled={quantity <= 1}
              >
                -
              </button>
              <input
                type="number"
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
                className="w-16 px-3 py-1 border-t border-b border-gray-300 text-center focus:outline-none"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-1 border border-gray-300 rounded-r-lg hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 mb-6">
            <button
              onClick={handleAddToCart}
              disabled={product.inStock === 0}
              className={`flex-1 flex items-center justify-center px-6 py-3 rounded-lg text-white ${
                product.inStock === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-primary hover:bg-primary-dark'
              }`}
            >
              <ShoppingCart size={20} className="mr-2" />
              Add to Cart
            </button>
            
            <button
              onClick={handleAddToWishlist}
              className="px-6 py-3 rounded-lg border border-primary text-primary hover:bg-primary-light/10"
            >
              <Heart size={20} />
            </button>
          </div>
          
          {/* Delivery Info */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start">
              <Truck size={20} className="text-primary mt-1 mr-3" />
              <div>
                <h3 className="font-medium text-text-dark">Free Delivery</h3>
                <p className="text-sm text-text-light">Orders above ₹500 qualify for free delivery</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Product Description */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold text-text-dark mb-4">Description</h2>
        <p className="text-text-light whitespace-pre-line">{product.description}</p>
      </div>
      
      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-xl font-semibold text-text-dark mb-6">You might also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <div key={relatedProduct._id} className="border border-gray-200 rounded-xl overflow-hidden group hover:shadow-card-hover transition-shadow">
                <Link to={`/products/${relatedProduct.category}/${relatedProduct._id}`}>
                  <div className="aspect-square bg-gray-50">
                    <img 
                      src={relatedProduct.imageUrls[0]} 
                      alt={relatedProduct.name} 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-text-dark group-hover:text-primary transition-colors">
                      {relatedProduct.name}
                    </h3>
                    <div className="flex items-baseline mt-1">
                      <span className="font-bold text-text-dark">₹{relatedProduct.offerPrice}</span>
                      {relatedProduct.originalPrice > relatedProduct.offerPrice && (
                        <span className="ml-2 text-sm text-text-light line-through">₹{relatedProduct.originalPrice}</span>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ProductDetails;
