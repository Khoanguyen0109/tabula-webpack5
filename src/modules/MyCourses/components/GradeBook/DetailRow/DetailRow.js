import React from 'react';

import { Grid, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  row: {
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
}));
export function Row(props) {
  const { label, render } = props;
  const classes = useStyles();
  return (
    <Grid container className={classes.row} spacing={2}>
      <Grid item xs={6}>
        <Typography variant='labelSmall'>{label}</Typography>
      </Grid>
      <Grid className={classes.detail} item xs={6}>
        <Typography variant='bodySmall'>{render()}</Typography>
      </Grid>
    </Grid>
  );
}

Row.propTypes = {
  label: PropTypes.string,
  render: PropTypes.func,
};

export function SubRow(props) {
  const { label, render } = props;
  const classes = useStyles();
  return (
    <Grid container className={classes.subRow} spacing={2}>
      <Grid item xs={6}>
        <Typography variant='bodySmall'>{label}</Typography>
      </Grid>
      <Grid item xs={6}>
        <Typography variant='bodySmall'>{render()}</Typography>
      </Grid>
    </Grid>
  );
}

SubRow.propTypes = {
  label: PropTypes.string,
  render: PropTypes.func,
};
