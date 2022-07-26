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

import { isStudent } from 'utils/roles';

import emptyImage from 'assets/images/undraw_empty_street.svg';
import {
  TabInViewMyTasks,
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
import ManageTaskDetail from '../../components/Manage/CompletedTaskDetails';
import {
  ERROR_GOOGLE_FILE,
  ERROR_MESSAGE_ASSIGNMENT_CLOSE,
  ERROR_MESSAGE_MAX_ATTEMPT,
  LIST_DISCARD_MESSAGE,
  LIST_HANDLE_ERROR_MESSAGE,
} from '../../constants';

class CompletedTaskDetails extends React.Component {
  constructor(props) {
    super(props);
    const { location, history, currentUser } = props;

    this.searchParams = new URLSearchParams(location.search);

    this.param_tabActive = this.searchParams.get('tabTaskActive');
    if (!!!this.param_tabActive) {
      this.param_tabActive = TabInViewTaskDetails[0];
      setUrlParam(location, history, { tabTaskActive: this.param_tabActive });
    }

    this.isStudent = isStudent(currentUser);
    this.toastMessage = '';
    this.state = {
      currentTab: Math.max(
        TabInViewTaskDetails.indexOf(this.param_tabActive),
        0
      ),
    };
  }

  componentDidMount() {
    const { match } = this.props;
    const { taskId } = match?.params || {};
    !!taskId && this.getTasksDetails(taskId, true);
  }

  componentDidUpdate() {
    const {
      t,
      match,
      isFetchingMTTaskDetails,
      studentEditShadowAssignmentSuccess,
      errorStudentEditShadowAssignment,
      studentEditShadowAssignmentFailed,
      resetMyTasksReducer,
      currentUser,
      taskDetails,
      studentEditShadowAssignment,
    } = this.props;
    if (!isFetchingMTTaskDetails) {
      // NOTE: Handle case when user edit URL
    }

    if (studentEditShadowAssignmentSuccess) {
      const { taskId } = match?.params || {};
      !!taskId && this.getTasksDetails(taskId, false);
      this.props.enqueueSnackbar(this.toastMessage, { variant: 'success' });
      resetMyTasksReducer({ studentEditShadowAssignmentSuccess: false });
    }
    // NOTE : change to inline error TL-3825 // add follow bug TL-4493
    if (
      studentEditShadowAssignmentFailed &&
      LIST_HANDLE_ERROR_MESSAGE.includes(
        errorStudentEditShadowAssignment?.message
      )
    ) {
      if (
        LIST_DISCARD_MESSAGE.includes(errorStudentEditShadowAssignment.message)
      ) {
        const { courseId, shadowId } = taskDetails;
        const payload = {
          orgId: currentUser.organizationId,
          courseId,
          shadowId,
          data: {
            discard: true,
          },
        };
        this.toastMessage = t('myTasks:discard_change');
        studentEditShadowAssignment(payload);
      }

      switch (errorStudentEditShadowAssignment?.message) {
        case ERROR_MESSAGE_MAX_ATTEMPT:
          this.props.enqueueSnackbar(ERROR_MESSAGE_MAX_ATTEMPT, {
            variant: 'error',
          });
          break;
        case ERROR_MESSAGE_ASSIGNMENT_CLOSE:
          this.props.enqueueSnackbar(t('myTasks:assignment_has_been_closed'), {
            variant: 'error',
          });
          break;
        case ERROR_GOOGLE_FILE[0]:
        case ERROR_GOOGLE_FILE[1]:
          this.props.enqueueSnackbar(t('myTasks:unable_copy_google_file'), {
            variant: 'error',
          });
          break;
        default:
          break;
      }
      resetMyTasksReducer({
        errorStudentEditShadowAssignment: null,
        studentEditShadowAssignmentFailed: null,
      });
    }
  }
  componentWillUnmount() {
    const { resetMyTasksReducer } = this.props;
    resetMyTasksReducer({
      taskDetails: null,
      errorStudentEditShadowAssignment: null,
    });
  }

  getTasksDetails = (id, isFetching = false) => {
    const {
      currentUser: {
        organizationId,
        organization: { timezone },
      },
      match: {
        params: { studentId },
      },
    } = this.props;
    this.props.mtGetTaskDetails({
      orgId: organizationId,
      taskId: id,
      params: studentId ? { studentId, timezone } : { timezone },
      isFetchingMTTaskDetails: isFetching,
    });
  };

  studentResubmit = (data) => {
    const { t, studentEditShadowAssignment, currentUser, taskDetails } =
      this.props;
    const { courseId, shadowId } = taskDetails;
    if (shadowId && currentUser?.organizationId) {
      const payload = {
        isTurningIn: true,
        orgId: currentUser.organizationId,
        courseId,
        shadowId,
        data,
      };
      studentEditShadowAssignment(payload);
      this.toastMessage = t(
        data?.turnIn ? 'myCourses:turn_in' : 'common:change_saved'
      );
    }
  };

  studentAttachFile = (data) => {
    const {
      t,
      studentEditShadowAssignment,
      currentUser,
      taskDetails,
      taskInProgress,
    } = this.props;
    const { courseId, shadowId } = taskDetails;
    if (shadowId && currentUser?.organizationId) {
      const payload = {
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
      this.toastMessage = t('common:change_saved');
    }
  };

  handleURLToList = () => {
    const {
      history,
      taskDetails,
      match: {
        params: { studentId },
      },
    } = this.props;
    handleURLToViewMyTask(
      history,
      TabInViewMyTasks[2],
      taskDetails?.schoolYearId,
      studentId
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
          tabTaskActive: TabInViewTaskDetails[value],
        });
      }
    );
  };

  render() {
    const { t, taskDetails, isFetchingMTTaskDetails, error, currentUser } =
      this.props;
    const { currentTab } = this.state;

    if (error?.subcode === 404) {
      return <ErrorPage />;
    }

    if (isFetchingMTTaskDetails) {
      return <ViewDetailSkeleton />;
    }
    const breadcrumb = (
      <Breadcrumb
        t={t}
        taskDetails={taskDetails}
        handleURLToList={this.handleURLToList}
        currentUser={currentUser}
      />
    );

    if (isEmpty(taskDetails)) {
      if (error?.subcode === 404) {
        return (
          <React.Fragment>
            {breadcrumb}
            <ErrorPage />
          </React.Fragment>
        );
      }
      return (
        <React.Fragment>
          {breadcrumb}
          <EmptyContent
            title={
              <Typography variant='headingSmall' color='primary'>
                {t('common:empty')}
              </Typography>
            }
            emptyImage={emptyImage}
            className='style1'
          />
        </React.Fragment>
      );
    }
    return (
      <React.Fragment>
        {breadcrumb}
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
            taskDetails={taskDetails}
            studentResubmit={this.studentResubmit}
            studentAttachFile={this.studentAttachFile}
            isStudent={this.isStudent}
          />
        </DetailContent>
      </React.Fragment>
    );
  }
}

CompletedTaskDetails.propTypes = {
  t: PropTypes.func,
  location: PropTypes.object,
  match: PropTypes.object,
  history: PropTypes.object,
  currentUser: PropTypes.object,

  mtGetTaskDetails: PropTypes.func,
  taskInProgress: PropTypes.object,
  taskDetails: PropTypes.object,
  isFetchingMTTaskDetails: PropTypes.bool,
  error: PropTypes.object,

  studentEditShadowAssignment: PropTypes.func,
  studentEditShadowAssignmentSuccess: PropTypes.bool,
  errorStudentEditShadowAssignment: PropTypes.object,
  resetMyTasksReducer: PropTypes.func,
  enqueueSnackbar: PropTypes.func,
  studentEditShadowAssignmentFailed: PropTypes.bool,
};

const mapStateToProps = ({ Auth, MyTasks }) => ({
  currentUser: Auth.currentUser,
  isFetchingMTTaskDetails: MyTasks.isFetchingMTTaskDetails,
  taskDetails: MyTasks.taskDetails,
  taskInProgress: MyTasks.taskInProgress,
  error: MyTasks.error,
  studentEditShadowAssignmentSuccess:
    MyTasks.studentEditShadowAssignmentSuccess,
  errorStudentEditShadowAssignment: MyTasks.errorStudentEditShadowAssignment,
  studentEditShadowAssignmentFailed: MyTasks.studentEditShadowAssignmentFailed,
});

const mapDispatchToProps = (dispatch) => ({
  mtGetTaskDetails: (payload) =>
    dispatch(myTasksActions.mtGetTaskDetails(payload)),
  studentEditShadowAssignment: (payload) =>
    dispatch(myTasksActions.studentEditShadowAssignment(payload)),
  resetMyTasksReducer: (payload) =>
    dispatch(myTasksActions.resetMyTasksReducer(payload)),
});

export default compose(
  withTranslation(['myTasks', 'common', 'myCourses']),
  connect(mapStateToProps, mapDispatchToProps)
)(withSnackbar(CompletedTaskDetails));
