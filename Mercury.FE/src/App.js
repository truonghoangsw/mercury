import { useCallback, useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import storage from "./common/storage";
import ws from "./common/ws";
import Game from "./pages/game/Game";
import Home from "./pages/home/Home";

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [user, setUser] = useState(null);
  const [gameData, setGameData] = useState(null);
  const navigate = useNavigate();

  const init = useCallback(async () => {
    await ws.start();
    const savedUser = storage.getItem("user");
    console.log("savedUser", savedUser);
    if (savedUser) {
      ws.invoke("AddUser", savedUser.name).catch((error) => {
        console.error(error);
        alert("Error: " + error.message);
      });
    }
  }, []);

  const onAddUserResponse = useCallback((payload) => {
    storage.setItem("user", payload);
    storage.setItem("userName", payload.name);
    setUser(payload);
  }, []);

  console.log("isConnected", isConnected);

  useEffect(() => {
    ws.on("AddUser", onAddUserResponse);
    return () => {
      ws.off("AddUser", onAddUserResponse);
    };
  }, [onAddUserResponse]);

  useEffect(() => {
    init()
      .then(() => {
        setIsConnected(true);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [init]);

  useEffect(() => {
    const onStartGame = (payload) => {
      setGameData({
        ...payload,
        startTime: new Date().getTime(),
      });
      navigate("/play");
    };
    ws.on("StartGame", onStartGame);
    return () => {
      ws.off("StartGame", onStartGame);
    };
  }, [navigate]);

  useEffect(() => {
    storage.setItem("roomId", gameData?.roomId);
    storage.setItem("currentGameId", gameData?.currentGameId);
  }, [gameData]);

  if (!isConnected) {
    return "Connecting...";
  }

  return (
    <Routes>
      <Route
        path="/"
        element={<Home user={user} isConnected={isConnected} />}
      />
      <Route
        path="/play"
        element={
          <Game
            key={gameData?.startTime}
            user={user}
            gameData={gameData}
            setGameData={setGameData}
          />
        }
      />
    </Routes>
  );
}

export default App;
