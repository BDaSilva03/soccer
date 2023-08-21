require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise'); // Use promise version
const cors = require('cors');

const app = express();
const port = 3001;

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');

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

app.use(cors({
    origin: "http://localhost:3000"
}));

// Middleware to verify JWT token and authenticate the user
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) return res.sendStatus(401); // if no token, send forbidden

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next(); // pass the execution off to whatever request the client intended
    });
}

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

app.use(express.json());

app.post('/register', [
    check('username').isAlphanumeric().withMessage('Username should be alphanumeric'),
    check('password').isLength({ min: 6 }).withMessage('Password should be at least 6 characters long'),
    check('email').isEmail().withMessage('Please provide a valid email address')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const connection = await pool.getConnection();

        await connection.query('INSERT INTO users (username, password, email) VALUES (?, ?, ?)', [req.body.username, hashedPassword, req.body.email]);

        connection.release();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/login', async (req, res) => {
    try {
        const connection = await pool.getConnection();

        const [users] = await connection.query('SELECT * FROM users WHERE username = ?', [req.body.username]);

        if (users.length === 0) {
            return res.status(400).json({ error: 'Invalid login details' });
        }

        const user = users[0];

        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ error: 'Invalid login details' });
        }

        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });

        connection.release();
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/saveScore', authenticateToken, async (req, res) => {
    try {
        const connection = await pool.getConnection();
        await connection.query('INSERT INTO scores (user_id, score) VALUES (?, ?)', [req.user.id, req.body.score]);
        connection.release();
        res.json({ message: 'Score saved successfully' });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/profile', authenticateToken, async (req, res) => {
    try {
        const connection = await pool.getConnection();
        
        // Fetch recent 5 scores
        const [recentScores] = await connection.query('SELECT score, date FROM scores WHERE user_id = ? ORDER BY date DESC LIMIT 5', [req.user.id]);
        
        // Fetch top 5 scores
        const [topScores] = await connection.query('SELECT score, date FROM scores WHERE user_id = ? ORDER BY score DESC LIMIT 5', [req.user.id]);

        connection.release();

        res.json({ recentScores, topScores });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/globalScores', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        
        const query = `
            SELECT u.username, s.score, s.date 
            FROM scores s
            JOIN users u ON s.user_id = u.id
            ORDER BY s.score DESC
            LIMIT 5;
        `;

        const [results] = await connection.query(query);
        
        connection.release();

        res.json(results);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
