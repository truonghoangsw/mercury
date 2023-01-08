import React, { useCallback, useMemo } from "react";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import { useNavigate } from "react-router-dom";

function EndGameModal({ gameData, open, userId, handleClose, handleReplay }) {
  const navigate = useNavigate();
  const isFinalWinner = useMemo(() => {
    const users = Object.keys(gameData?.players || {}).map((key) => ({
      userId: key,
      ...gameData.players[key],
      ...gameData.players[key]?.player,
    }));
    const currentUser = users.find((user) => user.userId === userId);
    const otherUser = users.find((user) => user.userId !== userId);
    return currentUser?.winSet > otherUser?.winSet;
  }, [gameData, userId]);

  const goBack = useCallback(() => {
    window.location.href = "/";
  }, [navigate]);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth={"xs"}
    >
      <DialogTitle id="alert-dialog-title">Game end!</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <div className="end-game-modal-result">
            {isFinalWinner ? "You win!" : "You lose!"}
          </div>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={goBack}>
          Go back home
        </Button>
        <Button variant="outlined" onClick={handleReplay}>
          Replay
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default React.memo(EndGameModal);
