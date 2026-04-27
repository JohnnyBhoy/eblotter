import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import AuditLog from '../models/AuditLog.js';
import { protect } from '../middleware/authMiddleware.js';
import { authorize } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('super_admin'));

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = '1', limit = '25', search } = req.query as Record<string, string>;
    const filter: Record<string, unknown> = {};
    if (search) filter['details'] = { $regex: search, $options: 'i' };

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const total = await AuditLog.countDocuments(filter);
    const logs = await AuditLog.find(filter)
      .populate('performedBy', 'fullName username')
      .populate('targetBlotter', 'blotterNumber')
      .populate('targetUser', 'fullName username')
      .sort({ timestamp: -1 })
      .lean()
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    res.json({ logs, total, page: pageNum, totalPages: Math.ceil(total / limitNum) });
  } catch (err) {
    next(err);
  }
});

export default router;
