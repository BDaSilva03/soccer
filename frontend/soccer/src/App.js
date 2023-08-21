import React, { useEffect, useState } from 'react';
import './App.css';
import GuessPlayer from './components/GuessPlayer';
import Register from './components/Register';
import Login from './components/Login';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [correctGuesses, setCorrectGuesses] = useState(0);

    // On component mount, check if a token exists in local storage to determine authentication status
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsAuthenticated(true);
        }
    }, []);

    return (
        <Router>
            <div className="App">
                <h1>Guess the Soccer Player</h1>
                {isAuthenticated && <Navbar correctGuesses={correctGuesses} onLogout={() => {
                setIsAuthenticated(false);
                setCorrectGuesses(0);  // Reset the correctGuesses state when logging out
                }} />}
                <Routes>
                    <Route path="/login" element={isAuthenticated ? <Navigate to="/game" /> : <Login onLogin={() => setIsAuthenticated(true)} />} />
                    <Route path="/register" element={isAuthenticated ? <Navigate to="/game" /> : <Register onRegistered={() => setIsAuthenticated(true)} />} />
                    <Route path="/game" element={isAuthenticated ? <GuessPlayer setCorrectGuesses={setCorrectGuesses} /> : <Navigate to="/login" />} />
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
