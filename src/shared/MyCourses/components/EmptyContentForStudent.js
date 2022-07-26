import React from 'react';

import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';

import EmptyContent from 'components/EmptyContent';

import emptyImage from 'assets/images/task-empty-list.svg';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  emptyVideo: {
    minHeight: '320px',
    height: '50vh',
    width: 'auto',
    maxWidth: '100%'
  },
  subTitle: {
    color: theme.newColors.gray[900]
  }
}));

export default function EmptyContentForStudent({ scrollable, subTitle, ...props }) {
  const classes = useStyles();
  return (
    <EmptyContent
      scrollable={scrollable}
      emptyImage={emptyImage}
      width={234}
      height={219}
      subTitle={<Typography variant='labelLarge' className={classes.subTitle}>
        {subTitle}
      </Typography>}
      {...props}
    />

  );
}

EmptyContentForStudent.propTypes = {
  scrollable: PropTypes.bool,
  subTitle: PropTypes.string
};

EmptyContentForStudent.defaultProps = {
  scrollable: false
};
