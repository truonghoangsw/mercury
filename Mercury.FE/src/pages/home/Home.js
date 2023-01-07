import React from 'react';
import {Link} from 'react-router-dom';

function Home() {
  return (
    <div className="home-page">
      <Link to="/play" className="btn">Play</Link>
    </div>
  );
}

export default Home;
