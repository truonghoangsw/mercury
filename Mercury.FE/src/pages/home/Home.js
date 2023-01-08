import React from "react";
import UserNameForm from "../../Component/UserNameForm";

function Home({ user }) {
  return (
    <div className="home-page">
      <UserNameForm user={user} />
    </div>
  );
}

export default Home;
