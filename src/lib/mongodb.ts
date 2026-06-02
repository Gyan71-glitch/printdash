import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || (process.env.NODE_ENV === 'production' ? '' : 'mongodb://127.0.0.1:27017/premium-news');

if (!MONGODB_URI) {
  throw new Error('CRITICAL: MONGODB_URI environment variable is missing in Vercel! Please add it in Vercel Settings -> Environment Variables and redeploy.');
}

if (process.env.NODE_ENV === 'production' && (MONGODB_URI.includes('127.0.0.1') || MONGODB_URI.includes('localhost'))) {
  throw new Error('CRITICAL: You pasted your LOCAL MongoDB URI into Vercel! You must use the MongoDB Atlas connection string (mongodb+srv://...) in Vercel.');
}


let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;
