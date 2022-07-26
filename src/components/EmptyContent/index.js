import React from 'react';

import { Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

import emptyImage from 'assets/images/img_data.png';
import clsx from 'clsx';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  emptyContent: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    maxHeight: 'calc(100% - 50px)',
    height: '100%',
    '&.style1': {
      color: theme.palette.primary.main,
      marginTop: theme.spacing(160 / 8 - 2),
    },
  },
  wrapContent: {
    textAlign: 'center',
    fontWeight: theme.fontWeight.light,
    marginTop: '4vh',
    marginBottom: theme.spacing(5),
    alignItems: 'center',
    '& .title': {
      fontWeight: theme.fontWeight.semi,
      fontSize: theme.fontSize.large,
    },
    '& .subtitle': {
      fontSize: theme.fontSize.normal,
      fontWeight: theme.fontWeight.normal,
    },
  },
  image: {
    margin: 'auto',
  },
  emptyTitle: {
    marginTop: theme.spacing(2),
    color: theme.newColors.gray[700],
  },
  emptySubTitle: {
    marginTop: theme.spacing(0.5),
    margin: 'auto',
    maxWidth: 500,
  },
  scrollBar: {
    width: '100%',
  },
}));

export default function EmptyContent(props) {
  const { title, subTitle, className, emptyImage, emptyVideo, width, height } =
    props;
  const classes = useStyles();

  const content = (
    <div className={classes.wrapContent}>
      <div className={classes.image}>
        {emptyVideo ? (
          emptyVideo
        ) : (
          <img
            alt=''
            src={emptyImage || ''}
            width={width}
            height={height}
           />
        )}
      </div>
      {title && (
        <Typography
          component='div'
          variant='bodyLarge'
          className={`${classes.emptyTitle} title`}
        >
          {title}
        </Typography>
      )}
      {subTitle && (
        <Typography
          component='div'
          variant='bodyMedium'
          className={`${classes.emptySubTitle} subtitle`}
        >
          {subTitle}
        </Typography>
      )}
    </div>
  );

  return <div className={clsx(classes.emptyContent, className)}>{content}</div>;
}

EmptyContent.propTypes = {
  icon: PropTypes.string,
  onClick: PropTypes.func,
  title: PropTypes.any,
  subTitle: PropTypes.any,
  className: PropTypes.string,
  emptyImage: PropTypes.any,
  emptyVideo: PropTypes.any,
  width: PropTypes.any,
  height: PropTypes.any,
};

EmptyContent.defaultProps = {
  // title: 'Empty Data',
  // subTitle: 'You can start by creating new lessons, assignments,...',
  className: '',
  emptyImage: emptyImage,
  emptyVideo: '',
  width: '150px',
};
