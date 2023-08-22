import React, { useEffect, useState } from 'react';
import './App.css';
import GuessPlayer from './components/GuessPlayer';
import Register from './components/Register';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Profile from './components/Profile';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';

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
            <div className="App container mt-4"> 
                <DynamicTitle isAuthenticated={isAuthenticated} />
                {isAuthenticated && <Navbar correctGuesses={correctGuesses} onLogout={() => {
                setIsAuthenticated(false);
                setCorrectGuesses(0);  // Reset the correctGuesses state when logging out
                }} />}
                <Routes>
                    <Route path="/login" element={isAuthenticated ? <Navigate to="/game" /> : <Login onLogin={() => setIsAuthenticated(true)} />} />
                    <Route path="/register" element={isAuthenticated ? <Navigate to="/game" /> : <Register onRegistered={() => setIsAuthenticated(true)} />} />
                    <Route path="/game" element={isAuthenticated ? <GuessPlayer setCorrectGuesses={setCorrectGuesses} /> : <Navigate to="/login" />} />
                    <Route path="*" element={<Navigate to="/login" />} />
                    <Route path="/profile" element={<Profile />} />
                </Routes>
            </div>
        </Router>
    );
}

// This component will be responsible for displaying the dynamic title.
function DynamicTitle({ isAuthenticated }) {
    const location = useLocation();

    // Determine the header title based on the current route
    const getTitle = () => {
        if (location.pathname === "/login") return "Login";
        if (location.pathname === "/register") return "Register";
        if (location.pathname.startsWith("/profile")) return "Profile";
        return "Guess the Soccer Player";
    };

    return <h1 className="text-center mb-4">{getTitle()}</h1>;
}

export default App;
