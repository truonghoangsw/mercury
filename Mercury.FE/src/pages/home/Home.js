import { default as React } from "react";
import UserNameForm from "../../Component/UserNameForm";

function Home({ user }) {
  return (
    <div className="home-page">
      <UserNameForm />
      {/* {!!user && (
        <>
          <h1>Hello {user.Name}</h1>
          {!isShowEnterRoom && !roomId && (
            <>
              <button onClick={createRoom}>Create Room</button>
              <button onClick={showEnterRoom}>Enter Room</button>
            </>
          )}
          {!isShowEnterRoom && !!roomId && (
            <>
              <p>Your room ID: {roomId}</p>
            </>
          )}
          {isShowEnterRoom && <EnterRoom userId={userId} />}
        </>
      )}
      {!user && (
        <form action="" method="post" onSubmit={onSubmit}>
          <input
            name="username"
            placeholder="Username"
            value={username}
            onChange={onInputChange}
          />
          <button type="submit">Start</button>
        </form>
      )} */}
    </div>
  );
}

export default Home;
