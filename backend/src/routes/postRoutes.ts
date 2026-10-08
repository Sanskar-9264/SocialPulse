import { Router } from 'express';
import {
  createPost,
  getPosts,
  getUserPosts,
  toggleLikePost,
  deletePost,
} from '../controllers/postController';
import { authMiddleware, optionalAuthMiddleware } from '../middleware/auth';

const router = Router();

router.post('/', authMiddleware, createPost);
router.get('/', optionalAuthMiddleware, getPosts);
router.get('/user/:username', optionalAuthMiddleware, getUserPosts);
router.post('/:id/like', authMiddleware, toggleLikePost);
router.delete('/:id', authMiddleware, deletePost);

export default router;
