import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import AddIcon from '@mui/icons-material/Add';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import WarningIcon from '@mui/icons-material/Warning';
import { Box, Collapse, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';

import TblButton from 'components/TblButton';
import TblIconButton from 'components/TblIconButton';
import TblTooltip from 'components/TblTooltip';

import { isNull } from 'lodash';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';

import useDidMountEffect from '../../../../../../utils/customHook/useDidMoutEffect';
import myCourseActions from '../../../../actions';

import AttemptItem from './AttemptItem';
const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(3),
  },
  title: {
    fontSize: theme.fontSize.small,
    fontWeight: theme.fontWeight.semi,
    color: theme.newColors.gray[800],
  },
  wrapperLabel: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
    fontSize: theme.fontSize.small,
    fontWeight: theme.fontWeight.semi,
    color: theme.newColors.gray[800],
    '& .MuiButtonBase-root': {
      padding: 0,
    },
  },
  wrapperList: {
    marginLeft: theme.spacing(-2),
    marginRight: theme.spacing(-2),
    // overflowX: 'auto',
    maxHeight: (props) =>
      props.quizSubmissionAttempts.length === 3
        ? theme.spacing(29.5)
        : theme.spacing(24),
  },
  addButton: {
    backgroundColor: '#E0EDFF',
    marginBottom: theme.spacing(1),

    color: '#0567F0',
    '&:hover': {
      backgroundColor: '#E0EDFF',
      color: '#0567F0',
    },
  },
  errorMessage: {
    display: 'flex',
    alignItems: 'center',
    color: theme.openColors.red[8],
    fontWeight: theme.fontWeight.normal,
    fontSize: theme.fontSize.small,
  },
}));
function QuizAttemptList(props) {
  const { disableOverallGrade, disableQuizDetailBeforeTakenOnAndOver7days } =
    props;
  const graderDetail = useSelector((state) => state.AllCourses.graderDetail);
  const { quizSubmissionAttempts } = graderDetail;
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const classes = useStyles({ quizSubmissionAttempts });
  const [show, setShow] = useState(true);
  const [error, setError] = useState();
  const params = useParams();
  const { courseId } = params;

  const {
    creatingQuizAttempt,
    createQuizAttemptSuccess,
    removeQuizAttemptSuccess,
    inputQuizAttemptGradeSuccess,
  } = useSelector((state) => state.AllCourses);

  const disableCreateAttempt =
    quizSubmissionAttempts.length ===
    graderDetail.shadowQuiz.masterQuiz.maxRetakes;
  const disableBeforeTakenOn = moment
    .utc()
    .isBefore(moment.utc(graderDetail?.shadowQuiz?.classSessionEndTime));
  const createNewAttempt = () => {
    if (
      quizSubmissionAttempts.length > 0 &&
      (isNaN(quizSubmissionAttempts[0].grade) ||
        isNull(quizSubmissionAttempts[0].grade))
    ) {
      return setError(t('myCourses:condition_to_create_new_quiz_attempt'));
    }
    setError(null);
    dispatch(
      myCourseActions.mcCreateQuizAttempt({
        creatingQuizAttempt: true,
        createQuizAttemptSuccess: null,
        courseId: courseId,
        shadowQuizId: graderDetail.shadowQuizId,
        studentId: graderDetail.studentId,
      })
    );
  };

  useDidMountEffect(() => {
    if (createQuizAttemptSuccess) {
    }
  }, [createQuizAttemptSuccess]);

  useDidMountEffect(() => {
    if (inputQuizAttemptGradeSuccess) {
    }
  }, [inputQuizAttemptGradeSuccess]);

  useDidMountEffect(() => {
    if (removeQuizAttemptSuccess) {
      enqueueSnackbar(t('common:change_saved'), { variant: 'success' });
    }
  }, [removeQuizAttemptSuccess]);

  useEffect(() => () => {
      dispatch(
        myCourseActions.myCoursesSetState({
          inputQuizAttemptGrade: null,
          creatingQuizAttempt: null,
          createQuizAttemptSuccess: null,
          newQuizAttempt: null,
          removeAttemptId: null,
          removeQuizAttemptSuccess: null,
          inputOverallGradeTestSuccess: null,
        })
      );
    }, [dispatch]);

  return (
    <Box className={classes.root}>
      <Box className={classes.wrapperLabel}>
        <Box mr={1} mb={0}>
          <Typography className={classes.title}>
            {t('myCourses:number_of_attempts')} ({quizSubmissionAttempts.length}
            )
          </Typography>
        </Box>
        <TblIconButton onClick={() => setShow(!show)}>
          {show ? <ExpandMoreIcon /> : <ExpandLessIcon />}
        </TblIconButton>
      </Box>
      <Collapse in={show}>
        <>
          <TblTooltip
            disableHoverListener={
              !disableCreateAttempt &&
              !disableBeforeTakenOn
            }
            title={
              disableCreateAttempt
                ? t('myCourses:maximum_creating_retake', {
                    maxRetakes: graderDetail.shadowQuiz.masterQuiz.maxRetakes,
                  })
                : disableBeforeTakenOn
                ? t('myCourses:unable_to_create_attempt_before_taken_on')
                : null
            }
            placement='top'
            arrow
          >
            <span>
              <TblButton
                disabled={
                  disableCreateAttempt ||
                  disableQuizDetailBeforeTakenOnAndOver7days
                }
                className={classes.addButton}
                variant='contained'
                onClick={() => createNewAttempt()}
                isShowCircularProgress={creatingQuizAttempt}
              >
                <AddIcon
                  sx={{ marginRight: theme.spacing(1) }}
                  fontSize='small'
                />{' '}
                <span>New Attempt </span>
              </TblButton>
            </span>
          </TblTooltip>

          {error && (
            <Box className={classes.errorMessage}>
              <WarningIcon
                fontSize='small'
                sx={{ marginRight: theme.spacing(1) }}
              />
              {error}
            </Box>
          )}
          {quizSubmissionAttempts.map((item, index) => (
            <AttemptItem
              attempt={item}
              key={item.id}
              isAttempt={!!item.name}
              attemptIndex={quizSubmissionAttempts.length - index}
              isLastAttempt={index === 0}
              isLast={index === quizSubmissionAttempts.length - 1}
              onChangeAttemptList={quizSubmissionAttempts}
              disableOverallGrade={disableOverallGrade}
            />
          ))}
        </>
      </Collapse>
    </Box>
  );
}

QuizAttemptList.propTypes = {
  attemptList: PropTypes.shape({
    length: PropTypes.number,
    map: PropTypes.func
  }),
  attemptSelected: PropTypes.shape({
    id: PropTypes.number
  }),
  disableOverallGrade: PropTypes.bool,
  disableQuizDetailBeforeTakenOnAndOver7days: PropTypes.bool,
  label: PropTypes.string,
  onOpenAttempt: PropTypes.func
};

export default QuizAttemptList;
