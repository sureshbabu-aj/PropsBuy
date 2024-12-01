// routes/video_props.js

const express = require('express');
const router = express.Router();


// Route to fetch all Videoprops for the given video_id
router.get('/PBVideoprops', async (req, res) => {
    const {email,video_id} = req.body;
    // SQL Query
const query = `
SELECT 
 VM.video_id, video_name, video_url, video_thumbnail, video_duration, video_display, container_id,
  JSON_ARRAYAGG(
  JSON_OBJECT('event_id', event_id ,
             'video_name', video_name ,
             'event_start_time', event_start_time ,
             'event_end_time',event_end_time ) 
  ) AS video_event_bar
FROM  pb_video_master_tbl VM
INNER JOIN pb_event_master_tbl EM ON VM.video_id = EM.video_id 
WHERE  VM.video_id = ?  
GROUP BY  VM.video_id, 
    video_name, 
    video_url, 
    video_thumbnail, 
    video_duration, 
    video_display, 
    container_id  
ORDER BY VM.video_id,event_id;
`;
    

req.db.query(query, [video_id], async (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ msg: 'Database error' });
      }
  
   // Send JSON response
    res.json(results);

    });
  });
  



// Route to fetch all Event with props List for the given video_id
router.get('/PBAutovideoprops', async (req, res) => {
  const {email,video_id} = req.body;
  // SQL Query
const query = `
SELECT 
  EM.event_id, EM.event_start_time, EM.event_end_time,count(PM.props_id),
  JSON_ARRAYAGG(
    JSON_OBJECT('props_id', PM.props_id ,
             'props_sub_id', PM.props_sub_id ,
             'props_seq', PE.props_seq ,
		         'props_cat', PM.props_cat ,
             'props_display_status', PM.props_display_status ,
             'props_name', PM.props_name ,
		         'props_price', PM.props_price ,
             'props_price', PM.props_price ,
             'props_image_url', PM.props_image_url ,
		         'propsdisplayType', PM.propsdisplayType ,
             'props_seller', PM.props_seller ,
             'props_material', PM.props_material ,
             'props_color', PM.props_color ,
             'props_desc', PM.props_desc ,                    
             'props_content_desc',PM.props_content_desc ) 
  ) AS props_list
FROM pb_event_master_tbl EM INNER JOIN 
pb_product_event_tbl PE ON EM.event_id= PE.event_id   
INNER JOIN pb_product_master_tbl PM ON PM.props_id = PE.props_id 
WHERE EM.video_id = ?
GROUP BY  EM.event_id, EM.event_start_time, EM.event_end_time
ORDER BY  EM.event_id,PE.props_seq

`;
  

req.db.query(query, [video_id], async (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ msg: 'Database error' });
    }

 // Send JSON response
  res.json(results);

  });
});



// Route to fetch all Event with props List for the given video_id and event time
router.get('/PBgetvideoprops', async (req, res) => {
  const {email,video_id,event_time} = req.body;
  // SQL Query
const query = `
SELECT 
  EM.event_id, EM.event_start_time, EM.event_end_time,count(PM.props_id),
  JSON_ARRAYAGG(
    JSON_OBJECT('props_id', PM.props_id ,
             'props_sub_id', PM.props_sub_id ,
             'props_seq', PE.props_seq ,
		         'props_cat', PM.props_cat ,
             'props_display_status', PM.props_display_status ,
             'props_name', PM.props_name ,
		         'props_price', PM.props_price ,
             'props_price', PM.props_price ,
             'props_image_url', PM.props_image_url ,
		         'propsdisplayType', PM.propsdisplayType ,
             'props_seller', PM.props_seller ,
             'props_material', PM.props_material ,
             'props_color', PM.props_color ,
             'props_desc', PM.props_desc ,                    
             'props_content_desc',PM.props_content_desc ) 
  ) AS props_list
FROM pb_event_master_tbl EM INNER JOIN 
pb_product_event_tbl PE ON EM.event_id= PE.event_id   
INNER JOIN pb_product_master_tbl PM ON PM.props_id = PE.props_id 
WHERE EM.video_id = ?
AND ? BETWEEN EM.event_start_time AND EM.event_end_time
GROUP BY  EM.event_id, EM.event_start_time, EM.event_end_time
ORDER BY  EM.event_id,PE.props_seq

`;
  

req.db.query(query, [video_id,event_time], async (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ msg: 'Database error' });
    }

 // Send JSON response
  res.json(results);

  });
});

  
  module.exports = router;