import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import { Box } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

import TblInputLabel from 'components/TblInputLabel';

import { ROUTE_MY_COURSES } from 'modules/MyCourses/constantsRoute';

import { ROUTE_GRADER } from '../../routeConstant';

import ToGradeItem from './ToGradeItem';

const useStyles = makeStyles(() => ({
  label: {
    '&:hover': {
      cursor: 'pointer',
    },
  },
}));

function ToGradeList() {
  const history = useHistory();
  const classes = useStyles();
  const toGradeList =
    useSelector((state) => state.AllCourses.toGradeList) || [];

  const startGrading = (courseId, id) => {
    history.push({
      pathname: ROUTE_GRADER.DEFAULT(courseId),
      search: new URLSearchParams({ assignmentId: id }).toString(),
    });
  };
  const toCourse = (courseId) => {
    history.push({
      pathname: ROUTE_MY_COURSES.MY_COURSES_DETAIL(courseId),
      search: new URLSearchParams({ active: 'gradebook' }).toString(),
    });
  };
  return (
    <Box>
      {toGradeList.map((course) => (
        <Box mb={3}>
          <Box mb={2} onClick={() => toCourse(course.courseId)}>
            <TblInputLabel className={classes.label}>
              <span className='text-ellipsis'> {course.courseName} </span>{' '}
              <span style={{ marginLeft: '8px' }}>
                {` (${ course.totalSubmission })`}
              </span>
            </TblInputLabel>
          </Box>
          <Box>
            {course?.assignments.map((item) => (
              <ToGradeItem
                key={item.assignmentId}
                courseId={course.courseId}
                item={item}
                startGrading={startGrading}
              />
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
}

export default ToGradeList;
