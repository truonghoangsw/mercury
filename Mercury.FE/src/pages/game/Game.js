import React, {useCallback, useEffect, useRef, useState} from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import {GAME_STATE} from '../../common/constants';
import TRex from './TRex';
import ws from '../../common/ws';
import storage from '../../common/storage';
import Winner from './Winner';
import Loser from './Loser';
import GameResult from './GameResult';
import {useNavigate} from 'react-router-dom';
import CountDown from './CountDown';
import EndGameModal from './EndGameModal';

function Game({user, gameData, setGameData}) {
  const runnerRef = useRef(null);
  const [gameState, setGameState] = useState(() => {
    return Object.values(gameData?.players || {}).some(x => x?.winSet || x?.pointInCurrentSet) ? GAME_STATE.RE_STARTING : GAME_STATE.NOT_START;
  });
  const navigate = useNavigate();

  const [openEndGameModal, setOpenEndGameModal] = React.useState(false);

  const handleClose = useCallback(() => {
    setOpenEndGameModal(false);
  }, []);

  const handleReplay = useCallback(() => {
    setOpenEndGameModal(false);
    const roomId = storage.getItem('roomId');
    const currentGameId = storage.getItem('currentGameId');
    ws.invoke('ReplayMatch', {
      roomId,
      currentGameId,
    });
  }, []);

  const userId = user?.playerId;

  const onGameOver = useCallback((data) => {
    if (data) {
      data = {
        ...data.room,
        winnerId: data.winnerId,
      };
      console.log(data);
      if (!data?.isEndMatch) {
        data.startTime = new Date().getTime();
      } else {
        setOpenEndGameModal(true);
      }
    }
    setGameData(prevData => ({
      ...prevData,
      ...data,
    }));
    if (runnerRef.current) {
      runnerRef.current.gameOver(true);
    }
  }, [userId]);

  const onThisGameOver = useCallback(() => {
    const roomId = storage.getItem('roomId');
    const currentGameId = storage.getItem('currentGameId');
    const user = storage.getItem('user');
    ws.invoke('GameOver', {roomId, currentGameId, userId: user?.playerId});
  }, []);

  useEffect(() => {
    const {Runner} = window;
    runnerRef.current = new Runner('.interstitial-wrapper', undefined, {
      onGameOver: onThisGameOver,
    });
  }, [onThisGameOver]);

  useEffect(() => {
    ws.on("GameOver", onGameOver);
    return () => {
      ws.off('GameOver', onGameOver);
    };
  }, [onGameOver]);

  useEffect(() => {
    setTimeout(() => {
      if (runnerRef.current) {
        runnerRef.current.start();
        setGameState(GAME_STATE.PLAYING);
      }
    }, 5000);
  }, []);

  useEffect(() => {
    if (!gameData) {
      navigate('/');
    }
  }, [navigate, gameData]);

  const onPlayerDisconnect = useCallback(() => {
    setOpenEndGameModal(true);
    // TODO
  }, []);

  useEffect(() => {
    ws.on("PlayerDisconnect", onPlayerDisconnect);
    return () => {
      ws.off('PlayerDisconnect', onPlayerDisconnect);
    };
  }, [onPlayerDisconnect]);

  const handleBack = () => {
    window.location.href = '/';
  };

  return (
    <React.Fragment>
      <CssBaseline/>
      <div className="game-page">
        <div className="toolbar">
          <button onClick={handleBack}>Back</button>
        </div>
        <div className="game-container">
          <GameResult gameData={gameData} userId={userId}/>
          {
            (gameState === GAME_STATE.NOT_START || gameState === GAME_STATE.RE_STARTING) &&
            <CountDown/>
          }
          <TRex/>
          {
            gameState === GAME_STATE.RE_STARTING && gameData?.winnerId === userId &&
            <Winner/>
          }
          {
            gameState === GAME_STATE.RE_STARTING && gameData?.winnerId !== userId &&
            <Loser/>
          }
        </div>
      </div>
      <EndGameModal
        userId={userId}
        gameData={gameData}
        open={openEndGameModal}
        handleReplay={handleReplay}
        handleClose={handleClose}
      />
    </React.Fragment>
  );
}

export default React.memo(Game);
