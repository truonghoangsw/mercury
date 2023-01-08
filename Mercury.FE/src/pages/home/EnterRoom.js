import React, { useCallback, useState } from "react";
import ws from "../../common/ws";

function EnterRoom({ userId, onBack }) {
  const [roomId, setRoomId] = useState("");

  const BackToHome = () => {
    setRoomId("");
    onBack();
  };

  const onRoomIdChane = useCallback((event) => {
    setRoomId(event.target.value);
  }, []);

  const onSubmit = useCallback(
    (event) => {
      event.preventDefault();
      if (!roomId) {
        return;
      }
      ws.invoke("EnterRoom", {
        userId,
        roomId,
      }).catch((error) => {
        console.error(error);
        alert("Error: " + error.message);
      });
    },
    [userId, roomId]
  );

  return (
    <>
      <form action="" method="post" onSubmit={onSubmit}>
        <div className="input-group">
          <input placeholder="RoomID" value={roomId} onChange={onRoomIdChane} />
          <button onClick={BackToHome}>Back</button>
        </div>
        <button type="submit">Join</button>
      </form>
    </>
  );
}

export default EnterRoom;
