import isNil from 'lodash/isNil';

import {
  TASK_IMPORTANCE_LEVEL,
  TASK_IMPORTANCE_LEVEL_STATUS,
} from 'modules/MyTasks/constants';
import moment from 'moment';
import {
  convertValueToUrlParam,
  getCurrentSchoolYear,
  objectToParams,
} from 'utils';

import { ROUTE_TASKS } from '../constantsRoute';

// import { COURSE_ITEM_TYPE } from 'shared/MyCourses/constants';
// import { OPPORTUNITY_TYPE, TIME_BLOCK_STT, TURN_IN_STT } from 'shared/MyTasks/constants';

const setSchoolYearURL = (schoolYearId) => {
  const { id, name } = getCurrentSchoolYear();
  return {
    schoolYearId: schoolYearId || id,
    ...(schoolYearId === id
      ? { schoolYear: convertValueToUrlParam(name) }
      : {}),
  };
};

export const TabInViewMyTasks = ['unscheduled', 'scheduled', 'completed'];

export const TabInViewTaskDetails = ['task_contents', 'task_information'];

export const TASK_STATUS = {
  UNSCHEDULED: 1,
  SCHEDULED: 2,
  COMPLETED: 3,
};

export const updateTime = (k) => (k < 0 ? '00' : k < 10 ? `0${k}` : k);

export const parseDurationToMinutes = (value = 0) => {
  const durationValue = moment.duration(value);
  const hours = Math.floor(durationValue.hours());
  const days = Math.floor(durationValue.days());
  const minutes = updateTime(
    Math.floor(durationValue.minutes()) + hours * 60 + days * 24 * 60
  );
  const seconds = updateTime(Math.floor(durationValue.seconds()));
  return `${minutes}:${seconds}`;
};

export const handleURLToSchedulePage = (
  history,
  taskId,
  schoolYearId,
  action = 'schedule'
) => {
  const paramsURL = {
    ...setSchoolYearURL(schoolYearId),
    action,
  };
  history.push(
    `${ROUTE_TASKS.SCHEDULE_TASK(taskId)}?${objectToParams(paramsURL)}`
  );
};

export const handleURLToReschedulePage = (history, paramsObj = {}, taskId) => {
  const { type, courseId, schoolYearId, timeBlockId } = paramsObj;
  const paramsURL = {
    type,
    courseId,
    ...setSchoolYearURL(schoolYearId),
    timeBlockId,
  };
  history.push(
    `${ROUTE_TASKS.RESCHEDULE_TASK(taskId)}?${objectToParams(paramsURL)}`
  );
};

export const handleURLToViewMyTask = (
  history,
  tabName,
  schoolYearId,
  studentId
) => {
  const paramsURL = {
    ...setSchoolYearURL(schoolYearId),
    active: tabName || TabInViewMyTasks[0],
  };
  const pathName = studentId
    ? ROUTE_TASKS.GUARDIAN_VIEW_MY_TASKS(studentId)
    : ROUTE_TASKS.DEFAULT;
  history.push(`${pathName}?${objectToParams(paramsURL)}`);
};

export const handleURLToViewUnscheduleTaskDetails = (
  history,
  taskId,
  studentId
) => {
  const paramsURL = `tabTaskActive=${TabInViewTaskDetails[0]}`;
  const pathName = studentId
    ? ROUTE_TASKS.GUARDIAN_VIEW_UNSCHEDULE_TASK_DETAILS(taskId, studentId)
    : ROUTE_TASKS.UNSCHEDULE_TASK_DETAILS(taskId);
  history.push(`${pathName}?${paramsURL}`);
};

export const handleURLToViewScheduleTaskDetails = (
  history,
  taskId,
  studentId
) => {
  const paramsURL = `tabTaskActive=${TabInViewTaskDetails[0]}`;
  const pathName = studentId
    ? ROUTE_TASKS.GUARDIAN_VIEW_SCHEDULE_TASK_DETAILS(taskId, studentId)
    : ROUTE_TASKS.SCHEDULE_TASK_DETAILS(taskId);
  history.push(`${pathName}?${paramsURL}`);
};

export const handleURLToViewCompletedTaskDetails = (
  history,
  taskId,
  studentId
) => {
  const paramsURL = `tabTaskActive=${TabInViewTaskDetails[0]}`;
  const pathName = studentId
    ? ROUTE_TASKS.GUARDIAN_VIEW_COMPLETED_TASK_DETAILS(taskId, studentId)
    : ROUTE_TASKS.COMPLETED_TASK_DETAILS(taskId);
  history.push(`${pathName}?${paramsURL}`);
};

const getImportanceLevelByTime = (time) => {
  const isCurrentDay = moment().isSame(time, 'day');
  const isTomorrowDay = moment().add(1, 'd').isSame(time, 'day');
  const status = isCurrentDay
    ? TASK_IMPORTANCE_LEVEL_STATUS.URGENT
    : isTomorrowDay
    ? TASK_IMPORTANCE_LEVEL_STATUS.PRESSING
    : TASK_IMPORTANCE_LEVEL_STATUS.UPCOMING;
  return {
    status,
    class: `task-${status.toLowerCase()}`,
  };
};

const getImportanceLevelByLevel = (level) => {
  const status = TASK_IMPORTANCE_LEVEL[level];
  return {
    status,
    class: `task-${status.toLowerCase()}`,
  };
};

export const getImportanceLevelInfo = (time, level) =>
  isNil(level)
    ? getImportanceLevelByTime(time)
    : getImportanceLevelByLevel(level);

export const filterTasksHasImportanceLevel = (tasks) =>
  tasks?.filter((i) => !isNil(i.importanceLevel));

export const formatTimeNeeded = (min) => {
  const seconds = Number(min * 60);
  var d = Math.floor(seconds / (3600 * 24));
  var h = Math.floor((seconds % (3600 * 24)) / 3600);
  var m = Math.floor((seconds % 3600) / 60);
  // var s = Math.floor(seconds % 60);

  var dDisplay = d > 0 ? d + (d === 1 ? ' day ' : ' days ') : '';
  var hDisplay = h > 0 ? h + (h === 1 ? ' hr ' : ' hrs ') : '';
  var mDisplay = m > 0 ? m + (m === 1 ? ' min ' : ' min ') : '';
  // var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
  return dDisplay + hDisplay + mDisplay;
};
