import isNil from 'lodash/isNil';

import moment from 'moment';

function compareDate(ref, msg, momentMethod = 'isSame') {
  const { path, reference } = ref;
  return this.test({
    name: 'compareDate',
    exclusive: false,
    message: msg || `${path} must be the same as ${reference}`,
    params: {
      reference: path,
    },
    test: function (value) {
      const date = moment(value);
      const dateCompare = moment(this.resolve(ref));
      return !isNil(dateCompare) && dateCompare.isValid() && date.isValid() ? date[momentMethod](dateCompare, 'day') : true;
    },
  });
}

function compareDateDuration(ref, msg, duration = 30) {
  return this.test({
    name: 'compareDateDuration',
    exclusive: false,
    message: msg || `Must span at least ${duration} days()`,
    params: {
      reference: ref.path,
    },
    test: function (value) {
      const date = moment(value);
      const dateCompare = moment(this.resolve(ref));
      return !isNil(dateCompare) && dateCompare.isValid() && date.isValid() ? Math.abs(date.diff(dateCompare, 'days')) >= duration : true;
    },
  });
}

function compareTime(ref, msg) {
  const { path, reference } = ref;
  return this.test({
    name: 'compareTime',
    exclusive: false,
    message: msg || `${path} must be the same as ${reference}`,
    params: {
      reference: path,
    },
    test: function (value) {
      const time = moment(value);
      const startTime = moment().set({ hour: 7, minute: 0 });
      const endTime = moment().set({ hour: 17, minute: 0 });

      const timeValue = moment().set({ hour: time.hour(), minute: time.minutes() });

      const durationStartTime = moment.duration(timeValue.diff(startTime));
      const durationEndTime = moment.duration(endTime.diff(timeValue));

      const hourStartTime = parseFloat(durationStartTime.asHours());
      const hourEndTime = parseFloat(durationEndTime.asHours());

      return !!value ? !(hourStartTime < 0 || hourEndTime < 0) : true;
    },
  });
}

function compareTimeDuration(ref, msg, isBefore, refDateTime) {
  const { path, reference } = ref;
  return this.test({
    name: 'compareTimeDuration',
    exclusive: false,
    message: msg || `${path} must be the same as ${reference}`,
    params: {
      reference: path,
    },
    test: function (value) {
      let date;
      if (!!refDateTime) {
        date = moment(this.resolve(refDateTime));
        if (!date.isValid()) {
          return true;
        }
      } else {
        date = moment();
      }

      const time = moment(value);
      const timeValue = date.clone().set({ hour: time.hour(), minute: time.minutes() });
      const timeCompare = moment(this.resolve(ref));
      const timeCompareValue = date.clone().set({ hour: timeCompare.hour(), minute: timeCompare.minutes() });

      const duration = moment.duration(timeValue.diff(timeCompareValue));

      const hourTime = parseFloat(duration.asHours());

      return !!value && timeCompare.isValid() ? !(isBefore ? hourTime <= 0 : hourTime >= 0) : true;
    },
  });
}

const schemaMethod = {
  schemaType: 'date',
  methods: {
    compareDate,
    compareDateDuration,
    compareTime,
    compareTimeDuration
  }
};

export default schemaMethod;