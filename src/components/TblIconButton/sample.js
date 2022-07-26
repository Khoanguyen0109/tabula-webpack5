import React from 'react';

import AlarmIcon from '@mui/icons-material/Alarm';
import DeleteIcon from '@mui/icons-material/Delete';
import makeStyles from '@mui/styles/makeStyles';

import TblIconButton from '.';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

export default function TblIconButtons() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <TblIconButton color='primary' aria-label='submit'>
        <span className='icon-icn_check' />
      </TblIconButton>
      <TblIconButton aria-label='delete' color='primary'>
        <DeleteIcon />
      </TblIconButton>
      <TblIconButton aria-label='delete' color='primary' size='medium'>
        <DeleteIcon />
      </TblIconButton>
      <TblIconButton aria-label='delete' disabled color='primary'>
        <DeleteIcon />
      </TblIconButton>
      <TblIconButton aria-label='add an alarm'>
        <AlarmIcon />
      </TblIconButton>
    </div>
  );
}
