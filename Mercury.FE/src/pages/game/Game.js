import React, { useCallback, useEffect, useRef, useState } from "react";
import CssBaseline from "@mui/material/CssBaseline";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { GAME_STATE } from "../../common/constants";
import TRex from "./TRex";
import ws from "../../common/ws";
import storage from "../../common/storage";
import GameResult from "./GameResult";
import { useNavigate } from "react-router-dom";

const PlayGameForm = () => {
  const user = storage.getItem("user");
  const userId = user.userId;
  const onRandomMatch = () => {
    ws.invoke("GameOver", { userId: userId });
  };
  return (
    <div class="login-box">
      <p
        style={{
          fontSize: 25,
          color: " #03e9f4",
          fontWeight: 900,
          borderBottom: "double",
        }}
      >
        MECURY's T'rex Runner
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: "double",
        }}
      >
        <h2>Click here to find a new random game</h2>
        <form style={{ alignItems: "center", justifyContent: "center" }}>
          <div onClick={onRandomMatch}>
            <a href="#">
              <div>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                Random match
              </div>
            </a>
          </div>
        </form>
      </div>

      <div
        style={{
          marginTop: "20px",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: "double",
        }}
      >
        <h2>Join a existing room</h2>
        <form
          style={{
            marginTop: "20px",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div class="user-box">
            <input type="text" name="" required="" />
            <label style={{ fontSize: 20 }}>RoomID</label>
          </div>
        </form>
      </div>

      <div
        style={{
          marginTop: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderBottom: "double",
        }}
      >
        <h2>Host a new private room</h2>
        <form style={{ alignItems: "center", justifyContent: "center" }}>
          <a href="#">
            <div>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              Create room
            </div>
          </a>
        </form>
      </div>
    </div>
  );
};

function Game({ user, gameData, setGameData }) {
  const navigate = useNavigate();
  const runnerRef = useRef(null);
  const [isStarted, setIsStarted] = useState(false);
  const [gameState, setGameState] = useState(GAME_STATE.NOT_START);
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  const userId = user?.playerId;

  const onGameOver = useCallback(
    (data) => {
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
    },
    [userId]
  );

  const onThisGameOver = useCallback(() => {
    const roomId = storage.getItem("roomId");
    const currentGameId = storage.getItem("currentGameId");
    const user = storage.getItem("user");
    ws.invoke("GameOver", { roomId, currentGameId, userId: user?.playerId });
  }, []);

  // useEffect(() => {
  //   const { Runner } = window;
  //   runnerRef.current = new Runner(".interstitial-wrapper", undefined, {
  //     onGameOver: onThisGameOver,
  //   });
  // }, [onThisGameOver]);

  useEffect(() => {
    ws.on("GameOver", onGameOver);
    return () => {
      ws.off("GameOver", onGameOver);
    };
  }, [onGameOver]);

  const onBlur = useCallback(() => {
    setOpen(true);
    window.removeEventListener("blur", onBlur);
  }, []);

  useEffect(() => {
    window.addEventListener("blur", onBlur);
    return;
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (runnerRef.current) {
        runnerRef.current.start();
        setGameState(GAME_STATE.PLAYING);
      }
    }, 3000);
  }, []);

  // useEffect(() => {
  //   if (!gameData) {
  //     navigate("/");
  //   }
  // }, [navigate, gameData]);

  return !isStarted ? (
    <PlayGameForm />
  ) : (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="sm" style={{ height: "100vh" }}>
        <div
          className="game-page"
          style={{
            height: "100vh",
            display: "flex",
          }}
        >
          <GameResult gameData={gameData} userId={userId} />
          {gameState === GAME_STATE.NOT_START && (
            <div>Game win start in 3 seconds</div>
          )}
          <TRex />
          <button onClick={() => setOpen(true)}>Open modal</button>
        </div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth={"xs"}
          fullWidth={true}
        >
          <DialogTitle id="alert-dialog-title">Game end!</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Please take next action.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="outlined" onClick={handleClose}>
              Go back home
            </Button>
            <Button variant="outlined" onClick={handleClose}>
              Continue
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </React.Fragment>
  );
}

export default Game;
