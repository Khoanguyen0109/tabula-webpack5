import React, { useRef } from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { Box, useMediaQuery } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

import TblCustomScrollbar from 'components/TblCustomScrollbar';
import TblDialog from 'components/TblDialog';

import useDidMountEffect from 'utils/customHook/useDidMoutEffect';
import { formatDateTime } from 'utils/time';

import { useAuthDataContext } from 'AppRoute/AuthProvider';
import { isEmpty, isNaN, isNull, isNumber } from 'lodash';
import moment from 'moment';
import PropTypes from 'prop-types';

import TblInputGrade from '../../../../../components/TblInputGrade';
import myCourseActions from '../../../actions';
import QuizAttemptList from '../../../components/GradeBook/Attempt/QuizAttempt/QuizAttemptList';
import { Row, SubRow } from '../../../components/GradeBook/DetailRow/DetailRow';

const useStyles = makeStyles(() => ({
  root: {
    overflow: 'hidden',
  },
  scrollContent: {
    // [theme.breakpoints.up('md')]: {
    //   height: 500,
    // },
    // [theme.breakpoints.up('lg')]: {
    //   // height: 216,
    // },
    // [theme.breakpoints.up('xl')]: {
    //   width: 280,
    //   // height: 210,
    // },
  },
}));

function QuizDetail(props) {
  const { open, cellSelected, onClose, disableOverallGrade } = props;
  const dispatch = useDispatch();
  const classes = useStyles();
  const params = useParams();
  const { t } = useTranslation('myCourses');
  const scrollRef = useRef();
  const matches = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  const maxScrollHeight = matches ? 600 : 480;
  const { courseId } = params;
  const graderDetail = useSelector((state) => state.AllCourses.graderDetail);
  const loading = !(graderDetail && !isEmpty(graderDetail));

  const fullName =
    `${graderDetail?.students?.firstName } ${ graderDetail?.students?.lastName}`;

  const { currentUser } = useAuthDataContext();
  const { organizationId } = currentUser;
  const [grade, setGrade] = useState('');
  const {
    overallGrade,
    shadowQuiz: {
      makeupDeadline,
      retakeDeadline,
      executeTime,
      masterQuiz: {
        quizName,
        percentCredit,
        allowRetake,
        totalPossiblePoints,
      } = {},
    } = {},
  } = graderDetail ?? {};

  const handleClose = () => {
    onClose();
    dispatch(
      myCourseActions.allCoursesSetState({
        graderDetail: null,
      })
    );
  };

  const onChangeOverallGrade = (overallGrade) => {
    setGrade(overallGrade);
  };

  const onGrade = () => {
    if (!isNull(grade) && !isNaN(grade)) {
      if (grade !== graderDetail.overallGrade) {
        return dispatch(
          myCourseActions.mcInputOverallGradeTest({
            courseId,
            quizSubmissionId: graderDetail.id,
            shadowQuizId: graderDetail.shadowQuizId,
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

  useEffect(() => {
    if (open) {
      const {
        value: { shadowQuizId },
        row: { id },
      } = cellSelected;
      dispatch(
        myCourseActions.mcGetQuizGraderDetail({
          orgId: organizationId,
          courseId,
          shadowId: shadowQuizId,
          studentId: id,
          isFetchingGraderDetail: true,
          graderDetail: {},
          error: {},
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, cellSelected]);

  useDidMountEffect(() => {
    if (graderDetail) {
      onChangeOverallGrade(overallGrade);
    }
  }, [graderDetail]);

  const disableQuizDetailBeforeTakenOnAndOver7days =
    disableOverallGrade ||
    moment
      .utc()
      .isBefore(moment.utc(graderDetail?.shadowQuiz?.classSessionEndTime));
  return (
    <TblDialog
      className={classes.root}
      open={open}
      hasCloseIcon={true}
      onClose={handleClose}
      loading={loading}
      title={fullName}
      subtitle2={quizName}
      showScrollBar={false}
    >
      <Box mb={2}>
        <Row
          label={t('myCourses:overall_grade')}
          render={() => (
            <TblInputGrade
              placeholder={`--/${totalPossiblePoints}`}
              value={grade}
              onChange={onChangeOverallGrade}
              totalPossiblePoints={totalPossiblePoints}
              suffix={`/${totalPossiblePoints}`}
              onBlur={onGrade}
              disabled={disableQuizDetailBeforeTakenOnAndOver7days}
            />
          )}
        />
      </Box>

      <Box>
        <TblCustomScrollbar
          forwardedRef={scrollRef}
          maxHeightScroll={maxScrollHeight}
        >
          <SubRow
            label={t('myCourses:time-test_date')}
            render={() => formatDateTime((executeTime))}
          />
          {makeupDeadline && (
            <SubRow
              label={t('myCourses:make_up_deadline')}
              render={() => formatDateTime((makeupDeadline))}
            />
          )}
          {allowRetake && (
            <>
              <SubRow
                label={t('myCourses:retake_deadline')}
                render={() => formatDateTime((retakeDeadline))}
              />
              <SubRow
                label={`${t('myCourses:percent_credit') } (%)`}
                render={() => `${percentCredit}%`}
              />
              <QuizAttemptList
                overallGrade
                onChangeOverallGrade={onChangeOverallGrade}
                disableOverallGrade={disableOverallGrade}
                disableQuizDetailBeforeTakenOnAndOver7days={
                  disableQuizDetailBeforeTakenOnAndOver7days
                }
              />
            </>
          )}
        </TblCustomScrollbar>
      </Box>
    </TblDialog>
  );
}

QuizDetail.propTypes = {
  cellSelected: PropTypes.object,
  disableOverallGrade: PropTypes.bool,
  onClose: PropTypes.func,
  open: PropTypes.bool,
};

export default QuizDetail;
