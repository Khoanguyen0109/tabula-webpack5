/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';

import TblButton from 'components/TblButton';
import TblCheckBox from 'components/TblCheckBox';
import TblConfirmDialog from 'components/TblConfirmDialog';

import { COURSE_ITEM_TYPE } from 'utils/constants';
import useDidMountEffect from 'utils/customHook/useDidMoutEffect';
import { checkIsInThePast } from 'utils/validation';

import StudentAttachment from 'shared/Attachments/StudentAttachment';
import googleActions from 'shared/Google/actions';
import { GOOGLE_ACTION } from 'shared/Google/constants';
import { MEDIA_TYPES } from 'shared/Media/constants';
import { SUBMISSION_METHOD } from 'shared/MyCourses/constants';

import { useAuthDataContext } from 'AppRoute/AuthProvider';
import clsx from 'clsx';
import {
  ASSIGNMENT_STATUS,
  STUDENT_PROGRESS_STATUS,
} from 'modules/MyCourses/constants';
import { updateTime } from 'modules/MyTasks/utils';
import moment from 'moment';
import PropTypes from 'prop-types';

import myTasksActions from '../../actions';
import { TASK_TIME_BLOCK_STATUS } from '../../constants';
import { MAX_ATTEMPT_TIMES } from '../../constants';
import { contentLeft } from '../../styled';
import { handleURLToSchedulePage } from '../../utils';

import BreakTime from './BreakTime';

const useStyles = makeStyles((theme) => ({
  turnInBtn: {
    marginRight: theme.spacing(1),
  },
  flexAlignCenter: {
    display: 'flex',
    alignItems: 'center',
  },
  fileSubmission: {
    maxWidth: theme.spacing(51.25),
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingLeft: '4%',
    paddingRight: '4%',
  },
  contentLeft: (props) => contentLeft(props, theme),
}));

function MangeTaskInProgress(props) {
  const classes = useStyles(props);
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const { currentUser } = useAuthDataContext();
  const searchParams = new URLSearchParams(location.search);
  const schoolYearSelected = Number(searchParams.get('schoolYearId'));
  const { t } = useTranslation('myTasks', 'common');
  const [openMedia, setOpenMedia] = React.useState(false);
  const isTurningIn = useSelector((state) => state.MyTasks.isTurningIn);

  const openLastTimeBlockConfirm = useSelector(
    (state) => state.MyTasks.openLastTimeBlockConfirm
  );
  const googleFileTemplate = useSelector(
    (state) => state.MyTasks.googleFileTemplate
  );

  const getGoogleTokenSuccess = useSelector(
    (state) => state.Google.getGoogleTokenSuccess
  );
  const googleOauthUrlSuccess = useSelector(
    (state) => state.Google.googleOauthUrlSuccess
  );
  const onAction = useSelector((state) => state.Google.onAction);

  let timer;
  const { taskDetails, studentEditShadowAssignment, taskInProgress, error } =
    props;
  const { id, shadowAssignment, taskType, timeBlocks } = taskDetails;
  const [attachments, setAttachments] = React.useState(
    shadowAssignment?.studentProgress?.[0]?.studentSubmissions || []
  );
  const [checkedSubmitDigitally, setCheckedSubmitDigitally] = React.useState(
    attachments?.length > 0
  );

  const isAssignment = taskType === COURSE_ITEM_TYPE.ASSIGNMENT;
  const isOnlineSubmission =
    shadowAssignment?.masterAssignment?.submissionMethod ===
    SUBMISSION_METHOD.ONLINE;
  const isOverDue = checkIsInThePast(shadowAssignment?.finalDueTime);
  const allowTurnInStatus = [
    STUDENT_PROGRESS_STATUS.NOT_TURN_IN,
    STUDENT_PROGRESS_STATUS.MISSING,
  ];
  const isDisplayTurnInButton =
    allowTurnInStatus.includes(
      taskDetails?.shadowAssignment?.studentProgress?.[0]?.status
    ) && shadowAssignment.status !== ASSIGNMENT_STATUS.CLOSED;
  const studentProgressStatus = shadowAssignment?.studentProgress?.[0].status;
  const isDisableAction =
    (shadowAssignment?.studentProgress?.[0].attemptTimes >= MAX_ATTEMPT_TIMES &&
      studentProgressStatus === STUDENT_PROGRESS_STATUS.GRADED) ||
    (shadowAssignment && shadowAssignment.status === ASSIGNMENT_STATUS.CLOSED);

  useEffect(() => {
    setAttachments(
      taskDetails?.shadowAssignment?.studentProgress?.[0]?.studentSubmissions
    );
  }, [taskDetails?.shadowAssignment]);

  //NOTE: Just show data to div not setTimeOut
  useEffect(() => {
    currentTime(false);
    return () => {
      dispatch(
        myTasksActions.myTasksSetState({
          openLastTimeBlockConfirm: false,
        })
      );
    };
  }, []);

  useEffect(() => {
    if (taskInProgress?.block?.status === TASK_TIME_BLOCK_STATUS.ON_BREAK) {
      clearTimeout(timer);
    } else {
      currentTime();
    }
    return () => clearTimeout(timer);
  }, [taskInProgress?.block?.status]);

  useDidMountEffect(() => {
    if (googleFileTemplate) {
      studentAttachFiles([...attachments, googleFileTemplate]);
      setCheckedSubmitDigitally(true);
    }
  }, [googleFileTemplate]);

  const onClickAttach = (value) => {
    setOpenMedia(value);
  };

  const onClickDeleteFile = (item) => {
    setAttachments(attachments.filter((f) => f.id !== item.id));
    studentAttachFiles(attachments.filter((f) => f.id !== item.id));
  };

  const studentAttachFiles = useCallback(
    (files) => {
      const data = {
        attachments: {
          mediaId: files?.map((item) => item?.id),
          studentProgressId:
            taskDetails?.shadowAssignment?.studentProgress[0]?.id,
        },
      };
      //NOTE: Fix bug TL-3362
      setAttachments(files);
      studentEditShadowAssignment(data);
    },
    [taskDetails, studentEditShadowAssignment]
  );
  const onFinishLater = () => {
    const haveUpComingTimeBlock = timeBlocks.find(
      (tb) => tb.status === TASK_TIME_BLOCK_STATUS.UP_COMING
    );
    if (!haveUpComingTimeBlock) {
      return dispatch(
        myTasksActions.myTasksSetState({
          openLastTimeBlockConfirm: true,
        })
      );
    }
    return props.finishLater();
  };

  const onAddWorkTime = () => {
    props.finishLater();
    handleURLToSchedulePage(history, id, schoolYearSelected);
  };

  const onTurnIn = useCallback(() => {
    if (attachments?.length === 0) {
      return dispatch(
        myTasksActions.studentEditShadowAssignmentFailed({
          errorStudentEditShadowAssignment: {
            subcode: 422,
          },
        })
      );
    }
    if (
      attachments.some(
        (attachment) => attachment.mediaType === MEDIA_TYPES.GOOGLE_DRIVE_FILE
      )
    ) {
      const { connectors } = currentUser;
      return dispatch(
        googleActions.getGoogleToken({
          messageOauthPopup: t('google:miss_match_email_message', {
            email: connectors[0].email,
          }),
          onAction: GOOGLE_ACTION.TURN_IN_GOOGLE_FILE,
        })
      );
    } 
      return studentEditShadowAssignment({ turnIn: true });
    
  }, [studentEditShadowAssignment, attachments]);

  useEffect(() => {
    if (
      (getGoogleTokenSuccess || googleOauthUrlSuccess) &&
      onAction === GOOGLE_ACTION.TURN_IN_GOOGLE_FILE
    ) {
      return studentEditShadowAssignment({ turnIn: true });
    }
  }, [getGoogleTokenSuccess, googleOauthUrlSuccess, onAction]);

  const currentTime = useCallback(
    (setTimeOut = true) => {
      //NOTe: Calculate total past time before take a break
      const totalPastTime =
        taskInProgress?.block?.timers.length > 0
          ? taskInProgress?.block?.timers
              .map((item) => item?.duration ?? 0)
              .reduce((total, num) => total + num)
          : 0;
      const startTime = moment(
        taskInProgress?.block?.timers[taskInProgress?.block?.timers.length - 1]
          ?.startTime
      );
      const currentMoment = moment();
      const durationFromStartTimeToCurrent = setTimeOut
        ? currentMoment.diff(startTime) >= 0
          ? currentMoment.diff(startTime)
          : 0
        : 0;
      const duration = moment.duration(
        durationFromStartTimeToCurrent + totalPastTime
      );
      const mins = updateTime(parseInt(duration.asMinutes()));
      const secs = updateTime(parseInt(duration.asSeconds()) % 60);
      if (document.getElementById('timer')) {
        document.getElementById('timer').innerText = [mins, secs].join(
          ':'
        ); /* adding time to the div */
      }
      //NOTE: Just setTimeOut because case just show timer and not setTimeOut in the first time
      if (setTimeOut) {
        timer = setTimeout(function () {
          currentTime();
        }, 1000); /* setting timer */
      }
    },
    [taskInProgress]
  );

  const renderContent = () => (
      <div className={classes.fileSubmission}>
        <Box mb={3} textAlign='center'>
          <Box fontSize={40} id='timer'>
            00:00
          </Box>
          <Typography variant='bodySmall'>
            <Box color='#8e8e8e;'>{t('time_spent')}</Box>
          </Typography>
        </Box>
        <Grid container>
          <Grid sm={6} item>
            <Box pr={0.5625}>
              <TblButton
                variant='outlined'
                color='primary'
                onClick={onFinishLater}
                fullWidth
              >
                {t('finish_later')}
              </TblButton>
            </Box>
          </Grid>
          <Grid sm={6} item>
            <Box pl={0.5625}>
              <TblButton
                variant='outlined'
                color='primary'
                fullWidth
                onClick={props.takeABreak}
              >
                {t('take_a_break')}
              </TblButton>
            </Box>
          </Grid>
        </Grid>
        {isAssignment && !isOnlineSubmission && (
          <Box mt={3}>
            <div className={clsx(classes.flexAlignCenter, classes.formItem)}>
              <TblCheckBox
                checked={checkedSubmitDigitally}
                style={{ padding: 0, paddingRight: 6 }}
                onChange={(e) => {
                  const { checked } = e.target;
                  setCheckedSubmitDigitally(checked);
                }}
              />
              <Typography
                variant='bodyMedium'
                color='primary'
              >
                {t('submit_this_assignment_digitally')}
              </Typography>
            </div>
          </Box>
        )}
        {isOnlineSubmission || checkedSubmitDigitally ? (
          <div>
            <Box mt={3}>
              <Typography
                variant='bodyMedium'
                color='primary'
              >
                <Box fontWeight='labelLarge.fontWeight'>{t('Submissions')}</Box>
              </Typography>
              <StudentAttachment
                label={null}
                actionLabel={t('upload_files')}
                initialAttachments={attachments}
                noMarginLeft
                openMedia={openMedia}
                onClickAttach={(open) => onClickAttach(open)}
                onClickDeleteFile={(item) => onClickDeleteFile(item)}
                viewOnly={isOverDue}
                updateData={(files) => studentAttachFiles(files)}
                onClose={() => setOpenMedia(false)}
                isDisableAction={isDisableAction}
              />
              {error && [422, 6].includes(error?.subcode) && (
                <div className='errorText'>
                  {error.subcode === 422
                    ? t('myCourses:file_submission_required')
                    : t('myTasks:assignment_has_been_closed')}
                </div>
              )}
            </Box>

            <Box mt={3}>
              {isDisplayTurnInButton && (
                <span className={classes.turnInBtn}>
                  <TblButton
                    variant='contained'
                    color='primary'
                    type='submit'
                    onClick={onTurnIn}
                    fullWidth
                    isShowCircularProgress={isTurningIn}
                    // disabled={!attachments.length}
                  >
                    {t('turn_in')}
                  </TblButton>
                </span>
              )}
            </Box>
          </div>
        ) : (
          <Box mt={3}>
            <span className={classes.turnInBtn}>
              <TblButton
                variant='contained'
                color='primary'
                type='submit'
                onClick={props.markTaskCompleted}
                fullWidth
              >
                {t('im_done')}
              </TblButton>
            </span>
          </Box>
        )}
      </div>
    );
  return (
    <React.Fragment>
      <BreakTime
        t={t}
        open={taskInProgress?.block?.status === TASK_TIME_BLOCK_STATUS.ON_BREAK}
        onResume={props.onResume}
      />
      <Box className={classes.contentLeft}>
        <PerfectScrollbar option={{ suppressScrollX: true }}>
          <div className='wrap-content'>{renderContent()}</div>
        </PerfectScrollbar>
      </Box>
      <TblConfirmDialog
        open={openLastTimeBlockConfirm}
        hasCloseIcon={true}
        onClose={() =>
          dispatch(
            myTasksActions.myTasksSetState({
              openLastTimeBlockConfirm: false,
            })
          )
        }
        message={t('bring_back_to_schedule_message')}
        onConfirmed={onAddWorkTime}
        okText={t('myTasks:add-time-block')}
        onCancel={props.finishLater}
        cancelText={t('bring_back_to_schedule')}
        title={t('myTasks:schedule_the_next_work_time')}
      />
    </React.Fragment>
  );
}

MangeTaskInProgress.propTypes = {
  taskDetails: PropTypes.object,
  taskInProgress: PropTypes.object,
  error: PropTypes.object,
  studentEditShadowAssignment: PropTypes.func,
  finishLater: PropTypes.func,
  markTaskCompleted: PropTypes.func,
  takeABreak: PropTypes.func,
  onResume: PropTypes.func,
};

MangeTaskInProgress.defaultProps = {
  isInProgress: true,
};

export default MangeTaskInProgress;
