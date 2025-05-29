import express from 'express';
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';
import { Order, User } from '../models/index.js';

const router = express.Router();
const clerkAuth = ClerkExpressWithAuth();

// Get all orders (admin only)
router.get('/', clerkAuth, async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    
    // Find user by Clerk ID and check permissions
    const user = await User.findOne({ clerkId });
    if (!user || (user.role !== 'admin' && user.role !== 'seller')) {
      return res.status(403).json({ error: 'Unauthorized: Admin access required' });
    }
    
    const orders = await Order.find().sort({ createdAt: -1 }).populate('items.productId');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get orders for authenticated user
router.get('/my-orders', clerkAuth, async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    
    // Find user by Clerk ID
    const user = await User.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const orders = await Order.find({ userId: user._id }).sort({ createdAt: -1 }).populate('items.productId');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get order by ID
router.get('/:orderId', clerkAuth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const clerkId = req.auth.userId;
    
    // Find user by Clerk ID
    const user = await User.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const order = await Order.findById(orderId).populate('items.productId');
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // Check if the order belongs to the user or the user is an admin
    if (order.userId.toString() !== user._id.toString() && user.role !== 'admin' && user.role !== 'seller') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new order
router.post('/', clerkAuth, async (req, res) => {
  try {
    const clerkId = req.auth.userId;
    const orderData = req.body;
    
    // Find user by Clerk ID
    const user = await User.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Validate minimum order value of ₹50
    if (orderData.totalAmount < 50) {
      return res.status(400).json({ error: 'Minimum order value should be ₹50' });
    }
    
    const newOrder = new Order({
      userId: user._id,
      ...orderData
    });
    
    await newOrder.save();
    
    // Here you would also clear the cart after successful order placement
    
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update order status (admin only)
router.patch('/:orderId/status', clerkAuth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const clerkId = req.auth.userId;
    
    // Find user by Clerk ID and check permissions
    const user = await User.findOne({ clerkId });
    if (!user || (user.role !== 'admin' && user.role !== 'seller')) {
      return res.status(403).json({ error: 'Unauthorized: Admin access required' });
    }
    
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cancel order
router.patch('/:orderId/cancel', clerkAuth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const clerkId = req.auth.userId;
    
    // Find user by Clerk ID
    const user = await User.findOne({ clerkId });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // Check if the order belongs to the user
    if (order.userId.toString() !== user._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    
    // Check if the order can be cancelled (e.g., not already shipped)
    if (['Shipped', 'Delivered'].includes(order.status)) {
      return res.status(400).json({ error: 'Cannot cancel order that has been shipped or delivered' });
    }
    
    order.status = 'Cancelled';
    await order.save();
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router; 