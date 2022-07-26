import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import compose from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';

import BreadcrumbWithSettings from 'components/TblBreadcrumb/BreadcrumbWithSettings';
import Tabs from 'components/TblTabs';
import EmptyContentForStudent from 'shared/MyCourses/components/EmptyContentForStudent';

import { withHooksGetSchoolYear } from 'utils/customHook/useGetSchoolYear';
import { isGuardian } from 'utils/roles';

import { AuthDataContext } from 'AppRoute/AuthProvider';
import { Layout1 } from 'layout';
import { filterTasksHasImportanceLevel } from 'modules/MyTasks/utils';
import { withSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { setUrlParam } from 'utils';

import myTasksActions from '../actions';
import TabContent from '../components/View/TabContent';
import { ROUTE_TASKS } from '../constantsRoute';
import { TabInViewMyTasks } from '../utils';

// import emptyImage from 'assets/images/undraw_empty_street.svg';

class ViewMyTask extends React.PureComponent {
  static contextType = AuthDataContext;

  constructor(props) {
    super(props);
    const { t, currentUser } = props;
    const { param_tabActive } = this.getParam();

    const defaultTab = TabInViewMyTasks.indexOf(param_tabActive);

    this.state = {
      sortUnscheduled: {
        typeSort: 'asc',
        fieldSort: 'completedBy',
      },
      sortScheduled: {
        typeSort: 'asc',
        fieldSort: 'completedBy',
      },
      sortCompleted: {
        typeSort: 'desc',
        fieldSort: 'completedBy',
      },
      pagingCompleted: {
        page: 1,
        limit: 50,
      },
      currentTab: defaultTab >= 0 ? defaultTab : 0,
      unscheduledTasksState: [],
      scheduledTasksState: [],
    };
    this.unListen = this.props.history.listen((location) => {
      const urlSearchParams = new URLSearchParams(location.search);
      let param_tabActive = urlSearchParams?.get('active');
      if (!!param_tabActive) {
        this.setState({
          currentTab: TabInViewMyTasks.indexOf(param_tabActive),
        });
      }
    });

    this.titleBreadcrumb = isGuardian(currentUser) ? t('tasks') : t('my_task');
  }

  static getDerivedStateFromProps(props, state) {
    const newState = {};
    if (
      props.unscheduledTasks &&
      !isEqual(props.unscheduledTasks, state.unscheduledTasksState)
    ) {
      Object.assign(newState, {
        unscheduledTasksState: filterTasksHasImportanceLevel(
          props.unscheduledTasks
        ),
      });
    }

    if (
      props.scheduledTasks &&
      !isEqual(props.scheduledTasks, state.scheduledTasksState)
    ) {
      Object.assign(newState, {
        scheduledTasksState: filterTasksHasImportanceLevel(
          props.scheduledTasks
        ),
      });
    }
    return !isEmpty(newState) ? newState : null;
  }

  componentDidMount() {
    const { location, history, taskStatus, resetMyTasksReducer } = this.props;
    const { param_tabActive } = this.getParam();
    if (taskStatus) {
      const tabId = taskStatus - 1;
      const newTab = tabId ? TabInViewMyTasks[tabId] : param_tabActive;
      if (tabId && newTab !== param_tabActive) {
        setUrlParam(location, history, { active: newTab });
        this.setState({ currentTab: tabId });
        resetMyTasksReducer({
          taskStatus: '',
        });
      }
    }
    this.reloadMyTask();
  }

  componentDidUpdate(prevProps) {
    const {
      t,
      location,
      history,
      scheduledTasks,
      schoolYearSelected,
      schoolYears,
      isFetchingSchoolYear,
      isFetchingDeleteTimeBlock,
      payloadDeleteTimeBlock,
      isFetchingGetTimeBlocksByTask,
      timeBlocksByTask,
      updateTimeBlocksByTask,
      resetMyTasksReducer,
      errorStartUrgentTask,
      errorWorkingOnTimeBlock,
      isFetchingWorkingOnTimeBlock,
      workingOnTimeBlockSuccess,
      taskId,
    } = this.props;

    const { currentTab } = this.state;

    const { param_tabActive } = this.getParam();

    if (prevProps.isFetchingSchoolYear && !isFetchingSchoolYear) {
      if (
        schoolYears.length > 0 &&
        (!param_tabActive || !TabInViewMyTasks.includes(param_tabActive))
      ) {
        setUrlParam(location, history, {
          active: TabInViewMyTasks[currentTab],
        });
      }
    }

    if (prevProps.schoolYearSelected !== schoolYearSelected) {
      this.getUnscheduled();
      this.getCompleted();
      this.getScheduled();
    }
    if (prevProps.isFetchingDeleteTimeBlock & !isFetchingDeleteTimeBlock) {
      const { isOnlyUpcoming } = payloadDeleteTimeBlock;
      if (isOnlyUpcoming) {
        // refresh unscheduled tab
        this.getUnscheduled();
        // refresh scheduled tab
        this.getScheduled();
        this.onChangeTab(null, 0);
      }
      resetMyTasksReducer({
        payloadDeleteTimeBlock: null,
      });
    }
    if (
      errorStartUrgentTask &&
      prevProps.errorStartUrgentTask !== errorStartUrgentTask
    ) {
      this.reloadMyTask();
      resetMyTasksReducer({
        errorStartUrgentTask: null,
      });
    }
    if (
      !!errorWorkingOnTimeBlock &&
      prevProps.errorWorkingOnTimeBlock !== errorWorkingOnTimeBlock
    ) {
      switch (errorWorkingOnTimeBlock) {
        case 9:
          this.props.enqueueSnackbar(
            t('myTasks:this_work_time_has_been_skipped'),
            { variant: 'error' }
          );
          break;

        default:
          break;
      }
      this.reloadMyTask();
      resetMyTasksReducer({
        errorWorkingOnTimeBlock: null,
      });
    }
    if (
      workingOnTimeBlockSuccess &&
      taskId &&
      prevProps.isFetchingWorkingOnTimeBlock !== isFetchingWorkingOnTimeBlock
    ) {
      setTimeout(() => {
        history.push(ROUTE_TASKS.TASK_IN_PROGRESS(taskId));
      }, 500);
      resetMyTasksReducer({
        taskId: null,
      });
    }
    if (
      prevProps.isFetchingGetTimeBlocksByTask & !isFetchingGetTimeBlocksByTask
    ) {
      const { id, timeBlocks, timeNeeded } = timeBlocksByTask;
      updateTimeBlocksByTask({
        scheduledTasks: scheduledTasks.map((e) =>
          e.id === id ? { ...e, timeBlocks, timeNeeded } : e
        ),
      });
      resetMyTasksReducer({
        payloadGetTimeBlocksByTask: null,
        isFetchingGetTimeBlocksByTask: false,
        timeBlocksByTask: [],
        errorGetTimeBlocksByTask: null,
      });
    }
  }

  componentWillUnmount() {
    this.props.resetMyTasksReducer({
      taskJustScheduled: null,
      taskJustCompleted: null,
      taskStatus: '',
    });
    this.unListen();
  }

  getParam = () => {
    const { location } = this.props;
    const searchParams = new URLSearchParams(location.search);
    return {
      param_tabActive: searchParams.get('active'),
      param_schoolYearId: Number(searchParams.get('schoolYearId')),
    };
  };

  getUnscheduled = (schoolYearId, sort) => {
    const { match, currentUser, getUnscheduledTasks, schoolYearSelected } =
      this.props;
    const { sortUnscheduled } = this.state;
    const { studentId } = match.params;
    if (!(schoolYearId || schoolYearSelected)) {
      return;
    }

    getUnscheduledTasks({
      orgId: currentUser?.organizationId,
      params: {
        schoolYearId: schoolYearId || schoolYearSelected,
        timezone: currentUser?.timezone,
        sort: sort?.typeSort || sortUnscheduled.typeSort,
        fieldSort: sort?.fieldSort || sortUnscheduled.fieldSort,
        ...(!!studentId && { studentId }),
      },
      isFetchingUnscheduled: true,
      unscheduledTasks: [],
    });
  };

  getScheduled = (schoolYearId, sort) => {
    const { match, currentUser, getScheduledTasks, schoolYearSelected } =
      this.props;
    const { sortScheduled } = this.state;
    const { studentId } = match.params;
    if (!(schoolYearId || schoolYearSelected)) {
      return;
    }
    getScheduledTasks({
      orgId: currentUser?.organizationId,
      params: {
        schoolYearId: schoolYearId || schoolYearSelected,
        timezone: currentUser?.timezone,
        sort: sort?.typeSort || sortScheduled.typeSort,
        fieldSort: sort?.fieldSort || sortScheduled.fieldSort,
        ...(!!studentId && { studentId }),
      },
      isFetchingScheduled: true,
      scheduledTasks: [],
    });
  };

  getCompleted = (schoolYearId, sort, paging) => {
    const { match, currentUser, getCompletedTasks, schoolYearSelected } =
      this.props;
    const { sortCompleted, pagingCompleted } = this.state;
    const { studentId } = match.params;
    if (!(schoolYearId || schoolYearSelected)) {
      return;
    }
    getCompletedTasks({
      orgId: currentUser?.organizationId,
      params: {
        schoolYearId: schoolYearId || schoolYearSelected,
        timezone: currentUser?.timezone,
        sort: sort?.typeSort || sortCompleted.typeSort,
        fieldSort: sort?.fieldSort || sortCompleted.fieldSort,
        page: paging?.page || pagingCompleted.page,
        limit: paging?.limit || pagingCompleted.limit,
        ...(!!studentId && { studentId }),
      },
      isFetchingCompleted: true,
      completedTasks: [],
    });
  };

  reloadMyTask = () => {
    this.getUnscheduled();
    this.getScheduled();
    this.getCompleted();
  };

  setSort = (tab, fieldSort, typeSort) => {
    this.setState({ [tab]: { fieldSort, typeSort } });
  };

  setPaging = (tab, page, limit) => {
    this.setState({ [tab]: { page, limit } });
  };

  renderTabHeader = () => {
    const {
      t,
      schoolYears,
      isFetchingUnscheduled,
      isFetchingScheduled,
      isFetchingCompleted,
      totalCompletedTasks,
    } = this.props;
    const { unscheduledTasksState, scheduledTasksState } = this.state;
    const { currentTab } = this.state;
    if (schoolYears.length) {
      return (
        <Tabs
          onChange={this.onChangeTab}
          selectedTab={currentTab}
          selfHandleChange={true}
          minWidthItem={120}
          tabs={[
            {
              label: `${t('tab-unscheduled_task')} ${
                isFetchingUnscheduled
                  ? ''
                  : `(${unscheduledTasksState?.length})`
              }`,
              name: t('tab-unscheduled_task'),
            },
            {
              label: `${t('tab-scheduled_task')} ${
                isFetchingScheduled ? '' : `(${scheduledTasksState?.length})`
              }`,
              name: t('tab-scheduled_task'),
            },
            {
              label: `${t('tab-completed-task')} ${
                isFetchingCompleted ? '' : `(${totalCompletedTasks})`
              }`,
              name: t('tab-completed-task'),
            },
          ]}
        />
      );
    }
    return null;
  };

  onChangeTab = (e, value) => {
    this.setState(
      {
        currentTab: value,
      },
      () => {
        const { location, history } = this.props;
        setUrlParam(location, history, { active: TabInViewMyTasks[value] });
      }
    );
  };

  startTimeBlock = (data) => {
    const { workingOnTimeBlock } = this.props;
    const { payload } = data;
    const { taskId, timeBlockId } = payload?.payloadWorkingOnTimeBlock || {};
    if (!!taskId && !!timeBlockId) {
      workingOnTimeBlock(payload);
    }
  };

  deleteTimeBlock = (task, timeBlock, isOnlyUpcoming) => {
    const { match, currentUser, deleteTimeBlock } = this.props;
    const { studentId } = match.params;

    deleteTimeBlock({
      payloadDeleteTimeBlock: {
        isOnlyUpcoming,
        orgId: currentUser?.organizationId,
        task,
        timeBlock,
      },
      payloadGetTimeBlocksByTask: {
        payloadGetTimeBlocksByTask: {
          orgId: currentUser?.organizationId,
          taskId: task?.id,
          params: {
            ...(!!studentId && { studentId }),
          },
        },
        isFetchingGetTimeBlocksByTask: true,
      },
      isFetchingDeleteTimeBlock: true,
    });
  };

  render() {
    const {
      t,
      currentUser,
      schoolYearSelected,

      isFetchingScheduled,
      getScheduledTasks,
      isFetchingWorkingOnTimeBlock,

      isFetchingUnscheduled,
      getUnscheduledTasks,

      isFetchingCompleted,
      completedTasks,
      totalCompletedTasks,
      getCompletedTasks,

      isFetchingDeleteTimeBlock,

      taskJustScheduled,
      taskJustCompleted,
      resetMyTasksReducer,
      schoolYears,
    } = this.props;
    const {
      currentTab,
      sortScheduled,
      sortUnscheduled,
      sortCompleted,
      pagingCompleted,
      scheduledTasksState,
      unscheduledTasksState,
    } = this.state;

    return (
      <>
        <BreadcrumbWithSettings
          title={this.titleBreadcrumb}
          footerContent={this.renderTabHeader()}
        />
        {schoolYears.length === 0 ? (
          <EmptyContentForStudent subTitle={t('task_empty_text')} />
        ) : (
          <Layout1
            bgcolor='#f6f6f7'
            scrollable={false}
            padding={{ pTop: 2, pRight: 5, pLeft: 5, pBottom: 2 }}
            contentHeight='100%'
          >
            <TabContent
              currentUser={currentUser}
              schoolYearSelected={schoolYearSelected}
              currentTab={currentTab}
              isFetchingScheduled={isFetchingScheduled}
              scheduledTasks={scheduledTasksState}
              getScheduledTasks={getScheduledTasks}
              sortScheduled={sortScheduled}
              setSortScheduled={(field, type) =>
                this.setSort('sortScheduled', field, type)
              }
              isFetchingWorkingOnTimeBlock={isFetchingWorkingOnTimeBlock}
              startTimeBlock={this.startTimeBlock}
              isFetchingDeleteTimeBlock={isFetchingDeleteTimeBlock}
              deleteTimeBlock={this.deleteTimeBlock}
              isFetchingUnscheduled={isFetchingUnscheduled}
              unscheduledTasks={unscheduledTasksState}
              getUnscheduledTasks={getUnscheduledTasks}
              sortUnscheduled={sortUnscheduled}
              setSortUnscheduled={(field, type) =>
                this.setSort('sortUnscheduled', field, type)
              }
              isFetchingCompleted={isFetchingCompleted}
              completedTasks={completedTasks}
              totalCompletedTasks={totalCompletedTasks}
              getCompletedTasks={getCompletedTasks}
              sortCompleted={sortCompleted}
              pagingCompleted={pagingCompleted}
              setSortCompleted={(field, type) =>
                this.setSort('sortCompleted', field, type)
              }
              setPagingCompleted={(page, limit) =>
                this.setPaging('pagingCompleted', page, limit)
              }
              resetMyTasksReducer={resetMyTasksReducer}
              taskJustScheduled={taskJustScheduled}
              taskJustCompleted={taskJustCompleted}
            />
          </Layout1>
        )}
      </>
    );
  }
}

ViewMyTask.propTypes = {
  authData: PropTypes.object,
  completedTasks: PropTypes.array,
  currentUser: PropTypes.object,
  schoolYearSelected: PropTypes.number,
  deleteTimeBlock: PropTypes.func,
  enqueueSnackbar: PropTypes.func,
  errorStartUrgentTask: PropTypes.number,
  errorWorkingOnTimeBlock: PropTypes.number,
  getCompletedTasks: PropTypes.func,
  getScheduledTasks: PropTypes.func,
  getUnscheduledTasks: PropTypes.func,
  history: PropTypes.object,
  isFetchingCompleted: PropTypes.bool,
  isFetchingDeleteTimeBlock: PropTypes.bool,
  isFetchingGetTimeBlocksByTask: PropTypes.bool,
  isFetchingScheduled: PropTypes.bool,
  isFetchingSchoolYear: PropTypes.bool,
  isFetchingUnscheduled: PropTypes.bool,
  isFetchingWorkingOnTimeBlock: PropTypes.bool,
  location: PropTypes.object,
  match: PropTypes.object,
  payloadDeleteTimeBlock: PropTypes.object,
  resetMyTasksReducer: PropTypes.func,
  scheduledTasks: PropTypes.array,
  schoolYears: PropTypes.array,
  t: PropTypes.func,
  taskId: PropTypes.number,
  taskJustCompleted: PropTypes.object,
  taskJustScheduled: PropTypes.array,
  taskStatus: PropTypes.number,
  timeBlocksByTask: PropTypes.object,
  totalCompletedTasks: PropTypes.number,
  unscheduledTasks: PropTypes.array,
  updateTimeBlocksByTask: PropTypes.func,
  workingOnTimeBlock: PropTypes.func,
  workingOnTimeBlockSuccess: PropTypes.bool,
};

const mapStateToProps = ({ Auth, MyTasks }) => ({
  currentUser: Auth.currentUser,
  schoolYearSelected: Auth.schoolYearSelected,
  isFetchingSchoolYear: MyTasks.isFetchingSchoolYear,

  isFetchingUnscheduled: MyTasks.isFetchingUnscheduled,
  unscheduledTasks: MyTasks.unscheduledTasks,

  isFetchingScheduled: MyTasks.isFetchingScheduled,
  scheduledTasks: MyTasks.scheduledTasks,

  isFetchingCompleted: MyTasks.isFetchingCompleted,
  completedTasks: MyTasks.completedTasks,
  totalCompletedTasks: MyTasks.totalCompletedTasks,

  isFetchingDeleteTimeBlock: MyTasks.isFetchingDeleteTimeBlock,
  errorStartUrgentTask: MyTasks.errorStartUrgentTask,
  payloadDeleteTimeBlock: MyTasks.payloadDeleteTimeBlock,

  isFetchingGetTimeBlocksByTask: MyTasks.isFetchingGetTimeBlocksByTask,
  timeBlocksByTask: MyTasks.timeBlocksByTask,

  taskJustScheduled: MyTasks.taskJustScheduled,
  taskJustCompleted: MyTasks.taskJustCompleted,
  taskId: MyTasks.taskId,
  workingOnTimeBlockSuccess: MyTasks.workingOnTimeBlockSuccess,
  isFetchingWorkingOnTimeBlock: MyTasks.isFetchingWorkingOnTimeBlock,
  errorWorkingOnTimeBlock: MyTasks.errorWorkingOnTimeBlock,
  taskStatus: MyTasks.taskStatus,
});

const mapDispatchToProps = (dispatch) => ({
  getScheduledTasks: (payload) =>
    dispatch(myTasksActions.getScheduledTasks(payload)),
  getUnscheduledTasks: (payload) =>
    dispatch(myTasksActions.getUnscheduledTasks(payload)),
  getCompletedTasks: (payload) =>
    dispatch(myTasksActions.getCompletedTasks(payload)),
  workingOnTimeBlock: (payload) =>
    dispatch(myTasksActions.workingOnTimeBlock(payload)),
  resetMyTasksReducer: (payload) =>
    dispatch(myTasksActions.resetMyTasksReducer(payload)),
  deleteTimeBlock: (payload) =>
    dispatch(myTasksActions.deleteTimeBlock(payload)),
  updateTimeBlocksByTask: (payload) =>
    dispatch(myTasksActions.updateTimeBlocksByTask(payload)),
});

export default compose(
  withSnackbar,
  withTranslation(['myTasks', 'common', 'myCourses']),
  connect(mapStateToProps, mapDispatchToProps)
)(withRouter(withHooksGetSchoolYear(ViewMyTask)));
