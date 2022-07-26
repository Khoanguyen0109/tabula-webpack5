import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { Box, Skeleton, Typography, useMediaQuery } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

import TblButton from 'components/TblButton';
import TblCheckBox from 'components/TblCheckBox';
import TblCustomScrollbar from 'components/TblCustomScrollbar';
import TblDialog from 'components/TblDialog';
import ActivityItemRelease from 'modules/MyCourses/components/GradeBook/ReleasePopup/ActivityItemRelease';

import useDidMountEffect from 'utils/customHook/useDidMoutEffect';

import { capitalize, cloneDeep } from 'lodash';
import myCoursesAction from 'modules/MyCourses/actions';
import { GRADE_WEIGHT_TYPE } from 'modules/MyCourses/constants';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { findNestedObj } from 'utils';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiPaper-root': {
      minWidth: theme.spacing(75),
    },
  },
  searchBox: {
    width: theme.spacing(30),
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(3),
  },
}));

const ReleasePopup = (props) => {
  const {
    open,
    onClose,
    termSelected,
    sectionSelected,
    gradingPeriodSelected,
    currentTerm,
  } = props;
  const classes = useStyles();
  const matches = useMediaQuery((theme) => theme.breakpoints.down('lg'));
  const matchesLg = useMediaQuery((theme) => theme.breakpoints.only('lg'));
  const maxScrollHeight = matches || matchesLg ? 400 : 600;
  const dispatch = useDispatch();
  const scrollRef = useRef();
  const { courseId } = useParams();

  const { enqueueSnackbar } = useSnackbar();

  const { t } = useTranslation('myCourses');
  // const [searchActivity, setSearchActivity] = useState('');
  const [list, setList] = useState([]);
  const releaseGradeStudentSubmissionSuccess = useSelector(
    (state) => state.AllCourses.releaseGradeStudentSubmissionSuccess
  );

  const releaseGradeOfGradeBook = useSelector(
    (state) => state.AllCourses.releaseGradeOfGradeBook
  );
  const activeButton = !!findNestedObj(list, 'checked', true);

  useEffect(() => {
    if (open) {
      const urlParams = {
        sectionId: sectionSelected,
      };
      // Note: if select all grading periods, then not post params grading period id
      if (gradingPeriodSelected !== 'All') {
        urlParams.gradingPeriodId = gradingPeriodSelected;
      }
      dispatch(
        myCoursesAction.mcGetReleaseGradeOfGradeBook({
          termId: termSelected,
          courseId,
          urlParams,
          releaseGradeOfGradeBook: null,
          releaseGradeStudentSubmissionSuccess: null,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, dispatch, open, termSelected]);

  useDidMountEffect(() => {
    if (releaseGradeOfGradeBook) {
      const mapList = releaseGradeOfGradeBook.map((item) => {
        const mapActivity = item.courseActivities.map((activity) => {
          const mapSubmission = (
            activity?.studentProgress ??
            activity?.quizSubmissions ??
            activity?.students ??
            []
          ).map((item) => ({
            ...item,
            submissionId: item?.id ?? item?.participationId,
            checked: false,
          }));
          activity.id =
            activity?.shadowAssignmentId ??
            activity?.shadowQuizId ??
            activity?.gradeWeightCriteriaId;
          activity.name =
            activity?.masterAssignment?.assignmentName ??
            activity?.masterQuiz?.quizName ??
            activity?.name;
          activity.releaseSubmission = mapSubmission;
          return activity;
        });
        item.courseActivities = mapActivity;
        return item;
      });
      setList(cloneDeep(mapList));
    }
  }, [releaseGradeOfGradeBook]);

  useDidMountEffect(() => {
    if (releaseGradeStudentSubmissionSuccess) {
      enqueueSnackbar(t('myCourses:release_grade_successfully'), {
        variant: 'success',
      });
    }
  }, [releaseGradeStudentSubmissionSuccess]);

  const onSelectActivity = (gradeWeightType, activityId, check) => {
    const gradeWeightIndex = list.findIndex(
      (item) => item.type === gradeWeightType
    );
    const activityIndex = list[gradeWeightIndex].courseActivities.findIndex(
      (item) => item.id === activityId
    );
    list[gradeWeightIndex].courseActivities[activityIndex].checked = check;
    const studentSubmissions = list[gradeWeightIndex].courseActivities[
      activityIndex
    ].releaseSubmission.map((item) => ({ ...item, checked: check }));
    list[gradeWeightIndex].courseActivities[activityIndex].releaseSubmission =
      studentSubmissions;
    setList(cloneDeep(list));
  };

  const onSelectSubmission = (
    gradeWeightType,
    activityId,
    submissionId,
    check
  ) => {
    const gradeWeightIndex = list.findIndex(
      (item) => item.type === gradeWeightType
    );
    const activityIndex = list[gradeWeightIndex].courseActivities.findIndex(
      (item) => item.id === activityId
    );
    const studentIndex = list[gradeWeightIndex].courseActivities[
      activityIndex
    ].releaseSubmission.findIndex((item) => item.submissionId === submissionId);
    list[gradeWeightIndex].courseActivities[activityIndex].releaseSubmission[
      studentIndex
    ].checked = check;

    if (
      list[gradeWeightIndex].courseActivities[
        activityIndex
      ].releaseSubmission.every((item) => item.checked === true)
    ) {
      list[gradeWeightIndex].courseActivities[activityIndex].checked = true;
    } else {
      list[gradeWeightIndex].courseActivities[activityIndex].checked = false;
    }
    setList(cloneDeep(list));
  };

  const onSelectAllRelease = () => {
    if (list.length <= 0) {
      return;
    }
    const checkAll = list.every((item) =>
      item.courseActivities.every((activity) => activity.checked === true)
    );

    list.forEach((gradeWeightType) => {
      gradeWeightType.courseActivities.forEach((courseActivity) => {
        courseActivity.checked = !checkAll;
        courseActivity.releaseSubmission.forEach((item) => {
          item.checked = !checkAll;
        });
      });
    });

    setList(cloneDeep(list));
  };
  const onClosePopup = () => {
    onClose();
    dispatch(
      myCoursesAction.myCoursesSetState({
        releaseGradeOfGradeBook: null,
        releaseGradeStudentSubmissionSuccess: null,
      })
    );
  };
  const onRelease = () => {
    const listAssignmentSubmissionIds = [];
    const listQuizSubmissionIds = [];
    const listParticipationIds = [];
    const listStudentIds = [];
    list.forEach((value) => {
      switch (value.type) {
        case GRADE_WEIGHT_TYPE.ASSIGNMENT:
          value.courseActivities.forEach((activity) => {
            activity.releaseSubmission.forEach((submission) => {
              if (submission.checked === true) {
                listAssignmentSubmissionIds.push(submission.submissionId);
                listStudentIds.push(submission.studentId);
              }
            });
          });
          break;
        case GRADE_WEIGHT_TYPE.TEST:
          value.courseActivities.forEach((activity) => {
            activity.releaseSubmission.forEach((submission) => {
              if (submission.checked === true) {
                listQuizSubmissionIds.push(submission.submissionId);
                listStudentIds.push(submission.studentId);
              }
            });
          });
          break;
        case GRADE_WEIGHT_TYPE.PARTICIPATION:
          value.courseActivities.forEach((activity) => {
            activity.releaseSubmission.forEach((submission) => {
              if (submission.checked === true) {
                listParticipationIds.push(submission.submissionId);
                listStudentIds.push(submission.studentId);
              }
            });
          });
          break;
        default:
          break;
      }
    });

    dispatch(
      myCoursesAction.releaseGradeStudentSubmission({
        courseId,
        listAssignmentSubmissionIds,
        listQuizSubmissionIds,
        listParticipationIds,
        currentTermId: currentTerm.id,
        selectedPublicStudentIds: listStudentIds,
      })
    );
    onClosePopup();
  };
  return (
    <TblDialog
      className={classes.root}
      open={open}
      hasCloseIcon={true}
      onClose={onClosePopup}
      showScrollBar={false}
      title={t(t('release_grades'))}
      footer={
        <>
          <Box />
          <Box display='flex'>
            <Box mr={1}>
              <TblButton variant='outlined' color='primary' onClick={onClose}>
                {t('common:cancel')}
              </TblButton>
            </Box>

            <TblButton
              disabled={!activeButton}
              variant='contained'
              color='primary'
              onClick={() => onRelease()}
            >
              {t('release')}
            </TblButton>
          </Box>
        </>
      }
    >
      {/* <Box className={classes.searchBox}>
        <TblInputs
          value={searchActivity}
          // inputProps={{ ref: input => this.searchInput = input }}
          inputSize='medium'
          placeholder={t('common:enter_name')}
          onChange={(e) => {
            e.persist();
            this.onSearch(e);
          }}
          hasSearchIcon={true}
          hasClearIcon={true}
        />
      </Box> */}
      <Box mt={3} ml={-1} display='flex' width={'100%'} alignItems='center'>
        <TblCheckBox
          checked={
            list.some((item) => item.courseActivities.length > 0) &&
            list.every((item) =>
              item.courseActivities.every(
                (activity) => activity.checked === true
              )
            )
          }
          defaultChecked={false}
          onChange={(e) => {
            e.stopPropagation();
            onSelectAllRelease();
          }}
        />
        <Typography className={'text-ellipsis'} variant='bodyMedium'>
          {t('common:select_all')}
        </Typography>
      </Box>
      <Box mt={2}>
        <TblCustomScrollbar
          forwardedRef={scrollRef}
          maxHeightScroll={maxScrollHeight}
        >
          {!releaseGradeOfGradeBook ? (
            <Box>
              <Skeleton height={50} />
              <Skeleton height={50} />
            </Box>
          ) : list.every((item) => item.courseActivities.length === 0) ? (
            <Box mt={1}>
              <Typography variant='bodyMedium'>
                {t('myCourses:no_new_grade')}{' '}
              </Typography>
            </Box>
          ) : (
            <>
              {list?.map((item) => {
                const gradeWeightType = item.type;
                if (item.courseActivities.length === 0) {
                  return null;
                }
                return (
                  <Box mb={3}>
                    <Typography variant='titleSmall'>
                      {capitalize(GRADE_WEIGHT_TYPE[gradeWeightType])}
                    </Typography>

                    {item?.courseActivities.map((activity) => {
                      if (activity.releaseSubmission.length === 0) {
                        return null;
                      }
                      return (
                        <ActivityItemRelease
                          gradeWeightType={gradeWeightType}
                          activity={activity}
                          studentSubmissions={activity.releaseSubmission}
                          onSelectActivity={onSelectActivity}
                          onSelectSubmission={onSelectSubmission}
                        />
                      );
                    })}
                  </Box>
                );
              })}
            </>
          )}
        </TblCustomScrollbar>
      </Box>
    </TblDialog>
  );
};

ReleasePopup.propTypes = {
  gradingPeriodSelected: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  onClose: PropTypes.func,
  open: PropTypes.bool,
  sectionSelected: PropTypes.number,
  termSelected: PropTypes.number,
  currentTerm: PropTypes.object,
};

export default ReleasePopup;
