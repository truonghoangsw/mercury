import React, {useCallback, useEffect, useRef, useState} from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import {GAME_STATE} from '../../common/constants';
import TRex from './TRex';
import ws from '../../common/ws';
import storage from '../../common/storage';
import Winner from './Winner';
import Loser from './Loser';
import GameResult from './GameResult';
import {useNavigate} from 'react-router-dom';

function Game({user, gameData, setGameData}) {
  const runnerRef = useRef(null);
  const [gameState, setGameState] = useState(() => {
    return Object.values(gameData?.players || {}).some(x => x?.winSet || x?.pointInCurrentSet) ? GAME_STATE.RE_STARTING : GAME_STATE.NOT_START;
  });
  const navigate = useNavigate();

  const [open, setOpen] = React.useState(false);

  const handleClose = () => setOpen(false)
  const userId = user?.playerId;

  const onGameOver = useCallback((data) => {
    if (data) {
      data = {
        ...data.room,
        winnerId: data.winnerId,
      };
      if (!data?.isEndMatch) {
        data.startTime = new Date().getTime();
        setOpen(true);
      }
    }
    setGameData(data);
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
    }, 3000);
  }, []);

  useEffect(() => {
    if (!gameData) {
      navigate('/');
    }
  }, [navigate, gameData]);

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="sm">
        <div className="game-page">
          <GameResult gameData={gameData} userId={userId}/>
          {
            gameState === GAME_STATE.NOT_START &&
            <div>Game win start in 3 seconds</div>
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
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth={'xs'}
        >
          <DialogTitle id="alert-dialog-title">
            Game end!
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Please take next action.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" onClick={handleClose}>Go back home</Button>
            <Button variant="outlined" onClick={handleClose}>
              Continue
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </React.Fragment>

  );
}

export default React.memo(Game);
