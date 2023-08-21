import React, { useState, useEffect } from 'react';
import PlayerInfo from './PlayerInfo';
import GlobalScores from './GlobalScores';
import { normalizeText } from './NormalizeText';
import axios from 'axios';

// This component handles the gameplay of "Guess the Player."
function GuessPlayer({ correctGuesses, setCorrectGuesses }) {
  // State variables to manage the game's logic and UI
  const [player, setPlayer] = useState(null);  // The current player to guess
  const [guess, setGuess] = useState('');      // The user's current guess
  const [correct, setCorrect] = useState(false); // Is the current guess correct?
  const [message, setMessage] = useState('');  // Feedback message for the user
  const [messageColor, setMessageColor] = useState(''); // Color of the feedback message (red or green)
  const [showPhoto, setShowPhoto] = useState(false); // Should the player's photo be revealed?

  // When the component mounts, fetch a new player
  useEffect(() => {
    fetchNewPlayer();
  }, []);

  // Fetch a new random player from the server
  const fetchNewPlayer = async () => {
    try {
      const response = await axios.get('/randomPlayer');
      setPlayer(response.data);
      setGuess('');
      setCorrect(false);
      setMessage('');
      setShowPhoto(false);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const saveScore = async () => {
    if (correctGuesses > 0) { // Only save if score is greater than 0
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

  // Handle the guess submission
  const handleGuess = async () => {
    if (player) {
      const normalizedGuess = normalizeText(guess);
      const lastNames = player.lastname.split(' ').map(name => normalizeText(name));
      const fullName = normalizeText(player.name);

      if (normalizedGuess === fullName || lastNames.includes(normalizedGuess)) {
        setCorrect(true);
        setMessage('Correct Guess!');
        setMessageColor('green');
        setCorrectGuesses(prev => prev + 1);
      } else {
        await saveScore(); // Save the score before resetting
        setMessage('Incorrect! Try again.');
        setMessageColor('red');
        setShowPhoto(true);
        setCorrectGuesses(0); // Reset correct guesses counter
      }
    }
  };

  // Render the game UI
  return (
    <div>
      <div>
      <GlobalScores />
    </div>
      {/*<div className="correct-guesses">Correct guesses in a row: {correctGuesses}</div>*/}
      {player ? (
        <div>
          <PlayerInfo player={player} />
          <input 
            type="text" 
            value={guess} 
            onChange={(e) => setGuess(e.target.value)}
            placeholder="Guess the player's name"
          />
          {!correct && <button onClick={handleGuess}>Submit</button>}
          {correct && <button onClick={fetchNewPlayer}>Start New Game</button>}
          <p style={{ color: messageColor }}>{message}</p>
          {showPhoto && !correct && <img src={player.photo} alt="Player" />}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default GuessPlayer;
