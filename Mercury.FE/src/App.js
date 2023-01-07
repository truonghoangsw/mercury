import { Route, Routes } from "react-router-dom";
import Home from "./pages/home/Home";
import Game from "./pages/game/Game";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/play" element={<Game />} />
    </Routes>
  );
}

export default App;
