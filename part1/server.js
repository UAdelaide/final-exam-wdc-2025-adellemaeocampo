const express = require('express');
const mysql = require('mysql2/promise');
const db = require('./db');
const app = express();

const PORT=8080;

(async () => {
  try {
    const connection = await mysql.createConnection({
          host: 'localhost',
          user: 'root',
          password: ''
        });

        // Create the database if it doesn't exist
        await connection.query('CREATE DATABASE IF NOT EXISTS testdb');
        await connection.end();

        // Now connect to the created database
        db = await mysql.createConnection({
          host: 'localhost',
          user: 'root',
          password: '',
          database: 'testdb'
        });




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
