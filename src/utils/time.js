import moment from 'moment';
import momentTimezone from 'moment-timezone';

export const convertDateTimeToLocalTime = (date, format = 'MM/dd/yyyy') =>
  moment.utc(date).local().format(format);

export const convertCurrentTimezoneToUtc = (date, format = '') =>
  moment(date).utc().format(format);

export const convertTimezone = (inputDate, time) => {
  const date = new Date(inputDate);
  const dateFormat = moment(date).format('YYYY-MM-DD');
  const timeFormat = time ? time : moment(date).format('HH:mm:ss');
  const dateTime = `${dateFormat} ${timeFormat}`;
  return momentTimezone.tz(
    dateTime,
    window.timezone ? window.timezone : moment().tz()
  ); //NOTE: parse to domain timezone or user timezone
};

export const formatDate = (day) =>
  moment(convertTimezone(day)).format('MMM DD, YYYY');
export const formatDateSlash = (day) =>
  moment(convertTimezone(day)).format('DD/MM/YYYY');

export const formatDateTime = (day) =>
  moment(convertTimezone(day)).format('MMM DD, YYYY - hh:mm A');
