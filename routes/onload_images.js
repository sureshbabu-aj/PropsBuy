// routes/onload_images.js

const express = require('express');
const router = express.Router();

// Route to fetch all image URLs
router.get('/PBonload_images', async(req, res) => {
  req.db.query('SELECT image_url FROM pb_login_image_urls_tbl where image_active_status = 1', async(err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ msg: 'Database error' });
    }

    // Extract image URLs into an array
    const imageUrls = results.map(row => row.image_url);

    // Send image URLs as JSON response
    res.json({ imageUrls });
  });
});

module.exports = router;
