const express = require('express');
const router = express.Router();

// Social media overview
router.get('/overview', (req, res) => {
  try {
    const data = {
      twitter: { 
        mentions: 1247, 
        sentiment: 'negative', 
        trending: ['#TsunamiAlert', '#ChennaiCoast'] 
      },
      facebook: { 
        posts: 892, 
        sentiment: 'concerned', 
        engagement: 'high' 
      },
      youtube: { 
        videos: 156, 
        sentiment: 'informational', 
        views: 45600 
      }
    };
    
    console.log('Social overview requested');
    res.json(data);
  } catch (error) {
    console.error('Social overview error:', error);
    res.status(500).json({ error: 'Failed to get social data' });
  }
});

module.exports = router;
