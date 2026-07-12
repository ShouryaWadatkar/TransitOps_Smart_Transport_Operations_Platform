import express from 'express';
import * as vehicleController from '../controllers/vehicleController.js';
import { validateCreateVehicle, validateUpdateVehicle } from '../validators/vehicleValidator.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get('/',    vehicleController.getVehicles);
router.get('/:id', vehicleController.getVehicle);
router.post('/',   validateCreateVehicle, vehicleController.createVehicle);
router.put('/:id', validateUpdateVehicle, vehicleController.updateVehicle);
router.delete('/:id', vehicleController.deleteVehicle);

export default router;
