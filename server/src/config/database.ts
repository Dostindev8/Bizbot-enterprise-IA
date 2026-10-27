import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from './logger.js';

export async function connectDatabase(): Promise<void> {
  if (mongoose.connection.readyState === 1) return;

  try {
    await mongoose.connect(env.MONGODB_URI, {
      autoIndex: env.NODE_ENV !== 'production',
      serverSelectionTimeoutMS: 5000,
    });
    logger.info(
      { host: mongoose.connection.host, db: mongoose.connection.name },
      'Connected to MongoDB'
    );
  } catch (error) {
    logger.warn({ err: error instanceof Error ? error.message : 'unknown' }, 'MongoDB connection warning — running in resilient mode');
  }
}

export async function disconnectDatabase(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    logger.info('Disconnected from MongoDB');
  }
}

export function isDatabaseReady(): boolean {
  return mongoose.connection.readyState === 1;
}
