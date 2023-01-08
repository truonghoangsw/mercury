import { React, useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import storage from "../../common/storage";
import ws from "../../common/ws";
import "./styles.scss";

const UserNameForm = (props) => {
  const { isConnected } = props;
  const curUserName = storage.getItem("userName" || "");
  const navigate = useNavigate();
  const [userName, setUsername] = useState(curUserName);
  const inputRef = useRef("");

  const onInputChange = useCallback((event) => {
    if (event.target?.value?.trim() === "") return;
    setUsername(event.target.value);
    console.log("UserName", event.target.value);
  }, []);

  const onSubmit = useCallback(
    (event) => {
      event.preventDefault();
      if (!userName) {
        return;
      }

      ws.invoke("AddUser", userName).catch((error) => {
        console.error(error);
        alert("Error: " + error.message);
      });
      storage.setItem("userName", userName);
      navigate("/play");
    },
    [userName, navigate]
  );

  return (
    <div>
      {isConnected ? (
        <div class="login-box">
          <p style={{ fontSize: 25, color: " #03e9f4", fontWeight: 900 }}>
            MECURY's T'rex Runner{" "}
          </p>
          <h2>Please enter your userName to start!</h2>
          <form style={{ alignItems: "center", justifyContent: "center" }}>
            <div class="user-box" style={{ marginTop: 20 }}>
              <input
                type="text"
                name=""
                required=""
                onChange={onInputChange}
                ref={inputRef}
                value={userName}
              />
              <label style={{ fontSize: 20, marginBottom: 20 }}>
                User name
              </label>
            </div>
            <a href="#">
              <div onClick={onSubmit}>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                Submit
              </div>
            </a>
          </form>
        </div>
      ) : (
        <div>Connecting to sever...</div>
      )}
    </div>
  );
};

export default UserNameForm;
