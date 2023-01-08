import React from 'react';
import Dialog from '@mui/material/Dialog';


const Fishing = (props) => {
    const { onClose, open } = props;
    
 
    const handleClose = () => {
        console.log('handleClose');
    }
    return (
        <Dialog onClose={handleClose} open={open}>
        <div className='fishing-wrapper'>
            <img src={process.env.PUBLIC_URL + '/assets/iphone.png'}/>
         </div>
      </Dialog>
    );
};

export default Fishing;