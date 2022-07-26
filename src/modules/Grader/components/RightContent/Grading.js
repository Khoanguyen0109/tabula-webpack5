import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';

import { Box, Tooltip, Typography } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import makeStyles from '@mui/styles/makeStyles';

import TblInputGrade from 'components/TblInputGrade';

import useDidMountEffect from 'utils/customHook/useDidMoutEffect';

import clsx from 'clsx';
import { isInteger } from 'lodash-es';
import PropTypes from 'prop-types';
import { getNumberWithOrdinal } from 'utils';

import AttemptList from '../../../MyCourses/components/GradeBook/Attempt/AsignmentAttempt/AttemptList';
import GraderActions from '../../actions';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    minHeight: theme.spacing(43),
  },
  attemptTitle: {
    color: theme.newColors.gray[800],
    fontWeight: theme.fontWeight.semi,
    fontSize: theme.fontSize.small,
  },
  grading: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing(1),
    '& .MuiFormControl-root': {
      width: theme.spacing(13),
      height: theme.spacing(5),
      marginRight: theme.spacing(1),
      '& .MuiInputBase-root': {
        paddingRight: 0,
      },
    },
    '& span': {
      color: theme.newColors.gray[800],
      fontWeight: theme.fontWeight.semi,
      fontSize: theme.fontSize.normal,
      marginBottom: theme.spacing(1),
    },
  },
  finalGrade: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: theme.spacing(1),
    '& .MuiTypography-root': {
      color: theme.newColors.gray[800],
      fontWeight: theme.fontWeight.normal,
      fontSize: theme.fontSize.normal,
    },
  },
  rejectBtn: {
    width: '100%',
    marginTop: theme.spacing(2),
    color: theme.newColors.gray[800],
    backgroundColor: theme.newColors.gray[200],
    '&:hover': {
      backgroundColor: theme.newColors.gray[200],
    },
  },
  emptyText: {
    color: theme.newColors.gray[800],
    fontSize: theme.fontSize.small,
    fontWeight: theme.fontWeight.semi,
  },
}));
function Grading(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { t } = useTranslation('grader', 'common');
  const params = useParams();
  const location = useLocation();

  const urlParams = new URLSearchParams(location.search);

  const graderDetail = useSelector((state) => state.Grader.graderDetail);
  const isFetchingGraderDetail = useSelector(
    (state) => state.Grader.isFetchingGraderDetail
  );
  const attemptList = useSelector((state) => state.Grader.attemptList);
  const attemptSelected = useSelector((state) => state.Grader.attemptSelected);
  const inputGradeSuccess = useSelector(
    (state) => state.Grader.inputGradeSuccess
  );
  const attemptGradedId = useSelector((state) => state.Grader.attemptGradedId);

  const isOverTime = useSelector((state) => state.Grader.isOverTime);
  const { totalPossiblePoints } = props;

  // const graderAttemptSelected = useSelector(
  //   (state) => state.Grader.graderAttemptSelected
  // );
  // const finalGradeAttemptSelected = useSelector(
  //   (state) => state.Grader.finalGradeAttemptSelected
  // );

  const graderAttemptSelected = attemptSelected?.grade;
  const finalGradeAttemptSelected = attemptSelected?.finalGrade;
  const [grade, setGrade] = useState(graderAttemptSelected);
  const [defaultShowAttemptList, setDefaultShowAttemptList] = useState(false);
  const index = attemptList?.findIndex(
    (item) => item.id === attemptSelected?.id
  );

  // TL-4113: disable when previous attempt have been graded
  const disableInputGrade =
    (attemptList[0]?.id !== attemptSelected?.id &&
      !isNaN(attemptList[index - 1]?.grade)) ||
    isOverTime;

  const onChange = (value) => {
    onResetInputGradeSuccess();
    setGrade(value);
    // dispatch(
    //   GraderActions.graderSetState({
    //     graderAttemptSelected: value,
    //   })
    // );
  };

  const onResetInputGradeSuccess = () => {
    dispatch(
      GraderActions.graderSetState({
        inputGradeSuccess: null,
        attemptGradedId: null,
      })
    );
  };
  const onGrade = () => {
    // const newGrade = graderAttemptSelected;
    // const oldGrade =  attemptSelected.grade;
    const newGrade = grade;
    const oldGrade = graderAttemptSelected;
    // TL-4113: Return oldGrade if edit empty grade
    if (!isNaN(oldGrade) && !newGrade && newGrade !== 0) {
      onChange(oldGrade);
      return;
    }

    dispatch(
      GraderActions.inputGrade({
        courseId: params.courseId,
        shadowAssignmentId: graderDetail.shadowAssignmentId,
        progressId: graderDetail.id,
        submissionAttemptId: attemptSelected.id,
        data: {
          grade: newGrade,
          studentId: graderDetail.studentId,
        },
      })
    );
  };
  const onOpenAttempt = (attempt) => {
    dispatch(
      GraderActions.graderSetState({
        attemptSelected: attempt,
      })
    );
  };

  /// Init attempt list and attempt selected when change student or filter
  useDidMountEffect(() => {
    setGrade('');
    /// Add index for attempt
    const submissionAttempts = graderDetail.submissionAttempts.map(
      (item, index) => ({
        ...item,
        attemptIndex: graderDetail.submissionAttempts.length - index,
      })
    );
    // Reset InputGradeSuccess when change student or filter
    dispatch(
      GraderActions.graderSetState({
        attemptList: submissionAttempts,
      })
    );
    // Set Default attempt
    if (urlParams.get('attemptSelected') && parseInt(urlParams.get('attemptSelected')) !== -1 ) {
      const searchAttempt = parseInt(urlParams.get('attemptSelected'));
      setDefaultShowAttemptList(true);
      dispatch(
        GraderActions.graderSetState({
          attemptSelected: {
            ...graderDetail.submissionAttempts[searchAttempt],
            attemptIndex:
              graderDetail.submissionAttempts.length - searchAttempt,
          },
        })
      );
    } else {
      if (
        graderDetail.submissionAttempts[0] &&
        graderDetail.submissionAttempts[0].id
      ) {
        dispatch(
          GraderActions.graderSetState({
            attemptSelected: {
              ...graderDetail.submissionAttempts[0],
              attemptIndex: graderDetail.submissionAttempts.length,
            },
          })
        );
      } else {
        dispatch(
          GraderActions.graderSetState({
            attemptSelected: null,
            attemptIndex: 0,
          })
        );
      }
    }
  }, [graderDetail?.submissionAttempts]);

  // Init grade and final grade
  useDidMountEffect(() => {
    if (attemptSelected) {
      setGrade(attemptSelected.grade ?? '');
      dispatch(
        GraderActions.graderSetState({
          graderAttemptSelected: attemptSelected.grade ?? '',
          finalGradeAttemptSelected: attemptSelected.finalGrade,
        })
      );
    }
  }, [attemptSelected]);
  // Update attempt list when input grade success
  useDidMountEffect(() => {
    if (inputGradeSuccess) {
      const index = attemptList.findIndex(
        (item) => item.id === attemptGradedId
      );
      if (index >= 0) {
        attemptList[index].grade = graderAttemptSelected;
        attemptList[index].finalGrade = finalGradeAttemptSelected;
        dispatch(
          GraderActions.graderSetState({
            attemptList: attemptList,
          })
        );
      }
    }
  }, [inputGradeSuccess]);

  if (isFetchingGraderDetail) {
    return (
      <Box className={classes.root}>
        <Skeleton width='100%' height={88} />
      </Box>
    );
  }

  return attemptSelected && attemptSelected?.attemptIndex !== 0 ? (
    <Box>
      <Typography className='title'>
        {`${getNumberWithOrdinal(attemptSelected?.attemptIndex) 
          } ${ 
          t('attempt')}`}
      </Typography>
      <Tooltip
        title={
          isOverTime
            ? t('can_not_edit_submission')
            : disableInputGrade
            ? t('grader:can_not_edit_attempt')
            : ''
        }
      >
        <Box className={classes.grading}>
          <TblInputGrade
            value={grade}
            onChange={onChange}
            onBlur={onGrade}
            placeholder={t('input_grade')}
            totalPossiblePoints={totalPossiblePoints}
            disabled={disableInputGrade}
          />
          <span>{t('out_of_total_point', { totalPossiblePoints })}</span>
        </Box>
      </Tooltip>

      <Box className={clsx(classes.finalGrade, t)}>
        <Typography>
          {t('final_grade_on_total_point', {
            grade: !isNaN(finalGradeAttemptSelected)
              ? isInteger(finalGradeAttemptSelected)
                ? finalGradeAttemptSelected
                : finalGradeAttemptSelected?.toFixed(2)
              : '--',
            totalPossiblePoints,
          })}
        </Typography>
      </Box>
      {/* <TblButton
        className={classes.rejectBtn}
        variant='contained'
        onClick={() => onReject()}
      >
        {t('reject_this_attempt')}
      </TblButton> */}

      <AttemptList
        label={t('attempts')}
        attemptList={attemptList}
        attemptSelected={attemptSelected}
        onOpenAttempt={onOpenAttempt}
        defaultShow={defaultShowAttemptList}
      />
    </Box>
  ) : (
    <Typography className={classes.emptyText}>{t('no_attempts')}</Typography>
  );
}
Grading.propTypes = {
  totalPossiblePoints: PropTypes.number,
};

export default Grading;
