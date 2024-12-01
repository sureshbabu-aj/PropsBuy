// routes/video_landing.js

const express = require('express');
const router = express.Router();


// Route to fetch all image URLs
router.get('/PBvideoslanding', async(req, res) => {
    
    // SQL Query
const query = `
SELECT 
 CT.container_id ,containe_cat,
  JSON_ARRAYAGG(
  JSON_OBJECT('video_id', video_id ,
             'video_name', video_name ,
             'video_url', video_url ,
             'video_thumbnail', video_thumbnail ,
             'video_duration', video_duration ,
             'video_display',video_display )
  ) AS video_list
FROM pb_container_tbl CT
INNER JOIN pb_video_master_tbl VM ON CT.container_id = VM.container_id   
GROUP BY CT.container_id;
`;
    

req.db.query(query, async(err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ msg: 'Database error' });
      }
  
   // Send JSON response
    res.json(results);

    });
  });
  
  module.exports = router;