import * as expenseService from '../services/expenseService.js';
import { sendSuccess } from '../utils/apiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * GET /api/expenses
 * Retrieve all expenses (optional ?vehicleId= ?driverId= ?tripId= ?category= queries)
 */
export const getExpenses = asyncHandler(async (req, res) => {
  const { vehicleId, driverId, tripId, category } = req.query;
  const expenses = await expenseService.getAllExpenses({ vehicleId, driverId, tripId, category });
  return sendSuccess(res, 'Expenses retrieved successfully.', expenses, 200);
});

/**
 * GET /api/expenses/:id
 * Retrieve a single expense by ID
 */
export const getExpense = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const expense = await expenseService.getExpenseById(id);
  return sendSuccess(res, 'Expense retrieved successfully.', expense, 200);
});

/**
 * POST /api/expenses
 * Create a new expense
 */
export const createExpense = asyncHandler(async (req, res) => {
  const { vehicleId, driverId, tripId, category, amount, description, date } = req.body;
  const expense = await expenseService.createExpense({ vehicleId, driverId, tripId, category, amount, description, date });
  return sendSuccess(res, 'Expense created successfully.', expense, 201);
});

/**
 * PUT /api/expenses/:id
 * Update an existing expense
 */
export const updateExpense = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { vehicleId, driverId, tripId, category, amount, description, date } = req.body;
  const expense = await expenseService.updateExpense(id, { vehicleId, driverId, tripId, category, amount, description, date });
  return sendSuccess(res, 'Expense updated successfully.', expense, 200);
});

/**
 * DELETE /api/expenses/:id
 * Delete an expense
 */
export const deleteExpense = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await expenseService.deleteExpense(id);
  return sendSuccess(res, `Expense with ID ${id} deleted successfully.`, null, 200);
});
