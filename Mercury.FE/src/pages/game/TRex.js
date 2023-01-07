import React, {useEffect} from 'react';

function TRex() {
  useEffect(() => {
    const {Runner} = window;
    const runner = new Runner('.interstitial-wrapper');
    setTimeout(() => {
      runner.start();
    }, 1000);
  }, []);

  return (
    <div id="main-frame-error" className="interstitial-wrapper">
      <div id="main-content">
        <div className="icon icon-offline" alt=""/>
      </div>
    </div>
  );
}

export default React.memo(TRex);
