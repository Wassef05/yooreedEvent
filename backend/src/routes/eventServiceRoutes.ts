import express, { Router } from 'express';
import {
  listPublicEventServices,
  listAllEventServices,
  createEventService,
  updateEventService,
  deleteEventService,
} from '../controllers/eventServiceController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router: Router = express.Router();

// Public
router.get('/', listPublicEventServices);

// Admin
router.get('/all', authenticate, authorize('admin', 'super_admin'), listAllEventServices);
router.post('/', authenticate, authorize('admin', 'super_admin'), createEventService);
router.put('/:id', authenticate, authorize('admin', 'super_admin'), updateEventService);
router.delete('/:id', authenticate, authorize('admin', 'super_admin'), deleteEventService);

export default router;

