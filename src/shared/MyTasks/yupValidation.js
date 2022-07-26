import moment from 'moment';

import { checkOverlapTimeDuration } from './utils';

function compareLimitTimeDuration(
  ref,
  msg,
  isBefore,
  limitMinutes,
  rangeTime,
  refDateTime
) {
  const { path, reference } = ref;
  return this.test({
    name: 'compareLimitTimeDuration',
    exclusive: false,
    message: msg || `${path} must be the same as ${reference}`,
    params: {
      reference: path,
    },
    test: function (value) {
      const date = moment(this.resolve(refDateTime));

      if (!!refDateTime && !date.isValid()) return true;

      const time = moment(value);
      const timeValue = time.clone().set({ second: 0, millisecond: 0 });
      const timeCompare = moment(this.resolve(ref));
      const timeCompareValue = timeCompare
        .clone()
        .set({ second: 0, millisecond: 0 });

      const duration = moment.duration(timeValue.diff(timeCompareValue));
      const hourTime = Math.abs(parseFloat(duration.asMinutes()));

      if (
        !!value &&
        timeCompare.isValid() &&
        !timeCompareValue.isSame(rangeTime.hourEnd) &&
        !timeValue.isSame(rangeTime.hourEnd)
      ) {
        return hourTime >= limitMinutes;
      }
      return true;
    },
  });
}

function compareLimitTimeLastDuration(
  ref,
  msg,
  limitMinutes,
  rangeTime,
  refDateTime
) {
  const { path, reference } = ref;
  return this.test({
    name: 'compareLimitTimeLastDuration',
    exclusive: false,
    message: msg || `${path} must be the same as ${reference}`,
    params: {
      reference: path,
    },
    test: function (value) {
      const date = moment(this.resolve(refDateTime));

      if (!!refDateTime && !date.isValid()) return true;

      const time = moment(value);
      const timeValue = time.clone().set({ second: 0, millisecond: 0 });
      const timeCompare = moment(this.resolve(ref));
      const timeCompareValue = timeCompare
        .clone()
        .set({ second: 0, millisecond: 0 });

      const duration = moment.duration(timeValue.diff(timeCompareValue));
      const hourTime = Math.abs(parseFloat(duration.asMinutes()));

      if (
        !!value &&
        timeCompareValue.isValid() &&
        (timeCompareValue.isSame(rangeTime.hourEnd) ||
          timeValue.isSame(rangeTime.hourEnd))
      ) {
        return hourTime >= limitMinutes;
      }
      return true;
    },
  });
}

function compareOverlapTimeDuration(ref, msg, availableTime, refDateTime) {
  const { path, reference } = ref;
  return this.test({
    name: 'compareOverlapTimeDuration',
    exclusive: false,
    message: msg || `${path} must be the same as ${reference}`,
    params: {
      reference: path,
    },
    test: function (value) {
      const date = moment(this.resolve(refDateTime));

      if (!!refDateTime && !date.isValid()) return true;

      const time = moment(value);
      const timeCompare = moment(this.resolve(ref));
      return checkOverlapTimeDuration(time, timeCompare, availableTime);
    },
  });
}

const checkBetweenDate = (date, start, end) => {
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

function isBetweenDate(ref, msg, start, end) {
  const { path } = ref;
  return this.test({
    name: 'isBetweenDate',
    exclusive: false,
    message: msg,
    params: {
      reference: path,
    },
    test: function (value) {
      const date = moment(value);
      return checkBetweenDate(date, start, end);
    },
  });
}

function isBetweenTime(ref, msg, refDateTime, start, end) {
  const { path } = ref;
  return this.test({
    name: 'isBetweenTime',
    exclusive: false,
    message: msg,
    params: {
      reference: path,
    },
    test: function (value) {
      const time = moment(value);
      const date = moment(this.resolve(refDateTime));
      if (checkBetweenDate(date, start, end)) {
        switch (true) {
          case !!(start && end):
            return time.isBetween(start, end, 'minute', '[]');
          case !!start:
            return time.isSameOrAfter(start, 'minute');
          case !!end:
            return time.isSameOrBefore(end, 'minute');
          default:
            return true;
        }
      }
      return true;
    },
  });
}

const schemaMethod = {
  schemaType: 'date',
  methods: {
    compareLimitTimeDuration,
    compareLimitTimeLastDuration,
    compareOverlapTimeDuration,
    isBetweenDate,
    isBetweenTime,
  },
};

export default schemaMethod;
