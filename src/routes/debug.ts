import { Router } from 'express';
import mongoose from 'mongoose';
import { User } from '../models/User.js';

const router = Router();

// Enhanced database status check
router.get('/db-status', async (req, res) => {
  try {
    // Detailed connection information
    const status = {
      isConnected: mongoose.connection.readyState === 1,
      connectionState: {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting',
      }[mongoose.connection.readyState],
      databaseName: mongoose.connection.name || 'Not connected',
      host: mongoose.connection.host || 'Not connected',
      // Add basic test query
      canQuery: false
    };

    // Test if we can actually query the database
    try {
      await User.findOne().select('_id');
      status.canQuery = true;
    } catch (queryError) {
      console.error('Query test failed:', queryError);
      status.canQuery = false;
    }

    res.json({
      timestamp: new Date().toISOString(),
      ...status
    });
  } catch (error) {
    console.error('Debug route error:', error);
    // Send a proper error response instead of crashing
    res.status(500).json({
      error: true,
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

export default router;