const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  type: String,
  severity: String,
  location: {
    name: String,
    lat: Number,
    lng: Number
  },
  description: String,
  mediaUrls: [String],
  status: { type: String, default: 'pending' },
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', reportSchema);
