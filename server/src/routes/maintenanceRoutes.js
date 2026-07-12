import express from 'express';
import * as maintenanceController from '../controllers/maintenanceController.js';
import { validateCreateMaintenance, validateUpdateMaintenance } from '../validators/maintenanceValidator.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

// CRUD
router.get('/',    maintenanceController.getMaintenances);
router.get('/:id', maintenanceController.getMaintenance);
router.post('/',   validateCreateMaintenance, maintenanceController.createMaintenance);
router.put('/:id', validateUpdateMaintenance, maintenanceController.updateMaintenance);
router.delete('/:id', maintenanceController.deleteMaintenance);

// State machine action
router.patch('/:id/close', maintenanceController.closeMaintenance);

export default router;
