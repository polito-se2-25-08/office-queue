import express, { Application } from 'express';
import cors from 'cors';
import ticketRoutes from './routes/ticket.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app: Application = express();
//////////
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DEBUG: Log everything about the request
app.use((req, res, next) => {
  console.log('=== INCOMING REQUEST ===');
  console.log(`Method: ${req.method}`);
  console.log(`Path: ${req.path}`);
  console.log(`Content-Type: ${req.get('Content-Type')}`);
  console.log(`Body:`, req.body);
  console.log(`Raw body type:`, typeof req.body);
  console.log('========================');
  next();
});/////////////////
// Routes
app.use('/api', ticketRoutes);

// Health check
app.get('/health', (_req, res) => {
	res.status(200).json({ status: 'ok' });
});

// Error handling (must be last)
app.use(errorHandler);

export default app;