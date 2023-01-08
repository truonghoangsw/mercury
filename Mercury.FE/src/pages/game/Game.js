import React, { useCallback, useEffect, useRef, useState } from "react";
import { GAME_STATE } from "../../common/constants";
import storage from "../../common/storage";
import ws from "../../common/ws";
import Loser from "./Loser";
import TRex from "./TRex";
import Winner from "./Winner";
import PlayGameForm from "./../../Component/PlayGameForm/index";

function Game({ user }) {
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

  useEffect(() => {
    const { Runner } = window;
    runnerRef.current = new Runner(".interstitial-wrapper", undefined, {
      onGameOver: onThisGameOver,
    });
  }, [onThisGameOver]);

  // useEffect(() => {
  //   ws.on("GameOver", onGameOver);
  //   return () => {
  //     ws.off("GameOver", onGameOver);
  //   };
  // }, [onGameOver]);

  return (
    <div className="game-page">
      {isStarted ? <TRex /> : <PlayGameForm />}
      {gameState === GAME_STATE.WIN && <Winner />}
      {gameState === GAME_STATE.LOSE && <Loser />}
    </div>
  );
}

export default Game;
