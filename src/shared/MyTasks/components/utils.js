import isNil from 'lodash/isNil';

import moment from 'moment';

export const getAvailableTime = (usedTime) => {
  let availableTime = [];
  let tempTimeFrom = 0;
  for (let i = 0; i < usedTime.length; i++) {
    if (tempTimeFrom === 0) {
      // if current timeTo is > next timeFrom so tempTimeFrom = next timeTo
      if (
        usedTime[i + 1] &&
        moment(usedTime[i].timeTo).isAfter(moment(usedTime[i + 1].timeFrom))
      ) {
        if (
          moment(usedTime[i].timeTo).isAfter(moment(usedTime[i + 1].timeTo))
        ) {
          tempTimeFrom = usedTime[i].timeTo;
        } else {
          tempTimeFrom = usedTime[i + 1].timeTo;
        }
        continue;
      } else {
        tempTimeFrom = 0;
        if (i !== usedTime.length - 1) {
          // available time block from current timeTo to next timeFrom
          availableTime.push({
            timeFrom: usedTime[i].timeTo,
            timeTo: usedTime[i + 1].timeFrom,
          });
        }
      }
    } else {
      if (
        // if current usedTime has timeTo larger than tempTimeFrom, then assign that timeTo to tempTimeFrom
        moment(usedTime[i].timeTo).isAfter(moment(tempTimeFrom))
      ) {
        tempTimeFrom = usedTime[i].timeTo;
        continue;
      } else {
        let j = i;
        while (
          // check if whether tempTimeFrom is larger than next usedTime's timeFrom
          usedTime[j + 1] &&
          moment(usedTime[j + 1].timeFrom).isBefore(moment(tempTimeFrom))
        ) {
          j++;
        }
        if (j !== usedTime.length - 1) {
          availableTime.push({
            timeFrom: tempTimeFrom,
            timeTo: usedTime[j + 1].timeFrom,
          });
          tempTimeFrom = 0;
        }
        i = j;
      }
    }

    availableTime = availableTime.filter((at) => !moment(at.timeFrom).isSame(moment(at.timeTo)));
  }

  return availableTime;
};

export const checkBetweenDate = (date, start, end) => {
  switch (true) {
    case !!start && !!end:
      return date.isBetween(start, end, 'day', '[]');
    case !!start:
      return date.isSameOrAfter(start, 'day');
    case !!end:
      return date.isSameOrBefore(end, 'day');
    default:
      return true;
  }
};

export const getUsedTime = (data) => {
  // TODO: Need to separate this logic, don't use too params like this.
  const {
    isCreateCurricular,
    dueTime,
    currentDate,
    isRescheduleTimeBlock,
    getSchedulesTmp,
    scheduleInfo,
    startTime,
    endTime,
    hourStart,
    hourEnd,
    dailyCalendarSchedules,
    calendarSchedules,
    startWeek,
    endWeek,
  } = data;
  const hasDueTime =
    !isCreateCurricular &&
    !isNil(dueTime) &&
    moment(dueTime).isSame(currentDate, 'day');
  // NOTE: Only allow to set time from 00:00 Am to 23:59 PM
  const exceptionTime = [
    {
      timeFrom: moment(currentDate).set(hourStart).format(),
      timeTo: moment(currentDate).set(hourStart).format(),
    },
  ];

  if (hasDueTime) {
    exceptionTime.push({
      timeFrom: moment(dueTime).format(),
      timeTo: moment(dueTime).set(hourEnd).format(),
    });
  } else {
    exceptionTime.push({
      timeFrom: moment(currentDate).set(hourEnd).format(),
      timeTo: moment(currentDate).set(hourEnd).format(),
    });
  }
  // NOTE: Get all of time selected in calendar and except current time editing
  const schedulesTmp = getSchedulesTmp()
    .filter((i) => i.id !== scheduleInfo.id)
    .map((i) => ({
      timeFrom: moment(i.timeFrom).format(),
      timeTo: moment(i.timeTo).format(),
    }));

  // const timeCalendarSelected = convertCalendarSchedules(hasDueTime);
  const timeCalendarSelected = convertCalendarSchedules({
    hasDueTime,
    dailyCalendarSchedules,
    calendarSchedules,
    dueTime,
    startWeek,
    endWeek,
    currentDate,
  });

  let usedTime = exceptionTime.concat(timeCalendarSelected, schedulesTmp);
  if (isRescheduleTimeBlock) {
    usedTime = usedTime.filter(
      (i) =>
        !(
          moment(i.timeFrom).isSame(startTime.clone()) &&
          moment(i.timeTo).isSame(endTime.clone())
        )
    );
    if (
      moment().isAfter(startTime.clone()) &&
      moment().isAfter(endTime.clone())
    ) {
      usedTime.push({
        timeFrom: moment(startTime).format(),
        timeTo: moment(endTime).format(),
      });
    }
  }

  usedTime = usedTime.filter(
    (i) =>
      !(
        moment(i.timeFrom).isSame(scheduleInfo?.raw?.timeFrom) &&
        moment(i.timeTo).isSame(scheduleInfo?.raw?.timeTo)
      )
  );

  const sortUsedTime = usedTime.sort(
    (a, b) => moment(a.timeFrom) - moment(b.timeFrom)
  );
  return sortUsedTime;
};

export const convertCalendarSchedules = (data) => {
  const {
    hasDueTime,
    dailyCalendarSchedules,
    calendarSchedules,
    dueTime,
    startWeek,
    endWeek,
    currentDate,
  } = data;
  const list = [];
  if (currentDate?.isValid()) {
    const schedules = currentDate.isBetween(startWeek, endWeek, 'day', '[]')
      ? calendarSchedules
      : dailyCalendarSchedules;
    schedules.forEach((element) => {
      const checkDueDate = hasDueTime
        ? moment(element.start).isSameOrBefore(dueTime, 'hour')
        : true;
      if (moment(element.start).isSame(currentDate, 'day') && checkDueDate) {
        list.push({
          timeFrom: moment(element.start).format(),
          timeTo: moment(element.end).format(),
        });
      }
    });
  }
  return list;
};
