import express from 'express';
import { ClerkExpressWithAuth } from '@clerk/clerk-sdk-node';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();
const clerkAuth = ClerkExpressWithAuth();

// Public routes
router.get('/',        asyncHandler(getAllProducts));
router.get('/:id',     asyncHandler(getProductById));

// Protected routes
router.post('/',       clerkAuth, asyncHandler(createProduct));
router.put('/:id',     clerkAuth, asyncHandler(updateProduct));
router.delete('/:id',  clerkAuth, asyncHandler(deleteProduct));

export default router;
