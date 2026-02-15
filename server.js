const express = require('express');
const cors = require('cors'); // <-- add this

const config = require('./config');
const { connectDatabase } = require('./config/database');
const routes = require('./routes');
const requestLogger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// ✅ CORS middleware - allow your frontend to access backend
app.use(cors({
  origin: 'http://localhost:5173', // your Vite frontend URL
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // if you use cookies
}));

// API routes
app.use('/api', routes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// Centralized error handler (must be last)
app.use(errorHandler);

// Start server
const startServer = async () => {
  await connectDatabase();

  app.listen(config.port, () => {
    console.log(`Server running in ${config.env} mode on port ${config.port}`);
  });
};

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});