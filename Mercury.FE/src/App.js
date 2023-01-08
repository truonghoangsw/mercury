import { useCallback, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import storage from "./common/storage";
import ws from "./common/ws";
import Game from "./pages/game/Game";
import Home from "./pages/home/Home";

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [user, setUser] = useState(null);

  const init = useCallback(async () => {
    await ws.start();
    const savedUser = storage.getItem("user");
    console.log("savedUser", savedUser);
    if (savedUser) {
      ws.invoke("AddUser", savedUser.Name).catch((error) => {
        console.error(error);
        alert("Error: " + error.message);
      });
    }
  }, []);

  const onAddUserResponse = useCallback((payload) => {
    storage.setItem("user", payload);
    storage.setItem("userName", payload.userName);
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

  return (
    <Routes>
      <Route path="/" element={<Home user={user} conected={isConnected} />} />
      <Route path="/play" element={<Game user={user} />} />
    </Routes>
  );
}

export default App;
