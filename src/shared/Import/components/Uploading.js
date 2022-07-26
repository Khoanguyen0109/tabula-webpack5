import React from 'react';

// material-ui
import { Box, LinearProgress, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
    backgroundColor: theme.newColors.gray[50],
  },
  progress: {},
}));

const Uploading = () => {
  const classes = useStyles();
  return (
    <Box className={classes.root}>
      <Typography variant='bodyMedium'> File name</Typography>
      <LinearProgress value={50} />
    </Box>
  );
};

Uploading.propTypes = {};

export default Uploading;
