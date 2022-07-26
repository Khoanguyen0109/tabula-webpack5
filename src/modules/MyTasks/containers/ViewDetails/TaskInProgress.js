import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import compose from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import EmptyContent from 'components/EmptyContent';
import ErrorPage from 'components/TblErrorPage';
import Tabs from 'components/TblTabs';

import emptyImage from 'assets/images/undraw_empty_street.svg';
import {
  TabInViewTaskDetails,
  handleURLToViewMyTask,
} from 'modules/MyTasks/utils';
import { withSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { setUrlParam } from 'utils';

import myTasksActions from '../../actions';
import Breadcrumb from '../../components/Details/Breadcrumb';
import DetailContent from '../../components/Details/DetailContent';
import ViewDetailSkeleton from '../../components/Details/Skeleton';
import TabContent from '../../components/Details/TabContent';
import ManageTaskDetail from '../../components/Manage/TaskInProgress';
import {
  ERROR_GOOGLE_FILE,
  ERROR_MESSAGE_ASSIGNMENT_CLOSE,
  ERROR_MESSAGE_MAX_ATTEMPT,
  TASK_TIME_BLOCK_STATUS,
} from '../../constants';
import { ROUTE_TASKS } from '../../constantsRoute';

class TaskDetails extends React.PureComponent {
  constructor(props) {
    super(props);
    const { location, history } = props;
    this.tabByIndex = TabInViewTaskDetails;
    this.toastMessage = '';

    this.searchParams = new URLSearchParams(location.search);
    this.param_tabActive = this.searchParams.get('tabTaskActive');
    if (!!!this.param_tabActive) {
      this.param_tabActive = this.tabByIndex[0];
      setUrlParam(location, history, { tabTaskActive: this.param_tabActive });
    }

    const defaultTab = this.tabByIndex.indexOf(this.param_tabActive);

    this.state = {
      currentTab: defaultTab >= 0 ? defaultTab : 0,
    };
  }

  componentDidMount() {
    // this.getTasksInProgress();
    this.getTasksDetails();
  }

  componentDidUpdate() {
    const {
      taskInProgress,
      taskDetails,
      studentEditShadowAssignmentSuccess,
      isTurnIn,
      resetMyTasksReducer,
      isFetchingMTTaskDetails,
      workingOnTimeBlockSuccess,
      payloadWorkingOnTimeBlock,
      errorMTTaskDetails,
      studentEditShadowAssignmentFailed,
      errorStudentEditShadowAssignment,
      currentUser,
      studentEditShadowAssignment,
      t,
    } = this.props;
    if (!isFetchingMTTaskDetails && isEmpty(taskInProgress)) {
      return this.handleURLBackToMyTask();
    }
    if (
      !isEmpty(taskInProgress) &&
      taskInProgress?.taskId !== taskDetails?.id &&
      !errorMTTaskDetails
    ) {
      return this.props.history.push(ROUTE_TASKS.DEFAULT);
    }
    if (studentEditShadowAssignmentSuccess) {
      this.showNotification();
      const newState = { studentEditShadowAssignmentSuccess: false };
      this.props.mtGetTaskDetails({
        orgId: currentUser.organizationId,
        taskId: taskInProgress.taskId,
        params: { timezone: currentUser.timezone },
      });
      if (isTurnIn) {
        this.handleURLBackToMyTask();
        Object.assign(newState, { isTurnIn: false, taskInProgress: {} });
      }
      resetMyTasksReducer(newState);
    }

    if (
      workingOnTimeBlockSuccess &&
      [
        TASK_TIME_BLOCK_STATUS.IN_PROGRESS,
        TASK_TIME_BLOCK_STATUS.ON_BREAK,
      ].includes(payloadWorkingOnTimeBlock?.body?.status)
    ) {
      this.getTasksInProgress();
      const newState = { workingOnTimeBlockSuccess: false };
      resetMyTasksReducer(newState);
    }

    if (studentEditShadowAssignmentFailed) {
      if (
        errorStudentEditShadowAssignment?.message ===
          ERROR_MESSAGE_ASSIGNMENT_CLOSE ||
        errorStudentEditShadowAssignment?.message === ERROR_MESSAGE_MAX_ATTEMPT
      ) {
        this.props.enqueueSnackbar(errorStudentEditShadowAssignment?.message, {
          variant: 'error',
        });
        this.toastMessage = t('myTasks:discard_change');
        const { courseId, shadowId } = taskDetails;
        const payload = {
          orgId: currentUser.organizationId,
          courseId,
          shadowId,
          data: {
            discard: true,
          },
        };
        studentEditShadowAssignment(payload);
      } else if (
        ERROR_GOOGLE_FILE.includes(errorStudentEditShadowAssignment?.message)
      ) {
        this.props.enqueueSnackbar(t('myTasks:unable_copy_google_file'), {
          variant: 'error',
        });
      }
      resetMyTasksReducer({
        errorStudentEditShadowAssignment: null,
        studentEditShadowAssignmentFailed: null,
      });
    }
  }
  componentWillUnmount() {
    this.props.resetMyTasksReducer({
      errorMTTaskDetails: null,
      errorStudentEditShadowAssignment: null,
    });
  }

  getTasksInProgress = () => {
    const {
      currentUser: { organizationId },
    } = this.props;
    this.props.mtGetTaskInProgress({
      orgId: organizationId,
      isFetchingMTTaskInProgress: true,
    });
  };

  getTasksDetails = () => {
    const {
      match,
      currentUser: { organizationId, timezone },
    } = this.props;
    const { taskId } = match?.params || {};
    if (!!!taskId) {
      return;
    }
    this.props.mtGetTaskDetails({
      orgId: organizationId,
      taskId,
      params: { timezone },
      isFetchingMTTaskDetails: true,
    });
  };

  handleURLBackToMyTask = () => {
    const { history, taskDetails } = this.props;
    handleURLToViewMyTask(
      history,
      this.tabByIndex[1],
      taskDetails?.schoolYearId
    );
  };

  onChangeTab = (e, value) => {
    const { history, location } = this.props;
    this.setState(
      {
        currentTab: value,
      },
      () => {
        setUrlParam(location, history, {
          tabTaskActive: this.tabByIndex[value],
        });
      }
    );
  };

  studentEditShadowAssignment = (data) => {
    const {
      studentEditShadowAssignment,
      currentUser,
      taskDetails,
      taskInProgress,
    } = this.props;
    const { courseId, shadowId } = taskDetails;
    if (shadowId && currentUser?.organizationId) {
      const payload = {
        isTurningIn: true,
        orgId: currentUser.organizationId,
        courseId,
        shadowId,
        data,
        taskStatus: 3,
      };
      //NOTE: Add isFetchingWorkingOnTimeBlock to the payload to reload Schedule Task in MyTasks line 427
      if (data?.turnIn) {
        Object.assign(payload, {
          isFetchingWorkingOnTimeBlock: true,
          taskJustCompleted: taskInProgress?.taskId,
        });
      }
      studentEditShadowAssignment(payload);
    }
  };

  showNotification = () => {
    const { enqueueSnackbar, isTurnIn, t } = this.props;
    if (isTurnIn) {
      return enqueueSnackbar(t('myCourses:turned_in_toast'), {
        variant: 'success',
      });
    }
    if (this.toastMessage) {
      enqueueSnackbar(this.toastMessage, {
        variant: 'success',
      });
      this.toastMessage = '';
      return;
    }
    return enqueueSnackbar(t('common:change_saved'), {
      variant: 'success',
    });
  };
  handleWorkingOnTimeBlock = (completed = false, onBreak = false) => {
    const { currentUser, taskInProgress } = this.props;
    const { organizationId } = currentUser;
    const { taskId } = taskInProgress;
    const timeBlockId = taskInProgress?.block?.id;
    let payloadWorkingOnTimeBlock = {
      orgId: organizationId,
      taskId,
      timeBlockId,
      body: {
        status: TASK_TIME_BLOCK_STATUS.ENDED,
        completed,
      },
    };
    if (onBreak) {
      payloadWorkingOnTimeBlock = Object.assign(payloadWorkingOnTimeBlock, {
        body: { status: TASK_TIME_BLOCK_STATUS.ON_BREAK },
      });
    }
    const payload = {
      payloadWorkingOnTimeBlock,
      isFetchingWorkingOnTimeBlock: true,
      taskInProgress: onBreak ? { ...taskInProgress } : {},
      taskJustCompleted: completed ? taskInProgress?.taskId : null,
      errorStudentEditShadowAssignment: null,
    };
    if (!!taskId && !!timeBlockId) {
      this.props.workingOnTimeBlock(payload);
    }
  };
  finishLater = () => {
    this.handleWorkingOnTimeBlock();
  };

  markTaskCompleted = () => {
    this.handleWorkingOnTimeBlock(true);
  };

  takeABreak = () => {
    this.handleWorkingOnTimeBlock(false, true);
  };

  onResume = () => {
    const { currentUser, taskInProgress } = this.props;
    const { organizationId } = currentUser;
    const { taskId } = taskInProgress;
    const timeBlockId = taskInProgress?.block?.id;
    const payload = {
      payloadWorkingOnTimeBlock: {
        orgId: organizationId,
        taskId,
        timeBlockId,
        body: {
          status: TASK_TIME_BLOCK_STATUS.IN_PROGRESS,
        },
      },
    };
    if (!!taskId && !!timeBlockId) {
      this.props.workingOnTimeBlock(payload);
    }
  };

  render() {
    const {
      t,
      taskInProgress,
      taskDetails,
      isFetchingMTTaskDetails,
      error,
      errorStudentEditShadowAssignment,
      currentUser,
      errorMTTaskDetails,
    } = this.props;
    const { currentTab } = this.state;
    if (error?.subcode === 404 || errorMTTaskDetails) {
      return <ErrorPage />;
    }
    if (isFetchingMTTaskDetails) {
      return <ViewDetailSkeleton />;
    }
    return (
      <>
        <Breadcrumb
          t={t}
          currentUser={currentUser}
          taskDetails={taskDetails}
          isShowConfirm={!isEmpty(taskInProgress)}
          onFinishLater={this.finishLater}
          handleURLToList={this.handleURLBackToMyTask}
        />
        {isEmpty(taskDetails) ? (
          <EmptyContent
            title={
              <Typography variant='headingSmall' color='primary'>
                {t('common:empty')}
              </Typography>
            }
            emptyImage={emptyImage}
            className='style1'
          />
        ) : (
          <DetailContent>
            <Box pr={4}>
              <Tabs
                onChange={this.onChangeTab}
                selectedTab={currentTab}
                selfHandleChange={true}
                tabs={[
                  {
                    label: `${t('tab_task_contents')}`,
                    name: t('tab_task_contents'),
                  },
                  {
                    label: `${t('tab_task_information')}`,
                    name: t('tab_task_information'),
                  },
                ]}
              />
              <TabContent
                taskDetails={taskDetails}
                currentTab={currentTab}
                isFetching={isFetchingMTTaskDetails}
              />
            </Box>
            <ManageTaskDetail
              markTaskCompleted={this.markTaskCompleted}
              taskInProgress={taskInProgress}
              taskDetails={taskDetails}
              studentEditShadowAssignment={this.studentEditShadowAssignment}
              finishLater={this.finishLater}
              takeABreak={this.takeABreak}
              onResume={this.onResume}
              error={errorStudentEditShadowAssignment}
            />
          </DetailContent>
        )}
      </>
    );
  }
}

TaskDetails.propTypes = {
  t: PropTypes.func,
  location: PropTypes.object,
  match: PropTypes.object,
  history: PropTypes.object,
  currentUser: PropTypes.object,

  mtGetTaskDetails: PropTypes.func,

  taskInProgress: PropTypes.object,
  taskDetails: PropTypes.object,

  isFetchingMTTaskDetails: PropTypes.bool,
  studentEditShadowAssignment: PropTypes.func,
  isTurnIn: PropTypes.bool,
  enqueueSnackbar: PropTypes.func,
  studentEditShadowAssignmentSuccess: PropTypes.bool,
  error: PropTypes.object,
  handleURLToList: PropTypes.func,
  finishLater: PropTypes.func,
  errorStudentEditShadowAssignment: PropTypes.object,
  workingOnTimeBlock: PropTypes.func,
  resetMyTasksReducer: PropTypes.func,

  workingOnTimeBlockSuccess: PropTypes.bool,
  mtGetTaskInProgress: PropTypes.func,
  payloadWorkingOnTimeBlock: PropTypes.object,
  errorMTTaskDetails: PropTypes.object,
  studentEditShadowAssignmentFailed: PropTypes.bool,
};

const mapStateToProps = ({ Auth, MyTasks }) => ({
  currentUser: Auth.currentUser,
  isFetchingMTTaskDetails: MyTasks.isFetchingMTTaskDetails,
  studentEditShadowAssignmentSuccess:
    MyTasks.studentEditShadowAssignmentSuccess,
  isTurnIn: MyTasks.isTurnIn,
  taskDetails: MyTasks.taskDetails,
  taskInProgress: MyTasks.taskInProgress,
  errorStudentEditShadowAssignment: MyTasks.errorStudentEditShadowAssignment,
  workingOnTimeBlockSuccess: MyTasks.workingOnTimeBlockSuccess,
  payloadWorkingOnTimeBlock: MyTasks.payloadWorkingOnTimeBlock,
  errorMTTaskDetails: MyTasks.errorMTTaskDetails,
  studentEditShadowAssignmentFailed: MyTasks.studentEditShadowAssignmentFailed,
});

const mapDispatchToProps = (dispatch) => ({
  studentEditShadowAssignment: (payload) =>
    dispatch(myTasksActions.studentEditShadowAssignment(payload)),
  resetMyTasksReducer: (payload) =>
    dispatch(myTasksActions.resetMyTasksReducer(payload)),
  mtGetTaskDetails: (payload) =>
    dispatch(myTasksActions.mtGetTaskDetails(payload)),
  workingOnTimeBlock: (payload) =>
    dispatch(myTasksActions.workingOnTimeBlock(payload)),
  mtGetTaskInProgress: (payload) =>
    dispatch(myTasksActions.mtGetTaskInProgress(payload)),
});

export default compose(
  withTranslation(['myTasks', 'common', 'myCourses']),
  connect(mapStateToProps, mapDispatchToProps)
)(withSnackbar(TaskDetails));
