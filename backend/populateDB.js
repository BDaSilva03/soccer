require('dotenv').config();
const axios = require('axios');
const mysql = require('mysql2/promise');

// Database connection
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

const API_ENDPOINT = 'https://v3.football.api-sports.io/players';
const HEADERS = {
    'x-rapidapi-key': process.env.FOOTBALL_DATA_API_KEY
};

async function testDbConnection() {
    try {
        const [results] = await db.query('SELECT 1');
        console.log('Database connection successful:', results);
    } catch (error) {
        console.error('Database connection error:', error);
    }
}

async function fetchPlayers(page = 1, allPlayers = []) {
    try {
        const response = await axios.get(`${API_ENDPOINT}?league=39&season=2023&page=${page}`, { headers: HEADERS });
        const players = response.data.response;

        allPlayers.push(...players);

        if (response.data.paging.current < response.data.paging.total) {
            return await fetchPlayers(page + 1, allPlayers);
        } else {
            return allPlayers;
        }
    } catch (error) {
        console.error('Error fetching players:', error);
        return [];
    }
}

async function savePlayersToDb(players) {
    for (let playerData of players) {
        const player = playerData.player;
        const team = playerData.statistics[0].team;

        // Insert player into players table (if not exists)
        const [playerResults] = await db.query('INSERT IGNORE INTO players (name) VALUES (?)', [`${player.firstname} ${player.lastname}`]);
        const playerId = playerResults.insertId;

        // Insert team into teams table (if not exists)
        const [teamResults] = await db.query('INSERT IGNORE INTO teams (name) VALUES (?)', [team.name]);
        const teamId = teamResults.insertId;

        // Insert relation into player_teams table
        await db.query('INSERT INTO player_teams (player_id, team_id) VALUES (?, ?)', [playerId, teamId]);
    }
}

async function populatePlayers() {
    await testDbConnection(); // Test the DB connection first
    const players = await fetchPlayers();
    await savePlayersToDb(players);
    console.log('Players saved successfully.');
    db.end();
}

populatePlayers().catch(error => {
    console.error('Error:', error);
    db.end();
});
