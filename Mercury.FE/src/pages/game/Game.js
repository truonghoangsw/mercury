import { default as React, useCallback, useEffect, useRef } from "react";
import ws from "../../common/ws";
import PlayGameForm from "../../Component/PlayGameForm";

function Game() {
  const runnerRef = useRef(null);

  const onStartGame = useCallback(() => {
    console.log("Start game");
    if (runnerRef.current) {
      runnerRef.current.start();
    }
  }, []);

  const onGameOver = useCallback(() => {
    console.log("onGameOver");
    if (runnerRef.current) {
      runnerRef.current.gameOver();
    }
  }, []);

  useEffect(() => {
    const { Runner } = window;
    runnerRef.current = new Runner(".interstitial-wrapper");
  }, []);

  useEffect(() => {
    ws.on("StartGame", onStartGame);
    return () => {
      ws.off("StartGame", onStartGame);
    };
  }, [onStartGame]);

  useEffect(() => {
    ws.on("GameOver", onGameOver);
    return () => {
      ws.off("GameOver", onGameOver);
    };
  }, [onGameOver]);

  return (
    <div className="game-page">
      <PlayGameForm />
      {/* <TRex/> */}
    </div>
  );
}

export default React.memo(Game);
