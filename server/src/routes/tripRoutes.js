import express from 'express';
import * as tripController from '../controllers/tripController.js';
import { validateCreateTrip, validateUpdateTrip } from '../validators/tripValidator.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// CRUD
router.get('/',    tripController.getTrips);
router.get('/:id', tripController.getTrip);
router.post('/',   validateCreateTrip, tripController.createTrip);
router.put('/:id', validateUpdateTrip, tripController.updateTrip);
router.delete('/:id', tripController.deleteTrip);

// State machine actions
router.patch('/:id/dispatch', tripController.dispatchTrip);
router.patch('/:id/complete', tripController.completeTrip);
router.patch('/:id/cancel',   tripController.cancelTrip);

export default router;
