const express = require('express');
const db = require('./db');
const app = express();

const PORT=8080;

(async () => {
  try {
    await db.execute(`
      CREATE TABLE IF NOT EXISTS Users (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('owner', 'walker') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    const [rows] = await db.execute('SELECT COUNT(*) AS count FROM Users');
    if (rows[0].count === 0) {
      await db.execute(`
        INSERT INTO Users(username, email, password_hash, role)
        VALUES ('testUser', 'test@tester.com', 'tester123!', 'owner');
      `);
    }
  } catch (err) {
    console.error('Error setting up database. Ensure Mysql is running: service mysql start', err);
  }
})();

app.get('/api/dogs', async (req,res) => {
  try {
    const [dogs] = await db.query('SELECT * FROM Dogs');
    res.json(dogs);
  } catch (err) {
    console.error('Error fetching dogs for route /api/dogs:', err);
    res.status(500).json({error: 'Failed to fetch dogs through /api/dogs route'});
  }
});

app.get('/api/walkrequests/open', async(req,res) => {
  try{
    const[openRequests] = await db.query (
      ` SELECT
        wr.request_id,
        d.name AS dog_name,
        wr.requested_time,
        wr.duration_minutes,
        wr.location,
        u.username AS owner_username
      FROM WalkRequests wr
      JOIN Dogs d ON wr.dog_id = d.dog_id
      JOIN Users u ON d.owner_id = u.user_id
      WHERE wr.status = 'open'`
    );
    res.json(openRequests);
  } catch (err) {
    res.status(500).json({error: 'Failed to fetch walkrequests through /api/walkrequests/open route'});
  }
});

app.get('/api/walkers/summary', async(req, res) => {
  try {
    const [walkerSummary] = await db.query (
      `SELECT
      u.username AS walker_username,
      COUNT(r.rating_id) AS total_ratings,
      ROUND(AVG(r.rating), 1) AS average_rating,
      COUNT(DISTINCT r.request_id) AS completed_walks
      FROM Users u
      LEFT JOIN WalkRatings r ON u.user_id = r.walker_id
      WHERE u.role = 'walker'
      GROUP BY u.user_id`
    );
    res.json(walkerSummary);
  } catch (err) {
    res.status(500).json({error: 'Failed to fetch walkers summary through /api/walkers/summary route'});
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


