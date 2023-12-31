import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Profile() {
    const [recentScores, setRecentScores] = useState([]);
    const [topScores, setTopScores] = useState([]);

    useEffect(() => {
        async function fetchProfileData() {
            try {
                const response = await axios.get('/profile', {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token')
                    }
                });
                setRecentScores(response.data.recentScores);
                setTopScores(response.data.topScores);
            } catch (error) {
                console.error("Error fetching profile data:", error);
            }
        }

        fetchProfileData();
    }, []);

    return (
        <div className="game-container d-flex">
            <div className="recent-scores-container mr-4">
                <h2 className="mb-4">Recent Scores</h2>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Score</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentScores.map((score, index) => 
                            <tr key={index}>
                                <td>{score.score}</td>
                                <td>{formatDate(score.date)}</td>
                            </tr>
                         )}
                    </tbody>
                </table>
            </div>
            
            <div className="top-scores-container">
                <h2 className="mb-4">Top Scores</h2>
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Score</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topScores.map((score, index) => 
                            <tr key={index}>
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

export default Profile;
