import React from 'react';
import { useNavigate } from 'react-router-dom';

function Navbar({ correctGuesses, onLogout }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        onLogout();
        navigate('/login');
    };

    return (
        <div className="correct-guesses">
            Correct guesses in a row: {correctGuesses}
            <button onClick={handleLogout} style={{ marginLeft: '20px' }}>Logout</button>
        </div>
    );
}

export default Navbar;
