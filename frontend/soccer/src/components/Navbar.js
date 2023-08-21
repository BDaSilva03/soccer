import React from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

function Navbar({ correctGuesses, onLogout }) {
    const navigate = useNavigate();
    const location = useLocation();

    const saveScore = async () => {
        if (correctGuesses > 0) {
            try {
                await axios.post('/saveScore', { score: correctGuesses }, {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token')
                    }
                });
            } catch (error) {
                console.error("Error saving score:", error);
            }
        }
    };

    const handleLogout = async () => {
        await saveScore();
        localStorage.removeItem('token');
        onLogout();
        navigate('/login');
    };

    return (
        <div className="correct-guesses">
            Correct guesses in a row: {correctGuesses}
            {location.pathname === "/profile" ? (
                <button onClick={() => navigate("/game")} style={{ marginLeft: '20px' }}>Back to Game</button>
            ) : (
                <button onClick={() => navigate("/profile")} style={{ marginLeft: '20px' }}>Profile</button>
            )}
            <button onClick={handleLogout} style={{ marginLeft: '20px' }}>Logout</button>
        </div>
    );
}

export default Navbar;

