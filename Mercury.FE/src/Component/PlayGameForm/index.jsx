import {
  default as React,
  useCallback,
  useEffect,
  useRef,
  useState,
  useNavigate,
} from "react";
import ws from "../../common/ws";
import storage from "../../common/storage";
import "./styles.scss";

const PlayGameForm = (props) => {
  const curUser = storage.getItem("user");
  console.log("user", curUser);
  const userId = curUser.userId;
  const navigate = useNavigate();
  const [isShowEnterRoom, setIsShowEnterRoom] = useState(false);
  const [roomId, setRoomId] = useState("");
  const createRoom = useCallback(() => {
    ws.invoke("CreateRoom", { userId }).catch((error) => {
      console.error(error);
      alert("Error: " + error.message);
    });
  }, [userId]);

  const showEnterRoom = useCallback(() => {
    setIsShowEnterRoom(true);
  }, []);

  useEffect(() => {
    const onCreateRoom = (payload) => {
      setRoomId(payload.RoomId);
    };
    ws.on("CreateRoom", onCreateRoom);
    return () => {
      ws.off("CreateRoom", onCreateRoom);
    };
  }, []);

  // useEffect(() => {
  //   const onEnterRoom = (payload) => {
  //     if (isShowEnterRoom) {
  //       return;
  //     }
  //     storage.setItem("roomId", roomId);
  //     navigate("/play");
  //   };
  //   ws.on("EnterRoom", onEnterRoom);
  //   return () => {
  //     ws.off("EnterRoom", onEnterRoom);
  //   };
  // }, [roomId, navigate, isShowEnterRoom]);

  console.log("enter play game form");
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
