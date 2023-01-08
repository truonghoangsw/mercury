import React, {useCallback, useState} from 'react';
import ws from '../../common/ws';

function EnterRoom({userId, setIsShowEnterRoom}) {
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
      roomId: roomId ? roomId.trim() : '',
    }).catch((error) => {
      console.error(error);
      alert('Error: ' + error.message);
    });
  }, [userId, roomId]);

  const handleBack = useCallback(() => {
    setIsShowEnterRoom(false);
  }, []);

  return (
    <>
      <form action="" method="post" onSubmit={onSubmit}>
        <div className="input-group">
          <input
            placeholder="RoomID"
            value={roomId}
            onChange={onRoomIdChane}
          />
        </div>
        <button type="submit">Join</button>
        <button className="btn-default" type="button" onClick={handleBack}>Back</button>
      </form>
    </>
  );
}

export default EnterRoom;
