import { Router } from 'express';
import {
  getTags,
  createTag,
  updateTag,
  deleteTag,
} from '../controllers/tag.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.get('/', getTags);
router.post('/', createTag);
router.put('/:id', updateTag);
router.delete('/:id', deleteTag);

export default router;
