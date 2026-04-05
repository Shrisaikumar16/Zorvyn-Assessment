import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import recordRoutes from './routes/record.routes.js';
import authRoutes from './routes/auth.routes.js'; 
const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors());   // Enable Cross-Origin requests
app.use(express.json()); // Body parser

// Routes
app.use('/api/records', recordRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/records', recordRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

export default app;