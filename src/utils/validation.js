import filter from 'lodash/filter';
import isEmpty from 'lodash/isEmpty';
import trim from 'lodash/trim';

import moment from 'moment';

export const formatEmail =
  // eslint-disable-next-line max-len
  /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+([a-zA-Z0-9]{2,})$/;

export const emailValidation = (email) => {
  if (formatEmail.test(email)) {
    const theLastIndexOfAtSign = email.lastIndexOf('@');
    if (trim(email).slice(0, theLastIndexOfAtSign).length > 64) {
      return false;
    }
    return true;
  }
  if (email === '') {
    return true;
  }
  return false;
};

export const emailValidationInForm = (rule, value, callback, t) => {
  if (emailValidation(value)) {
    callback();
  } else {
    callback(t('common:email_valid_message'));
  }
};

/** Author: Kim Pham
 * check due date is in the past or not
 * date & time get from server
 * date format: 2020-03-16T00:00:00.000Z
 * time format: 13:06:00 */
export const isInThePast = (date, time) => {
  if (!date) {
    return false;
  }

  // const dueDate = moment(date).format('YYYY-MM-DD');
  // const dueTime = moment(dueDate + "T" + time);
  // return dueTime.isSameOrBefore(moment());

  // NOTE: only need timeFrom or timeTo to check with current time, don't need concat data and time.
  return moment(time).isSameOrBefore(moment());
};

/**
 * This method to check date has in the past or not.
 *
 * @param {*} date The date to compare.
 * @returns {*} Returns boolean value.
 * @example date: 2021-04-28T23:59:59+08:00
 * const isInThePast = checkIsInThePast('2021-04-28T23:59:59+08:00);
 */
export const checkIsInThePast = (date) => {
  if (!date) {
    return false;
  }
  return moment(date).isSameOrBefore(moment());
};

export const checkRole = (role, userRoles) => {
  const isIncludes = filter(userRoles, (item) => role === item.roleName);
  if (!isEmpty(isIncludes)) {
    return true;
  }
  return false;
};
