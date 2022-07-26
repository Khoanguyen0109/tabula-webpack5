import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';

import TblButton from 'components/TblButton';
import TblCheckBoxWithLabel from 'components/TblCheckBox/CheckBoxWithLabel';

import StudentAttachment from 'shared/Attachments/StudentAttachment';
import googleActions from 'shared/Google/actions';

import {
  ASSIGNMENT_STATUS,
  STUDENT_PROGRESS_STATUS,
} from 'modules/MyCourses/constants';
import { parseDurationToMinutes } from 'modules/MyTasks/utils';
import moment from 'moment';
import PropTypes from 'prop-types';

import { useAuthDataContext } from '../../../../AppRoute/AuthProvider';
import { GOOGLE_ACTION } from '../../../../shared/Google/constants';
import { MEDIA_TYPES } from '../../../../shared/Media/constants';
import { SUBMISSION_METHOD } from '../../../../shared/MyCourses/constants';
import useDidMountEffect from '../../../../utils/customHook/useDidMoutEffect';
import myTasksActions from '../../actions';
import { MAX_ATTEMPT_TIMES, TASK_STATUS, turnInStatus } from '../../constants';
import { contentLeft } from '../../styled';

const useStyles = makeStyles((theme) => ({
  containerCheckbox: {
    margin: 0,
  },
  checkbox: {
    padding: 0,
    paddingRight: '6px',
  },
  groupBtn: {
    marginTop: theme.spacing(3),
    display: 'flex',
    justifyContent: 'space-between',
    '& button': {
      width: 'calc(50% - 5px)',
    },
  },
  contentLeft: (props) => contentLeft(props, theme),
}));

function CompletedTaskDetails({
  taskDetails,
  studentAttachFile,
  studentResubmit,
  isStudent,
}) {
  const { shadowAssignment, taskType } = taskDetails;
  const isAssignment = taskType === 1;
  const isOnline =
    shadowAssignment?.masterAssignment?.submissionMethod ===
    SUBMISSION_METHOD.ONLINE;
  const isSubmitAssignment =
    shadowAssignment?.studentProgress?.[0].digitalSubmisstion;
  const canAttachment =
    moment().isBefore(shadowAssignment?.finalDueTime) &&
    isSubmitAssignment &&
    isStudent;
  const canResubmit =
    shadowAssignment?.studentProgress?.[0].retract && isStudent;
  const studentProgressStatus = shadowAssignment?.studentProgress?.[0].status;
  const isDisableAction =
    (shadowAssignment?.studentProgress?.[0].attemptTimes >= MAX_ATTEMPT_TIMES &&
      studentProgressStatus === STUDENT_PROGRESS_STATUS.GRADED) ||
    shadowAssignment?.status === ASSIGNMENT_STATUS.CLOSED;

  const dispatch = useDispatch();
  const {currentUser} = useAuthDataContext();
  const { t } = useTranslation('myTasks', 'myCourses', 'common');
  const [attachments, setAttachments] = React.useState(
    shadowAssignment?.studentProgress?.[0]?.studentSubmissions || []
  );

  const classes = useStyles();
  const [isOpenMedia, setIsOpenMedia] = useState(false);

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

  const error = useSelector(
    (state) => state.MyTasks.errorStudentEditShadowAssignment
  );
  const isTurningIn = useSelector((state) => state.MyTasks.isTurningIn);

  useEffect(() => {
    setAttachments(shadowAssignment?.studentProgress?.[0]?.studentSubmissions);
  }, [shadowAssignment?.studentProgress?.[0]?.studentSubmissions]);

  useDidMountEffect(() => {
    studentAttachFiles([...attachments, googleFileTemplate]);
  }, [googleFileTemplate]);

  const onClickAttach = (isOpen) => {
    setIsOpenMedia(isOpen);
  };

  const onClose = () => {
    setIsOpenMedia(false);
  };

  const studentAttachFiles = useCallback(
    (files) => {
      //NOTE: Fix bug TL-3362
      setAttachments(files);
      const data = {
        attachments: {
          mediaId: files?.map((item) => item?.id),
          studentProgressId:
            taskDetails?.shadowAssignment?.studentProgress[0]?.id,
        },
      };
      studentAttachFile(data);
    },
    [taskDetails]
  );

  const onDiscard = () => {
    studentResubmit({ discard: true });
  };

  const onReturnIn = () => {
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
      const{connectors} = currentUser;
      return dispatch(
        googleActions.getGoogleToken({
          messageOauthPopup: t('google:miss_match_email_message', { email: connectors[0].email }),
          onAction: GOOGLE_ACTION.TURN_IN_GOOGLE_FILE,
        })
      );
    } 
      return studentResubmit({ turnIn: true });
    
  };

  useEffect(() => {
    if (
      (getGoogleTokenSuccess || googleOauthUrlSuccess) &&
      onAction === GOOGLE_ACTION.TURN_IN_GOOGLE_FILE
    ) {
      studentResubmit({ turnIn: true });
    }
  }, [getGoogleTokenSuccess,googleOauthUrlSuccess ,onAction ]);
  const content = [
    {
      title: t('task_status'),
      data: t(TASK_STATUS[taskDetails?.status]),
      show: true,
    },
    {
      title: t('total_time_spent'),
      data: parseDurationToMinutes(taskDetails?.actualDuration),
      show: true,
    },
    {
      title: t('submission_status'),
      data: t(
        turnInStatus(
          taskDetails?.shadowAssignment?.studentProgress?.[0].status
        ) || 'N/A'
      ),
      show: isAssignment,
    },
    {
      title: null,
      data: (
        <TblCheckBoxWithLabel
          containerClass={classes.containerCheckbox}
          className={classes.checkbox}
          checked={isSubmitAssignment}
          label={t('submit_digitally')}
          disabled
        />
      ),
      show: isAssignment && !isOnline,
    },
    // NOTE: TL-4230 Hide "Attachment" field for course activities
    {
      title: t('Submissions'),
      data: (
        <React.Fragment>
          <StudentAttachment
            label={null}
            actionLabel={t('upload_files')}
            initialAttachments={attachments}
            noMarginLeft
            openMedia={isOpenMedia}
            onClickAttach={onClickAttach}
            viewOnly={!canAttachment}
            onClose={onClose}
            updateData={(files) => studentAttachFiles(files)}
            isDisableAction={isDisableAction}
          />
          {error && [422].includes(error?.subcode) && (
            <div className='errorText'>
              {error.subcode === 422
                ? t('myCourses:file_submission_required')
                : t('myTasks:assignment_has_been_closed')}
            </div>
          )}
        </React.Fragment>
      ),
      show: isAssignment,
    },
    {
      title: null,
      data: (
        <Fade in={canResubmit}>
          <div className={classes.groupBtn}>
            <TblButton variant='outlined' color='primary' onClick={onDiscard}>
              {t('btn_discard')}
            </TblButton>
            <TblButton
              variant='contained'
              color='secondary'
              onClick={onReturnIn}
              isShowCircularProgress={isTurningIn}
            >
              {t('btn_re-turnin')}
            </TblButton>
          </div>
        </Fade>
      ),
      show: isAssignment,
    },
  ];

  const renderContent = useMemo(
    () =>
      content?.map(
        (item, index) =>
          item.show && (
            <Box mt={index === 0 ? 0 : 3}>
              {item.title && (
                <Typography
                  variant='bodyMedium'
                  color='primary'
                >
                  <Box fontWeight='labelLarge.fontWeight' className='text-ellipsis'>
                    {item.title}
                  </Box>
                </Typography>
              )}
              <Box className='text-ellipsis'>
                {!!item.data ? (
                  <Typography
                    variant='bodyMedium'
                    color='primary'
                  >
                    {item.data}
                  </Typography>
                ) : (
                  <div className={classes.noneText}>
                    <Typography
                      variant='bodyMedium'
                      color='inherit'
                    >
                      {t('common:none')}
                    </Typography>
                  </div>
                )}
              </Box>
            </Box>
          )
      ),
    [content]
  );

  return (
    <Box className={classes.contentLeft}>
      <PerfectScrollbar option={{ suppressScrollX: true }}>
        <div className='wrap-content'>{renderContent}</div>
      </PerfectScrollbar>
    </Box>
  );
}

CompletedTaskDetails.propTypes = {
  taskDetails: PropTypes.object,
  studentAttachFile: PropTypes.func,
  studentResubmit: PropTypes.func,
  isStudent: PropTypes.bool,
};

CompletedTaskDetails.defaultProps = {};

export default CompletedTaskDetails;
