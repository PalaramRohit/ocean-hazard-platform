const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  // Try to get token from Authorization header first, then from cookies
  let token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token && req.cookies) {
    token = req.cookies.token;
  }
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token verification error:', err.message);
    return res.status(401).json({ error: 'Invalid token.' });
  }
}

module.exports = auth;
