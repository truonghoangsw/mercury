import React, {useCallback, useEffect, useRef, useState} from 'react';
import {GAME_STATE} from '../../common/constants';
import TRex from './TRex';
import ws from '../../common/ws';
import storage from '../../common/storage';
import Winner from './Winner';
import Loser from './Loser';

function Game() {
  const runnerRef = useRef(null);
  const [gameState, setGameState] = useState(GAME_STATE.NOT_START);

  const onStartGame = useCallback(() => {
    if (runnerRef.current) {
      runnerRef.current.start();
      setGameState(GAME_STATE.PLAYING);
    }
  }, []);

  const onGameOver = useCallback((data) => {
    if (runnerRef.current) {
      runnerRef.current.gameOver(true);
    }
  }, []);

  const onThisGameOver = useCallback((data) => {
    const roomId = storage.getItem('roomId');
    const currentGameId = storage.getItem('currentGameId');
    const user = storage.getItem('user');
    setGameState(data?.isWinner ? GAME_STATE.WIN : GAME_STATE.LOSE);
    ws.invoke('GameOver', {roomId, currentGameId, userId: user?.PlayerId});
  }, []);

  useEffect(() => {
    const {Runner} = window;
    runnerRef.current = new Runner('.interstitial-wrapper', undefined, {
      onGameOver: onThisGameOver,
    });
  }, [onThisGameOver]);

  useEffect(() => {
    ws.on("StartGame", onStartGame);
    return () => {
      ws.off('StartGame', onStartGame);
    };
  }, [onStartGame]);

  useEffect(() => {
    ws.on("GameOver", onGameOver);
    return () => {
      ws.off('GameOver', onGameOver);
    };
  }, [onGameOver]);

  return (
    <div className="game-page">
      <TRex/>
      {
        gameState === GAME_STATE.WIN &&
        <Winner/>
      }
      {
        gameState === GAME_STATE.LOSE &&
        <Loser/>
      }
    </div>
  );
}

export default React.memo(Game);
