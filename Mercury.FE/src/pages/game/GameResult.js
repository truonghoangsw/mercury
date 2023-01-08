import React, {useMemo} from 'react';

function GameResult({gameData, userId}) {
  const users = useMemo(() => {
    return Object.keys(gameData?.players || {}).map(key => ({
      userId: key,
      ...gameData.players[key],
      ...gameData.players[key]?.player,
    }));
  }, []);

  const currentPlayer = useMemo(() => {
    return users.find(user => user.userId === userId);
  }, [users, userId]);

  const secondPlayer = useMemo(() => {
    return users.find(user => user.userId !== userId);
  }, [users, userId]);

  return (
    <div className="game-result">
      {
        currentPlayer &&
        <div className="first-user">
          <div className="player-name">You</div>
          <div>Win set: {currentPlayer?.winSet}</div>
          <div>Win game: {currentPlayer?.pointInCurrentSet}</div>
        </div>
      }
      {
        secondPlayer &&
        <div className="second-user">
          <div className="player-name">{secondPlayer?.name}</div>
          <div>Win set: {secondPlayer?.winSet}</div>
          <div>Win game: {secondPlayer?.pointInCurrentSet}</div>
        </div>
      }
    </div>
  );
}

export default GameResult;
