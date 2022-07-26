import React from 'react';

import Grid from '@mui/material/Grid';
import makeStyles from '@mui/styles/makeStyles';

import { ReactComponent as TabulaLogo } from 'assets/images/tabula-logo-icon.svg';

const useStyles = makeStyles({
  root: {
    height: '100vh'
  },
  progress: {
    width: 320,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#e1e3ea',
    justifyItems: 'center',
    marginTop: 40,
    '& > div': {
      width: 320,
      height: 4,
      borderRadius: 2,
      backgroundColor: '#43425d',
      animation: '$progressBar 5s ease-in-out'
    }
  },
  '@keyframes progressBar': {
    '0%': {
      width: 0
    },
    '100%': {
       width: '100%'
    }
  }
});

function Preloader() {
  const classes = useStyles();
  return (
    <Grid className={classes.root} container alignContent='center' alignItems='center' justifyContent='center' direction='column'>
            <TabulaLogo />
            <div id='progress' className={classes.progress}>
              <div/>
            </div> 
          </Grid>
  );
}
export default Preloader;