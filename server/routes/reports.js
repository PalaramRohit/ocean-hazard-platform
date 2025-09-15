const express = require('express');
const Report = require('../models/Report');
const auth = require('../middleware/auth');  // Import auth middleware
const router = express.Router();

// Protected route - any authenticated user can submit reports
router.post('/', auth, async (req, res) => {
  try {
    const report = new Report({ ...req.body, reporter: req.user.id });
    await report.save();
    res.status(201).json(report);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Protected route - any authenticated user can view reports
router.get('/', auth, async (req, res) => {
  try {
    const reports = await Report.find().populate('reporter', 'username role');
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Role-protected route - only officials can verify reports
router.patch('/:id/verify', auth, async (req, res) => {
  if (req.user.role !== 'official') {
    return res.status(403).json({ error: 'Access denied. Officials only.' });
  }
  
  try {
    const { status } = req.body;
    const report = await Report.findByIdAndUpdate(
      req.params.id, 
      { status }, 
      { new: true }
    );
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
