import { Router } from 'express';
import {
  getUserProfile,
  updateProfile,
  toggleFollow,
  getSuggestedUsers,
  searchUsers,
} from '../controllers/userController';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth';

const router = Router();

router.get('/suggested', optionalAuthMiddleware, getSuggestedUsers);
router.get('/search', searchUsers);
router.get('/:username', optionalAuthMiddleware, getUserProfile);
router.put('/profile', authMiddleware, updateProfile);
router.post('/:id/follow', authMiddleware, toggleFollow);

export default router;
