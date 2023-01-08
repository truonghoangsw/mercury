import React, {useMemo} from 'react';

function GameResult({gameData, userId}) {
  const currentPlayer = useMemo(() => {
    if (!gameData?.players || !gameData.players[userId]) {
      return null;
    }
    return gameData.players[userId];
  }, [gameData, userId]);

  return (
    <div className="game-result">
      {
        currentPlayer &&
        <>
          <div>Win Sec: {currentPlayer?.winSet}</div>
          <div>Win Game: {currentPlayer?.pointInCurrentSet}</div>
        </>
      }
    </div>
  );
}

export default GameResult;
