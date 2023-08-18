// This script populates the database with player data fetched from an external API.

// Load environment variables
require('dotenv').config();

// Import necessary libraries
const axios = require('axios');
const mysql = require('mysql2/promise');

// Set up the database connection
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// API configuration
const API_BASE_URL = 'https://api-football-v1.p.rapidapi.com/v3';
const HEADERS = {
    'x-rapidapi-key': process.env.FOOTBALL_DATA_API_KEY
};

// Test the database connection
async function testDbConnection() {
    try {
        const [results] = await db.query('SELECT 1');
        console.log('Database connection successful:', results);
    } catch (error) {
        console.error('Database connection error:', error);
    }
}

// Function to call the external API
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

// Recursive function to fetch players from the API
async function fetchPlayers(league = 140, season = 2023, page = 1, allPlayers = []) {
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

// Save the fetched players to the database
async function savePlayersToDb(players) {
    for (let playerData of players) {
        const player = playerData.player;
        const team = playerData.statistics[0].team;

        try {
            // Insert player into players table
            const [playerResults] = await db.query(`
                INSERT INTO players (id, name, firstname, lastname, age, birth_date, birth_place, birth_country, nationality, height, weight, injured, photo) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) 
                ON DUPLICATE KEY UPDATE name=VALUES(name), firstname=VALUES(firstname), lastname=VALUES(lastname), age=VALUES(age), 
                birth_date=VALUES(birth_date), birth_place=VALUES(birth_place), birth_country=VALUES(birth_country), nationality=VALUES(nationality), 
                height=VALUES(height), weight=VALUES(weight), injured=VALUES(injured), photo=VALUES(photo)
            `, [
                player.id, player.name, player.firstname, player.lastname, player.age, player.birth.date, 
                player.birth.place, player.birth.country, player.nationality, player.height, player.weight, 
                player.injured, player.photo
            ]);

            // Insert team into teams table
            const [teamResults] = await db.query(`
                INSERT INTO teams (id, name, logo) 
                VALUES (?, ?, ?) 
                ON DUPLICATE KEY UPDATE name=VALUES(name), logo=VALUES(logo)
            `, [team.id, team.name, team.logo]);

            // Insert relation into player_teams table
            await db.query('INSERT INTO player_teams (player_id, team_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE player_id=VALUES(player_id), team_id=VALUES(team_id)', [player.id, team.id]);

        } catch (err) {
            console.error('Error inserting data:', err);
        }
    }
}

// Main function to populate the database
async function populateDb() {
    await testDbConnection();

    // Fetch players and save them to the database
    const players = await fetchPlayers();
    await savePlayersToDb(players);

    console.log('Players saved successfully.');
    db.end();
}

// Run the main function
populateDb().catch(error => {
    console.error('Error:', error);
    db.end();
});
