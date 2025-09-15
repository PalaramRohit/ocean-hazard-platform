const express = require('express');
const Alert = require('../models/Alert');
const auth = require('../middleware/auth');  // Import auth middleware
const router = express.Router();

// Role-protected route - only officials can create alerts
router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'official') {
    return res.status(403).json({ error: 'Access denied. Officials only.' });
  }
  
  try {
    const alert = new Alert({ ...req.body, issuedBy: req.user.id });
    await alert.save();
    res.status(201).json(alert);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Protected route - authenticated users can view alerts
router.get('/', auth, async (req, res) => {
  try {
    const alerts = await Alert.find({ active: true });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Role-protected route - only officials can deactivate alerts
router.patch('/:id/deactivate', auth, async (req, res) => {
  if (req.user.role !== 'official') {
    return res.status(403).json({ error: 'Access denied. Officials only.' });
  }
  
  try {
    const alert = await Alert.findByIdAndUpdate(
      req.params.id, 
      { active: false }, 
      { new: true }
    );
    res.json(alert);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
