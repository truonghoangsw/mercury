import React, {useCallback, useEffect, useState} from 'react';
import ws from '../../common/ws';
import EnterRoom from './EnterRoom';

function Home({user}) {
  const [username, setUsername] = useState('');
  const [isShowEnterRoom, setIsShowEnterRoom] = useState(false);
  const [roomId, setRoomId] = useState('');

  const userId = user?.playerId;

  const onInputChange = useCallback((event) => {
    setUsername(event.target.value);
  }, []);

  const onSubmit = useCallback((event) => {
    event.preventDefault();
    if (!username) {
      return;
    }
    ws.invoke('AddUser', username).catch((error) => {
      console.error(error);
      alert('Error: ' + error.message);
    });
  }, [username]);

  const createRoom = useCallback(() => {
    ws.invoke('CreateRoom', {userId}).catch((error) => {
      console.error(error);
      alert('Error: ' + error.message);
    });
  }, [userId]);

  const showEnterRoom = useCallback(() => {
    setIsShowEnterRoom(true);
  }, []);

  useEffect(() => {
    const onCreateRoom = (payload) => {
      setRoomId(payload.roomId);
    };
    ws.on('CreateRoom', onCreateRoom);
    return () => {
      ws.off('CreateRoom', onCreateRoom);
    };
  }, []);

  return (
    <div className="home-page">
      {
        !!user &&
        <>
          <h1>Hello {user.name}</h1>
          {
            !isShowEnterRoom && !roomId &&
            <>
              <button onClick={createRoom}>Create Room</button>
              <button onClick={showEnterRoom}>Enter Room</button>
            </>
          }
          {
            !isShowEnterRoom && !!roomId &&
            <>
              <p>Your room ID: {roomId}</p>
            </>
          }
          {
            isShowEnterRoom &&
            <EnterRoom userId={userId}/>
          }
        </>
      }
      {
        !user &&
        <form action="" method="post" onSubmit={onSubmit}>
          <input
            name="username"
            placeholder="Username"
            value={username}
            onChange={onInputChange}
          />
          <button type="submit">Start</button>
        </form>
      }
    </div>
  );
}

export default Home;
