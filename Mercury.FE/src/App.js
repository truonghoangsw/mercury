import {Route, Routes} from 'react-router-dom';
import Home from './pages/home/Home';
import Game from './pages/game/Game';
import {useCallback, useEffect, useState} from 'react';
import ws from './common/ws';
import storage from './common/storage';

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [user, setUser] = useState(null);

  const init = useCallback(async () => {
    await ws.start();
    const savedUser = storage.getItem('user');
    if (savedUser) {
      ws.invoke('AddUser', savedUser.Name).catch((error) => {
        console.error(error);
        alert('Error: ' + error.message);
      });
    }
  }, []);

  const onAddUserResponse = useCallback(payload => {
    storage.setItem('user', payload);
    setUser(payload);
  }, []);

  useEffect(() => {
    ws.on('addUser', onAddUserResponse);
    return () => {
      ws.off('addUser', onAddUserResponse);
    };
  }, [onAddUserResponse]);

  useEffect(() => {
    init().then(() => {
      setIsConnected(true);
    }).catch((error) => {
      console.error(error);
    });
  }, [init]);

  if (!isConnected) {
    return 'Connecting...';
  }

  return (
    <Routes>
      <Route path="/" element={<Home user={user}/>}/>
      <Route path="/play" element={<Game user={user}/>}/>
    </Routes>
  );
}

export default App;
