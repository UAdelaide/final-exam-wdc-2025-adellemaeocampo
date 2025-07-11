const express = require('express');
const router = express.Router();
const db = require('../models/db');

// GET all users (for admin/testing)
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT user_id, username, email, role FROM Users');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// POST a new user (simple signup)
router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const [result] = await db.query(`
      INSERT INTO Users (username, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `, [username, email, password, role]);

    res.status(201).json({ message: 'User registered', user_id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

//q15
router.get('/dogs', async(req,res) => {
  const {owner_id} = req.query;

  try{
    const[dogs] = await db.query (
      `SELECT dog_id, name FROM Dogs WHERE owner_id = ?`,
      [owner_id]
    );
    res.json(dogs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch dogs' });
  }
});

router.get('/me', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not logged in' });
  }
  res.json(req.session.user);
});


// POST login (dummy version)
router.post('/login', async (req, res) => {
  //changed to username instead of email
  const { username, password } = req.body;

  try {
    //changed to username instead of email
    const [rows] = await db.query(`
      SELECT user_id, username, role FROM Users
      WHERE username = ? AND password_hash = ?
    `, [username, password]);

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    //for session implementation
    req.session.user = rows[0];

    res.json({ message: 'Login successful', user: rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

//adding logout route
router.post('/logout', (req, res) => {
  //destroys session form login
  req.session.destroy(err => {
    if(err) {
      return res.status(500).json({ error: 'failed to logout'});
    }
    res.clearCookie('dogwalk.sid');
    res.status(200).json({ message: 'logout success!'});
  });
});

module.exports = router;