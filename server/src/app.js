import express from 'express';
import cors from 'cors';
import authRoutes        from './routes/authRoutes.js';
import roleRoutes        from './routes/roleRoutes.js';
import vehicleRoutes     from './routes/vehicleRoutes.js';
import driverRoutes      from './routes/driverRoutes.js';
import tripRoutes        from './routes/tripRoutes.js';
import maintenanceRoutes from './routes/maintenanceRoutes.js';
import fuelRoutes        from './routes/fuelRoutes.js';
import expenseRoutes     from './routes/expenseRoutes.js';
import errorMiddleware   from './middlewares/errorMiddleware.js';
import { NotFoundError } from './utils/errorHandler.js';

const app = express();

// Enable Cross-Origin Resource Sharing
app.use(cors());

// Body parser, parsing JSON request bodies
app.use(express.json());

// URL-encoded body parser
app.use(express.urlencoded({ extended: true }));

// Health Check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'TransitOps API Server is operational',
    timestamp: new Date().toISOString(),
  });
});

// ─────────────────────────────────────────────
// Mount modular routes
// ─────────────────────────────────────────────

// Auth & Roles
app.use('/api/auth',  authRoutes);
app.use('/api/roles', roleRoutes);

// Core fleet management APIs
app.use('/api/vehicles',    vehicleRoutes);
app.use('/api/drivers',     driverRoutes);
app.use('/api/trips',       tripRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/fuel',        fuelRoutes);
app.use('/api/expenses',    expenseRoutes);

// Fallback: 404 handler for unmatched routes
app.all('*', (req, res, next) => {
  next(new NotFoundError(`Cannot find endpoint "${req.originalUrl}" on this server.`));
});

// Mount global error response handler
app.use(errorMiddleware);

export default app;
