import React, { useState, useEffect } from 'react';
import PlayerInfo from './PlayerInfo';
import { normalizeText } from './NormalizeText';
import axios from 'axios';

function GuessPlayer() {
  const [player, setPlayer] = useState(null);
  const [guess, setGuess] = useState('');
  const [correct, setCorrect] = useState(false);
  const [correctGuesses, setCorrectGuesses] = useState(0); // 1. Correct guesses counter
  const [message, setMessage] = useState('');
  const [messageColor, setMessageColor] = useState('');
  const [showPhoto, setShowPhoto] = useState(false);
  
  useEffect(() => {
    fetchNewPlayer();
  }, []);

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

  const handleGuess = () => {
    if (player) {
      const normalizedGuess = normalizeText(guess);
      const lastNames = player.lastname.split(' ').map(name => normalizeText(name));
      const fullName = normalizeText(player.name);

      if (normalizedGuess === fullName || lastNames.includes(normalizedGuess)) {
        setCorrect(true);
        setMessage('Correct Guess!');
        setMessageColor('green');
        setCorrectGuesses(prev => prev + 1); // Increment correct guesses
      } else {
        setMessage('Incorrect! Try again.');
        setMessageColor('red');
        setShowPhoto(true);
        setCorrectGuesses(0); // Reset correct guesses counter
      }
    }
  };

  return (
    <div>
      <div className="correct-guesses">Correct guesses in a row: {correctGuesses}</div>
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
