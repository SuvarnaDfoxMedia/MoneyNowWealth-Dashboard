// routes/profileRoutes.js
import express from 'express';
import { body } from 'express-validator';
import { getProfile, updateProfile } from '../controllers/profileController.js';
import { protect as authMiddleware } from '../middleware/authMiddleware.js';
import { uploadProfileImage } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// GET /api/profile - Get user profile
router.get('/', getProfile);

// PUT /api/profile - Update user profile
// router.put(
//   '/',
//   uploadProfileImage,
//   [
//     body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
//     body('phone').optional().trim().isLength({ min: 10 }).withMessage('Phone must be at least 10 characters'),
//     body('address').optional().trim()
//   ],
//   updateProfile
// );

router.put(
  '/',
  uploadProfileImage,
  [
    body('name')
      .notEmpty().withMessage('Name is required')
      .trim()
      .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
    body('phone')
      .optional()
      .trim()
      .isLength({ min: 10 }).withMessage('Phone must be at least 10 characters'),
    body('address').optional().trim()
  ],
  updateProfile
);


export default router;