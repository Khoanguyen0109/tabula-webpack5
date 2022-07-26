import { COURSE_ITEM_TYPE } from 'utils/constants';
import { TEACHER } from 'utils/roles';

import { ROUTE_MY_COURSES } from 'modules/MyCourses/constantsRoute';
import { objectToParams } from 'utils';
import { checkPermission } from 'utils';

export const hoursForTimeToComplete = 60*8; // 8 hours

export const getUrlToStudentViewActivity = (item, studentId) => {
  if (!item) {
    return '';
  }
  let id = `${item?.type}-${item?.shadowId || item?.id}`;
  if (item.type === COURSE_ITEM_TYPE.QUIZ) {
    id = `${id}-${item?.quizType}`;
  }
  const params = objectToParams({
    week: `${item?.weekly}_${item?.termId}`,
    id,
    sectionId: item?.sectionId
  });
  // NOTE: view for guardian
  if (!!studentId) {
    return `${ROUTE_MY_COURSES.MY_COURSES_DETAIL_GUARDIAN(studentId, item?.courseId) }?${ params}`;
  }
  return `${ROUTE_MY_COURSES.MY_COURSES_DETAIL(item?.courseId) }?${ params}`;
};

export const getTimeItems = (stepMinute = 1, stepHours = 1, stepDays = 1) => {
  const groupSelect = {
    minutes: {
      to: 60 / stepMinute,
      step: stepMinute,
      title: 'Minutes',
      label: (value) => `${value} min`
    },
    hours: {
      step: stepHours,
      to: 24,
      title: 'Hours',
      convertToMinute: (value) => value * 60,
      label: (value) => `${value} hour`
    },
    days: {
      step: stepDays,
      to: 8,
      title: 'Days',
      convertToMinute: (value) => value * 60 * 24,
      label: (value) => `${value} day`
    }
  };

  const items = [];
  Object.keys(groupSelect).forEach((key) => {
    const type = groupSelect[key];
    items.push({ title: type.title });
    for (let i = 1, j = type.to; i < j; i++) {
      const value = i * type.step;
      items.push({
        value: (type?.convertToMinute && type.convertToMinute(value)) || value,
        label: type.label(value)
      });
    }
  });
  return items;
};

export const checkPermissionCreateAndPublish= (permission) => {
  const ROLES_UPDATE = [TEACHER];
  return checkPermission(
    permission,
    ROLES_UPDATE
  );
};

export const validMinMaxInput = (max) => (values) => {
  const { floatValue, formattedValue } = values;
  return formattedValue === '' || (floatValue <= max && floatValue > 0);
};
