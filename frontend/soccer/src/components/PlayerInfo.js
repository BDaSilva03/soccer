import React from 'react';
import { normalizedCountryToCode } from './countryCodes';
import { normalizeText } from './NormalizeText';

// The PlayerInfo component displays basic information about a given soccer player.
function PlayerInfo({ player }) {
  // Convert the player's nationality to a country code
  const countryCode = normalizedCountryToCode[normalizeText(player.nationality)] || 'unknown';
  
  // Determine the flag URL based on the country code
  let flagURL;
  if (['gb-eng', 'ie', 'gb-sct', 'gb-wls', 'gb-nir'].includes(countryCode.toLowerCase())) {
    flagURL = `https://flagcdn.com/64x48/${countryCode.toLowerCase()}.png`;
  } else {
    flagURL = `https://flagsapi.com/${countryCode.toUpperCase()}/flat/64.png`;
  }

  // Render the player info
  return (
    <div className="player-info-content">
      <p>Age: {player.age}</p>
      <img src={flagURL} alt={player.nationality} title={player.nationality} />
      <img src={player.team_logo} alt={player.team_name} title={player.team_name} />
    </div>
  );
}

export default PlayerInfo;
