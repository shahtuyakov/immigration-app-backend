// src/config/database.ts
import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDatabase() {
  try {
    const options = {
      autoIndex: true,
      serverSelectionTimeoutMS: 30000, // Increased timeout
      socketTimeoutMS: 45000,
      family: 4,
      retryWrites: true,
      retryReads: true,
      w: 'majority',
      maxPoolSize: 10,
      minPoolSize: 5,
    };

    console.log('Attempting to connect to MongoDB...');
    
    await mongoose.connect(env.MONGODB_URI, options);
    
    mongoose.connection.on('connected', () => {
      console.log('MongoDB connection established successfully');
    });

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    // Add detailed error logging
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      if ('code' in error) {
        console.error('Error code:', (error as any).code);
      }
    }
    throw error;
  }
}