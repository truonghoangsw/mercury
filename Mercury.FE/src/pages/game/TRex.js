import React from 'react';

function TRex() {
  return (
    <div id="main-frame-error" className="interstitial-wrapper">
      <div id="main-content">
        <div className="icon icon-offline"/>
      </div>
    </div>
  );
}

export default React.memo(TRex);
