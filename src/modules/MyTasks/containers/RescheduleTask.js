import React, { PureComponent } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import compose from 'lodash/flowRight';

import { Box, Grid, Typography } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import withStyles from '@mui/styles/withStyles';

import TblActivityIcon from 'components/TblActivityIcon/icon';
import TaskTags from 'modules/MyTasks/components/TaskTags';
import SetScheduleCalendar from 'shared/MyTasks/components/SetScheduleCalendar';

import { AuthDataContext } from 'AppRoute/AuthProvider';
import clsx from 'clsx';
import { Layout1 } from 'layout';
import moment from 'moment';
import { withSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { fixedDecimalNumber } from 'utils';

import myTasksActions from '../actions';
import { infoByType } from '../constants';
import { TabInViewMyTasks, handleURLToViewMyTask } from '../utils';

const styled = ({ newColors, spacing, fontSizeIcon, fontWeight }) => ({
  root: {
    height: '100vh',
    paddingLeft: 0,
    paddingRight: 0,
    '& .font-weight-semi': {
      fontWeight: fontWeight.semi,
    },
    '& > .MuiTypography-root': {
      height: '100%',
      display: 'flex',
      flexFlow: 'column',
    },
  },
  header: {
    padding: spacing(0, 5, 2, 5),
  },
  headerContainer: {
    textTransform: 'uppercase',
    fontSize: '13px',
    fontWeight: 600,
    marginLeft: '8px',
  },
  bodyContainer: {
    display: 'flex',
    alignItems: 'center',
    margin: '8px',
    marginRight: '0',
    '& .MuiSkeleton-root': {
      marginRight: '16px',
    },
    '& span[class^="icon-"]': {
      fontSize: fontSizeIcon.medium,
    },
  },
  iconBack: {
    fontSize: fontSizeIcon.medium,
    cursor: 'pointer',
  },
  activityCalendar: {
    flex: 1,
    overflow: 'auto',
    padding: spacing(0, 5, '20px'),
    backgroundColor: newColors.gray[100],
  },
});

const errorByCode = {
  400: '', // ...
  404: 'Activity not found',
};

class RescheduleTask extends PureComponent {
  static contextType = AuthDataContext;

  constructor(props, context) {
    super(props, context);
    this.state = {
      isClosedPopup: false,
    };

    const searchParams = new URLSearchParams(window.location.search);
    this.param_taskId = Number(props.match.params?.taskId);
    this.param_timeBlockId = Number(searchParams.get('timeBlockId'));
    this.param_schoolYearId = Number(searchParams.get('schoolYearId'));
  }

  componentDidMount() {
    const { getDetailTask, currentUser } = this.props;
    getDetailTask({
      payloadDataDetail: {
        convertModelResponse: ({ task }) => {
          const { typeName, typeLabel, typeIcon } =
            infoByType(task?.taskType) || {};
          return {
            type: task?.taskType,
            typeName,
            typeLabel,
            typeIcon,
            activityName: task?.name,
            courseName: task?.courseName,
            timeNeeded: fixedDecimalNumber(task?.timeNeeded || 0),
            dueTime: task?.completedBy,
            opportunityType: task?.opportunityType,
            schoolYearId: this.param_schoolYearId,
            color: task?.color,
            subColor: task?.subColor,
            defaultDateTime: task?.timeBlocks?.find(
              (e) => e.id === this.param_timeBlockId
            )?.startTime,
          };
        },
        orgId: currentUser?.organizationId,
        taskId: this.param_taskId,
        params: {
          timezone: currentUser?.timezone,
        },
      },
      detailTask: null,
      isFetchingDetailTask: true,
    });
  }

  componentDidUpdate(prevProps) {
    const {
      t,
      enqueueSnackbar,
      isFetchingRescheduleTask,
      errorRescheduleTask,
      isReSchedulesSuccess,
    } = this.props;
    if (
      prevProps.isFetchingRescheduleTask !== isFetchingRescheduleTask &&
      prevProps.isFetchingRescheduleTask
    ) {
      const errorByCode = {
        400: {
          // 1: '1',
          2: t('myTasks:msg_reschedule-skipped'),
          // 3: '3'
        },
        default: 'N/A',
      };
      if (
        errorRescheduleTask &&
        errorByCode?.[errorRescheduleTask.code]?.[
          errorRescheduleTask?.errors?.subcode
        ]
      ) {
        enqueueSnackbar(
          errorByCode?.[errorRescheduleTask.code]?.[
            errorRescheduleTask?.errors?.subcode
          ],
          { variant: 'error' }
        );
      } else {
        // this.moveToScheduledTab();
      }
    }
    if (isReSchedulesSuccess) {
      this.props.resetMyTasksReducer({
        isReSchedulesSuccess: false,
      });
    }
  }

  componentWillUnmount() {
    this.props.resetMyTasksReducer({
      detailTask: null,
      calendarSchedules: [],
      calendarAvailableTime: [],
      calendarStudyHall: [],
      isFetchingRescheduleTask: false,
      errorRescheduleTask: null,
      isReSchedulesSuccess: false,
    });
  }

  moveToScheduledTab = () => {
    const { history } = this.props;
    handleURLToViewMyTask(
      history,
      TabInViewMyTasks[1],
      this.param_schoolYearId
    );
  };

  onUpdateDetailPopup = (schedule) => {
    const { currentUser, rescheduleTask } = this.props;
    rescheduleTask({
      payloadData: {
        orgId: currentUser?.organizationId,
        taskId: this.param_taskId,
        params: {
          timezone: currentUser?.timezone,
        },
        body: {
          id: this.param_timeBlockId,
          startTime: schedule.start.format(),
          endTime: schedule.end.format(),
        },
      },
      isFetchingRescheduleTask: true,
    });
  };

  onCloseDetailPopup = () => {
    this.setState({ isClosedPopup: true });
  };

  onBack = () => {
    this.moveToScheduledTab();
  };

  checkMinute = (time) => `${time} ${time !== 1 ? 'mins' : 'min'}`;

  renderDetailTask = () => {
    const { t, classes, isFetchingDetailTask, detailTask } = this.props;

    let col1 = null;
    let col2 = null;
    let tags = null;

    if (isFetchingDetailTask) {
      col1 = <Skeleton variant='rectangular' height={66} />;
      col2 = <Skeleton variant='rectangular' height={66} />;
    } else if (detailTask) {
      const formatDueTime = moment(detailTask.dueTime);
      col1 = (
        <Box display='flex' flexDirection='column' width='100%'>
          <Box component='div' display='flex' alignItems='center'>
            {/* <span className={detailTask.typeIcon} /> */}
            <TblActivityIcon type={detailTask.type} />
            <Box component='span' ml={1}>
              {detailTask.typeLabel}:
            </Box>
          </Box>
          <Typography component='a' className='text-ellipsis font-weight-semi'>
            {detailTask.activityName}
          </Typography>
          <Typography component='p' className='text-ellipsis'>
            {detailTask.courseName}
          </Typography>
        </Box>
      );
      col2 = (
        <Box component='div'>
          <Typography component='p'>
            {formatDueTime.format('ddd, MMM DD, YYYY')}
          </Typography>
          <Typography component='p'>
            {formatDueTime.format('h:mm a')}
          </Typography>
        </Box>
      );
      tags = <TaskTags t={t} opportunities={detailTask.opportunityType} />;
    }

    return (
      <React.Fragment>
        <Grid container className={classes.headerContainer}>
          <Grid item xs={8} md={8} lg={8}>
            {t('myTasks:th-name_and_course')}
          </Grid>
          <Grid item xs={4} md={4} lg={4}>
            {t('myTasks:th-due_time')}
          </Grid>
        </Grid>
        <Grid container className={classes.bodyContainer}>
          <Grid item xs={8} md={8} lg={8}>
            {col1}
          </Grid>
          <Grid item xs={4} md={4} lg={4}>
            {col2}
          </Grid>
        </Grid>
        {tags}
      </React.Fragment>
    );
  };

  renderBody = () => {
    const { isFetchingDetailTask, errorDetailTask, detailTask } = this.props;

    if (isFetchingDetailTask || detailTask) {
      return this.renderDetailTask();
    }
    if (errorDetailTask) {
      return errorByCode[errorDetailTask] || 'N/A';
    }
    return null;
  };

  openReschedulePopup = (schedule, calendarRef, detailPopupRef) => {
    if (schedule.id === this.param_timeBlockId && !this.state.isClosedPopup) {
      // scroll container to detail popup
      const domSchedule = calendarRef.current
        .getInstance()
        .getElement(schedule.id, schedule.calendarId);
      domSchedule.scrollIntoView();
      setTimeout(() => {
        detailPopupRef.openPopup(schedule, domSchedule.getBoundingClientRect());
      }, 800);
    }
  };

  render() {
    const {
      classes,
      location,
      history,
      match,
      currentUser,
      schoolYears,
      dailyCalendarSchedules,
      calendarSchedules,
      calendarStudyHall,
      calendarAvailableTime,
      calendarCollision,
      detailTask,
      isFetchingCalendar,
      getCalendarSchedules,
      isFetchingDailyCalendar,
      getDailyCalendarSchedules,
      isReSchedulesSuccess,
    } = this.props;

    return (
      <Layout1 className={classes.root}>
        <Box
          className={classes.header}
          component='div'
          display='flex'
          alignItems='center'
        >
          <span
            className={clsx('icon-icn_back', classes.iconBack)}
            onClick={this.onBack}
          />
          <Box component='div' width='calc(100% - 56px)' ml={2} mr={2}>
            {this.renderBody()}
          </Box>
        </Box>
        <Box component='div' className={classes.activityCalendar}>
          {detailTask && (
            <SetScheduleCalendar
              hasDueDate
              history={history}
              location={location}
              currentUser={currentUser}
              match={match}
              defaultDateTime={detailTask.defaultDateTime}
              schoolYears={schoolYears}
              schoolYearId={this.param_schoolYearId}
              detailActivity={detailTask}
              getDailyCalendarSchedules={getDailyCalendarSchedules}
              getCalendarSchedules={getCalendarSchedules}
              dailyCalendarSchedules={dailyCalendarSchedules}
              calendarSchedules={calendarSchedules}
              calendarAvailableTime={calendarAvailableTime}
              calendarStudyHall={calendarStudyHall}
              calendarCollision={calendarCollision}
              isFetchingCalendar={isFetchingCalendar}
              isFetchingDailyCalendar={isFetchingDailyCalendar}
              onUpdateDetailPopup={this.onUpdateDetailPopup}
              onUpdateSchedule={this.onUpdateDetailPopup}
              onOpenDetailPopup={this.openReschedulePopup}
              onCloseDetailPopup={this.onCloseDetailPopup}
              isRescheduleTimeBlock={{
                timeBlockId: this.param_timeBlockId,
              }}
              isReSchedulesSuccess={isReSchedulesSuccess}
            />
          )}
        </Box>
      </Layout1>
    );
  }
}

RescheduleTask.propTypes = {
  t: PropTypes.func,
  classes: PropTypes.object,
  history: PropTypes.object,
  location: PropTypes.object,
  match: PropTypes.object,
  enqueueSnackbar: PropTypes.func,
  dailyCalendarSchedules: PropTypes.array,
  calendarSchedules: PropTypes.array,
  calendarStudyHall: PropTypes.array,
  calendarAvailableTime: PropTypes.array,
  calendarCollision: PropTypes.array,
  getDetailTask: PropTypes.func,
  detailTask: PropTypes.object,
  isFetchingDailyCalendar: PropTypes.bool,
  isFetchingCalendar: PropTypes.bool,
  isFetchingDetailTask: PropTypes.bool,
  isFetchingRescheduleTask: PropTypes.bool,
  errorRescheduleTask: PropTypes.object,
  currentUser: PropTypes.object,
  schoolYears: PropTypes.array,
  getDailyCalendarSchedules: PropTypes.func,
  getCalendarSchedules: PropTypes.func,
  resetMyTasksReducer: PropTypes.func,
  errorDetailTask: PropTypes.number,
  rescheduleTask: PropTypes.func,
  payloadDataCalendar: PropTypes.object,
  payloadDataDetail: PropTypes.object,
  errorCalendar: PropTypes.bool,
  isReSchedulesSuccess: PropTypes.bool,
};

const mapStateToProps = ({ Auth, MyTasks }) => ({
  currentUser: Auth.currentUser,
  dailyCalendarSchedules: MyTasks.dailyCalendarSchedules,
  calendarSchedules: MyTasks.calendarSchedules,
  calendarStudyHall: MyTasks.calendarStudyHall,
  calendarAvailableTime: MyTasks.calendarAvailableTime,
  calendarCollision: MyTasks.calendarCollision,
  detailTask: MyTasks.detailTask,
  errorDetailTask: MyTasks.errorDetailTask,
  schoolYears: MyTasks.schoolYears,
  isFetchingDailyCalendar: MyTasks.isFetchingDailyCalendar,
  isFetchingCalendar: MyTasks.isFetchingCalendar,
  isFetchingDetailTask: MyTasks.isFetchingDetailTask,
  isFetchingRescheduleTask: MyTasks.isFetchingRescheduleTask,
  errorRescheduleTask: MyTasks.errorRescheduleTask,
  payloadDataCalendar: MyTasks.payloadDataCalendar,
  payloadDataDetail: MyTasks.payloadDataDetail,
  errorCalendar: MyTasks.errorCalendar,
  isReSchedulesSuccess: MyTasks.isReSchedulesSuccess,
});

const mapDispatchToProps = (dispatch) => ({
  getDailyCalendarSchedules: (payload) =>
    dispatch(myTasksActions.getDailyCalendarSchedules(payload)),
  getCalendarSchedule: (payload) =>
    dispatch(myTasksActions.getCalendarSchedule(payload)),
  getDetailTask: (payload) => dispatch(myTasksActions.getDetailTask(payload)),
  getCalendarSchedules: (payload) =>
    dispatch(myTasksActions.getCalendarSchedules(payload)),
  rescheduleTask: (payload) => dispatch(myTasksActions.rescheduleTask(payload)),
  resetMyTasksReducer: (payload) =>
    dispatch(myTasksActions.resetMyTasksReducer(payload)),
});

export default compose(
  withTranslation(['myTasks', 'common']),
  withStyles(styled),
  withSnackbar,
  connect(mapStateToProps, mapDispatchToProps)
)(RescheduleTask);
