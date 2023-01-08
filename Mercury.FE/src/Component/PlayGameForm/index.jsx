import { useRef } from "react";
import "./styles.scss";

const PlayGameForm = () => {
  const userNameRef = useRef();
  return (
    <div class="login-box">
      <p style={{ fontSize: 25, color: " #03e9f4", fontWeight: 900 }}>
        MECURY's T'rex Runner
      </p>
      <table>
        <tr>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <h2>Click here to find a new random game</h2>
            <form style={{ alignItems: "center", justifyContent: "center" }}>
              <a href="#">
                <div>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  Random match
                </div>
              </a>
            </form>
          </div>
          <td>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <h2>Join a existing room</h2>
              <form
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div class="user-box">
                  <input type="text" name="" required="" />
                  <label style={{ fontSize: 20 }}>RoomID</label>
                </div>
              </form>
            </div>
          </td>
          <td>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <h2>Host a new private room</h2>
              <form style={{ alignItems: "center", justifyContent: "center" }}>
                <a href="#">
                  <div>
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                    Create room
                  </div>
                </a>
              </form>
            </div>
          </td>
        </tr>
      </table>
    </div>
  );
};

export default PlayGameForm;
