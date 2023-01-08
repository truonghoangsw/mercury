import React from 'react';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

function GiveAway(props) {
    const { onClose, open, handleOpenGiveAway } = props;

    const handleClose = () => {
      onClose();
      if(handleOpenGiveAway) {
        handleOpenGiveAway(false);
      }
    };
  
    const onGiveAwayClick = (value) => {
        if(handleOpenGiveAway) {
        handleOpenGiveAway(true);
        }
    };
  
    return (
      <Dialog onClose={handleClose} open={open}>
       <IconButton color="primary" className='close-give-away'>
            <HighlightOffIcon color='error' onClick={handleClose}/>
       </IconButton>
        <div className='image-wrapper' onClick={onGiveAwayClick}>
            <img src={process.env.PUBLIC_URL + '/assets/give-away.gif'}/>
         </div>
      </Dialog>
    );
}

export default GiveAway;