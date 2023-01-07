import React, {useEffect} from 'react';
import TRex from './TRex';

function Game() {
  useEffect(() => {
  }, []);

  return (
    <div className="game-page">
      <TRex/>
    </div>
  )
}

export default React.memo(Game);
