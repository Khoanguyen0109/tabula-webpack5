import React from 'react';

// material-ui
import { Box, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

import TblDivider from 'components/TblDivider';

import clsx from 'clsx';
import { GRADE_WEIGHT_TYPE } from 'modules/MyCourses/constants';
import PropTypes from 'prop-types';

import ReportItem from './ReportItem';
const useStyles = makeStyles((theme) => ({
  root: {
    
  },
  name: {
    maxWidth: theme.spacing(80)
  }
}));

const ReportGroup = (props) => {
  const { name, type, courseActivities, info } = props;
  const classes = useStyles();
  if (type === GRADE_WEIGHT_TYPE.PARTICIPATION) {
    const { publicFinalGrade } = info;
    return (
      <Box className={classes.root}>
        <Typography variant='titleSmall'>
          {name} {publicFinalGrade ? `(${publicFinalGrade}%)` : '(-)'}
        </Typography>
        <TblDivider />
      </Box>
    );
  } 
    return (
      <Box className={classes.root}>
        <Typography component='div' variant='titleSmall' className={clsx(classes.name , 'text-ellipsis')}>
          {name} ({courseActivities?.length})  
        </Typography>
        <TblDivider />
        <Box mt={2} pr={0}>
          {courseActivities &&
            courseActivities?.map((item) => {
              const name =
                item?.masterAssignment?.assignmentName ??
                item?.masterQuiz?.quizName;
              const totalPossiblePoint =
                item?.masterAssignment?.totalPossiblePoints ??
                item?.masterQuiz?.totalPossiblePoints;
              const overallGrade =
                item?.studentProgress?.[0]?.publicFinalGrade ??
                item?.quizSubmissions?.[0]?.publicFinalGrade;
              const shadowId = item?.shadowAssignmentId ?? item?.shadowQuizId;
              return (
                <ReportItem
                key={`${type}-${shadowId}`}
                shadowId={shadowId}
                type={type}
                  assignmentName={name}
                  totalPossiblePoint={totalPossiblePoint}
                  overallGrade={overallGrade}
                />
              );
            })}
        </Box>
      </Box>
    );
  
};

ReportGroup.propTypes = {
  courseActivities: PropTypes.array,
  info: PropTypes.shape({
    publicFinalGrade: PropTypes.number,
  }),
  name: PropTypes.string,
  type: PropTypes.number,
};

export default ReportGroup;
