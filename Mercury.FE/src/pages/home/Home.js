import React, { useCallback, useEffect, useState } from "react";
import ws from "../../common/ws";
import AutoMatch from "../game/AutoMatch";
import EnterRoom from "./EnterRoom";

function Home({ user, logout, onStartGame }) {
  const [username, setUsername] = useState("");
  const [isShowEnterRoom, setIsShowEnterRoom] = useState(false);
  const [roomId, setRoomId] = useState("");

  const userId = user?.playerId;

  const onInputChange = useCallback((event) => {
    setUsername(event.target.value);
  }, []);

  const onSubmit = useCallback(
    (event) => {
      event.preventDefault();
      if (!username) {
        return;
      }
      ws.invoke("AddUser", username).catch((error) => {
        console.error(error);
        alert("Error: " + error.message);
      });
    },
    [username]
  );

  const createRoom = useCallback(() => {
    ws.invoke("CreateRoom", { userId }).catch((error) => {
      console.error(error);
      alert("Error: " + error.message);
    });
  }, [userId]);

  const showEnterRoom = useCallback(() => {
    setIsShowEnterRoom(true);
  }, []);

  useEffect(() => {
    const onCreateRoom = (payload) => {
      setRoomId(payload.roomId);
    };
    ws.on("CreateRoom", onCreateRoom);
    return () => {
      ws.off("CreateRoom", onCreateRoom);
    };
  }, []);

  const copyText = () => {
    // Copy the text inside the text field
    navigator.clipboard.writeText(roomId);
  };
  const clearRoomId = useCallback(() => {
    setRoomId("");
  }, []);

  return (
    <div className="home-page">
      <div className="game-container">
        {!!user && (
          <>
            <h1>Mercury 88</h1>
            <h2>
              Hello <strong>{user.name}</strong>,
            </h2>
            {!isShowEnterRoom && !roomId && (
              <>
                <button onClick={createRoom}>Create Room</button>
                <button onClick={showEnterRoom}>Enter Room</button>
                <AutoMatch userId={userId} onStartGame={onStartGame} />
                <button className="btn-default" type="button" onClick={logout}>
                  Logout
                </button>
              </>
            )}
            {!isShowEnterRoom && !!roomId && (
              <div className="room-infor">
                <span>Your room ID: {roomId}</span>
                <span className="material-symbols-outlined" onClick={copyText}>
                  content_copy
                </span>
                <button
                  className="btn-default"
                  type="button"
                  onClick={clearRoomId}
                >
                  Back
                </button>
              </div>
            )}
            {isShowEnterRoom && (
              <EnterRoom
                userId={userId}
                setIsShowEnterRoom={setIsShowEnterRoom}
              />
            )}
          </>
        )}
        {!user && (
          <form action="" method="post" onSubmit={onSubmit}>
            <h1>Mercury 88</h1>
            <h2>Welcome,</h2>
            <p>Please input your username to continue:</p>
            <div className="input-group">
              <input
                name="username"
                value={username}
                onChange={onInputChange}
              />
            </div>
            <button type="submit">Start</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Home;
