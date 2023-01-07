import React from 'react';
import TRex from './TRex';

function Game() {
  return (
    <div className="game-page">
      <TRex/>
    </div>
  )
}

export default React.memo(Game);
