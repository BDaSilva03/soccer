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

const API_BASE_URL = 'https://api-football-v1.p.rapidapi.com/v3';
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

async function callApi(endpoint, params) {
    const url = `${API_BASE_URL}/${endpoint}`;
    try {
        const response = await axios.get(url, { headers: HEADERS, params: params });
        return response.data;
    } catch (error) {
        console.error('Error calling API:', error);
        return null;
    }
}

async function fetchPlayers(league = 39, season = 2023, page = 1, allPlayers = []) {
    const playersResponse = await callApi('players', { league: league, season: season, page: page });

    if (playersResponse) {
        allPlayers.push(...playersResponse.response);
        
        if (playersResponse.paging.current < playersResponse.paging.total) {
            if (page % 2 === 1) {
                await new Promise(resolve => setTimeout(resolve, 1000)); // Sleep for 1 second
            }
            return await fetchPlayers(league, season, page + 1, allPlayers);
        }
    }

    return allPlayers;
}

async function savePlayersToDb(players) {
    for (let playerData of players) {
        const player = playerData.player;
        const team = playerData.statistics[0].team;

        try {
            // Insert player into players table
            const [playerResults] = await db.query('INSERT INTO players (name) VALUES (?) ON DUPLICATE KEY UPDATE name=name', [`${player.firstname} ${player.lastname}`]);
            const playerId = playerResults.insertId;

            // Insert team into teams table
            const [teamResults] = await db.query('INSERT INTO teams (name) VALUES (?) ON DUPLICATE KEY UPDATE name=name', [team.name]);
            const teamId = teamResults.insertId;

            // Insert relation into player_teams table
            await db.query('INSERT INTO player_teams (player_id, team_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE player_id=player_id, team_id=team_id', [playerId, teamId]);
        } catch (err) {
            console.error('Error inserting data:', err);
        }
    }
}

async function populateDb() {
    await testDbConnection();

    // Fetch and print all the teams (optional)
    const teams = await callApi('teams', { league: 39, season: 2023 });
    console.log(teams);

    // Fetch players and save them to the database
    const players = await fetchPlayers();
    await savePlayersToDb(players);

    console.log('Players saved successfully.');
    db.end();
}

populateDb().catch(error => {
    console.error('Error:', error);
    db.end();
});
