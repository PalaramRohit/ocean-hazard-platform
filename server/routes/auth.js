const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Register new user - Updates Database
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    
    // Validation
    if (!username || !password || !role) {
      return res.status(400).json({ error: 'Username, password, and role are required' });
    }
    
    if (username.length < 3 || username.length > 20) {
      return res.status(400).json({ error: 'Username must be 3-20 characters long' });
    }
    
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }
    
    // Check if user already exists in database
    const existingUser = await User.findOne({ username: username.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ 
        error: 'Username already exists. Please choose a different username.' 
      });
    }
    
    // Create new user and save to database
    const user = new User({ 
      username: username.toLowerCase().trim(), 
      email: email ? email.toLowerCase().trim() : undefined, 
      password, 
      role 
    });
    
    await user.save(); // This updates the database
    console.log(`New user registered: ${username} with role: ${role}`);
    
    res.status(201).json({ 
      message: 'Account created successfully! Please login with your credentials.',
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Registration error:', err);
    if (err.code === 11000) {
      res.status(400).json({ error: 'Username already exists' });
    } else {
      res.status(400).json({ error: 'Registration failed. Please try again.' });
    }
  }
});

// Login user - Check Database
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Validation
    if (!username || !password) {
      return res.status(400).json({ 
        error: 'Please enter both username and password' 
      });
    }
    
    // Find user in database (case insensitive)
    const user = await User.findOne({ username: username.toLowerCase().trim() });
    
    if (!user) {
      return res.status(400).json({ 
        error: 'Login details invalid. Please check your username or sign up if you don\'t have an account.' 
      });
    }
    
    // Check password against database
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ 
        error: 'Login details invalid. Please check your password or sign up if you don\'t have an account.' 
      });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role, username: user.username }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );
    
    console.log(`User logged in: ${user.username} (${user.role})`);
    
    res.json({ 
      token, 
      role: user.role, 
      username: user.username,
      message: 'Login successful'
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error. Please try again.' });
  }
});

// Verify token
router.get('/verify', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user, valid: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all users (for testing - remove in production)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ users, count: users.length });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
