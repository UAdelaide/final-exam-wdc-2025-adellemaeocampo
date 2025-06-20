
const mysql = require('mysql2');

//would put in .env but couldnt create one
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password:'',
  database: 'DogWalkService'
});

db.connect((err) => {
  if(err) {
    console.error('DB unable to connect:', err);
    process.exit(1);
  }
  console.log('SQL Connected');
});

export.mod


