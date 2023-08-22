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
        <div className="correct-guesses d-flex justify-content-between align-items-center">
            <span>Correct guesses in a row: {correctGuesses}</span>
            <div className="ml-auto">
                {location.pathname === "/profile" ? (
                    <button onClick={() => navigate("/game")} className="btn btn-primary mr-4" id="Profile">Back to Game</button>
                ) : (
                    <button onClick={() => navigate("/profile")} className="btn btn-primary mr-4" id="Profile">Profile</button>
                )}
                <button onClick={handleLogout} className="btn btn-danger">Logout</button>
            </div>
        </div>
    );
    
}

export default Navbar;

