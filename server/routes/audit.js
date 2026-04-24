import express from 'express';
import AuditLog from '../models/AuditLog.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('super_admin'));

router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 25, search } = req.query;
    const filter = {};
    if (search) filter.details = { $regex: search, $options: 'i' };

    const total = await AuditLog.countDocuments(filter);
    const logs = await AuditLog.find(filter)
      .populate('performedBy', 'fullName username')
      .populate('targetBlotter', 'blotterNumber')
      .populate('targetUser', 'fullName username')
      .sort({ timestamp: -1 })
      .lean()
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    res.json({ logs, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (err) {
    next(err);
  }
});

export default router;
