import { Router } from 'express';
import { getPostComments, addComment, deleteComment } from '../controllers/commentController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.get('/post/:postId', getPostComments);
router.post('/post/:postId', authMiddleware, addComment);
router.delete('/:id', authMiddleware, deleteComment);

export default router;
