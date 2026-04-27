import express from 'express';
import { login, logout, changePassword, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();
router.post('/login', login);
router.post('/logout', protect, logout);
router.post('/change-password', protect, changePassword);
router.get('/me', protect, getMe);
export default router;
//# sourceMappingURL=auth.js.map