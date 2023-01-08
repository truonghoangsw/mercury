import React from "react";
import UserNameForm from "../../Component/UserNameForm";

function Home(props) {
  const { user, isConnected } = props;
  return (
    <div className="home-page">
      <UserNameForm user={user} isConnected={isConnected} />
    </div>
  );
}

export default Home;
