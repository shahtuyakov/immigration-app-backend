import express from 'express';
import mongoose from 'mongoose';
import { env } from './config/env.js';
import { configureApp } from './config/app.js';
import { errorHandler } from './utils/errorHandler.js';
import { connectDatabase } from './config/database.js';

import authRoutes from './routes/auth.js';
import newsRoutes from './routes/news.js';
import userManagementRoutes from './routes/userManagement.js';
import caseTrackingRoutes from './routes/caseTracking.js';
import casesRouter from './routes/cases.js';

const app = express();

// Connect to database
await connectDatabase();

// Apply configurations
configureApp(app);

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/admin', userManagementRoutes);
app.use('/api/case-tracking', caseTrackingRoutes);
app.use('/api/cases', casesRouter);

// Health check route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV,
    dbConnection: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Apply error handler
app.use(errorHandler);

// Start server
const server = app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
});

export { app, server };