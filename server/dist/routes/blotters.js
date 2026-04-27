import express from 'express';
import { createBlotter, getBlotters, getBlotter, updateBlotter, updateStatus, deleteBlotter, getDashboardStats } from '../controllers/blotterController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';
const router = express.Router();
router.use(protect);
router.get('/stats', getDashboardStats);
router.get('/', getBlotters);
router.post('/', authorize('barangay'), createBlotter);
router.get('/:id', getBlotter);
router.put('/:id', authorize('barangay'), updateBlotter);
router.patch('/:id/status', authorize('barangay', 'municipal', 'provincial', 'super_admin'), updateStatus);
router.delete('/:id', authorize('barangay', 'super_admin'), deleteBlotter);
export default router;
//# sourceMappingURL=blotters.js.map