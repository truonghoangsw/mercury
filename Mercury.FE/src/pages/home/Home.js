import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import ws from "../../common/ws";
import UserNameForm from "../../Component/UserNameForm";
import Mecury from "../../assets/Mecury.jpg";

function Home() {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const onInputChange = useCallback((event) => {
    setUsername(event.target.value);
  }, []);

  const onSubmit = useCallback(
    (event) => {
      event.preventDefault();
      if (!username) {
        return;
      }
      ws.invoke("add_user", username)
        .then(() => {
          navigate("/play");
        })
        .catch((error) => {
          console.error(error);
          alert("Error: " + error.message);
        });
    },
    [username, navigate]
  );

  return (
    <div
      className="home-page"
      style={{
        backgroundImage: Mecury,
        backgroundSize: "cover",
      }}
    >
      <UserNameForm />
    </div>
  );
}

export default Home;
