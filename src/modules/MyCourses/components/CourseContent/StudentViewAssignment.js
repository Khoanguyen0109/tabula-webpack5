//TODO: Need to refactor
// ** Clean the logic
// ** Remove code comment unuseful
// END
import React, {
  useCallback,
  useContext,
  useEffect,
  useState,
  // useState
} from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router';
import { useHistory } from 'react-router-dom';

import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';

import { Typography } from '@mui/material';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import makeStyles from '@mui/styles/makeStyles';

import TblConfirmDialog from 'components/TblConfirmDialog';
import TblGoogleLabel from 'components/TblGoogleFile/TblGoogleLable';
import TblViewContentEditor from 'components/TblViewContentEditor';

import { isTeacher } from 'utils/roles';

import AttachmentLabel from 'shared/Attachments/Attachment/AttachmentLabel';
import AttachmentList from 'shared/Attachments/Attachment/AttachmentList';
import LinkedContents from 'shared/MyCourses/containers/LinkedContents';
import myTasksSharedActions from 'shared/MyTasks/actions';

import { AuthDataContext } from 'AppRoute/AuthProvider';
import myCoursesActions from 'modules/MyCourses/actions';
import { TASK_STATUS } from 'modules/MyTasks/constants';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';

// import filter from 'lodash/filter';

// import TblConfirmDialog from 'components/TblConfirmDialog';
// import TblButton from 'components/TblButton';
// import Tabs from 'components/TblTabs';

import TblGoogleFileList from '../../../../components/TblGoogleFileList';
import { formatTimeNeeded } from '../../../MyTasks/utils';
import {
  STATUS_STUDENT_ASSIGNMENT,
  // STUDENT_PROGRESS_STATUS,
} from '../../constants';
import { getPathname } from '../../utils';

const useStyles = makeStyles((theme) => ({
  // content: {
  //   display: 'flex',
  // },
  leftContent: {
    // width: '100%',
    paddingRight: theme.spacing(4),
  },
  // rightContent: {
  //   minWidth: 288,
  // },

  row: {
    display: 'flex',
    alignItems: 'center',
  },
  startBtn: {
    marginLeft: 'auto',
  },
  turnInBtn: {
    marginLeft: theme.spacing(2),
  },
  label: {
    fontSize: theme.fontSize.normal,
    fontWeight: theme.fontWeight.semi,
    color: theme.mainColors.primary1[0],
    marginBottom: theme.spacing(1),
    paddingLeft: 0,
  },

  value: {
    fontSize: theme.fontSize.normal,
    color: theme.mainColors.primary1[0],
    overflowWrap: 'break-word',
  },

  editorValue: {
    outline: 'none',
    overflow: 'auto',
  },
  noneValue: {
    fontSize: theme.fontSize.normal,
    color: theme.newColors.gray[700],
  },
  rootTabPanel: {
    background: theme.newColors.gray[100],
    marginTop: 0,
  },
  fileSubmission: {
    padding: theme.spacing(2),
  },
  taskStatus: {
    padding: theme.spacing(0.5, 1),
    backgroundColor: theme.newColors.gray[300],
    color: theme.mainColors.primary1[0],
    fontSize: theme.fontSize.normal,
    marginLeft: theme.spacing(1),
    borderRadius: theme.spacing(1),
  },
  link: {
    color: theme.mainColors.primary2[0],
    fontSize: theme.fontSize.normal,
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  emptyTaskInfoLine: {
    width: 4,
    background: theme.newColors.gray[300],
    borderRadius: 8,
  },
}));
const myCoursesSelector = (state) => state.AllCourses;

// NOTE : Remove material
// function NoneValue() {
//   const { t } = useTranslation(['common']);
//   const classes = useStyles();

//   return <div className={classes.noneValue}>{t('common:none')}</div>;
// }
function StudentViewAssignment(props) {
  const { shadowId, getAssignmentDetails, sectionId } = props;
  const {
    errorStudentEditShadowAssignment,
    shadowAssignmentDetail,
    studentEditShadowAssignmentSuccess,
    isTurnIn,
  } = useSelector(myCoursesSelector);
  // const [open, setOpen] = React.useState(visible);
  const history = useHistory();
  const classes = useStyles();
  const dispatch = useDispatch();
  const authContext = useContext(AuthDataContext);
  const { organizationId } = authContext.currentUser;
  const { t } = useTranslation(['myCourses', 'common', 'myTasks']);

  const [message, setMessage] = useState('');
  const currentUser = useSelector((state) => state.Auth.currentUser);
  const taskInProgress = useSelector(
    (state) => state.MyTasksShared.taskInProgressShared
  );
  const match = useRouteMatch();
  const courseId = match.params.courseId;

  const { enqueueSnackbar } = useSnackbar();

  const showNotification = useCallback(() => {
    if (isTurnIn) {
      return enqueueSnackbar(t('turned_in_toast'), {
        variant: 'success',
      });
    }
    return enqueueSnackbar(t('common:change_saved'), {
      variant: 'success',
    });
  }, [enqueueSnackbar, isTurnIn, t]);

  const onCancel = () => {
    setMessage('');
  };

  useEffect(() => {
    const { organizationId } = currentUser;
    dispatch(
      myTasksSharedActions.mtGetTaskInProgress({
        orgId: organizationId,
        isFetchingMTTaskInProgress: true,
      })
    );
  }, [currentUser, dispatch, shadowAssignmentDetail]);

  useEffect(() => {
    if (studentEditShadowAssignmentSuccess) {
      showNotification();
      getAssignmentDetails(shadowId, sectionId);
      dispatch(
        myCoursesActions.myCoursesSetState({
          studentEditShadowAssignmentSuccess: false,
          isTurnIn: false,
        })
      );
    }
  }, [
    courseId,
    dispatch,
    getAssignmentDetails,
    organizationId,
    sectionId,
    shadowId,
    showNotification,
    studentEditShadowAssignmentSuccess,
  ]);

  const onViewTaskDetail = () => {
    if (
      !!taskInProgress.taskId &&
      taskInProgress.taskId !== shadowAssignmentDetail.tasks[0].id
    ) {
      return setMessage(
        t(
          `The task ${taskInProgress.taskName} is in-progress. You can not view the task ${shadowAssignmentDetail.name} at the moment.`
        )
      );
    }
    const path = getPathname(authContext, shadowAssignmentDetail?.tasks[0]);
    return history.push(path);
  };

  return (
    <>
      {!isEmpty(errorStudentEditShadowAssignment) &&
        errorStudentEditShadowAssignment?.subcode !== 422 &&
        errorStudentEditShadowAssignment?.subcode !== 4 && (
          <Box mb={2}>
            <Alert severity='error'>
              {errorStudentEditShadowAssignment?.message}
            </Alert>
          </Box>
        )}

      <Grid className={classes.content} container>
        <Grid item xs={8} className={classes.leftContent}>
          <div className={classes.row}>
            <div>
              <div className={classes.label}>Status</div>
              <div className={classes.value}>
                {t(
                  STATUS_STUDENT_ASSIGNMENT[
                    get(shadowAssignmentDetail, 'studentProgress[0].status')
                  ]?.name
                )}
              </div>
            </div>
          </div>
          {shadowAssignmentDetail?.tasks?.length ? (
            <Box mt={3}>
              <Box>
                <Typography variant='bodyMedium' color='primary'>
                  {shadowAssignmentDetail?.tasks[0]?.status !== 3
                    ? t('go_to_my_task_message')
                    : t('to_view_completed_task')}
                </Typography>
              </Box>

              <Box display='flex' alignItems='center' mt={1}>
                <span onClick={onViewTaskDetail} className={classes.link}>
                  {t('view_task_details')}
                </span>
                <div className={classes.taskStatus}>
                  {t(
                    `myTasks:${
                      TASK_STATUS[shadowAssignmentDetail?.tasks[0]?.status]
                    }`
                  )}
                </div>
              </Box>
            </Box>
          ) : (
            !isTeacher(currentUser) && (
              <Box mt={3} display='flex'>
                <Box className={classes.emptyTaskInfoLine} mr={1} />
                <Box>{t('myTasks:empty_task_info')}</Box>
              </Box>
            )
          )}
          <Box mt={3}>
            {/*NOTE: Section 3 in TL-3330*/}
            <div className={classes.label}>{t('common:description')}</div>
              <TblViewContentEditor
                content={shadowAssignmentDetail?.masterAssignment?.requirement}
              />
          </Box>
          <Box mt={3.5}>
            <Typography variant='labelLarge'>
              {t('common:attachments')}
            </Typography>
          </Box>
          <Box mt={3}>
            <TblGoogleLabel />
            <TblGoogleFileList
              list={shadowAssignmentDetail?.masterAssignment?.googleFiles}
            />
          </Box>
          <Box mt={3}>
            <AttachmentLabel />
            <AttachmentList
              files={shadowAssignmentDetail?.masterAssignment?.attachments}
              canDownload={true}
            />
          </Box>
          <Box mt={3} ml={-1}>
            <LinkedContents
              actionLabel={null}
              ableViewItem
              // subtitle={t('choose_courses_activities', { type: 'Lesson' })}
              // courseActivityInfo={lessonDetail}
              // unit={unit}
              noMarginLeft
              type='student-view'
              sectionId={sectionId}
              initialLinkedContents={
                shadowAssignmentDetail?.masterAssignment?.linkData
              }
              viewOnly
            />
          </Box>
        </Grid>

        <Grid item xs={4} className={classes.rightContent}>
          <Box>
            <div className={classes.label}>{t('due')}</div>
            <div className={classes.value}>
              {moment(shadowAssignmentDetail?.originalDueTime).format(
                'MMM DD, YYYY - hh:mm a'
              )}
            </div>
          </Box>

          {shadowAssignmentDetail?.finalDueTime && (
            <Box mt={3}>
              <div className={classes.label}>{t('due_late_turn_in')}</div>
              <div className={classes.value}>
                {moment(shadowAssignmentDetail?.finalDueTime).format(
                  'MMM DD, YYYY - hh:mm a'
                )}
              </div>
            </Box>
          )}

          <Box mt={3}>
            <div className={classes.label}>{t('unit')}</div>
            <div className={classes.value}>
              {shadowAssignmentDetail?.masterAssignment?.unit?.unitName}
            </div>
          </Box>

          <Box mt={3}>
            <div className={classes.label}>{t('total_possible_points')}</div>
            <div className={classes.value}>
              {shadowAssignmentDetail?.masterAssignment?.totalPossiblePoints}
            </div>
          </Box>

          <Box mt={3}>
            <div className={classes.label}>{t('time_to_complete')}</div>
            <div className={classes.value}>
              {/* {shadowAssignmentDetail?.masterAssignment?.timeToComplete} */}
              {/* {t('common:min', {
                count: shadowAssignmentDetail?.masterAssignment?.timeToComplete,
              })} */}
              {formatTimeNeeded(
                shadowAssignmentDetail?.masterAssignment?.timeToComplete
              )}
            </div>
          </Box>

          <Box mt={3}>
            <div className={classes.label}>{t('extra_credit')}</div>
            <div className={classes.value}>
              {shadowAssignmentDetail?.masterAssignment?.extraCredit
                ? 'Yes'
                : 'No'}
            </div>
          </Box>

          <Box mt={3}>
            <div className={classes.label}>{t('submission_type')}</div>
            <div className={classes.value}>
              {shadowAssignmentDetail?.masterAssignment?.submissionMethod === 1
                ? t('submission_type_online')
                : t('submission_type_offline')}
            </div>
          </Box>

          <Box mt={3}>
            <div className={classes.label}>{t('grade_weighting_category')}</div>
            <div className={classes.value}>
              {
                shadowAssignmentDetail?.masterAssignment?.gradeWeightCriteria
                  ?.name
              }
            </div>
          </Box>

          <Box mt={3}>
            <div className={classes.label}>{t('allow_late_turn_in_label')}</div>
            <div className={classes.value}>
              {shadowAssignmentDetail?.masterAssignment?.allowLateTurnIn
                ? 'Yes'
                : 'No'}
            </div>
          </Box>
          {shadowAssignmentDetail?.masterAssignment?.allowLateTurnIn && (
            <Box mt={3}>
              <div className={classes.label}>{t('percent_credit')}</div>
              <div className={classes.value}>
                {shadowAssignmentDetail?.masterAssignment?.percentCredit}%
              </div>
            </Box>
          )}
        </Grid>
        <TblConfirmDialog
          cancelText={t('common:cancel')}
          open={!!message}
          message={message}
          onCancel={onCancel}
          onConfirmed={onCancel}
          title={t('common:warning')}
        />
      </Grid>
    </>
  );
}

StudentViewAssignment.propTypes = {
  shadowId: PropTypes.object,
  getAssignmentDetails: PropTypes.func,
  sectionId: PropTypes.number,
};

export default StudentViewAssignment;
