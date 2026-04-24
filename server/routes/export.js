import express from 'express';
import {
  exportBlotterPDF,
  exportBlotterDocx,
  exportBlotterExcel,
  exportSummaryExcel,
  exportSummaryPDF
} from '../controllers/exportController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/blotter/:id/pdf', exportBlotterPDF);
router.get('/blotter/:id/docx', exportBlotterDocx);
router.get('/blotter/:id/excel', exportBlotterExcel);
router.get('/summary/excel', exportSummaryExcel);
router.get('/summary/pdf', exportSummaryPDF);

export default router;
