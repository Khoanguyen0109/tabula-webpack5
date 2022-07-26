import React, { PureComponent } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import compose from 'lodash/flowRight';

import { Box, Grid, Typography } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import withStyles from '@mui/styles/withStyles';

import TblActivityIcon from 'components/TblActivityIcon/icon';
import TblButton from 'components/TblButton';
import TblConfirmDialog from 'components/TblConfirmDialog';
import TaskTags from 'modules/MyTasks/components/TaskTags';
import SetScheduleCalendar from 'shared/MyTasks/components/SetScheduleCalendar';

import { COURSE_ITEM_TYPE } from 'utils/constants';
import { isGuardian } from 'utils/roles';

import {
  QUIZ_TYPE,
  infoByType,
} from 'shared/MyCourses/constants';

import { AuthDataContext } from 'AppRoute/AuthProvider';
import clsx from 'clsx';
import { Layout1 } from 'layout';
import moment from 'moment';
import { withSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { calculatorTime, fixedDecimalNumber } from 'utils';

import myTasksActions from '../actions';
import { ROUTE_TASKS } from '../constantsRoute';
import {
  TabInViewMyTasks,
  formatTimeNeeded,
  handleURLToViewMyTask,
} from '../utils';

const styled = ({
  mainColors,
  newColors,
  spacing,
  fontSize,
  fontSizeIcon,
  fontWeight,
}) => ({
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
  iconBack: {
    fontSize: fontSizeIcon.medium,
    cursor: 'pointer',
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
  timeBar: {
    position: 'relative',
    width: '100%',
    maxWidth: '100%',
    height: spacing(0.75),
    background: mainColors.gray[4],
    borderRadius: spacing(0.5),
    '& > div': {
      height: '100%',
      background: mainColors.primary1[0],
      borderRadius: 'inherit',
    },
  },
  instruction: {
    display: 'flex',
    alignItems: 'center',
    '& p': {
      display: 'flex',
      alignItems: 'center',
      fontSize: fontSize.medium,
      '& span': {
        marginLeft: '5px',
        '&.MuiSkeleton-root': {
          width: '300px',
          borderRadius: '4px',
        },
      },
    },
  },
  selectDateLesson: {
    paddingLeft: spacing(1),
  },
  groupBtn: {
    display: 'flex',
    alignItems: 'center',
    padding: `0 ${spacing(1)}`,
 
  },
  activityCalendar: {
    flex: 1,
    overflow: 'auto',
    padding: spacing(0, 5, '20px'),
    backgroundColor: newColors.gray[100],
  },
});

class ScheduleTask extends PureComponent {
  static contextType = AuthDataContext;

  constructor(props, context) {
    super(props, context);
    this.state = {
      scheduledTasks: [],
      isFetchingCreateTask: false,
      timeSelected: 0,
      askConfirm: false,
    };

    const searchParams = new URLSearchParams(props.location.search);
    this.param_taskId = Number(props.match.params.taskId);
    this.param_action = searchParams.get('action');
    this.param_schoolYearId = Number(searchParams.get('schoolYearId'));
  }

  componentDidMount() {
    const { getDetailTask, currentUser } = this.props;
    getDetailTask({
      payloadDataDetail: {
        orgId: currentUser?.organizationId,
        taskId: this.param_taskId,
        convertModelResponse: ({ task }) => {
          const { typeName, typeLabel, typeIcon } =
            infoByType(task?.taskType) || {};

          let timeSuggested;
          if (task?.taskType === COURSE_ITEM_TYPE.ASSIGNMENT) {
            timeSuggested =
              task?.shadowAssignment?.masterAssignment?.timeToComplete;
          } else if (task?.taskType === COURSE_ITEM_TYPE.QUIZ) {
            const { quizType, masterQuiz } = task?.shadowQuiz || {};
            if (quizType === QUIZ_TYPE.ANNOUNCED) {
              timeSuggested = masterQuiz?.studyEffort;
            } else if (quizType === QUIZ_TYPE.POP) {
              timeSuggested = masterQuiz?.timeToComplete;
            }
          }

          return {
            type: task?.taskType,
            typeName,
            typeLabel,
            typeIcon,
            activityName: task?.name,
            courseName: task?.courseName,
            timeNeeded: fixedDecimalNumber(timeSuggested || 0),
            timeScheduled: fixedDecimalNumber(task?.duration || 0),
            dueTime: task?.completedBy,
            opportunityType: task?.opportunityType,
            schoolYearId: this.param_schoolYearId,
            color: task?.color,
            subColor: task?.subColor,
          };
        },
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
      isFetchingDetailTask,
      isFetchingCreateTask,
      detailTask,
      errorCreateTask,
      enqueueSnackbar,
    } = this.props;
    if (
      prevProps.isFetchingDetailTask &&
      !isFetchingDetailTask &&
      !prevProps.detailTask
    ) {
      this.setState({ timeSelected: detailTask?.timeScheduled || 0 });
    }
    if (
      prevProps.isFetchingCreateTask !== isFetchingCreateTask &&
      prevProps.isFetchingCreateTask
    ) {
      this.setState(
        {
          scheduledTasks: [],
        },
        () => {
          const errorByCode = {
            400: {
              1: 'Task duration must be at least 15 mins.',
              // 1: t('myTasks:msg_schedule-least-min', { minMinutes: MIN_MINUTES }),
              // 2: '2',
              // 3: '3'
            },
            default: 'N/A',
          };
          if (errorCreateTask) {
            if (
              errorByCode[errorCreateTask.code] &&
              errorByCode[errorCreateTask.code][
                errorCreateTask?.errors?.subcode
              ]
            ) {
              enqueueSnackbar(
                errorByCode[errorCreateTask.code][
                  errorCreateTask?.errors?.subcode
                ],
                { variant: 'error' }
              );
            } else {
              enqueueSnackbar(errorByCode.default, { variant: 'error' });
            }
          } else {
            this.moveToScheduledTab();
            enqueueSnackbar(
              t('myTasks:object_created', { objectName: 'Task' }),
              { variant: 'success' }
            );
          }
        }
      );
    }
  }

  componentWillUnmount() {
    this.props.resetMyTasksReducer({
      detailTask: null,
      calendarSchedules: [],
      calendarAvailableTime: [],
      calendarStudyHall: [],
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

  moveToUnscheduledTab = () => {
    const { history } = this.props;
    handleURLToViewMyTask(
      history,
      TabInViewMyTasks[0],
      this.param_schoolYearId
    );
  };

  onSave = () => {
    const { currentUser, createTask } = this.props;
    const { scheduledTasks } = this.state;

    createTask({
      payloadData: {
        orgId: currentUser?.organizationId,
        taskId: this.param_taskId,
        params: {
          timezone: currentUser?.timezone,
        },
        body: scheduledTasks,
      },
      taskJustScheduled: [],
      isFetchingCreateTask: true,
    });
  };

  onBack = () => {
    const { history } = this.props;
    if (isGuardian(this.context?.currentUser)) {
      return history.push(
        ROUTE_TASKS.GUARDIAN_VIEW_MY_TASKS(
          this.context?.currentStudentId ||
            this.context?.currentUser?.students[0].id
        )
      );
    } else if (this.param_action === 'schedule') {
      return this.moveToUnscheduledTab();
    } else if (this.param_action === 'add') {
      return this.moveToScheduledTab();
    } 
      return history.goBack();
    
  };

  onDiscard = () => {
    if (
      this.props.detailTask &&
      this.state.timeSelected !== this.props.detailTask.timeScheduled
    ) {
      return this.setState({
        askConfirm: true,
      });
    }
    return this.onBack();
  };

  checkMinute = (time) => `${time} ${time !== 1 ? 'mins' : 'min'}`;

  calculateTimeSelected = (schedules) =>
    schedules.reduce(
      (accumulator, currentValue) =>
        accumulator +
        calculatorTime(currentValue.startTime, currentValue.endTime),
      0
    );

  onGetSchedule = (schedules) => {
    const { detailTask } = this.props;

    const newScheduledTasks = schedules.map((e) => ({
      startTime: moment(new Date(e.timeFrom)).second(0).format(),
      endTime: moment(new Date(e.timeTo)).second(0).format(),
    }));

    this.setState({
      timeSelected:
        this.calculateTimeSelected(newScheduledTasks) +
        detailTask.timeScheduled,
      scheduledTasks: newScheduledTasks,
    });
  };

  onDeleteSchedule = (scheduleSample) => {
    const { timeSelected, scheduledTasks } = this.state;

    this.setState({
      timeSelected:
        timeSelected + calculatorTime(scheduleSample.start, scheduleSample.end),
      scheduledTasks: [
        ...scheduledTasks,
        {
          startTime: moment(new Date(scheduleSample.start)).format(),
          endTime: moment(new Date(scheduleSample.end)).format(),
        },
      ],
    });
  };

  renderDetailTask = () => {
    const {
      t,
      classes,
      isFetchingDetailTask,
      isFetchingCreateTask,
      detailTask,
    } = this.props;
    const { scheduledTasks, timeSelected } = this.state;

    let col1 = null;
    let col2 = null;
    let col3 = null;
    let col4 = null;
    let selectTimeBlock = null;
    let tags = null;

    if (isFetchingDetailTask) {
      col1 = <Skeleton variant='rectangular' height={66} />;
      col2 = <Skeleton variant='rectangular' height={66} />;
      col3 = <Skeleton variant='rectangular' height={66} />;
      col4 = <Skeleton variant='rectangular' height={66} />;
      selectTimeBlock = <Skeleton variant='rectangular' height={25} />;
    } else if (detailTask) {
      const formatDueTime = moment(detailTask.dueTime);
      col1 = (
        <Box display='flex' flexDirection='column' width='100%'>
          <Box component='div' display='flex' alignItems='center'>
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
      col2 = formatTimeNeeded(detailTask.timeNeeded);
      col3 = (
        <Box component='div'>
          <Typography component='p'>
            {formatDueTime.format('ddd, MMM DD, YYYY')}
          </Typography>
          <Typography component='p'>
            {formatDueTime.format('h:mm a')}
          </Typography>
        </Box>
      );
      col4 = (
        <Box component='div' width='100%'>
          <Typography component='p'>
            {formatTimeNeeded(timeSelected) === ''
              ? '0 min'
              : formatTimeNeeded(timeSelected)}{' '}
            / {formatTimeNeeded(detailTask.timeNeeded)}
          </Typography>
          <div className={this.props.classes.timeBar}>
            <div
              style={{
                maxWidth: '100%',
                width:
                  `${parseInt((timeSelected * 100) / detailTask.timeNeeded) }%`,
              }}
            />
          </div>
        </Box>
      );
      selectTimeBlock = (
        <span className='font-weight-semi text-ellipsis'>
          {detailTask.typeLabel}: {detailTask.activityName}
        </span>
      );
      tags = <TaskTags t={t} opportunities={detailTask?.opportunityType} />;
    }

    return (
      <React.Fragment>
        <Grid container className={classes.headerContainer}>
          <Grid item xs={5} md={5} lg={5}>
            {t('myTasks:th-name_and_course')}
          </Grid>
          <Grid item xs={2} md={2} lg={2}>
            {t('myTasks:th-time_needed')}
          </Grid>
          <Grid item xs={2} md={2} lg={2}>
            {t('myTasks:th-complete_by')}
          </Grid>
          <Grid item xs={3} md={3} lg={3}>
            {t('myTasks:th-time_selected_and_needed')}
          </Grid>
        </Grid>
        <Grid container className={classes.bodyContainer}>
          <Grid item xs={5} md={5} lg={5}>
            {col1}
          </Grid>
          <Grid item xs={2} md={2} lg={2}>
            {col2}
          </Grid>
          <Grid item xs={2} md={2} lg={2}>
            {col3}
          </Grid>
          <Grid item xs={3} md={3} lg={3}>
            {col4}
          </Grid>
        </Grid>
        {tags}
        <Grid container item className={classes.selectDateLesson}>
          <Grid item xs={9} md={9} lg={9} className={classes.instruction}>
            <Typography component='p' className='text-ellipsis'>
              {t('myTasks:text_select_date_lesson')} {selectTimeBlock}
            </Typography>
          </Grid>
          <Grid item xs={3} md={3} lg={3} className={classes.groupBtn}>
            <TblButton
              variant='outlined'
              color='primary'
              onClick={this.onBack}
            >
              {t('common:discard')}
            </TblButton>
            <Box mr={2}/>
              <TblButton
                variant='contained'
                color='secondary'
                onClick={this.onSave}
                disabled={
                  isFetchingDetailTask ||
                  isFetchingCreateTask ||
                  scheduledTasks.length === 0
                }
              >
                {t('common:save')}
              </TblButton>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  };

  renderBody = () => {
    const { isFetchingDetailTask, detailTask, errorDetailTask } = this.props;

    if (isFetchingDetailTask || detailTask) {
      return this.renderDetailTask();
    }
    if (errorDetailTask) {
      const errorByCode = {
        400: '', // ...
        404: 'Activity not found',
      };
      return errorByCode[errorDetailTask] || 'N/A';
    }
    return null;
  };

  render() {
    const {
      t,
      classes,
      location,
      history,
      currentUser,
      schoolYears,
      dailyCalendarSchedules,
      calendarSchedules,
      calendarAvailableTime,
      calendarStudyHall,
      calendarCollision,

      detailTask,
      isFetchingCreateTask,
      isFetchingCalendar,
      isFetchingDailyCalendar,
      getDailyCalendarSchedules,
      getCalendarSchedules,
      match,
    } = this.props;

    const { timeSelected, askConfirm } = this.state;
    const timeRemaining = detailTask?.timeNeeded - timeSelected;
    return (
      <Layout1 className={classes.root}>
        <TblConfirmDialog
          title={t('common:confirmation')}
          message={t('myTasks:msg_confirmation_save_scheduled', {
            taskName: detailTask?.activityName,
          })}
          okText={t('common:save')}
          cancelText={t('common:discard')}
          open={askConfirm}
          onCancel={this.onBack}
          onConfirmed={this.onSave}
          hasCloseIcon={true}
          onClose={() => {
            this.setState({
              askConfirm: false,
            });
          }}
        />
        <Box
          className={classes.header}
          component='div'
          display='flex'
          alignItems='center'
        >
          <span
            className={clsx('icon-icn_back', classes.iconBack)}
            onClick={this.onDiscard}
          />
          <Box component='div' ml={2} mr={2} width='calc(100% - 56px)'>
            {this.renderBody()}
          </Box>
        </Box>
        <Box component='div' className={classes.activityCalendar}>
          <SetScheduleCalendar
            hasDueDate
            hasAvailableTime
            match={match}
            location={location}
            history={history}
            currentUser={currentUser}
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
            // props for schedule tasks
            timeSelected={timeSelected}
            defaultMinutesItem={timeRemaining}
            onGetSchedule={this.onGetSchedule}
            onDeleteSchedule={this.onDeleteSchedule}
            isFetchingCalendar={isFetchingCalendar}
            isFetchingDailyCalendar={isFetchingDailyCalendar}
            isFetchingCreateTask={isFetchingCreateTask}
          />
        </Box>
      </Layout1>
    );
  }
}

ScheduleTask.propTypes = {
  t: PropTypes.func,
  classes: PropTypes.object,
  history: PropTypes.object,
  location: PropTypes.object,
  match: PropTypes.object,
  enqueueSnackbar: PropTypes.func,
  dailyCalendarSchedules: PropTypes.array,
  calendarSchedules: PropTypes.array,
  calendarAvailableTime: PropTypes.array,
  calendarStudyHall: PropTypes.array,
  calendarCollision: PropTypes.array,
  getDetailTask: PropTypes.func,
  detailTask: PropTypes.object,
  isFetchingDetailTask: PropTypes.bool,
  isFetchingCreateTask: PropTypes.bool,
  currentUser: PropTypes.object,
  schoolYears: PropTypes.array,
  getDailyCalendarSchedules: PropTypes.func,
  getCalendarSchedules: PropTypes.func,
  errorDetailTask: PropTypes.number,
  createTask: PropTypes.func,
  isFetchingCalendar: PropTypes.bool,
  isFetchingDailyCalendar: PropTypes.bool,
  payloadDataCalendar: PropTypes.object,
  payloadDataDetail: PropTypes.object,
  errorCalendar: PropTypes.bool,
  errorCreateTask: PropTypes.bool,
  resetMyTasksReducer: PropTypes.func,
};

const mapStateToProps = ({ Auth, MyTasks }) => ({
  currentUser: Auth.currentUser,
  dailyCalendarSchedules: MyTasks.dailyCalendarSchedules,
  calendarSchedules: MyTasks.calendarSchedules,
  calendarAvailableTime: MyTasks.calendarAvailableTime,
  calendarStudyHall: MyTasks.calendarStudyHall,
  calendarCollision: MyTasks.calendarCollision,
  detailTask: MyTasks.detailTask,
  errorDetailTask: MyTasks.errorDetailTask,
  schoolYears: MyTasks.schoolYears,
  isFetchingDetailTask: MyTasks.isFetchingDetailTask,
  isFetchingCreateTask: MyTasks.isFetchingCreateTask,
  payloadDataCalendar: MyTasks.payloadDataCalendar,
  payloadDataDetail: MyTasks.payloadDataDetail,
  isFetchingCalendar: MyTasks.isFetchingCalendar,
  isFetchingDailyCalendar: MyTasks.isFetchingDailyCalendar,
  errorCreateTask: MyTasks.errorCreateTask,
  errorCalendar: MyTasks.errorCalendar,
});

const mapDispatchToProps = (dispatch) => ({
  getDailyCalendarSchedules: (payload) =>
    dispatch(myTasksActions.getDailyCalendarSchedules(payload)),
  getCalendarSchedule: (payload) =>
    dispatch(myTasksActions.getCalendarSchedule(payload)),
  getDetailTask: (payload) => dispatch(myTasksActions.getDetailTask(payload)),
  getCalendarSchedules: (payload) =>
    dispatch(myTasksActions.getCalendarSchedules(payload)),
  createTask: (payload) => dispatch(myTasksActions.createTask(payload)),
  resetMyTasksReducer: (payload) =>
    dispatch(myTasksActions.resetMyTasksReducer(payload)),
});

export default compose(
  withTranslation(['myTasks', 'common']),
  withStyles(styled),
  withSnackbar,
  connect(mapStateToProps, mapDispatchToProps)
)(ScheduleTask);
