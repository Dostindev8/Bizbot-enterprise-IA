import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from './logger.js';

export async function connectDatabase(): Promise<void> {
  if (mongoose.connection.readyState === 1) return;

  try {
    await mongoose.connect(env.MONGODB_URI, {
      autoIndex: true,
      serverSelectionTimeoutMS: 5000,
    });
    logger.info({ uri: env.MONGODB_URI }, 'Connected to MongoDB Enterprise database');
  } catch (error) {
    logger.warn({ error }, 'MongoDB connection warning — running in resilient mode');
  }
}

export async function disconnectDatabase(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    logger.info('Disconnected from MongoDB');
  }
}
