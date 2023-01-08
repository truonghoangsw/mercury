import { useRef } from "react";
import "./styles.scss";
import { useNavigate } from "react-router-dom";

const UserNameForm = () => {
  const navigate = useNavigate();
  const userNameRef = useRef();
  const toPlayGame = () => {
    navigate("/play");
  };
  return (
    <div class="login-box">
      <p style={{ fontSize: 25, color: " #03e9f4", fontWeight: 900 }}>
        MECURY's T'rex Runner{" "}
      </p>
      <h2>Please enter your username to start!</h2>
      <form style={{ alignItems: "center", justifyContent: "center" }}>
        <div class="user-box">
          <input type="text" name="" required="" />
          <label style={{ fontSize: 20 }}>Username</label>
        </div>
        <a href="#">
          <div onClick={toPlayGame}>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            Submit
          </div>
        </a>
      </form>
    </div>
  );
};

export default UserNameForm;
