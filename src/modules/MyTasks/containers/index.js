import React from 'react';
import { connect } from 'react-redux';

import compose from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';

import Loading from 'components/TblLoading';

import { isStudent } from 'utils/roles';

import loadable from '@loadable/component';
import { AuthDataContext } from 'AppRoute/AuthProvider';
import { handleURLToViewMyTask } from 'modules/MyTasks/utils';
import PropTypes from 'prop-types';
import {
  convertValueToUrlParam,
  getCurrentSchoolYear,
  setCurrentSchoolYear,
  setUrlParam,
} from 'utils';

import myTasksActions from '../actions';
import { ROUTE_TASKS } from '../constantsRoute';

const ViewMyTask = loadable(() => import('./ViewMyTask'));

class MyTasks extends React.Component {
  static contextType = AuthDataContext;

  constructor(props, context) {
    super(props, context);
    const { currentStudentId } = context;
    const { currentUser } = props;
    // const { param_schoolYearId } = this.getParam();
    // const currentSchoolYear = getCurrentSchoolYear();

    this.isStudent = isStudent(currentUser);
    this.currentStudentId = currentStudentId;

    // if (!param_schoolYearId && currentSchoolYear?.id && currentSchoolYear?.name) {
    //   this.setParamSchoolYear(currentSchoolYear, 'replace');
    // }
  }

  componentDidMount() {
    if (this.isStudent) {
      this.getTasksInProgress();
    }
    this.getSchoolYears();
  }

  componentDidUpdate(prevProps) {
    const { param_schoolYearId } = this.getParam();
    const { isFetchingMTTaskInProgress, isFetchingSchoolYear, schoolYears } =
      this.props;
    if (!isFetchingMTTaskInProgress) {
      this.handlePageDisplay();
    }

    // NOTE: Fixed when schoolYearId on the URL didn't included in school year list
    if (
      prevProps.isFetchingSchoolYear &&
      !isFetchingSchoolYear &&
      schoolYears?.length > 0
    ) {
      const currentSchoolYear = getCurrentSchoolYear(schoolYears);
      const schoolYearItem = schoolYears.find(
        (e) => e.id === (param_schoolYearId || Number(currentSchoolYear.id))
      );
      const schoolYearTmp = schoolYearItem || schoolYears[0];
      setCurrentSchoolYear(schoolYearTmp);
      this.setParamSchoolYear(schoolYearTmp, 'replace');
    }
  }

  getParam = () => {
    const { location } = this.props;
    const searchParams = new URLSearchParams(location.search);
    return {
      param_schoolYearId: Number(searchParams.get('schoolYearId')),
    };
  };

  setParamSchoolYear = (schoolYear, type) => {
    const { location, history } = this.props;
    setUrlParam(
      location,
      history,
      {
        schoolYearId: schoolYear?.id,
        schoolYear: convertValueToUrlParam(schoolYear?.name),
      },
      type
    );
  };

  getSchoolYears = () => {
    const { currentUser, getSchoolYears } = this.props;
    const params = !this.isStudent ? { studentId: this.currentStudentId } : {};
    getSchoolYears({
      payloadData: {
        orgId: currentUser?.organizationId,
        studentId: currentUser?.id,
        params,
      },
      isFetchingSchoolYear: true,
    });
  };

  handlePageDisplay = () => {
    const { match, history, taskInProgress, schoolYears } = this.props;
    const { taskId, studentId, isExact } = match?.params || {};
    // eslint-disable-next-line eqeqeq
    if (
      !this.isStudent &&
      !isExact &&
      !!this.currentStudentId &&
      parseInt(studentId) !== this.currentStudentId &&
      schoolYears.length
    ) {
      const { param_schoolYearId } = this.getParam();
      const { id } = getCurrentSchoolYear();
      const schoolYearId = param_schoolYearId || id || schoolYears[0]?.id;
      handleURLToViewMyTask(history, null, schoolYearId, this.currentStudentId);
    }
    if (!!!taskId && !isEmpty(taskInProgress)) {
      this.handleURLToViewInProgress();
    }
  };

  getTasksInProgress = () => {
    const {
      currentUser: { organizationId },
    } = this.props;
    this.props.mtGetTaskInProgress({
      orgId: organizationId,
      isFetchingMTTaskInProgress: true,
    });
  };

  handleURLToViewInProgress = () => {
    const { history, taskInProgress } = this.props;
    history.push(`${ROUTE_TASKS.TASK_IN_PROGRESS(taskInProgress?.taskId)}`);
  };

  render() {
    const {
      isFetchingMTTaskInProgress,
      taskInProgress,
      isFetchingSchoolYear,
      schoolYears,
    } = this.props;
    if (isFetchingMTTaskInProgress || isFetchingSchoolYear) {
      return <Loading />;
    }
    return (
      <ViewMyTask
        taskInProgress={taskInProgress}
        isStudent={this.isStudent}
        schoolYears={schoolYears}
      />
    );
  }
}

MyTasks.propTypes = {
  match: PropTypes.object,
  history: PropTypes.object,
  location: PropTypes.object,
  currentUser: PropTypes.object,

  taskInProgress: PropTypes.object,
  isFetchingMTTaskInProgress: PropTypes.bool,
  mtGetTaskInProgress: PropTypes.func,

  schoolYears: PropTypes.array,
  isFetchingSchoolYear: PropTypes.bool,
  getSchoolYears: PropTypes.func,
};

const mapStateToProps = ({ Auth, MyTasks }) => ({
  currentUser: Auth.currentUser,
  auth: Auth,
  taskInProgress: MyTasks.taskInProgress,
  isFetchingMTTaskInProgress: MyTasks.isFetchingMTTaskInProgress,
  isFetchingSchoolYear: MyTasks.isFetchingSchoolYear,
  schoolYears: MyTasks.schoolYears,
  workingOnTimeBlockSuccess: MyTasks.workingOnTimeBlockSuccess,
  payloadWorkingOnTimeBlock: MyTasks.payloadWorkingOnTimeBlock,
});

const mapDispatchToProps = (dispatch) => ({
  mtGetTaskInProgress: (payload) =>
    dispatch(myTasksActions.mtGetTaskInProgress(payload)),
  getSchoolYears: (payload) =>
    dispatch(myTasksActions.getCalendarSchoolYear(payload)),
});

export default compose(connect(mapStateToProps, mapDispatchToProps))(MyTasks);
