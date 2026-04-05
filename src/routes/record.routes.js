import express from 'express';
import { 
  getRecords, 
  createRecord, 
  updateRecord, 
  deleteRecord 
} from '../controllers/record.controller.js';
import { getDashboardSummary } from '../controllers/summary.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

// 1. View Records: Accessible to all logged-in roles (Viewer, Analyst, Admin)
// Note: Changed from getAllRecords to getRecords to match your controller
router.get('/', protect, getRecords);

// 2. Dashboard Summary: Only Analysts and Admins
router.get('/summary', protect, authorize('Analyst', 'Admin'), getDashboardSummary);

// 3. Management: Only Admins can create, update, or delete
router.post('/', protect, authorize('Admin'), createRecord);
router.put('/:id', protect, authorize('Admin'), updateRecord);
router.delete('/:id', protect, authorize('Admin'), deleteRecord);

export default router;