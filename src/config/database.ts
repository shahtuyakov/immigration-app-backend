import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDatabase() {
  try {
    // Add connection options for better debugging
    const options = {
      autoIndex: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4 // Force IPv4
    };

    console.log('Attempting to connect to MongoDB...');
    console.log('Connection string format check:', env.MONGODB_URI.startsWith('mongodb'));
    
    await mongoose.connect(env.MONGODB_URI, options);
    
    // Add detailed connection event handlers
    mongoose.connection.on('connected', () => {
      console.log('MongoDB connection established successfully');
      console.log('Connected to database:', mongoose.connection.name);
    });

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
      console.error('Full error details:', JSON.stringify(err, null, 2));
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    // Test the connection immediately
    if (mongoose.connection.readyState === 1) {
      console.log('Connection test successful');
    } else {
      console.log('Current connection state:', mongoose.connection.readyState);
    }

  } catch (error) {
    console.error('Error in database connection:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Full error:', error);
    throw error;
  }
}