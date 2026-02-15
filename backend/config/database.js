/**
 * MongoDB database connection with Mongoose
 * Handles connection lifecycle and error handling
 */

const mongoose = require('mongoose');
const config = require('./index');

const connectDatabase = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUri, {
      // Mongoose 6+ no longer needs these, but kept for older versions compatibility
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected');
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    process.exit(1);
  }
};

const disconnectDatabase = async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  } catch (error) {
    console.error('Error closing MongoDB connection:', error.message);
  }
};

module.exports = {
  connectDatabase,
  disconnectDatabase,
};
