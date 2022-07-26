import React from 'react';

// material-ui
import { Box } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

import { ReactComponent as UploadIcon } from 'assets/images/icn_upload.svg';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  root: {
    pointerEvents: (props) => props.disabled ? 'none' : 'auto',

    '&:hover svg': {
      '& #arrow_upward': {
        fill: theme.palette.secondary.main,
        animationDuration: '600ms',
        animationName: '$animationarrow',
        animationIterationCount: 'infinite',
        animationDirection: 'alternate',
      },
      '& #border': {
        fill: '#ffffff',
        stroke: theme.palette.secondary.main,
      },
      '& #dash': {
        fill: theme.palette.secondary.main,
        animationDuration: '600ms',
        animationName: '$animationdash',
        animationIterationCount: 'infinite',
        animationDirection: 'alternate',
      },
    },
  },
  svg: {
    '&.drag': {
      '& #arrow_upward': {
        fill: theme.palette.secondary.main,
        animationDuration: '600ms',
        animationName: '$animationarrow',
        animationIterationCount: 'infinite',
        animationDirection: 'alternate',
      },
      '& #border': {
        fill: '#ffffff',
        stroke: theme.palette.secondary.main,
      },
      '& #dash': {
        fill: theme.palette.secondary.main,
        animationDuration: '600ms',
        animationName: '$animationdash',
        animationIterationCount: 'infinite',
        animationDirection: 'alternate',
      },
    },
  },
  '@keyframes animationarrow': {
    from: {
      transform: 'translateX(8px) translateY(16px)',
    },
    to: {
      transform: 'translateX(8px) translateY(8px)',
    },
  },
  '@keyframes animationdash': {
    from: {
      transform: 'translateX(16px) translateY(7px)',
      width: '8px',
    },
    to: {
      transform: 'translateX(12px) translateY(7px)',
      width: '16px',
    },
  },
}));

const TblUploadIcon = (props) => {
  const classes = useStyles(props);
  return (
    <Box className={clsx(classes.root)}>
      <UploadIcon className={classes.svg} />
    </Box>
  );
};

TblUploadIcon.propTypes = {
};

export default TblUploadIcon;
