const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

async function createTestUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('test123', salt);
    
    // Create test user with all required fields
    const testUser = new User({
      name: 'Test User',
      username: 'testuser',
      password: hashedPassword,
      email: 'test@example.com',
      role: 'official',
      isActive: true
    });

    // Save user (password will be hashed by the pre-save hook)
    await testUser.save();
    console.log('Test user created successfully!');
    console.log('Username: testuser');
    console.log('Password: test123');
    console.log('Role: official');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating test user:', error);
    process.exit(1);
  }
}

createTestUser();
