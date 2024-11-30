import express from 'express';
import { env } from './config/env.js';
import { configureApp } from './config/app.js';
import { errorHandler } from './utils/errorHandler.js';

const app = express();

// Apply configurations
configureApp(app);

// Test route
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: env.NODE_ENV
  });
});

// Test error route
app.get('/test-error', () => {
  throw new Error('Test error handling');
});

// Apply error handler
app.use(errorHandler);

// Start server
const server = app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
});

// Handle server shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received. Closing server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

export { app, server };