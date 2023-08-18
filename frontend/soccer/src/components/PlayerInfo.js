import React from 'react';

function PlayerInfo({ player }) {
  return (
    <div>
      <p>Age: {player.age}</p>
      <p>Nationality: {player.nationality}</p>
      <p>Team: {player.team_name}</p>
    </div>
  );
}

export default PlayerInfo;
