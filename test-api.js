// Simple test script to check API connectivity
const fetch = require('node-fetch');

async function testLogin() {
  try {
    console.log('Testing login endpoint...');
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'testuser',
        password: 'test123',
        role: 'official'
      }),
    });
    
    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', data);
    
    if (!response.ok) {
      console.error('Login failed:', data.message || 'Unknown error');
      return;
    }
    
    console.log('Login successful!');
    console.log('JWT Token:', data.token);
    
  } catch (error) {
    console.error('Error during login test:', error);
  }
}

testLogin();
