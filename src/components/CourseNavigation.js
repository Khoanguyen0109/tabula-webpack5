import React from 'react';

// import PropTypes from 'prop-types';
import AdjustIcon from '@mui/icons-material/Adjust';
import Box from '@mui/material/Box';
import makeStyles from '@mui/styles/makeStyles';

import TblActivityIcon from 'components/TblActivityIcon';

import { ReactComponent as TimelineImg } from 'assets/images/timeline-obj.svg';
import { ReactComponent as TimelineScaleImg } from 'assets/images/timeline-scale-obj.svg';
import img from 'assets/images/timeline-scale-obj.svg';

const useStyles = makeStyles(() => ({

  point: {

  },
  icon: {
    fontSize: 16
  },
  imgScale: {
    backgroundImage: `url(${img})`,
  }
}));
const CourseNavigation = () => {
  const classes = useStyles();

  return (
    <Box>
      <Box display='flex'>
        <Box className={classes.point} display='flex' alignItems='flex-end'><AdjustIcon className={classes.icon} /></Box>
        <Box>Tue - Jan 2</Box>
      </Box>
      <Box pl={0.5}>
        <TimelineImg />
        {/* <Box className={classes.timeline}></Box> */}
        8:00 am - 9:30 am
        </Box>
      <Box className={classes.item} display='flex' pl={0.5}>
        <Box className={classes.imgScale}><TimelineScaleImg /></Box>
        <TblActivityIcon type={1} name='Lesson 1: Get Started' />
      </Box>
      <Box className={classes.item} display='flex' pl={0.5}>
        <Box className={classes.imgScale}><TimelineScaleImg /></Box>
        <TblActivityIcon type={1} name='Lesson 1: Get Started' />
      </Box>
      <Box pl={0.5}>
        <TimelineImg />
        8:00 am - 9:30 am
        </Box>
    </Box>
  );
};
export default CourseNavigation;