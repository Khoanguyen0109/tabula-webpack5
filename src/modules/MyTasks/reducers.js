import createReducers from 'utils/createReducers';

import { initialState as allCourseInitState } from 'modules/MyCourses/reducers';

import { actions } from './constants';
export const initialState = {
  ...allCourseInitState,
  error: null,
  isBusy: false,
  isChangePassWordSuccess: false,
  schoolYears: [],
  sortUnscheduled: {
    typeSort: 'asc',
    fieldSort: 'completedBy'
  },
  sortScheduled: {
    typeSort: 'asc',
    fieldSort: 'completedBy'
  },
  sortCompleted: {
    typeSort: 'asc',
    fieldSort: 'completedBy'
  },
  pagingCompleted: {
    page: 1,
    limit: 50
  },
  // get schedules in calendar
  isFetchingCalendar: false,
  calendarSchedules: [],
  calendarAvailableTime: [],
  calendarStudyHall: [],
  errorCalendar: undefined,
  // get schedules in daily calendar
  isFetchingDailyCalendar: false,
  dailyCalendarSchedules: [],
  errorDailyCalendar: undefined,
  // get scheduled list
  isFetchingScheduled: false,
  scheduledTasks: [],
  // get unscheduled list
  isFetchingUnscheduled: false,
  unscheduledTasks: [],
  taskInProgress: {},
  // get finished list
  isFetchingCompleted: false,
  completedTasks: [],
  totalCompletedTasks: 0,
  // get detail of task
  isFetchingDetailTask: false,
  detailTask: null,
  errorDetailTask: null,
  // delete a time block
  isFetchingDeleteTimeBlock: false,
  errorDeleteTimeBlock: null,
  // get time blocks by task
  isFetchingGetTimeBlocksByTask: false,
  timeBlocksByTask: {},
  errorGetTimeBlocksByTask: null,
  // schedule task
  taskJustScheduled: null,
  taskJustCompleted: null,
  isFetchingCreateTask: false,
  errorCreateTask: null,
  // reschedule task
  isFetchingRescheduleTask: false,
  errorRescheduleTask: null,
  isReSchedulesSuccess: false,
  openLastTimeBlockConfirm: false,
  teacherGoogleConnect: false
};

export default createReducers(initialState, actions);