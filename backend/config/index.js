/**
 * Application configuration
 * Loads and exports environment variables
 */

require('dotenv').config();

const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/animal-health-tracker',
  jwt: {
    secret: process.env.JWT_SECRET || 'change-me-in-production',
    expire: process.env.JWT_EXPIRE || '7d',
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
  upload: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
  },
};

module.exports = config;
