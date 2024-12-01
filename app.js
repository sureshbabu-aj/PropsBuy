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


const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
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

