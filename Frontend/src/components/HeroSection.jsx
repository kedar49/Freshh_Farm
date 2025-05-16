import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Leaf, Award, TrendingUp } from 'lucide-react';

const HeroSection = () => {
  return (
    <div className="relative bg-gradient-to-br from-primary-light to-primary overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMzYgMzRjMC0yLjIwOCAxLjc5NS00IDQtNHM0IDEuNzkyIDQgNC0xLjc5NSA0LTQgNC00LTEuNzkyLTQtNHptMC0yYzAtMS4xMDQuODk4LTIgMi0yczIgLjg5NiAyIDItLjg5OCAyLTIgMi0yLS44OTYtMi0yem0tMTYgMTZjMC0yLjIwOCAxLjc5NS00IDQtNHM0IDEuNzkyIDQgNC0xLjc5NSA0LTQgNC00LTEuNzkyLTQtNHptMC0yYzAtMS4xMDQuODk4LTIgMi0yczIgLjg5NiAyIDItLjg5OCAyLTIgMi0yLS44OTYtMi0yem0wLTE2YzAtMi4yMDggMS43OTUtNCA0LTRzNCAxLjc5MiA0IDQtMS43OTUgNC00IDQtNC0xLjc5Mi00LTR6bTAtMmMwLTEuMTA0Ljg5OC0yIDItMnMyIC44OTYgMiAyLS44OTggMi0yIDItMi0uODk2LTItMnptLTE2IDE2YzAtMi4yMDggMS43OTUtNCA0LTRzNCAxLjc5MiA0IDQtMS43OTUgNC00IDQtNC0xLjc5Mi00LTR6bTAtMmMwLTEuMTA0Ljg5OC0yIDItMnMyIC44OTYgMiAyLS44OTggMi0yIDItMi0uODk2LTItMnoiLz48L2c+PC9nPjwvc3ZnPg==')]"></div>
      </div>

      <div className="container mx-auto px-6 py-16 md:py-24 relative z-10">
        <div className="flex flex-col md:flex-row items-center justify-between">
          {/* Hero text content */}
          <motion.div 
            className="md:w-1/2 mb-12 md:mb-0 text-white"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Fresh From Farm <br />
              <span className="text-accent">To Your Table</span>
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-lg opacity-90">
              Experience the fresh Veggies directly from local farms. Quality you can trust, flavors you'll love.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/products" 
                className="px-8 py-3 bg-accent hover:bg-orange-500 text-white font-medium rounded-full transition-all flex items-center gap-2"
              >
                <ShoppingBag size={20} />
                Shop Now
              </Link>
              <Link 
                to="/products/featured" 
                className="px-8 py-3 bg-white hover:bg-gray-100 text-primary font-medium rounded-full transition-all"
              >
                Featured Products
              </Link>
            </div>
          </motion.div>

          {/* Hero image */}
          <motion.div 
            className="md:w-1/2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-accent rounded-full opacity-20"></div>
              <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-primary-dark rounded-full opacity-20"></div>
              <img 
                src="https://images.unsplash.com/photo-1506617564039-2f3b650b7010?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80" 
                alt="Fresh Farm Products" 
                className="rounded-3xl shadow-2xl w-full object-cover h-[400px]"
              />
            </div>
          </motion.div>
        </div>

        {/* Features section */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
            <div className="bg-accent/20 w-12 h-12 flex items-center justify-center rounded-full mb-4">
              <Leaf className="text-white" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">100% Fresh</h3>
            <p className="text-white/80">All our products are certified organic and grown without harmful pesticides.</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
            <div className="bg-accent/20 w-12 h-12 flex items-center justify-center rounded-full mb-4">
              <ShoppingBag className="text-white" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Free Delivery</h3>
            <p className="text-white/80">Free delivery on orders over Rs.50. We deliver straight to your doorstep.</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
            <div className="bg-accent/20 w-12 h-12 flex items-center justify-center rounded-full mb-4">
              <Award className="text-white" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Premium Quality</h3>
            <p className="text-white/80">We guarantee the highest quality of all products from our partner farms.</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
            <div className="bg-accent/20 w-12 h-12 flex items-center justify-center rounded-full mb-4">
              <TrendingUp className="text-white" size={24} />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Best Prices</h3>
            <p className="text-white/80">By cutting out middlemen, we offer the best prices for premium products.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection; 