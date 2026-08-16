import mongoose from 'mongoose';

/**
 * Cached Mongoose connection helper.
 *
 * Reuses the connection across warm serverless invocations via a module-level
 * variable, since a fresh connection per invocation would exhaust MongoDB
 * Atlas's connection limit.
 */
let cachedConnection = null;

export async function connectDB() {
  if (cachedConnection && cachedConnection.readyState === 1) {
    return cachedConnection;
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI environment variable is not defined');
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // These are sensible defaults for serverless environments
      bufferCommands: false,
      maxPoolSize: 10,
    });

    cachedConnection = conn.connection;
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return cachedConnection;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    throw error;
  }
}
