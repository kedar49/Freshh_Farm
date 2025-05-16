import { Product, User } from '../models/index.js';

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const { category, search } = req.query;
    
    let query = {};
    
    // Filter by category if provided
    if (category) {
      query.category = category;
    }
    
    // Search by name if provided
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    
    const products = await Product.find(query);
    
    return res.status(200).json({ 
      success: true, 
      count: products.length,
      products 
    });
  } catch (error) {
    console.error('Error in getAllProducts:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Get product by ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }
    
    return res.status(200).json({ 
      success: true, 
      product 
    });
  } catch (error) {
    console.error('Error in getProductById:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Create new product - clerks only
export const createProduct = async (req, res) => {
  try {
    const userId = req.auth.userId; // From Clerk middleware
    
    // Check if user is a clerk
    const user = await User.findOne({ clerkId: userId });
    if (!user || (user.role !== 'clerk' && user.role !== 'admin')) {
      return res.status(403).json({ 
        success: false, 
        message: 'Unauthorized: Clerk access required' 
      });
    }
    
    const { 
      name, 
      description, 
      originalPrice, 
      offerPrice, 
      category, 
      imageUrl, 
      inStock, 
      unit 
    } = req.body;
    
    // Create new product
    const product = new Product({
      name,
      description,
      originalPrice,
      offerPrice,
      category,
      imageUrl,
      inStock,
      unit
    });
    
    await product.save();
    
    return res.status(201).json({ 
      success: true, 
      message: 'Product created successfully', 
      product 
    });
  } catch (error) {
    console.error('Error in createProduct:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Update product - clerks only
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.auth.userId; // From Clerk middleware
    
    // Check if user is a clerk
    const user = await User.findOne({ clerkId: userId });
    if (!user || (user.role !== 'clerk' && user.role !== 'admin')) {
      return res.status(403).json({ 
        success: false, 
        message: 'Unauthorized: Clerk access required' 
      });
    }
    
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }
    
    // Update product with new values
    const updatedProduct = await Product.findByIdAndUpdate(
      id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    return res.status(200).json({ 
      success: true, 
      message: 'Product updated successfully', 
      product: updatedProduct 
    });
  } catch (error) {
    console.error('Error in updateProduct:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Delete product - clerks only
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.auth.userId; // From Clerk middleware
    
    // Check if user is a clerk
    const user = await User.findOne({ clerkId: userId });
    if (!user || (user.role !== 'clerk' && user.role !== 'admin')) {
      return res.status(403).json({ 
        success: false, 
        message: 'Unauthorized: Clerk access required' 
      });
    }
    
    const product = await Product.findByIdAndDelete(id);
    
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }
    
    return res.status(200).json({ 
      success: true, 
      message: 'Product deleted successfully' 
    });
  } catch (error) {
    console.error('Error in deleteProduct:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
}; 