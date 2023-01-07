import React, {useCallback, useEffect, useRef} from 'react';
import ws from '../../common/ws';

function TRex() {
  const runnerRef = useRef(null);

  const onStartGame = useCallback(() => {
    console.log('Start game');
    if (runnerRef.current) {
      runnerRef.current.start();
    }
  }, []);

  const onEndGame = useCallback(() => {
    console.log('End game');
    if (runnerRef.current) {
      runnerRef.current.gameOver();
    }
  }, []);

  useEffect(() => {
    const {Runner} = window;
    runnerRef.current = new Runner('.interstitial-wrapper');
  }, []);

  useEffect(() => {
    ws.on("start_game", onStartGame);
  }, [onStartGame]);

  useEffect(() => {
    ws.on("end_game", onEndGame);
  }, [onEndGame]);

  return (
    <div id="main-frame-error" className="interstitial-wrapper">
      <div id="main-content">
        <div className="icon icon-offline"/>
      </div>
    </div>
  );
}

export default React.memo(TRex);
