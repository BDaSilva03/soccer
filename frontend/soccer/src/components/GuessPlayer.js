import React, { useState, useEffect } from 'react';
import PlayerInfo from './PlayerInfo';
import axios from 'axios';

function GuessPlayer() {
  const [player, setPlayer] = useState(null);
  const [guess, setGuess] = useState('');
  const [correct, setCorrect] = useState(false);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/randomPlayer');
        setPlayer(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleGuess = () => {
    if (player && guess.toLowerCase() === player.name.toLowerCase()) {
      setCorrect(true);
    }
  };

  return (
    <div>
      {player ? (
        <div>
          <PlayerInfo player={player} />
          <input 
            type="text" 
            value={guess} 
            onChange={(e) => setGuess(e.target.value)}
            placeholder="Guess the player's name"
          />
          <button onClick={handleGuess}>Submit</button>
          {correct && <p>Correct Guess!</p>}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default GuessPlayer;
