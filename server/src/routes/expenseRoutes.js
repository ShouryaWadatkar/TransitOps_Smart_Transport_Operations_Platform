import express from 'express';
import * as expenseController from '../controllers/expenseController.js';
import { validateCreateExpense, validateUpdateExpense } from '../validators/expenseValidator.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(protect);

router.get('/',    expenseController.getExpenses);
router.get('/:id', expenseController.getExpense);
router.post('/',   validateCreateExpense, expenseController.createExpense);
router.put('/:id', validateUpdateExpense, expenseController.updateExpense);
router.delete('/:id', expenseController.deleteExpense);

export default router;
