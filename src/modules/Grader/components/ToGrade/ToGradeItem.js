import React from 'react';

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { Box, Grid, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';

import TblActivityIcon from 'components/TblActivityIcon/icon';
import TblIconButton from 'components/TblIconButton';

import { COURSE_ITEM_TYPE } from 'utils/constants';

import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: theme.spacing(5),
    alignItems: 'center',
    padding: theme.spacing(1),
    color: theme.newColors.gray[800],
    borderRadius: theme.borderRadius.default,
    transition: theme.transitionDefault,
    '&:hover': {
      cursor: 'pointer',
      color: theme.customColors.primary1.main,
      backgroundColor: theme.customColors.primary1.light[3],
      '& .MuiIconButton-root': {
        color: theme.customColors.primary1.main,
      },
    },
  },
  icon: {
    flexGrow: 0.5,
    color: theme.newColors.gray[900],
  },
}));

function ToGradeItem(props) {
  const classes = useStyles();
  const {
    item: { assignmentName, totalSubmission, assignmentId },
    courseId,
    startGrading,
  } = props;

  return (
    <Grid
      container
      className={classes.root}
      display='flex'
      onClick={() => startGrading(courseId, assignmentId)}
    >
      <Grid item xs={2}>
        <TblActivityIcon type={COURSE_ITEM_TYPE.ASSIGNMENT} />
      </Grid>
      <Grid item xs={6}>
        <Typography component='div' variant='bodyMedium' className={'text-ellipsis'}>
          {assignmentName}
        </Typography>
      </Grid>

      <Grid item xs={2} >
        <Box textAlign='center'>
        {totalSubmission}

        </Box>
      </Grid>
      <Grid item xs={2}>
        <TblIconButton className={classes.icon} size='small'>
          <ArrowForwardIosIcon />
        </TblIconButton>
      </Grid>
    </Grid>
  );
}

ToGradeItem.propTypes = {
  courseId: PropTypes.number,
  startGrading: PropTypes.func,
  item: PropTypes.object
};

export default ToGradeItem;
