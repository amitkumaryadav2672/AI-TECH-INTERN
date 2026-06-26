require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const leadRoutes = require('./routes/leadRoutes');
const trackRoutes = require('./routes/trackRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/leads', leadRoutes);
app.use('/api/track', trackRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Automated Lead Management System backend is online.' });
});

// Database connection
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lead_tracker';
console.log(`[Server] Attempting connection to MongoDB: ${mongoUri}`);

mongoose
  .connect(mongoUri)
  .then(() => {
    console.log('[Server] Successfully connected to MongoDB database.');
    
    // Start listening
    app.listen(PORT, () => {
      console.log(`[Server] Backend server running on port ${PORT}`);
      console.log(`[Server] Health status available at http://localhost:${PORT}/health`);
    });
  })
  .catch((error) => {
    console.error('[Server] Critical: Database connection failed:', error.message);
    process.exit(1);
  });
