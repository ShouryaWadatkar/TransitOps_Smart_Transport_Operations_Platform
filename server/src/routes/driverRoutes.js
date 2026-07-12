import express from 'express';
import * as driverController from '../controllers/driverController.js';
import { validateCreateDriver, validateUpdateDriver } from '../validators/driverValidator.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get('/',    driverController.getDrivers);
router.get('/:id', driverController.getDriver);
router.post('/',   validateCreateDriver, driverController.createDriver);
router.put('/:id', validateUpdateDriver, driverController.updateDriver);
router.delete('/:id', driverController.deleteDriver);

export default router;
