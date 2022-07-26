import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';

import TblCustomScrollbar from 'components/TblCustomScrollbar';
import TblGoogleLabel from 'components/TblGoogleFile/TblGoogleLable';
import TblGoogleFileList from 'components/TblGoogleFileList';
import TblViewContentEditor from 'components/TblViewContentEditor';

import { SUB_CODE } from 'utils/constants';
import useDidMountEffect from 'utils/customHook/useDidMoutEffect';
import { isStudent } from 'utils/roles';
import { convertTimezone } from 'utils/time';

import AttachmentLabel from 'shared/Attachments/Attachment/AttachmentLabel';
import AttachmentList from 'shared/Attachments/Attachment/AttachmentList';
import LinkedContents from 'shared/MyCourses/containers/LinkedContents';

import { isAfter } from 'date-fns';
import {
  ASSIGNMENT_STATUS,
  STUDENT_PROGRESS_STATUS,
} from 'modules/MyCourses/constants';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';

import { useAuthDataContext } from '../../../../AppRoute/AuthProvider';
import { GOOGLE_SUB_CODE } from '../../../../shared/Google/constants';
import myTasksActions from '../../actions';
import { MAX_ATTEMPT_TIMES, TASK_STATUS } from '../../constants';

function AssignmentTaskContents(props) {
  const { t } = useTranslation(['myCourses', 'common', 'myTasks']);
  const { enqueueSnackbar } = useSnackbar();
  const {
    details,
    isFetching,
    sectionId,
    courseIdProp,
    teacherView,
    viewLinkItem,
  } = props;
  const dispatch = useDispatch();
  const teacherViewLinkContent = (item) => {
    viewLinkItem && viewLinkItem(item);
  };
  const { currentUser } = useAuthDataContext();
  const taskInProgress = useSelector((state) => state.MyTasks.taskInProgress);
  const taskDetails = useSelector((state) => state.MyTasks.taskDetails);
  const attemptTimes =
    useSelector(
      (state) =>
        state.MyTasks?.taskDetails?.shadowAssignment?.studentProgress[0]
          ?.attemptTimes
    ) || 0;
  const studentProgressStatus = useSelector(
    (state) =>
      state.MyTasks?.taskDetails?.shadowAssignment?.studentProgress[0]?.status
  );
  const useTemplateLoading = useSelector(
    (state) => state.MyTasks.useTemplateLoading
  );
  const teacherGoogleConnect = useSelector(
    (state) => state.MyTasks?.teacherGoogleConnect
  );
  const errorUseGoogleTemplate = useSelector(
    (state) => state.MyTasks.errorUseGoogleTemplate
  );
  const disableUseTemplate = taskDetails
    ? isAfter(
        new Date(convertTimezone(new Date())),
        new Date(convertTimezone(taskDetails.shadowAssignment.finalDueTime))
      )
    : false;

  const canUseTemplate =
    ((taskDetails && taskDetails.id === taskInProgress.taskId) ||
      (taskDetails.status === TASK_STATUS.COMPLETED &&
        !!taskDetails.shadowAssignment.studentProgress[0]
          .digitalSubmisstion)) &&
    isStudent(currentUser) &&
    (attemptTimes < MAX_ATTEMPT_TIMES ||
      studentProgressStatus !== STUDENT_PROGRESS_STATUS.GRADED) &&
    // && teacherGoogleConnect; //still show use template when teacher did not connect
    taskDetails.shadowAssignment.status !== ASSIGNMENT_STATUS.CLOSED;

  const onUseTemplate = (mediaId) => {
    dispatch(
      myTasksActions.mtUseGoogleTemplate({
        data: {
          mediaId,
          shadowAssignmentId: taskDetails.shadowAssignment.id,
        },
        errorUseGoogleTemplate: null,
        useTemplateLoading: true,
      })
    );
  };
  useDidMountEffect(() => {
    if (errorUseGoogleTemplate) {
      switch (errorUseGoogleTemplate) {
        case SUB_CODE.LIMITED_FILE_UPDATE:
          enqueueSnackbar(
            t('myTasks:the_submission_files_reached_maximum_quantity'),
            { variant: 'error' }
          );
          break;
        case GOOGLE_SUB_CODE.CAN_NOT_COPY_FILE:
          if (teacherGoogleConnect) {
            enqueueSnackbar(t('myTasks:can_not_copy_google_file'), {
              variant: 'error',
            });
          }

          break;
        default:
          break;
      }
    }
  }, [errorUseGoogleTemplate]);

  if (isFetching) {
    return (
      <Skeleton
        variant='rectangular'
        animation='wave'
        width={'100%'}
        height={'58px'}
      />
    );
  }
  return (
    <TblCustomScrollbar maxHeightScroll={'calc(100vh - 172px)'}>
        <Box mb={3}>
          <Typography variant='bodyMedium' color='primary'>
            {/*NOTE: Section 3 in TL-3330*/}
            <Box fontWeight='labelLarge.fontWeight'>{t('common:description')}</Box>
          </Typography>
          <Typography>
            <Box
              mt={1}
              mr={2}
              fontSize='fontSize'
              className='ql-editor tbl-view-editor'
            >
              <TblViewContentEditor
                content={details?.masterAssignment?.requirement}
              />
            </Box>
          </Typography>
        </Box>
        <Box mt={3.5}>
          <Typography variant='labelLarge'>
            {t('common:attachments')}
          </Typography>
        </Box>
        <Box mt={3}>
          <TblGoogleLabel />
          <TblGoogleFileList
            list={details?.masterAssignment?.googleFiles}
            onUseTemplate={canUseTemplate && onUseTemplate}
            useTemplateLoading={useTemplateLoading}
            disableUseTemplate={disableUseTemplate}
            itemOnView={null}
          />
        </Box>
        <Box mt={3}>
          <AttachmentLabel />
          <AttachmentList
            files={details?.masterAssignment?.attachments}
            canDownload={true}
          />
        </Box>
        <Box mt={3} ml={-1}>
          <LinkedContents
            actionLabel={null}
            // initialLinkedContents={
            //   teacherView
            //     ? details?.masterAssignment?.linkContents
            //     : details?.masterAssignment?.linkData
            // }
            initialLinkedContents={details?.masterAssignment?.linkData}
            ableViewItem
            sectionId={sectionId}
            viewOnly
            noMarginLeft
            emptyContent={t('myCourses:no_linked_contents')}
            courseIdProp={courseIdProp}
            onClickViewItem={teacherView ? teacherViewLinkContent : null}
          />
        </Box>
    </TblCustomScrollbar>
  );
}

AssignmentTaskContents.defaultProps = {
  details: {},
};

AssignmentTaskContents.propTypes = {
  details: PropTypes.object,
  isFetching: PropTypes.bool,
  sectionId: PropTypes.string,
  courseIdProp: PropTypes.number,
  teacherView: PropTypes.bool,
  viewLinkItem: PropTypes.func,
};

export default React.memo(AssignmentTaskContents);
// export default AssignmentTaskContents;
