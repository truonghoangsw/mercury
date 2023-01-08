import React, {useCallback, useEffect, useState} from 'react';
import ws from '../../common/ws';
import EnterRoom from './EnterRoom';
import UserNameForm from "../../Component/UserNameForm";

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

  const { user, isConnected } = props;
  return (
    <div className="home-page">
      <UserNameForm user={user} isConnected={isConnected} />
    </div>
  );
}

export default Home;
