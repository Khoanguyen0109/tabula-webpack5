import React from 'react';

import DialogContentText from '@mui/material/DialogContentText';

import TurnOnNotificationImg from 'assets/images/img_turnonnotificaiton.png';

import TblButton from '../TblButton';

import TblDialog from '.';

const SampleDialog = () => {
  const [isVisible, setIsVisible] = React.useState(false);
  const onShowOrHideDialog = () => {
    setIsVisible(!isVisible);
  };
  return (
    <>
      <TblButton
        variant='outlined'
        size='large'
        color='primary'
        onClick={onShowOrHideDialog}
      >
        Open Dialog
      </TblButton>
      <TblDialog
        open={isVisible}
        title='Subscribe'
        onClose={onShowOrHideDialog}
        header={
          <img
            className='img'
            src={TurnOnNotificationImg}
            alt=''
            width='100%'
          />
        }
        footer={
          <>
            <TblButton
              variant='outlined'
              size='large'
              color='primary'
              onClick={onShowOrHideDialog}
            >
              Cancel
            </TblButton>
            <TblButton size='large' variant='contained' color='primary'>
              Create
            </TblButton>
          </>
        }
      >
        <DialogContentText>
          To subscribe to this website, please enter your email address here. We
          will send updates occasionally.
        </DialogContentText>
      
      </TblDialog>
    </>
  );
};

export default SampleDialog;
