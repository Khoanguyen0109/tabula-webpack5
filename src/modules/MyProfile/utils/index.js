import moment from 'moment';

const generateHourMinuteArray = (start = 20, end = 24, interval = 30) => {
  const items = [];
  var index = -1;
  for (let hour = start; hour <= end; hour++) {
    items.push({ text: moment({ hour }).format('hh:mm a'), id: ++index });
    if (hour !== end) {
      items.push({
        text: moment({ hour, minute: interval }).format('hh:mm a'),
        id: ++index,
      });
    }
  }
  return items;
};
const temporaryBedtimeArray = generateHourMinuteArray(20, 23, 30);
const exceptionBedtimeArray = [
  {
    text: moment({ hour: 23, minute: 30 }).format('hh:mm a'),
    id: temporaryBedtimeArray.length,
  },
  {
    text: moment({ hour: 23, minute: 59 }).format('hh:mm a'),
    id: temporaryBedtimeArray.length + 1,
  },
];
const bedtimeArray = temporaryBedtimeArray.concat(exceptionBedtimeArray);
const wakeUpArray = generateHourMinuteArray(3, 8, 30);

const checkPhoneNumber = (value) => {
  if(value[0]!=='+'){
    return `+${ value}`;
  }
  return value;
};

export {
  generateHourMinuteArray,
  temporaryBedtimeArray,
  exceptionBedtimeArray,
  checkPhoneNumber,
  bedtimeArray,
  wakeUpArray,
};
