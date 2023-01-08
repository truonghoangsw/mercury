import React from 'react';
import Dialog from '@mui/material/Dialog';

function GiftBox(props) {
    const { onClose, open } = props;
    const handleClose = () => {
      onClose();
    };
    return (
      <Dialog onClose={handleClose} open={open}>
        <div className='image-wrapper' onClick={handleClose}>
            <img src={process.env.PUBLIC_URL + '/assets/iphone.png'}/>
         </div>
      </Dialog>
    );
}

export default GiftBox;