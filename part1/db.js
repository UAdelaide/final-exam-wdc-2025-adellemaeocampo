require('dotenv').config();
const mysql = require('mysql2');

//would put in .env but couldnt create one
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password:'',
  database: 'DogWalkService'
});





