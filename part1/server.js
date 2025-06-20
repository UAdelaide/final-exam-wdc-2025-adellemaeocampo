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
    res.status(500).json({error: 'Failed to fetch dog route'});
  }
});

app.get('/api/walkrequests/open', async(req,res) => {
  try{
    const[openRequests] = await db.query (
      "SELECT * FROM WalkRequests WHERE status = 'open'"
    );
    res.json(openRequests);
  } catch (err) {
    console.error('Error fetching walk requests for route /api/walkrequests/open:', err);
    res.status(500).json({error: 'Failed to fetch walkrequest route'});
  }
});

app.get()

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


