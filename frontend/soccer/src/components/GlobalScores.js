import React, { useState, useEffect } from 'react';
import axios from 'axios';

//function to show the top 5 global scores
function GlobalScores(){
    const [globalScores, setGlobalScores] = useState([]);

    useEffect(() => {
        async function fetchGlobalScores() {
            try {
                const response = await axios.get('/globalScores');
                setGlobalScores(response.data);
            } catch (error) {
                console.error("Error fetching global scores:", error);
            }
        }

        fetchGlobalScores();
    }, []);

    return (
        <div className="global-scores-container">
            <h2>Top 5 Global Scores</h2>
            <div className="table-wrapper">
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Score</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {globalScores.map((score, index) => 
                        <tr key={index}>
                            <td>{score.username}</td>
                            <td>{score.score}</td>
                            <td>{formatDate(score.date)}</td>
                        </tr>
                     )}
                </tbody>
            </table>
            </div>
        </div>
    );
    
}

function formatDate(utcString) {
    const date = new Date(utcString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
}

export default GlobalScores;