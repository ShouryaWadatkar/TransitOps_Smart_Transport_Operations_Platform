import express from 'express';
import * as fuelController from '../controllers/fuelController.js';
import { validateCreateFuelLog, validateUpdateFuelLog } from '../validators/fuelValidator.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get('/',    fuelController.getFuelLogs);
router.get('/:id', fuelController.getFuelLog);
router.post('/',   validateCreateFuelLog, fuelController.createFuelLog);
router.put('/:id', validateUpdateFuelLog, fuelController.updateFuelLog);
router.delete('/:id', fuelController.deleteFuelLog);

export default router;
