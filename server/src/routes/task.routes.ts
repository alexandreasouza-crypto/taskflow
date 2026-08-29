import { Router } from 'express';
import {
  getTasks,
  createTask,
  updateTask,
  updateTaskStatusAndOrder,
  deleteTask,
} from '../controllers/task.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.get('/', getTasks);
router.post('/', createTask);
router.put('/:id', updateTask);
router.patch('/:id/move', updateTaskStatusAndOrder);
router.delete('/:id', deleteTask);

export default router;
