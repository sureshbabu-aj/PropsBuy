// routes/props_details.js

const express = require('express');
const router = express.Router();


// Route to fetch all Props Details for the given props id
router.get('/PBPropsdetail', async (req, res) => {
    const {email,video_id,props_id,props_index} = req.body;
    // SQL Query

const video_query = `
    SELECT 
    video_id, video_name, video_url, video_thumbnail, video_duration, video_display, container_id from pb_video_master_tbl 
    WHERE video_id = ? ;
    `;    


const props_query = `
 SELECT
 PMP.props_id, PMP.props_sub_id, PMP.props_cat, PMP.props_display_status, PMP.props_name, PMP.props_price, PMP.props_image_url, PMP.propsdisplayType, PMP.props_seller, PMP.props_material, PMP.props_color, PMP.props_desc, PMP.props_content_desc,
  JSON_ARRAYAGG(
    JSON_OBJECT('props_id', PMC.props_id ,
             'props_sub_id', PMC.props_sub_id ,
             'props_cat', PMC.props_cat ,
             'props_display_status', PMC.props_display_status ,
             'props_name', PMC.props_name ,
		     'props_price', PMC.props_price ,
             'props_price', PMC.props_price ,
             'props_image_url', PMC.props_image_url ,
		     'propsdisplayType', PMC.propsdisplayType ,
             'props_seller', PMC.props_seller ,
             'props_material', PMC.props_material ,
             'props_color', PMC.props_color ,
             'props_desc', PMC.props_desc ,                    
             'props_content_desc',PMC.props_content_desc ) 
  ) AS props_list
    
 FROM pb_product_master_tbl PMP
 INNER JOIN pb_product_master_tbl PMC ON PMP.props_id = PMC.props_id
 WHERE PMP.props_id = ? AND PMP.props_sub_id = ?
GROUP BY PMP.props_id, PMP.props_sub_id, PMP.props_cat, PMP.props_display_status, PMP.props_name, PMP.props_price, PMP.props_image_url, PMP.propsdisplayType, PMP.props_seller, PMP.props_material, PMP.props_color, PMP.props_desc, PMP.props_content_desc;
`;
    
    req.db.query(video_query, [video_id], async (err, result1) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ msg: 'Database error'+err.msg });
          }
        
        req.db.query(props_query, [props_id,props_index], async (err, result2) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ msg: 'Database error'+err.msg });
              }
            
            const combinedResult = {
                video_details: result1,
                props_details: result2
            };
            
            res.json(combinedResult);  // Send the combined result as JSON
        });
    });

  });
  



module.exports = router;