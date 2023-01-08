import CssBaseline from "@mui/material/CssBaseline";
import {
  default as React,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";
import { GAME_STATE } from "../../common/constants";
import storage from "../../common/storage";
import ws from "../../common/ws";
import GameResult from "./GameResult";
import TRex from "./TRex";
import EndGameModal from "./EndGameModal";
import Winner from "./Winner";
import Loser from "./Loser";
import CountDown from "./CountDown";

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
  const [open, setOpen] = React.useState(false);
  const [openErrorModal, setOpenErrorModal] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState("");

  const onErrorMessage = useCallback((data) => {
    setOpenErrorModal(true);
    setErrorMsg(data);
  }, []);

  useEffect(() => {
    ws.on("ErrorMessage", onErrorMessage);
    return () => {
      ws.off("ErrorMessage", onErrorMessage);
    };
  }, [onErrorMessage]);

  const [openEndGameModal, setOpenEndGameModal] = React.useState(false);

  const handleClose = useCallback(() => {
    setOpenEndGameModal(false);
  }, []);

  const handleReplay = useCallback(() => {
    setOpenEndGameModal(false);
    const roomId = storage.getItem("roomId");
    const currentGameId = storage.getItem("currentGameId");
    ws.invoke("ReplayMatch", {
      roomId,
      currentGameId,
    });
  }, []);

  const userId = user?.playerId;

  const onGameOver = useCallback(
    (data) => {
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
      setGameData((prevData) => ({
        ...prevData,
        ...data,
      }));
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

  useEffect(() => {
    const { Runner } = window;
    runnerRef.current = new Runner(".interstitial-wrapper", undefined, {
      onGameOver: onThisGameOver,
    });
  }, [onThisGameOver]);

  useEffect(() => {
    ws.on("GameOver", onGameOver);
    return () => {
      ws.off("GameOver", onGameOver);
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

  // useEffect(() => {
  //   if (!gameData) {
  //     navigate("/");
  //   }
  // }, [navigate, gameData]);

  const onPlayerDisconnect = useCallback(() => {
    setOpenEndGameModal(true);
  }, []);

  useEffect(() => {
    ws.on("PlayerDisconnect", onPlayerDisconnect);
    return () => {
      ws.off("PlayerDisconnect", onPlayerDisconnect);
    };
  }, [onPlayerDisconnect]);

  return !isStarted ? (
    <PlayGameForm />
  ) : (
    <React.Fragment>
      <CssBaseline />
      <div className="game-page">
        <div className="game-container">
          <GameResult gameData={gameData} userId={userId} />
          {(gameState === GAME_STATE.NOT_START ||
            gameState === GAME_STATE.RE_STARTING) && <CountDown />}
          <TRex />
          {gameState === GAME_STATE.RE_STARTING &&
            gameData?.winnerId === userId && <Winner />}
          {gameState === GAME_STATE.RE_STARTING &&
            gameData?.winnerId !== userId && <Loser />}
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
