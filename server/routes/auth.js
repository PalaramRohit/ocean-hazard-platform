const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { name, username, email, password, role } = req.body;
    
    // Basic validation
    if (!name || !username || !email || !password || !role) {
      return res.status(400).json({ 
        success: false,
        message: 'All fields are required' 
      });
    }
    
    // Check if username already exists
    const existingUsername = await User.findOne({ 
      username: username.toLowerCase() 
    });
    
    if (existingUsername) {
      return res.status(400).json({ 
        success: false,
        message: 'Username already exists' 
      });
    }
    
    // Check if email already exists
    const existingEmail = await User.findOne({ 
      email: email.toLowerCase() 
    });
    
    if (existingEmail) {
      return res.status(400).json({ 
        success: false,
        message: 'Email already registered' 
      });
    }
    
    // Create new user
    const user = new User({
      name: name.trim(),
      username: username.toLowerCase().trim(),
      email: email.toLowerCase().trim(),
      password,
      role
    });
    
    // Save user to database
    await user.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Set HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });
    
    // Log the registration
    console.log(`New user registered: ${username} (${role})`);
    
    // Return success response
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role
      },
      token // For client-side storage if needed
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
