const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const router = express.Router();

// Register route
router.post('/PBregister', async (req, res) => {
  const { username, password,email } = req.body;

  try {
    // Check if user already exists
    req.db.query('SELECT * FROM pb_user_tbl WHERE email = ?', [email], async (err, results) => {
      if (results.length > 0) {
        return res.status(400).json({ msg: 'User already exists' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Save the user to the database
      req.db.query(
        'INSERT INTO pb_user_tbl (email, password_hash) VALUES (?, ?)',
        [email, hashedPassword],
        (err, results) => {
          //if (err) return res.status(500).json({ msg: 'Database error' });
          if (err) {
            console.error('Error checking user existence:', err);
            return res.status(500).json({ msg: 'Database error', error: err });
          }
          res.status(201).json({ msg: 'User registered successfully' });
        }
      );
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// Login route
router.post('/PBlogin', (req, res) => {
  const { email, password } = req.body;


  try {
    // Find the user by username
    req.db.query('SELECT * FROM pb_user_tbl WHERE email = ?', [email], async (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ msg: 'Database error' });
      }

      // Check if the user exists
      if (results.length === 0) {
        return res.status(400).json({ msg: 'user not exists' });
      }

      const login = results[0];

      // Check if the user's password hash is defined
      if (!login.password_hash) {
        console.error('User password is undefined');
        return res.status(400).json({ msg: 'Invalid credentials - User password is undefined' });
      }

      // Compare the provided password with the stored hash
      const isMatch = await bcrypt.compare(password, login.password_hash);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid credentials -Password incorrect' });
      }

      // Generate a JWT token
      const token = jwt.sign({ id: login.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ token, email: login.email });


    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});


module.exports = router;
