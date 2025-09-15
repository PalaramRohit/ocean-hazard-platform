const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  type: String,
  message: String,
  regions: [String],
  issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Alert', alertSchema);
