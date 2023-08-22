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
  const [hintMessage, setHintMessage] = useState(''); // Hint message for the user

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
      if (response.data.userId === 1) {
        console.log(response.data);
      }
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

  const generateHint = () => {
    if (!player) return;

    const hintOptions = [];
    if (!showPhoto) hintOptions.push('photo');
    if (player.height) hintOptions.push('height');

    const randomHint = hintOptions[Math.floor(Math.random() * hintOptions.length)];
    switch (randomHint) {
        case 'photo':
            setShowPhoto(true);
            break;
        case 'height':
            setHintMessage(`The player's height is ${player.height}.`);
            break;
        default:
            setHintMessage(`The player's last name starts with "${player.lastname.charAt(0)}".`);
            break;
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
    <div className="game-container d-flex">
      <div className="player-info-container">
        {player ? (
          <div className="d-flex flex-column align-items-center"> {/* Wrap everything in this div */}
            <PlayerInfo player={player} />
            <input 
                    type="text" 
                    className="form-control mb-2"
                    value={guess} 
                    onChange={(e) => setGuess(e.target.value)}
                    placeholder="Guess the player's name"
                />
                <div className="d-flex align-items-center mb-2 justify-content-center"> {/* Flex container for buttons */}
                  {!correct && <button className="btn btn-primary mr-2" id="SubmitGame" onClick={handleGuess}>Submit</button>}
                  {correct && <button className="btn btn-success mr-2" onClick={fetchNewPlayer}>Start New Game</button>}
                  {!correct && <button className="btn btn-secondary" onClick={generateHint}>Hint</button>}
                </div>
            <p>{hintMessage}</p>
            <p style={{ color: messageColor }}>{message}</p>
            {showPhoto && !correct && <img src={player.photo} alt="Player" />}
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
      <div className="global-scores-container mr-4">
        <GlobalScores />
      </div>
    </div>
  );
}

export default GuessPlayer;
