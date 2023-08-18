import React from 'react';
import './App.css';
import GuessPlayer from './components/GuessPlayer';
import Register from './components/Register'; // Import Register
import Login from './components/Login'; // Import Login

function App() {
    return (
        <div className="App">
            <h1>Guess the Soccer Player</h1>
            <Register />
            <Login />
            <GuessPlayer />
        </div>
    );
}

export default App;
