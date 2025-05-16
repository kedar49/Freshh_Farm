import express from 'express';
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';
import { Cart, Product, Coupon, User } from '../models/index.js';

const router = express.Router();
const clerkAuth = ClerkExpressWithAuth();

// Get cart for authenticated user
router.get('/', clerkAuth, async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    
    // First find the user with this clerkId
    const user = await User.findOne({ clerkId });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Now find the cart using MongoDB user ID
    let cart = await Cart.findOne({ userId: user._id }).populate('items.productId');
    
    if (!cart) {
      // Create a new cart if one doesn't exist
      cart = new Cart({ userId: user._id, items: [] });
      await cart.save();
    }
    
    res.json(cart);
  } catch (error) {
    console.error('Cart fetch error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Add item to cart
router.post('/items', clerkAuth, async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    const { productId, quantity, variant } = req.body;
    
    // Find user by Clerk ID
    const user = await User.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Validate product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    let cart = await Cart.findOne({ userId: user._id });
    
    if (!cart) {
      // Create a new cart if one doesn't exist
      cart = new Cart({ userId: user._id, items: [] });
    }
    
    // Check if product already in cart
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId && 
                JSON.stringify(item.variant) === JSON.stringify(variant)
    );
    
    if (itemIndex > -1) {
      // Update quantity if item exists
      cart.items[itemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({ productId, quantity, variant });
    }
    
    await cart.save();
    
    // Return populated cart
    cart = await Cart.findOne({ userId }).populate('items.productId');
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update cart item
router.put('/items/:itemId', clerkAuth, async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    const { itemId } = req.params;
    const { quantity, savedForLater } = req.body;
    
    // Find user by Clerk ID
    const user = await User.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Find cart
    const cart = await Cart.findOne({ userId: user._id });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    
    // Find the item
    const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);
    
    if (itemIndex === -1) {
      return res.status(404).json({ error: 'Item not found in cart' });
    }
    
    // Update item
    if (quantity !== undefined) {
      cart.items[itemIndex].quantity = quantity;
    }
    
    if (savedForLater !== undefined) {
      cart.items[itemIndex].savedForLater = savedForLater;
    }
    
    await cart.save();
    
    // Return populated cart
    const updatedCart = await Cart.findOne({ userId }).populate('items.productId');
    
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove item from cart
router.delete('/items/:itemId', clerkAuth, async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    const { itemId } = req.params;
    
    // Find user by Clerk ID
    const user = await User.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Find cart
    const cart = await Cart.findOne({ userId: user._id });
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    
    // Remove the item
    cart.items = cart.items.filter(item => item._id.toString() !== itemId);
    
    await cart.save();
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Apply coupon to cart
router.post('/apply-coupon', clerkAuth, async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    const { code } = req.body;
    
    // Find user by Clerk ID
    const user = await User.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Validate and find coupon
    const coupon = await Coupon.findOne({ 
      code, 
      isActive: true,
      validFrom: { $lte: new Date() },
      $or: [
        { validUntil: { $gte: new Date() } },
        { validUntil: null }
      ]
    });
    
    if (!coupon) {
      return res.status(404).json({ error: 'Invalid or expired coupon' });
    }
    
    // Update cart with coupon
    const cart = await Cart.findOneAndUpdate(
      { userId: user._id },
      { couponCode: code },
      { new: true }
    ).populate('items.productId');
    
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    
    res.json({
      cart,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minimumPurchase: coupon.minimumPurchase
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove coupon from cart
router.delete('/remove-coupon', clerkAuth, async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    
    // Find user by Clerk ID
    const user = await User.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const cart = await Cart.findOneAndUpdate(
      { userId: user._id },
      { $unset: { couponCode: "" } },
      { new: true }
    ).populate('items.productId');
    
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }
    
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;