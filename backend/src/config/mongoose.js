import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const connectDB = async (retries = 5, delay = 5000) => {
  while (retries) {
    try {
      await mongoose.connect(process.env.MONGODB_ADDRESS);
      console.log('MongoDB Connected');
      return;
    } catch (error) {
      console.error('MongoDB connection error:', error);
      retries -= 1;
      console.log(`Retries left: ${retries}`);
      if (!retries) throw new Error('Could not connect to MongoDB');
      await new Promise((res) => setTimeout(res, delay));
    }
  }
};
