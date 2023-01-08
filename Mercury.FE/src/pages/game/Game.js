import React, { useEffect } from "react";
import TRex from "./TRex";
import PlayGameForm from "../../Component/PlayGameForm";
function Game() {
  useEffect(() => {}, []);

  return (
    <div className="game-page">
      <PlayGameForm />
      {/* <TRex/> */}
    </div>
  );
}

export default React.memo(Game);
