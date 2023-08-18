import React, { useState } from 'react';
import './App.css';
import GuessPlayer from './components/GuessPlayer';
import Register from './components/Register';
import Login from './components/Login';

// The main App component that handles the overall game and authentication logic
function App() {
    // State variables to manage authentication and UI
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Is the user currently authenticated?
    const [showLogin, setShowLogin] = useState(true);  // Should the Login or Register component be shown?

    // Mark the user as authenticated
    const handleAuthentication = () => {
        setIsAuthenticated(true);
    };

    // Toggle between showing the Login and Register components
    const toggleLoginRegister = () => {
        setShowLogin(prev => !prev);
    };

    // Render the main app UI
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
