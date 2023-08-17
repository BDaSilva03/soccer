require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise'); // Use promise version
const cors = require('cors');

const app = express();
const port = 3001;

// Create a connection pool instead of a single connection
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

app.use(cors());

app.get('/randomPlayer', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        
        const query = `
            SELECT 
                players.*, 
                teams.name AS team_name, teams.logo AS team_logo 
            FROM players
            JOIN player_teams ON players.id = player_teams.player_id
            JOIN teams ON player_teams.team_id = teams.id
            ORDER BY RAND()
            LIMIT 1;
        `;

        const [results] = await connection.query(query);
        
        connection.release();

        if (results.length === 0) {
            return res.status(404).json({ error: 'No players found' });
        }

        res.json(results[0]);
    } catch (error) {
        console.error("Database query error:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
