import React, {useCallback, useEffect, useRef, useState} from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

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

function Game({user}) {
  const runnerRef = useRef(null);
  const [gameState, setGameState] = useState(GAME_STATE.NOT_START);
  const [gameData, setGameData] = useState(null);

  const [open, setOpen] = React.useState(false);
 
  const handleClose = () => setOpen(false)
  const userId = user?.playerId;

  const onStartGame = useCallback(() => {
    if (runnerRef.current) {
      runnerRef.current.start();
      setGameState(GAME_STATE.PLAYING);
    }
  }, []);

  const onGameOver = useCallback((data) => {
    console.log(data);
    if (data === userId) {

    }
    if (runnerRef.current) {
      runnerRef.current.gameOver(true);
    }
    setOpen(true)
  }, [userId]);

  const onThisGameOver = useCallback((data) => {
    const roomId = storage.getItem('roomId');
    const currentGameId = storage.getItem('currentGameId');
    const user = storage.getItem('user');
    setGameState(data?.isWinner ? GAME_STATE.WIN : GAME_STATE.LOSE);
    ws.invoke('GameOver', {roomId, currentGameId, userId: user?.playerId});
    setOpen(true)
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
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="sm">
        <div className="game-page">
          <TRex/>
        </div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth={'xs'}
        >
          {
            gameState === GAME_STATE.WIN ? (
              <DialogTitle id="alert-dialog-title">
                  You WIN!
              </DialogTitle>
            ) : (
              <DialogTitle id="alert-dialog-title">
                You LOSE!
              </DialogTitle>
            )
          }
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
