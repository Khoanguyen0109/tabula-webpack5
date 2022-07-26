import React from 'react';

import Box from '@mui/material/Box';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles(() => ({
  root: {
    position: 'fixed',
    display: 'none'
  }
}));
export default function DrawerOverlay() {
  const classes = useStyles();
  return <Box className={`${classes.root} drawer-overlay`}>Box overlay</Box>;
}