require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

console.log('Starting server...');

const app = express();

// Enhanced CORS configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Test route - IMPORTANT: Must be before other routes
app.get('/', (req, res) => {
  res.json({ message: 'INCOIS Ocean Hazard Platform API', status: 'running' });
});

app.get('/test', (req, res) => {
  res.json({ 
    message: 'Backend server is working!', 
    timestamp: new Date(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/oceanhazard')
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.log('❌ MongoDB error:', err.message));

// Import and use routes
try {
  const authRoutes = require('./routes/auth');
  const socialRoutes = require('./routes/social');
  
  app.use('/api/auth', authRoutes);
  app.use('/api/social', socialRoutes);
  
  console.log('✅ Routes loaded successfully');
} catch (error) {
  console.log('❌ Route loading error:', error.message);
}

// Catch-all error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🔗 Test URL: http://localhost:${PORT}/test`);
  console.log(`🔗 API Base: http://localhost:${PORT}/api`);
});
