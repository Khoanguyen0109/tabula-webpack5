import isEmpty from 'lodash/isEmpty';

import { COURSE_ITEM_TYPE } from 'utils/constants';
import { isGuardian } from 'utils/roles';

import { isUndefined } from 'lodash-es';
import { TASK_STATUS } from 'modules/MyTasks/constants';
import { ROUTE_TASKS } from 'modules/MyTasks/constantsRoute';
import moment from 'moment';
import { objectToParams } from 'utils';

import {
  STATUS_STUDENT_ASSIGNMENT_IN_SUBMISSION_LIST,
  STUDENT_PROGRESS_STATUS,
} from '../constants';

export const getCourseDayId = (string = '') => {
  if (string !== '') {
    return string.replace('masterItem-', '').split('_')?.[0];
  }
  return string;
};

export const checkHasCharacter = (string, regExpType) => {
  var pattern = new RegExp(regExpType);
  return pattern.test(string);
};

export const isMasterItemInPlan = (string) => {
  const pattern = /^masterItem/i;
  return pattern.test(string);
};

export const isAvailableItemInPlan = (string) => {
  const pattern = /^availableList/i;
  return pattern.test(string);
};

export const isAnnouncedQuizItemInPlan = (string) =>
  checkHasCharacter(string, 'Announced');

export const isAssignmentItemInPlan = (string) => {
  const pattern = /^Assignment/i;
  return pattern.test(string);
};

export const isLessonItemInPlan = (string) => {
  // const pattern = /^Lesson/;
  var pattern = new RegExp('Lesson');
  return pattern.test(string);
};

export const getKeyName = (type) => {
  switch (Number(type)) {
    case COURSE_ITEM_TYPE.ASSIGNMENT:
      return 'assignmentId';
    case COURSE_ITEM_TYPE.QUIZ:
      return 'quizId';
    default:
      return 'lessonId';
  }
};

export const getKeyType = (string) =>
  checkHasCharacter(string, 'Lesson')
    ? COURSE_ITEM_TYPE.LESSON
    : checkHasCharacter(string, 'Assignment')
    ? COURSE_ITEM_TYPE.ASSIGNMENT
    : COURSE_ITEM_TYPE.QUIZ;

export const getCourseItemInfo = (courseItems, sourceId) => {
  const courseItemsKeys = Object.keys(courseItems);
  for (let i = 0; i <= courseItemsKeys.length; i++) {
    const data = courseItems[`${courseItemsKeys[i]}`]?.find(
      (i) => i.id === sourceId
    )?.data;
    if (data) {
      return data;
    }
  }
  return {};
};
// courseDays.map(i => i.dates?.find(date => date.id === courseDayId));
export const getCourseDayInfo = (courseDays, courseDayId) => {
  if (!!!courseDayId || isEmpty(courseDays)) {
    return;
  }
  for (let i = 0; i <= courseDays.length; i++) {
    // eslint-disable-next-line eqeqeq
    const data = courseDays[i]?.dates?.find((date) => date.id == courseDayId);
    if (data) {
      return data;
    }
  }
  return {};
};

export const getQueueUpdate = (courseDayIds) => {
  const queueUpdate = {};
  if (courseDayIds) {
    courseDayIds.forEach((id) => (queueUpdate[id] = true));
  }
  return queueUpdate;
};

export const convertedCourseDay = (courseDays) =>
  courseDays?.reduce(
    (accumulator, currentValue) => [
      ...accumulator,
      currentValue,
      ...currentValue.dates,
    ],
    []
  );

export const getInitialScrollOffset = (data, id, itemSize = 44) => {
  const index = data.findIndex((i) => i.id === id);
  return index !== -1 ? index * itemSize : 0;
};

export const getIndexOfTermAndGradingPeriod = (termsListByCourse) => {
  if (!termsListByCourse.length) {
    return {};
  }
  const currentDay = moment().startOf('day');
  const lastIndexOfTerm = termsListByCourse.length - 1;
  const isAfterLastDayOfTerm = currentDay.isAfter(
    termsListByCourse[lastIndexOfTerm].lastDay
  );
  const isAfterFirstDayOfTerm = currentDay.isAfter(
    termsListByCourse[0].firstDay
  );

  let currentTermIndex = termsListByCourse.findIndex((i) =>
    currentDay.isBetween(i.firstDay, i.lastDay, null, '[]')
  );
  let indexOfTermNearly = termsListByCourse.findIndex((i, indx) =>
    indx > 0
      ? currentDay.isBetween(
          termsListByCourse[indx - 1].lastDay,
          i.firstDay,
          null,
          '[]'
        )
      : false
  );
  let currentGdpIndex = 0;

  if (currentTermIndex !== -1) {
    currentGdpIndex = termsListByCourse[
      currentTermIndex
    ]?.gradingPeriods?.findIndex((i) =>
      currentDay.isBetween(i.firstDay, i.lastDay, null, '[]')
    );
  } else {
    currentTermIndex = indexOfTermNearly !== -1 ? indexOfTermNearly : 0;
  }

  // NOTE: Case 1: current time in the future
  // NOTE: Case 2: current time in a term
  // NOTE: Case 3: current time in the past
  // NOTE: Case 4: current time between two terms and selected term nearly in the future

  const indexTerm = isAfterLastDayOfTerm
    ? lastIndexOfTerm
    : isAfterFirstDayOfTerm
    ? currentTermIndex
    : 0;
  const indexGdp = isAfterLastDayOfTerm
    ? termsListByCourse[indexTerm].gradingPeriods?.length - 1
    : isAfterFirstDayOfTerm
    ? currentGdpIndex
    : 0;

  return { indexTerm, indexGdp };
};

export const getPathname = (authContext, item) => {
  const isGuardianRole = isGuardian(authContext.currentUser);

  switch (item?.status) {
    case TASK_STATUS.UNSCHEDULED:
      const unscheduledParam = `?${objectToParams({
        tabTaskActive: 'task_contents',
      })}`;
      if (isGuardianRole) {
        return (
          ROUTE_TASKS.GUARDIAN_VIEW_UNSCHEDULE_TASK_DETAILS(
            item.id,
            authContext.currentStudentId
          ) + unscheduledParam
        );
      }
      return ROUTE_TASKS.UNSCHEDULE_TASK_DETAILS(item.id) + unscheduledParam;

    case TASK_STATUS.SCHEDULED:
      const scheduledParam = `?${objectToParams({
        tabTaskActive: 'task_contents',
      })}`;
      if (isGuardianRole) {
        return (
          ROUTE_TASKS.GUARDIAN_VIEW_SCHEDULE_TASK_DETAILS(
            item.id,
            authContext.currentStudentId
          ) + scheduledParam
        );
      }
      return ROUTE_TASKS.SCHEDULE_TASK_DETAILS(item.id) + scheduledParam;

    case TASK_STATUS.COMPLETED:
      const completedParam = `?${objectToParams({
        active: 'completed',
        tabTaskActive: 'task_contents',
      })}`;
      if (isGuardianRole) {
        return (
          ROUTE_TASKS.GUARDIAN_VIEW_MY_TASKS(authContext.currentStudentId) +
          completedParam
        );
      }
      return ROUTE_TASKS.COMPLETED_TASK_DETAILS(item.id) + completedParam;

    default:
      break;
  }
};

export const initFilterStatus = () => {
  const initFilter = {};
  Object.keys(STUDENT_PROGRESS_STATUS).forEach((key) => {
    // if (key !== 'LATE_TURN_IN') {
    initFilter[key] = true;
    // }
  });
  return initFilter;
};

export const getStatusStudentProgressFilter = (filters) => {
  const filtered = Object.keys(filters).filter((k) => filters[k]);
  const statusId = filtered.map((key) => STUDENT_PROGRESS_STATUS[key]);
  return statusId.toString();
};

export const getStatusStudentSubmission = (t, statusCode) => {
  if (!isUndefined(statusCode)) {
    const { name /* color */ } =
      STATUS_STUDENT_ASSIGNMENT_IN_SUBMISSION_LIST[statusCode];
    return t(`myCourses:${name}`);
  }
  return '';
};
