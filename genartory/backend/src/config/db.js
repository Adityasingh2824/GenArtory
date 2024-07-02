// backend/src/config/db.js (or db.ts for TypeScript)

import mongoose from 'mongoose';

// Get MongoDB URI from environment variables
const mongoURI = process.env.MONGODB_URI;

// Function to connect to the database
export const connectDB = async () => {
  try {
    if (!mongoURI) {
      throw new Error('MongoDB URI not found. Please check your environment variables.');
    }
    await mongoose.connect(mongoURI, { 
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected...');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit process with failure
  }
};
