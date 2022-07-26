import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { Box, Typography } from '@mui/material';
import Divider from '@mui/material/Divider';
import makeStyles from '@mui/styles/makeStyles';

import TblButton from 'components/TblButton';
import TblCheckboxWithLable from 'components/TblCheckBox/CheckBoxWithLabel';
import TblConfirmDialog from 'components/TblConfirmDialog';

import useDidMountEffect from 'utils/customHook/useDidMoutEffect';
import { formatDateSlash } from 'utils/time';

import { isNaN, isNull, isNumber } from 'lodash';
import myCourseActions from 'modules/MyCourses/actions';
import PropTypes from 'prop-types';
import { getNumberWithOrdinal } from 'utils';

import TblInputGrade from '../../../../../../components/TblInputGrade';
import { SubRow } from '../../DetailRow/DetailRow';

const useStyles = makeStyles((theme) => ({
  box: {
    display: 'flex',
    alignItems: 'baseLine',
    marginBottom: theme.spacing(2),

    gap: theme.spacing(1.2),
  },
  name: {
    fontSize: theme.fontSize.small,
  },
  circle: {
    borderRadius: '50%',
    width: theme.spacing(1),
    height: theme.spacing(1),
    backgroundColor: theme.newColors.gray[400],
  },
  checkbox: {
    '& .MuiTypography-bodyMedium': {
      fontSize: theme.fontSize.small,
    },
  },
  removeBtn: {
    padding: 0,
    color: theme.newColors.gray[800],
    fontWeight: theme.fontWeight.normal,
    textDecoration: 'underline',
  },
  inputRow: {
    marginTop: '-30px',
    '& .MuiGrid-root': {
      marginBottom: `${0 }!important`,
      paddingTop: `${theme.spacing(1) }!important`,
    },
    '& .TblInputs': {
      marginBottom: `${0 }!important`,
    },
  },
}));
function AttemptItem(props) {
  const {
    isLast,
    isLastAttempt,
    attempt,
    attemptIndex,
    disableOverallGrade,
  } = props;
  const { retake, makeup, gradedAt, grade } = attempt;
  const params = useParams();
  const { courseId } = params;
  const dispatch = useDispatch();
  const classes = useStyles();
  const { t } = useTranslation();
  const graderDetail = useSelector((state) => state.AllCourses.graderDetail);
  const [attemptState, setAttemptState] = useState({
    ...attempt,
  });
  const [openConfirm, setOpenConfirm] = useState(false);
  const onGradeAttempt = () => {
    if (
      attemptState.grade === grade &&
      attemptState.retake === retake &&
      attemptState.makeup === makeup
    ) {
      return;
    }
    if (
      (isNull(attemptState.grade) || isNaN(attemptState.grade)) &&
      isNumber(grade)
    ) {
      setAttemptState({
        ...attemptState,
        grade: grade,
      });
    } else {
      dispatch(
        myCourseActions.mcInputGradeQuizAttempt({
          courseId,
          shadowQuizId: graderDetail.shadowQuizId,
          studentId: graderDetail.studentId,
          attemptId: attempt.id,

          inputQuizAttemptGrade: attemptState.grade,
          retake: attemptState.retake,
          makeup: attemptState.makeup,

          inputQuizAttemptGradeSuccess: null,
        })
      );
    }
  };
  const onRemoveAttempt = () => {
    if (!isNull(grade) && !isNaN(grade)) {
      return setOpenConfirm(true);
    }
    return removeAttempt();
  };
  const onCloseConfirm = () => {
    setOpenConfirm(false);
  };
  const confirmDelete = () => {
    setOpenConfirm(false);
    removeAttempt();
  };
  const removeAttempt = () => {
    dispatch(
      myCourseActions.mcRemoveQuizAttempt({
        courseId,
        shadowQuizId: graderDetail.shadowQuizId,
        studentId: graderDetail.studentId,
        attemptId: attempt.id,
        removeQuizAttemptSuccess: null,
      })
    );
  };
  const onGrade = (overallGrade) => {
    setAttemptState({
      ...attemptState,
      grade: overallGrade,
    });
  };

  useDidMountEffect(() => {
    setAttemptState(attempt);
  }, [attempt]);

  useDidMountEffect(() => {
    onGradeAttempt();
  }, [attemptState.retake, attemptState.makeup]);
  return (
    <Box>
      <Box className={classes.box}>
        <Box className={classes.circle} />
        <Box sx={{ flexGrow: 2 }}>
          <Typography className={classes.name} noWrap={true}>
            {getNumberWithOrdinal(attemptIndex)} attempt
          </Typography>

          <Box className={classes.checkbox} display='flex' ml={-0.5}>
            <TblCheckboxWithLable
              disabled={!isLastAttempt || disableOverallGrade}
              name='retake'
              className={classes.checkbox}
              label={t('myCourses:retake')}
              checked={attemptState.retake}
              onChange={() =>
                setAttemptState({
                  ...attemptState,
                  retake: !attemptState.retake,
                })
              }
            />
            <TblCheckboxWithLable
              disabled={!isLastAttempt || disableOverallGrade}
              name='makeup'
              label={t('myCourses:make_up')}
              checked={attemptState.makeup}
              onChange={() =>
                setAttemptState({
                  ...attemptState,
                  makeup: !attemptState.makeup,
                })
              }
            />
          </Box>
          <Box className={classes.inputRow}>
            <SubRow
              label={t('myCourses:grade')}
              render={() => (
                <TblInputGrade
                  disabled={!isLastAttempt || disableOverallGrade}
                  placeholder={'--'}
                  value={attemptState.grade}
                  onBlur={onGradeAttempt}
                  onChange={onGrade}
                  totalPossiblePoints={
                    graderDetail.shadowQuiz.masterQuiz.totalPossiblePoints
                  }
                />
              )}
            />
            <SubRow
              label={t('myCourses:final_grade')}
              render={() => (
                <TblInputGrade
                  placeholder={'--'}
                  disabled={true}
                  value={attemptState.finalGrade}
                  onChange={() => {}}
                />
              )}
            />

            <Box mt={1}>
              <SubRow
                label={t('myCourses:grade_date')}
                render={() => (
                  <Box ml={1}>
                    {gradedAt ? formatDateSlash(gradedAt) : '--'}
                  </Box>
                )}
              />
            </Box>
          </Box>
        </Box>
        <Box>
          <TblButton
            disabled={disableOverallGrade}
            onClick={() => onRemoveAttempt()}
            className={classes.removeBtn}
            variant='text'
          >
            {t('common:remove')}
          </TblButton>
        </Box>
      </Box>
      {!isLast && <Divider />}
      <TblConfirmDialog
        cancelText={t('common:cancel')}
        okText={t('common:delete')}
        open={openConfirm}
        onConfirmed={confirmDelete}
        message={t('myCourses:delete_attempt_message')}
        onCancel={onCloseConfirm}
        title={t('myCourses:delete_attempt')}
      />
    </Box>
  );
}

AttemptItem.propTypes = {
  attempt: PropTypes.shape({
    finalGrade: PropTypes.number,
    grade: PropTypes.number,
    gradedAt: PropTypes.string,
    id: PropTypes.number,
    makeup: PropTypes.bool,
    retake: PropTypes.bool
  }),
  attemptIndex: PropTypes.number,
  disableOverallGrade: PropTypes.bool,
  isLast: PropTypes.bool,
  isLastAttempt: PropTypes.bool
};

export default AttemptItem;
