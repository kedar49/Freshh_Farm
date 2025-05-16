import { User } from '../models/index.js';

// Create or update user from Clerk webhook
export const createOrUpdateUser = async (req, res) => {
  try {
    const { id, email_addresses, first_name, last_name, image_url } = req.body.data;
    
    // Check if user exists with this clerk ID
    let user = await User.findOne({ clerkId: id });

    // If user exists, update their information
    if (user) {
      user.email = email_addresses[0]?.email_address || user.email;
      user.firstName = first_name || user.firstName;
      user.lastName = last_name || user.lastName;
      user.imageUrl = image_url || user.imageUrl;
      await user.save();
    } else {
      // Create new user
      user = new User({
        clerkId: id,
        email: email_addresses[0]?.email_address,
        firstName: first_name,
        lastName: last_name,
        imageUrl: image_url
      });
      await user.save();
    }

    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Error in createOrUpdateUser:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Get user by Clerk ID
export const getUserByClerkId = async (req, res) => {
  try {
    const userId = req.auth.userId; // From Clerk middleware
    
    const user = await User.findOne({ clerkId: userId });
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error('Error in getUserByClerkId:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Server error', 
      error: error.message 
    });
  }
};

// Update user role - admin only
export const updateUserRole = async (req, res) => {
  try {
    const { userId, role } = req.body;
    const adminId = req.auth.userId; // From Clerk middleware

    // Verify admin status
    const adminUser = await User.findOne({ clerkId: adminId });
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized: Admin access required'
      });
    }

    // Find user and update role
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.role = role;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'User role updated successfully',
      user
    });
  } catch (error) {
    console.error('Error in updateUserRole:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
}; 