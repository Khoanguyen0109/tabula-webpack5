import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import ExpandCircleDownOutlinedIcon from '@mui/icons-material/ExpandCircleDownOutlined';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { Box, Collapse, Skeleton, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';

import TblButton from 'components/TblButton';
import TblCustomScrollbar from 'components/TblCustomScrollbar';
import TblIconButton from 'components/TblIconButton';
import TblTooltip from 'components/TblTooltip';

import useDidMountEffect from 'utils/customHook/useDidMoutEffect';
import { isGuardian } from 'utils/roles';

import { useAuthDataContext } from 'AppRoute/AuthProvider';
import clsx from 'clsx';
import gradeReportActions from 'modules/GradeReport/actions';
import {
  GRADE_WEIGHT_TYPE,
  STATUS_STUDENT_ASSIGNMENT_IN_SUBMISSION_LIST,
  STATUS_STUDENT_QUIZ_SUBMISSION,
} from 'modules/MyCourses/constants';
import PropTypes from 'prop-types';

import ReportAttemptItem from './ReportAttemptItem';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
  },
  opened: {
    color: theme.newColors.primary[500],
  },
  name: {
    maxWidth: theme.spacing(50),
  },
  icon: {
    color: theme.newColors.gray[700],
    fontSize: theme.fontSizeIcon.small,
  },
  iconBtn: {
    padding: 0,
  },

  expandLessIcon: {
    transform: 'rotate(0) ',
  },
  expendIcon: {
    transform: 'rotate(-90deg)',
  },
  detail: {
    backgroundColor: theme.newColors.gray[50],
    borderRadius: theme.borderRadius.default,
    padding: theme.spacing(2),
  },
  wrapperLabel: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(1),
    fontSize: theme.fontSize.small,
    fontWeight: theme.fontWeight.semi,
    color: theme.openColors.gray[800],
    '& .MuiButtonBase-root': {
      padding: 0,
      color: theme.openColors.gray[800],
      marginLeft: theme.spacing(1),
    },
  },
  showMore: {
    backgroundColor: 'transparent',
    color: theme.newColors.gray[800],
  },
  popper: {
    marginLeft: '30px !important',
  },
}));

const ReportItem = (props) => {
  const { type, shadowId, assignmentName, totalPossiblePoint, overallGrade } =
    props;
  const classes = useStyles();
  const theme = useTheme();
  // const {attempts = [1]} = props;
  const { t } = useTranslation('myCourses');
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState({});
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [showAttempt, setShowAttempt] = useState(true);
  const [showMore, setShowMore] = useState(false);
  const authContext = useAuthDataContext();

  const currentStudentId = authContext?.currentStudentId;

  const gradeReportAssignmentDetail = useSelector(
    (state) => state.GradeReport.gradeReportAssignmentDetail
  );
  const gradeReportQuizDetail = useSelector(
    (state) => state.GradeReport.gradeReportQuizDetail
  );

  const attempts =
    detail?.submissionAttempts ?? detail?.quizSubmissionAttempts ?? [];
  const numberOfItems = showMore ? attempts.length : 3;

  const status =
    type === GRADE_WEIGHT_TYPE.ASSIGNMENT
      ? STATUS_STUDENT_ASSIGNMENT_IN_SUBMISSION_LIST[detail?.status]?.name
      : STATUS_STUDENT_QUIZ_SUBMISSION[detail?.status]?.name ??
        STATUS_STUDENT_QUIZ_SUBMISSION[0]?.name;
  const statusLabel = t(`myCourses:${status}`);

  const getReportDetail = () => {
    const isGuardianRole = isGuardian(authContext.currentUser);
    const urlParams = {};
    if (isGuardianRole) {
      urlParams.studentId = currentStudentId;
    }
    switch (type) {
      case GRADE_WEIGHT_TYPE.ASSIGNMENT:
        return dispatch(
          gradeReportActions.getGradeReportAssignmentDetail({
            shadowId,
            urlParams
          })
        );
      case GRADE_WEIGHT_TYPE.TEST:
        return dispatch(
          gradeReportActions.getGradeReportQuizDetail({
            shadowId,
            urlParams
          })
        );
      default:
        break;
    }
  };

  const onSetDetail = () => {
    setLoadingDetail(false);
    switch (type) {
      case GRADE_WEIGHT_TYPE.ASSIGNMENT:
        if (
          gradeReportAssignmentDetail &&
          gradeReportAssignmentDetail.shadowAssignmentId === shadowId
        ) {
          return setDetail(gradeReportAssignmentDetail);
        }
        return;
      case GRADE_WEIGHT_TYPE.TEST:
        if (
          gradeReportQuizDetail &&
          gradeReportQuizDetail.shadowQuizId === shadowId
        ) {
          return setDetail(gradeReportQuizDetail);
        }
        return;
      default:
        break;
    }
  };

  useDidMountEffect(() => {
    if (open) {
      getReportDetail();
    }
  }, [open]);

  useDidMountEffect(() => {
    onSetDetail();
  }, [gradeReportQuizDetail, gradeReportAssignmentDetail]);

  const onOpen = () => {
    if (!open) {
      setLoadingDetail(true);
      return setOpen(true);
    }
    return setOpen(false);
  };
  return (
    <Box mb={2}>
      <div
        className={clsx(classes.root, open && classes.opened)}
        onClick={() => onOpen()}
      >
        <ExpandCircleDownOutlinedIcon
          sx={{ marginRight: '8px' }}
          fontSize={'10px'}
          className={open ? classes.expandLessIcon : classes.expendIcon}
        />
        <Box flexGrow={8}>
          <Typography
            component='div'
            variant='bodyMedium'
            className={clsx(classes.name, 'text-ellipsis')}
          >
            {assignmentName}
          </Typography>
        </Box>

        <Box display='flex' alignItem='center'>
          <Typography
            sx={{ marginRight: theme.spacing(5.1) }}
            flexGrow={1}
            variant='bodyMedium'
          >
            <Typography
              variant='bodyMedium'
              component='span'
              sx={{ minWidth: theme.spacing(4), fontWeight: theme.fontWeight.semi }}
            >
              {overallGrade ?? '--'}
            </Typography>
            /{totalPossiblePoint}
          </Typography>
        </Box>
      </div>
      {open &&
      <TblCustomScrollbar maxHeightScroll={'500px'} >

        {(loadingDetail ? (
          <Box>
            <Skeleton height={200} />
          </Box>
        ) : (
          <Box className={classes.detail}>
            <Box display='flex' mb={2}>
              <Typography
                sx={{
                  width: theme.spacing(12.5),
                  marginRight: theme.spacing(4),
                }}
                variant='bodyMedium'
              >
                {t('overall_grade')}
              </Typography>
              <Typography variant='titleSmall'>
                {' '}
                {overallGrade ?? '--'}/{totalPossiblePoint}
              </Typography>
            </Box>
            <Box display='flex' mb={2}>
              <Typography
                sx={{
                  width: theme.spacing(12.5),
                  marginRight: theme.spacing(4),
                }}
                variant='bodyMedium'
              >
                {t('common:status')}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'white',
                  padding: theme.spacing(0.2, 1),
                  borderRadius: theme.borderRadius.default,
                  border: '1px solid',
                  borderColor: theme.newColors.gray[300],
                }}
              >
                <Typography variant='bodyMedium'>
                  {t(`myCourses:${statusLabel}`)}
                </Typography>
              </Box>
            </Box>

            <Box className={classes.wrapperLabel}>
              <Box mr={1} mb={0}>
                <Typography variant='bodyMedium'>
                  {t('myCourses:number_of_attempts')} ({attempts.length})
                </Typography>
              </Box>
              <TblTooltip
                classes={{
                  popper: classes.popper,
                }}
                title={t('myCourses:indicator_attempt_grade')}
                placement='right'
                arrow
              >
                <HelpOutlineIcon sx={{ fontSize: '15px' }} />
              </TblTooltip>
              <TblIconButton
                onClick={() => setShowAttempt(!showAttempt)}
              >
                {showAttempt ? (
                  <ExpandMoreIcon fontSize='small' />
                ) : (
                  <ExpandLessIcon fontSize='small' />
                )}
              </TblIconButton>
            </Box>
            <Collapse in={showAttempt}>
              <>
                {attempts.slice(0, numberOfItems).map((item, index) => (
                    <ReportAttemptItem
                      attemptIndex={attempts.length - index}
                      attempt={item}
                    />
                  ))}
                {attempts.length > 3 && (
                  <TblButton
                    className={classes.showMore}
                    variant='text'
                    color='secondary'
                    onClick={() => setShowMore(!showMore)}
                  >
                    <Typography variant='labelLarge'>
                      {showMore
                        ? t('grader:show_less_attempt')
                        : t('grader:show_more_attempt')}
                    </Typography>
                  </TblButton>
                )}
              </>
            </Collapse>
          </Box>
        ))}
        </TblCustomScrollbar>

        }
        
    </Box>
  );
};

ReportItem.propTypes = {
  assignmentName: PropTypes.string,
  overallGrade: PropTypes.string,
  shadowId: PropTypes.number,
  totalPossiblePoint: PropTypes.number,
  type: PropTypes.number,
};

export default ReportItem;
