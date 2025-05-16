import express from 'express';
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';
import { createOrUpdateUser, getUserByClerkId, updateUserRole } from '../controllers/userController.js';

const router = express.Router();
const clerkAuth = ClerkExpressWithAuth();

// Public routes
router.post(
  '/webhook',
  async (req, res, next) => {
    try {
      await createOrUpdateUser(req, res);
    } catch (error) {
      next(error);
    }
  }
);

// Protected routes — pass the middleware reference, not its invocation
router.get(
  '/me',
  clerkAuth,
  async (req, res, next) => {
    try {
      await getUserByClerkId(req, res);
    } catch (error) {
      next(error);
    }
  }
);

router.put(
  '/role',
  clerkAuth,
  async (req, res, next) => {
    try {
      await updateUserRole(req, res);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
