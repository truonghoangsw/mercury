import React, {useCallback, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import ws from '../../common/ws';

function Home() {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const onInputChange = useCallback((event) => {
    setUsername(event.target.value);
  }, []);

  const onSubmit = useCallback((event) => {
    event.preventDefault();
    if (!username) {
      return;
    }
    ws.invoke('add_user', username).then(() => {
      navigate('/play');
    }).catch((error) => {
      console.error(error);
      alert('Error: ' + error.message);
    });
  }, [username, navigate]);

  return (
    <div className="home-page">
      <form action="" method="post" onSubmit={onSubmit}>
        <input
          name="username"
          placeholder="Username"
          value={username}
          onChange={onInputChange}
        />
        <button type="submit">Start</button>
      </form>
    </div>
  );
}

export default Home;
