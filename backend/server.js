require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = 3001;

// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

app.use(cors());

app.get('/randomPlayer', (req, res) => {
    // Fetch a random player and their teams from the database
    // Respond with the data
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
