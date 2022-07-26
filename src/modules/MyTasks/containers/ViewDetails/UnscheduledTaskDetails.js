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
import { TASK_STATUS, TabInViewMyTasks, TabInViewTaskDetails, handleURLToViewMyTask } from 'modules/MyTasks/utils';
import PropTypes from 'prop-types';
import { setUrlParam } from 'utils';

import myTasksActions from '../../actions';
import Breadcrumb from '../../components/Details/Breadcrumb';
import DetailContent from '../../components/Details/DetailContent';
import ViewDetailSkeleton from '../../components/Details/Skeleton';
import TabContent from '../../components/Details/TabContent';
import ManageTaskDetail from '../../components/Manage/UnscheduledTaskDetails';
import { ROUTE_TASKS } from '../../constantsRoute';

class UnscheduledTaskDetails extends React.Component {
  constructor(props) {
    super(props);
    const { location, history, currentUser } = props;
    this.tabByIndex = TabInViewTaskDetails;

    this.searchParams = new URLSearchParams(location.search);
    this.param_tabActive = this.searchParams.get('tabTaskActive');
    if (!!!this.param_tabActive) {
      this.param_tabActive = this.tabByIndex[0];
      setUrlParam(location, history, { tabTaskActive: this.param_tabActive });
    };
    this.isStudent = isStudent(currentUser);

    const defaultTab = this.tabByIndex.indexOf(this.param_tabActive);

    this.state = {
      currentTab: defaultTab >= 0 ? defaultTab : 0
    };
  }

  componentDidMount() {
    const { match } = this.props;
    const { taskId } = match?.params || {};
    if (!!taskId) {
      this.getTasksDetails(taskId, true);
    }
  }

  componentDidUpdate() {
    const { isFetchingMTTaskDetails, taskInProgress, taskDetails } = this.props;
    if (!isFetchingMTTaskDetails) {
      if (!isEmpty(taskInProgress) && this.isStudent) {
        this.handleURLToViewInProgress();
      }
      // NOTE: Handle case when user edit URL
      if (taskDetails?.status !== TASK_STATUS.UNSCHEDULED) {
        const tabId = taskDetails?.status ? taskDetails.status - 1 : '';
        this.handleURLToList(tabId);
      }
    }
  }
  componentWillUnmount(){
    const {resetMyTasksReducer} = this.props;
    resetMyTasksReducer({taskDetails: null});
  }

  handleURLToViewInProgress = () => {
    const { history, taskInProgress } = this.props;
    history.push(`${ROUTE_TASKS.TASK_IN_PROGRESS(taskInProgress?.taskId)}`);
  };

  getTasksDetails = (id, isFetching = false) => {
    const { currentUser: { organizationId }, match: { params: { studentId } } } = this.props;
    this.props.mtGetTaskDetails({
      orgId: organizationId, taskId: id,
      params: studentId ? { studentId } : {}, isFetchingMTTaskDetails: isFetching
    });
  }

  handleURLToList = (tabId = 0) => {
    const { history, taskDetails, match: { params: { studentId } } } = this.props;
    handleURLToViewMyTask(history, TabInViewMyTasks[tabId], taskDetails?.schoolYearId, studentId);
  };

  onChangeTab = (e, value) => {
    const { history, location } = this.props;
    this.setState({
      currentTab: value
    }, () => {
      setUrlParam(location, history, { tabTaskActive: this.tabByIndex[value] });
    });
  }

  render() {
    const {
      t,
      taskDetails,
      isFetchingMTTaskDetails,
      error,
      currentUser
    } = this.props;
    const { currentTab } = this.state;
    if (error?.subcode === 404) {
      return <ErrorPage />;
    }
    if (isFetchingMTTaskDetails) {
      return <ViewDetailSkeleton />;
    }
    return (
      <>
        <Breadcrumb
          t={t}
          taskDetails={taskDetails}
          handleURLToList={this.handleURLToList}
          currentUser={currentUser}
        />
        {isEmpty(taskDetails) ? (
          <>
            {error?.subcode === 404 ? (
              <ErrorPage />
            ) : (
                <EmptyContent
                  title={
                    <Typography variant='headingSmall' color='primary'>
                      {t('common:empty')}
                    </Typography>
                  }
                  emptyImage={emptyImage}
                  className='style1'
                />
              )}
          </>
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
                taskDetails={taskDetails}
                isStudent={this.isStudent}
              />
            </DetailContent>
          )}
      </>
    );
  }
}

UnscheduledTaskDetails.propTypes = {
  t: PropTypes.func,
  location: PropTypes.object,
  match: PropTypes.object,
  history: PropTypes.object,
  authData: PropTypes.object,
  currentUser: PropTypes.object,

  mtGetTaskDetails: PropTypes.func,
  resetMyTasksReducer: PropTypes.func,
  taskInProgress: PropTypes.object,

  taskDetails: PropTypes.object,
  isFetchingMTTaskDetails: PropTypes.bool,

  error: PropTypes.object

};

const mapStateToProps = ({ Auth, MyTasks }) => ({
  currentUser: Auth.currentUser,
  isFetchingMTTaskDetails: MyTasks.isFetchingMTTaskDetails,
  taskDetails: MyTasks.taskDetails,
  taskInProgress: MyTasks.taskInProgress,
  error: MyTasks.error
});

const mapDispatchToProps = (dispatch) => ({
  mtGetTaskDetails: (payload) => dispatch(myTasksActions.mtGetTaskDetails(payload)),
  resetMyTasksReducer: (payload) => dispatch(myTasksActions.resetMyTasksReducer(payload))

});

export default compose(
  withTranslation(['myTasks', 'common', 'myCourses']),
  connect(mapStateToProps, mapDispatchToProps)
)(UnscheduledTaskDetails);
