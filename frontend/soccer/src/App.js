import React, { useState } from 'react';
import './App.css';
import GuessPlayer from './components/GuessPlayer';
import Register from './components/Register';
import Login from './components/Login';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [showLogin, setShowLogin] = useState(true);

    const handleAuthentication = () => {
        setIsAuthenticated(true);
    };

    const toggleLoginRegister = () => {
        setShowLogin(prev => !prev);
    };

    return (
        <div className="App">
            <h1>Guess the Soccer Player</h1>

            {!isAuthenticated ? (
                <>
                    {showLogin ? (
                        <Login onLogin={handleAuthentication} onSwitch={toggleLoginRegister} />
                    ) : (
                        <Register onRegistered={toggleLoginRegister} />
                    )}
                </>
            ) : (
                <GuessPlayer />
            )}
        </div>
    );
}

export default App;
