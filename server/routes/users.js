import express from 'express';
import {
  getUsers,
  createUser,
  getUser,
  updateUser,
  toggleUser,
  deleteUser
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('super_admin'));

router.get('/', getUsers);
router.post('/', createUser);
router.get('/:id', getUser);
router.put('/:id', updateUser);
router.patch('/:id/toggle', toggleUser);
router.delete('/:id', deleteUser);

export default router;
