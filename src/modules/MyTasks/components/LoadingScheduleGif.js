import React from 'react';
import { useTranslation } from 'react-i18next';

import Backdrop from '@mui/material/Backdrop';
import Paper from '@mui/material/Paper';
import makeStyles from '@mui/styles/makeStyles';

import AutoScheduleGif from 'assets/gif/auto_schedule.gif';
import { format } from 'date-fns/esm';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  container: {
    position: 'relative',
    width: theme.spacing(40),
    height: theme.spacing(47.5),
    borderRadius: theme.borderRadius.default
  },
  loadingText: {
    color: theme.newColors.gray[900],
    fontSize: theme.fontSize.normal,
    fontWeight: theme.fontWeight.semi,
    textAlign: 'center',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  currentTime: {
    position: 'absolute',
    top: theme.spacing(2),
    left: theme.spacing(1.75),
    color: theme.newColors.gray[900],
    fontSize: theme.fontSize.small,
    fontWeight: theme.fontWeight.normal,
  },
  gif: {
    width: theme.spacing(40),
    height: theme.spacing(40),
    borderTopLeftRadius: theme.borderRadius.default,
    borderTopRightRadius: theme.borderRadius.default
  },
}));

function LoadingScheduleGif(props) {
  const { t } = useTranslation('myTasks');
  const classes = useStyles();
  const { open } = props;
  const currentTime = format(new Date(), 'HH:mm aaa');
  return (
    <Backdrop className={classes.backdrop} open={open}>
      <Paper className={classes.container}>
        <img src={AutoScheduleGif} alt='' className={classes.gif} />
        <p className={classes.loadingText}> {t('scheduling')}</p>
        <p className={classes.currentTime}>{currentTime}</p>
      </Paper>
    </Backdrop>
  );
}

LoadingScheduleGif.propTypes = {
  open: PropTypes.bool
};

export default LoadingScheduleGif;
