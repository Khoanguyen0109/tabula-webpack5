import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { Box, Skeleton } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

import useDidMountEffect from 'utils/customHook/useDidMoutEffect';
import { formatDateTime } from 'utils/time';

import { useTheme } from '@emotion/react';
import { isEmpty, isNull, isNumber } from 'lodash';
import myCourseActions from 'modules/MyCourses/actions';
import PropTypes from 'prop-types';

import TblInputGrade from '../../../../../components/TblInputGrade';
import { ROUTE_GRADER } from '../../../../Grader/routeConstant';
import AttemptList from '../../../components/GradeBook/Attempt/AsignmentAttempt/AttemptList';
import { Row, SubRow } from '../../../components/GradeBook/DetailRow/DetailRow';
import { STATUS_STUDENT_ASSIGNMENT_IN_SUBMISSION_LIST } from '../../../constants';

const useStyles = makeStyles((theme) => ({
  attemptList: {
    '& .MuiTypography-bodyMedium': {
      color: theme.newColors.gray[800],
      fontSize: theme.fontSize.small,
      fontWeight: theme.fontWeight.semi,
    },
  },
}));
function ActivityDetails(props) {
  const { attemptSelected, attemptList, disableOverallGrade } = props;
  const theme = useTheme();
  const classes = useStyles();
  const { courseId } = useParams();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const graderDetail = useSelector((state) => state.AllCourses.graderDetail);
  const [grade, setGrade] = useState(graderDetail?.overallGrade);

  // Load grade first fetch
  useDidMountEffect(() => {
    setGrade(graderDetail?.overallGrade);
  }, [graderDetail?.overallGrade]);

  if (!graderDetail || isEmpty(graderDetail)) {
    return <Skeleton />;
  }
  const {
    status,
    shadowAssignment: {
      masterAssignment: {
        percentCredit,
        allowLateTurnIn,
        totalPossiblePoints,
      } = {},
      originalDueTime,
      finalDueTime,
    } = {},
  } = graderDetail;

  const onGrade = () => {
    if (!isNull(grade) && !isNaN(grade)) {
      if (grade !== graderDetail.overallGrade) {
        return dispatch(
          myCourseActions.mcInputOverallGrade({
            courseId,
            progressId: graderDetail.id,
            shadowAssignmentId: graderDetail.shadowAssignmentId,
            data: {
              overallGrade: grade,
              studentId: graderDetail.studentId,
            },
          })
        );
      }
      return;
    } 
      if (isNumber(graderDetail.overallGrade)) {
        setGrade(graderDetail.overallGrade);
      }
    
  };
  const onChange = (value) => {
    setGrade(Number(value));
  };
  const { name } = STATUS_STUDENT_ASSIGNMENT_IN_SUBMISSION_LIST[status];
  let statusLabel = t(`myCourses:${name}`);

  const onOpenGrader = (attempt) => {
    const attemptIndex = attemptList.findIndex((atp) => atp.id === attempt.id);
    const params = {
      studentId: graderDetail.studentId,
      unitId: graderDetail.shadowAssignment.masterAssignment.unitId,
      assignmentId: graderDetail.shadowAssignment.masterAssignment.id,
      attemptSelected: attemptIndex,
      sectionId: graderDetail.students.sections[0].id,
    };
    const path = ROUTE_GRADER.DEFAULT(courseId);
    const search = new URLSearchParams(params).toString();
    window.open(`${window.location.origin}${path}?${search}`);
  };

  return (
    <Box>
      <Row label={t('common:status')} render={() => statusLabel} />
      <Row
        label={t('myCourses:overall_grade')}
        render={() => (
          <TblInputGrade
            placeholder={`--/${totalPossiblePoints}`}
            value={grade}
            onChange={onChange}
            totalPossiblePoints={totalPossiblePoints}
            suffix={`/${totalPossiblePoints}`}
            onBlur={onGrade}
            disabled={disableOverallGrade}
          />
        )}
      />

      <SubRow
        label={t('myCourses:original_due')}
        render={() => formatDateTime(originalDueTime)}
      />
      {allowLateTurnIn && (
        <SubRow
          label={t('myCourses:final_due')}
          render={() => formatDateTime(finalDueTime)}
        />
      )}
      <SubRow
        label={`${t('myCourses:percent_credit') } (%)`}
        ß
        render={() => `${percentCredit}%`}
      />
      <Box
        sx={{
          marginTop: theme.spacing(3),
        }}
        className={classes.attemptList}
      >
        {attemptList.length === 0 ? (
          <Box mb={-3}>
            <Row label={t('myCourses:no_attempts')} render={() => null} />
          </Box>
        ) : (
          <AttemptList
            label={
              `${t('myCourses:number_of_attempts') 
              } (${ 
              attemptList.length 
              })`
            }
            attemptList={attemptList}
            attemptSelected={attemptSelected}
            onOpenGrader={onOpenGrader}
            viewShowMore={false}
          />
        )}
      </Box>
    </Box>
  );
}

ActivityDetails.propTypes = {
  attemptList: PropTypes.array,
  attemptSelected: PropTypes.shape({
    id: PropTypes.number
  }),
  disableOverallGrade: PropTypes.bool,
};

ActivityDetails.defaultProps = {
  attemptList: []
};

export default ActivityDetails;
