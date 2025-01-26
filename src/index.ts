import express from 'express';
import mongoose from 'mongoose';
import { env } from './config/env.js';
import { configureApp } from './config/app.js';
import { errorHandler } from './utils/errorHandler.js';
import { connectDatabase } from './config/database.js';

// Routes
import authRoutes from './routes/auth.js';
import oauthRoutes from './routes/oauth.js';
import newsRoutes from './routes/news.js';
import userManagementRoutes from './routes/userManagement.js';
import casesRouter from './routes/cases.js';

// Schedulers
import { NewsUpdateScheduler } from './schedulers/NewsUpdateScheduler.js';

async function startServer() {
  const app = express();

  try {
    // Connect to database
    await connectDatabase();

    // Apply configurations
    configureApp(app);

    // Mount routes
    app.use('/api/auth', authRoutes);
    app.use('/api/auth/oauth', oauthRoutes);
    app.use('/api/news', newsRoutes);
    app.use('/api/admin', userManagementRoutes);
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

    // Start news update scheduler
    const newsScheduler = new NewsUpdateScheduler();
    newsScheduler.start();

    return { app, server };
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
const { app, server } = await startServer();

export { app, server };