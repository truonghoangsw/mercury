import React, {useCallback, useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import ws from '../../common/ws';
import storage from '../../common/storage';

function EnterRoom({userId}) {
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState('');

  const onRoomIdChane = useCallback((event) => {
    setRoomId(event.target.value);
  }, []);

  const onSubmit = useCallback((event) => {
    event.preventDefault();
    if (!roomId) {
      return;
    }
    ws.invoke('EnterRoom', {
      userId,
      roomId,
    }).catch((error) => {
      console.error(error);
      alert('Error: ' + error.message);
    });
  }, [userId, roomId]);

  useEffect(() => {
    const onEnterRoom = (payload) => {
      storage.setItem('roomId', roomId);
      navigate('/play');
    };
    ws.on('EnterRoom', onEnterRoom);
    return () => {
      ws.off('EnterRoom', onEnterRoom);
    };
  }, [roomId, navigate]);

  return (
    <>
      <form action="" method="post" onSubmit={onSubmit}>
        <input
          placeholder="RoomID"
          value={roomId}
          onChange={onRoomIdChane}
        />
        <button type="submit">Join</button>
      </form>
    </>
  )
}

export default EnterRoom;
