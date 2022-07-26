import React from 'react';

import Grid from '@mui/material/Grid';
import Grow from '@mui/material/Grow';
import Slide from '@mui/material/Slide';
import Snackbar from '@mui/material/Snackbar';

import TblButton from '../TblButton';

import TblNotification from '.';

function TransitionLeft(props) {
  return <Slide {...props} direction='left' />;
}

function GrowTransition(props) {
  return <Grow {...props} />;
}

function NotificationSample() {
  const [state, setState] = React.useState({
    open: false,
    vertical: 'top',
    horizontal: 'center',
    isToast: false,
    transition: undefined
  });

  const { vertical, horizontal, open, isToast, transition } = state;

  const handleClick = (isToast = false) => {
    isToast
      ? setState({ open: true, vertical: 'top', horizontal: 'right', isToast: true, transition: TransitionLeft })
      : setState({ open: true, vertical: 'bottom', horizontal: 'center', isToast: false, transition: GrowTransition });
  };

  const handleClose = () => {
    setState({ ...state, open: false });
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item>
          <TblButton size='large' variant='contained' color='primary' onClick={() => handleClick(true)}>Open Toast Message</TblButton>
        </Grid>
        <Grid item>
          <TblButton size='large' variant='contained' color='primary' onClick={() => handleClick(false)}>Open Snack Bar</TblButton>
        </Grid>
      </Grid>
      <Snackbar
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical, horizontal }}
        TransitionComponent={transition}
      >
        <TblNotification severity='success' isToast={isToast} onClose={handleClose}>
          This is an error alert — <strong>check it out!</strong>
        </TblNotification>
      </Snackbar>
    </>
  );
}

export default NotificationSample;