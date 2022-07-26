import moment from 'moment';

export const checkOverlapTimeDuration = (time, timeCompare, availableTime) => {
  const timeValue = time.clone().set({ second: 0, millisecond: 0 });
  const timeCompareValue = timeCompare.clone().set({ second: 0, millisecond: 0 });

  const isInAvailableTime = availableTime.some( (i) => {
    const timeFrom = moment(i.timeFrom);
    const timeTo = moment(i.timeTo);
    return timeValue.isBetween(timeFrom, timeTo, null, '[]') && timeCompareValue.isBetween(timeFrom, timeTo, null, '[]');
  });

  return !!time && timeValue.isValid() && timeCompareValue.isValid() ? isInAvailableTime : true;
};