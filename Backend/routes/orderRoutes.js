import express from 'express';
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';
import { Order } from '../models/index.js';

const router = express.Router();
const clerkAuth = ClerkExpressWithAuth();

// Get all orders (admin only)
router.get('/', clerkAuth, async (req, res) => {
  try {
    const userId = req.auth.userId;
    // Check if user has admin permissions (implement this logic)
    
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get orders for authenticated user
router.get('/my-orders', clerkAuth, async (req, res) => {
  try {
    const userId = req.auth.userId;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get order by ID
router.get('/:orderId', clerkAuth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.auth.userId;
    
    const order = await Order.findById(orderId).populate('items.productId');
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // Check if the order belongs to the user or the user is an admin
    // Implement this logic
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new order
router.post('/', clerkAuth, async (req, res) => {
  try {
    const userId = req.auth.userId;
    const orderData = req.body;
    
    // Validate minimum order value of ₹50
    if (orderData.totalAmount < 50) {
      return res.status(400).json({ error: 'Minimum order value should be ₹50' });
    }
    
    const newOrder = new Order({
      userId,
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
    
    // Check if user has admin permissions (implement this logic)
    
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
    const userId = req.auth.userId;
    
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    // Check if the order belongs to the user
    if (order.userId.toString() !== userId) {
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