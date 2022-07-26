import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import compose from 'lodash/flowRight';
import trim from 'lodash/trim';

import withStyles from '@mui/styles/withStyles';

import BreadcrumbWithSettings from 'components/TblBreadcrumb/BreadcrumbWithSettings';
import { DEFAULT_EXTRA_MINUTES } from 'components/TblCalendar/constants';
import SetScheduleCalendar from 'shared/MyTasks/components/SetScheduleCalendar';

import { withHooksGetSchoolYear } from 'utils/customHook/useGetSchoolYear';
import { isGuardian, isStudent } from 'utils/roles';

import { AuthDataContext } from 'AppRoute/AuthProvider';
import { Layout1 } from 'layout';
import moment from 'moment';
import PropTypes from 'prop-types';
import { calculatorTime } from 'utils';

import calendarActions from '../actions';

const styled = ({ newColors }) => ({
  activityCalendar: {
    height: 'calc(100vh - 130px)',
  },
  calendarContent: {
    backgroundColor: newColors.gray[100],
  },
  styleCalendar: {
    '& .tui-full-calendar-time-schedule .due-time-wrapper': {
      display: 'none',
    },
  },
});

class Calendar extends React.PureComponent {
  static contextType = AuthDataContext;

  constructor(props) {
    super(props);
    const { t } = props;

    this.state = {
      detailActivity: {
        dueTime: moment().format(),
      },
      scheduledCurricular: [],
      timeSelected: 0,
      schoolYears: [],
    };

    this.titleBreadcrumb = t('calendar');
  }

  componentDidMount() {
    const { currentUser, getSchoolYearList } = this.props;
    const { currentStudentId } = this.context;
    getSchoolYearList({
      payloadData: {
        orgId: currentUser?.organizationId,
        studentId:
          !!currentStudentId && isGuardian(currentUser)
            ? currentStudentId
            : currentUser?.id,
      },
      isFetchingSchoolYear: true,
    });
  }

  updateTimeSelected = (scheduleSample) => {
    const { match } = this.props;
    const { timeSelected, scheduledCurricular } = this.state;

    let taskType = '';
    if (this.param_type === 1) {
      taskType = 'shadowAssignmentId';
    } else {
      taskType = 'shadowQuizId';
    }

    this.setState({
      timeSelected:
        timeSelected + calculatorTime(scheduleSample.start, scheduleSample.end),
      scheduledCurricular: [
        ...scheduledCurricular,
        {
          [taskType]: Number(match.params?.shadowId),
          taskName: scheduleSample.title,
          startTime: moment(new Date(scheduleSample.start)).toISOString(),
          endTime: moment(new Date(scheduleSample.end)).toISOString(),
        },
      ],
    });
  };

  onUpdateDetailPopup = (
    schedule,
    payloadGetCalendar,
  ) => {
    const { currentUser } = this.props;
    const { date, activityName, start, end } = schedule;
    const payload = {
      orgId: currentUser?.organizationId,
      dataBody: {
        activityName: trim(activityName),
        date,
        startTime: moment(start).format('HH:mm'),
        endTime: moment(end).format('HH:mm'),
        timezone: currentUser?.timezone,
      },
      payloadGetCalendar: { ...payloadGetCalendar },
    };
    this.props.createCurricular(payload);
  };

  onCreateSchedule = (
    event,
    schedule,
    payloadGetCalendar,
    scheduleDetailPopupRef
  ) => {
    event.minTop = document
      .querySelector('.tui-full-calendar-timegrid-container')
      ?.getBoundingClientRect().top;
    event.maxTop = window.innerHeight - event.top;
    scheduleDetailPopupRef.openPopup(schedule, event);
  };

  onUpdateSchedule = (schedule, payloadGetCalendar) => {
    const { currentUser } = this.props;
    const payload = {
      orgId: currentUser?.organizationId,
      curricularId: schedule?.id,
      dataBody: {
        activityName: trim(schedule?.raw?.name),
        date: moment(schedule?.start).format('YYYY-MM-DD'), //NOTE: Fixed for cases when doing drag drop and resize item
        startTime: moment(schedule?.start).format('HH:mm'),
        endTime: moment(schedule?.end).format('HH:mm'),
        timezone: currentUser?.timezone,
      },
      payloadGetCalendar: { ...payloadGetCalendar },
    };
    this.props.updateCurricular(payload);
  };

  onDeleteSchedule = (schedule, payloadGetCalendar) => {
    const id = schedule?.raw?.id;
    if (!!!id) {
      return;
    }
    const { currentUser } = this.props;
    const payload = {
      orgId: currentUser?.organizationId,
      curricularId: id,
      payloadGetCalendar: { ...payloadGetCalendar },
    };
    this.props.deleteCurricular(payload);
  };

  render() {
    const {
      classes,
      location,
      history,
      match,
      calendarSchedules,
      calendarStudyHall,
      calendarAvailableTime,
      calendarCollision,
      currentUser,
      getSchedules,
      isFetchingCalendar,
      schoolYears,
      schoolYearSelected,
    } = this.props;
    const { currentStudentId } = this.context;

    const { detailActivity } = this.state;

    const isStudentRole = isStudent(currentUser) || !!!currentStudentId;

    return (
      <>
        <Layout1 className={classes.calendarContent} scrollable={false}>
          <BreadcrumbWithSettings title={this.titleBreadcrumb} />

          <div className={classes.activityCalendar}>
            <SetScheduleCalendar
              hasAvailableTime
              match={match}
              location={location}
              history={history}
              className={classes.styleCalendar}
              schoolYearId={schoolYearSelected}
              currentUser={currentUser}
              schoolYears={schoolYears}
              isStudent={!!isStudentRole}
              detailActivity={detailActivity}
              updateTimeSelected={this.updateTimeSelected}
              getCalendarSchedules={getSchedules}
              isFetchingCalendar={isFetchingCalendar}
              calendarAvailableTime={calendarAvailableTime}
              calendarSchedules={calendarSchedules}
              calendarStudyHall={calendarStudyHall}
              calendarCollision={calendarCollision}
              defaultMinutesItem={DEFAULT_EXTRA_MINUTES}
              isCreateCurricular
              onCreateSchedule={this.onCreateSchedule}
              onUpdateSchedule={this.onUpdateSchedule}
              onDeleteSchedule={this.onDeleteSchedule}
              onUpdateDetailPopup={this.onUpdateDetailPopup}
            />
          </div>
        </Layout1>
      </>
    );
  }
}

Calendar.propTypes = {
  activityDetails: PropTypes.object,
  calendarAvailableTime: PropTypes.array,
  calendarCollision: PropTypes.array,
  calendarSchedules: PropTypes.array,
  calendarStudyHall: PropTypes.array,
  classes: PropTypes.object,
  createCurricular: PropTypes.func,
  currentUser: PropTypes.object,
  deleteCurricular: PropTypes.func,
  getAssignmentDetails: PropTypes.func,
  getQuizDetails: PropTypes.func,
  getSchedules: PropTypes.func,
  getSchoolYearList: PropTypes.func,
  getUnscheduledTasks: PropTypes.func,
  history: PropTypes.object,
  isFetchingCalendar: PropTypes.bool,
  isFetchingSchoolYear: PropTypes.bool,
  isFetchingUnscheduled: PropTypes.bool,
  location: PropTypes.object,
  match: PropTypes.object,
  schoolYearSelected: PropTypes.number,
  schoolYears: PropTypes.array,
  t: PropTypes.func,
  unscheduledTasks: PropTypes.array,
  updateCurricular: PropTypes.func,
};

const mapStateToProps = (state) => ({
  schoolYears: state.Calendar.schoolYears,
  currentUser: state.Auth.currentUser,
  schoolYearSelected: state.Auth.schoolYearSelected,
  isFetchingCalendar: state.Calendar.isFetchingCalendar,
  isFetchingSchoolYear: state.Calendar.isFetchingSchoolYear,
  calendarAvailableTime: state.Calendar.calendarAvailableTime,
  calendarSchedules: state.Calendar.calendarSchedules,
  calendarStudyHall: state.Calendar.calendarStudyHall,
  calendarCollision: state.Calendar.calendarCollision,
});

const mapDispatchToProps = (dispatch) => ({
  getSchedules: (payload) => dispatch(calendarActions.getSchedules(payload)),
  getSchoolYearList: (payload) =>
    dispatch(calendarActions.getCalendarSchoolYear(payload)),
  createCurricular: (payload) =>
    dispatch(calendarActions.createCurricular(payload)),
  updateCurricular: (payload) =>
    dispatch(calendarActions.updateCurricular(payload)),
  deleteCurricular: (payload) =>
    dispatch(calendarActions.deleteCurricular(payload)),
});

export default compose(
  withTranslation(['calendar', 'common']),
  withStyles(styled),
  connect(mapStateToProps, mapDispatchToProps)
)(withHooksGetSchoolYear(Calendar));
