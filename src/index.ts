import express from 'express';
import mongoose from 'mongoose';
import { env } from './config/env.js';
import { configureApp } from './config/app.js';
import { errorHandler } from './utils/errorHandler.js';
import { connectDatabase } from './config/database.js';
import authRoutes from './routes/auth.js';

const app = express();

// Connect to database
connectDatabase()
  .then(() => {
    console.log('Database connection established');
  })
  .catch((error) => {
    console.error('Database connection failed:', error);
    process.exit(1);
  });

// Apply configurations
configureApp(app);

// Apply routes
app.use('/api/auth', authRoutes);

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