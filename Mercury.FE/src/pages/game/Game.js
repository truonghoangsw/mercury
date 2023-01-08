import React, { useCallback, useEffect, useRef, useState } from "react";
import { GAME_STATE } from "../../common/constants";
import storage from "../../common/storage";
import ws from "../../common/ws";
import Loser from "./Loser";
import TRex from "./TRex";
import Winner from "./Winner";
import "./styles.scss";

const PlayGameForm = () => {
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
          <a href="#">
            <div>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              Random match
            </div>
          </a>
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

const Game = ({ user }) => {
  const runnerRef = useRef(null);
  const [isStarted, setIsStarted] = useState(false);
  const [gameState, setGameState] = useState(GAME_STATE.NOT_START);
  const [gameData, setGameData] = useState(null);

  const userId = user?.playerId;

  const onStartGame = useCallback(() => {
    if (runnerRef.current) {
      runnerRef.current.start();
      setGameState(GAME_STATE.PLAYING);
    }
  }, []);

  const onGameOver = useCallback(
    (data) => {
      console.log(data);
      if (data === userId) {
      }
      if (runnerRef.current) {
        runnerRef.current.gameOver(true);
      }
    },
    [userId]
  );

  const onThisGameOver = useCallback((data) => {
    const roomId = storage.getItem("roomId");
    const currentGameId = storage.getItem("currentGameId");
    const user = storage.getItem("user");
    setGameState(data?.isWinner ? GAME_STATE.WIN : GAME_STATE.LOSE);
    ws.invoke("GameOver", { roomId, currentGameId, userId: user?.playerId });
  }, []);

  // useEffect(() => {
  //   const { Runner } = window;
  //   runnerRef.current = new Runner(".interstitial-wrapper", undefined, {
  //     onGameOver: onThisGameOver,
  //   });
  // }, [onThisGameOver]);

  // useEffect(() => {
  //   ws.on("GameOver", onGameOver);
  //   return () => {
  //     ws.off("GameOver", onGameOver);
  //   };
  // }, [onGameOver]);
  console.log("isStarted", isStarted);

  return (
    <div className="game-page">
      {!isStarted ? (
        <PlayGameForm />
      ) : (
        <div>
          <TRex />
          {gameState === GAME_STATE.WIN && <Winner />}
          {gameState === GAME_STATE.LOSE && <Loser />}
        </div>
      )}
    </div>
  );
};

export default Game;
