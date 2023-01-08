import { React, useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import TextField from '@mui/material/TextField';
import storage from "../../common/storage";
import ws from "../../common/ws";
import "./styles.scss";

const UserNameForm = (props) => {
  const { user, isConnected } = props;
  const navigate = useNavigate();
  const curUserName = storage.getItem("userName");
  const [userName, setUsername] = useState(curUserName || "");
  const inputRef = useRef("");

  const onSubmit = (event) => {
    event.preventDefault();
    if (!userName) {
      return;
    }
    storage.setItem("userName", userName);

    ws.invoke("AddUser", userName).catch((error) => {
      console.error(error);
      alert("Error: " + error.message);
      return;
    });
    console.log("setUser", userName);
    navigate("/play");
  };

  const onInputChange = (event) => {
    setUsername(event.target.value);
    storage.setItem("UserName", event.target.value);
    console.log("UserName", event.target.value);
  };

  console.log("isConnected", isConnected, curUserName);
  return (
    <div>
      {isConnected ? (
        <div className="login-box">
          <p style={{ fontSize: 25, color: " #03e9f4", fontWeight: 900 }}>
            MECURY's T'rex Runner{" "}
          </p>
          <h2>Please enter your Username to start!</h2>
          <form className="user-form" style={{ alignItems: "center", justifyContent: "center" }}>
            <TextField 
              label="User name"
              variant="standard"
              onChange={onInputChange}
              value={userName}
              fullWidth 
            />
            <a href="#">
              <div onClick={onSubmit} disabled={!userName}>
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
