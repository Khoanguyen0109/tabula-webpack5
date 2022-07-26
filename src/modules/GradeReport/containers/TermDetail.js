import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Box, Skeleton } from '@mui/material';

import { isGuardian } from 'utils/roles';

import { useAuthDataContext } from 'AppRoute/AuthProvider';
import gradeReportActions from 'modules/GradeReport/actions';
import PropTypes from 'prop-types';

import GradeCard from '../components/GradeCard';
import ReportGroup from '../components/ReportGroup';

const TermDetail = (props) => {
  const { term, courseSelected } = props;
  const authContext = useAuthDataContext();
  const{currentUser} = authContext;
  const dispatch = useDispatch();
  const gradeReport = useSelector((state) => state.GradeReport.gradeReport);
  const fetchingGradeReport =
    useSelector((state) => state.GradeReport.fetchingGradeReport) ?? true;

  useEffect(() => {
    let urlParams = {};
    if(isGuardian(currentUser)){
      urlParams.studentId = authContext?.currentStudentId;
 
    }
    dispatch(
      gradeReportActions.getGradeReport({
        fetchingGradeReport: true,
        courseId: courseSelected.id,
        termId: term.id,
        gradeReport: null,
        urlParams
      })
    );
    return () => {
      dispatch(
        gradeReportActions.gradeReportSetState({
          gradeReport: null,
        })
      );
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [term]);

  if (fetchingGradeReport || !gradeReport) {
    return (
      <Box mt={5}>
        <Skeleton height={100} />
        <Box mt={4}>
          <Skeleton height={50} />
          <Skeleton height={50} />
        </Box>
      </Box>
    );
  }

  return (
    <Box mt={5} >
      <GradeCard
        overallGrade={gradeReport?.courseStudent.publicOverallGrade}
        letterGrade={gradeReport?.courseStudent.letterValue}
      />
      <Box mt={4}>
        {gradeReport?.activities.map((group) => (
          <ReportGroup
            type={group.type}
            courseActivities={group.courseActivities}
            name={group.name}
            info={group.info}
           />
        ))}

      </Box>
    </Box>
  );
};

TermDetail.propTypes = {
  courseSelected: PropTypes.shape({
    id: PropTypes.number
  }),
  term: PropTypes.shape({
    id: PropTypes.number
  })
};

export default TermDetail;
