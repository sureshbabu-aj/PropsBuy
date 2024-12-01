require('dotenv').config();
const http = require('http');
const express = require('express');
const axios = require('axios');
const mysql = require('mysql2');
const authRoutes = require('./routes/auth');
const onloadImagesRoute = require('./routes/onload_images');
const video_landing     = require('./routes/video_landing');
const video_props       = require('./routes/video_props');
const props_details     = require('./routes/props_details');


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// MySQL database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

db.connect((err) => {
  if (err) throw err;
  console.log('MySQL connected...');
});

// Attach the database connection to request object
app.use((req, res, next) => {
  req.db = db;
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/onload', onloadImagesRoute);
app.use('/api/pb', video_landing);
app.use('/api/pb', video_props);
app.use('/api/pb', props_details);




app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});






// Function to get public IP
/*
function getPublicIP(callback) {
    http.get({ host: 'checkip.amazonaws.com', port: 80, path: '/' }, function (res) {
        res.on('data', function (ip) {
            callback(ip.toString().trim());
        });
    });
}
*/
/*

// Function to fetch public IP
const getPublicIP = async () => {
  try {
    const { data } = await axios.get('https://api.ipify.org?format=json');
    return data.ip;
  } catch (error) {
    console.error('Could not fetch public IP:', error);
    return null;
  }
};


// Start server

const HOST = process.env.HOST || '0.0.0.0'; // Default to all interfaces
app.listen(PORT, HOST, async () => {
  if (HOST === '0.0.0.0') {
    console.log(`Server running at http://localhost:${PORT}`);
    const publicIP = await getPublicIP();
    if (publicIP) {
      console.log(`Server also accessible at http://${publicIP}:${PORT}`);
    }
  } else {
    console.log(`Server running at http://${HOST}:${PORT}`);
  }
});
*/



/*
app.listen(PORT, '0.0.0.0', () => {
   getPublicIP((publicIP) => {
        console.log(`Server running at http://${publicIP}:${PORT}`);
    });
});
*/

