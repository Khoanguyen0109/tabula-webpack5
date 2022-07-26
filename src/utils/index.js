import filter from 'lodash/filter';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import isString from 'lodash/isString';
import trim from 'lodash/trim';
import uniqueId from 'lodash/uniqueId';

// import map from 'lodash/map';
// import orderBy from 'lodash/orderBy';

import { HOUR_RANGE, blockViewOnlyColor, colors } from 'utils/constants';

import moment from 'moment';

import { LOCAL_STORAGE, TYPE_BLOCK_CALENDAR } from './constants';
// import { schoolYearStatus } from 'utils/constants';

export const getDefaultTimezone = () => ({ timezone: window.timezone });

export const getIcon = (mimetype) => {
  if (mimetype.indexOf('image') !== -1) {
    return 'icon-icn_file_image';
  }
  if (mimetype.indexOf('video') !== -1) {
    return 'icon-icn_type_video';
  }
  if (mimetype.indexOf('audio') !== -1) {
    return 'icon-icn_file_audio';
  }
  if (mimetype.indexOf('pdf') !== -1) {
    return 'icon-icn_file_pdf';
  }
  if (
    mimetype.indexOf('msword') !== -1 ||
    mimetype.indexOf('officedocument') !== -1 ||
    mimetype.indexOf('office') !== -1
  ) {
    return 'icon-icn_file_document';
  }
  return 'icon-icn_attention';
};

export const getIconByExt = (filename) => {
  const ext = getExt(filename);
  switch (ext) {
    case 'jpg':
    case 'png':
    case 'bmp':
    case 'jpeg':
    case 'ico':
    case 'sgv':
    case 'webp':
      return 'icon-icn_file_image';
    case 'mp4':
    case 'avi':
    case 'flv':
      return 'icon-icn_file_video';
    case 'mp3':
    case 'ogg':
      return 'icon-icn_file_audio';
    case 'pdf':
      return 'icon-icn_file_pdf';
    case 'doc':
    case 'docx':
    case 'xls':
    case 'xlsx':
    case 'ppt':
    case 'pptx':
      return 'icon-icn_file_document';
    default:
      return 'icon-icn_attention';
  }
};

export const getExt = (filename) => {
  if (!filename || !isString(filename)) return '';
  return filename.split('.').pop().toLowerCase();
};

export const getValueFromEditor = (string) => trim(string.replace(/<[/]*p>|<br[/]*>/gm, ''));

// export const removeHtmlTag = string => {
//   return string && string !== '' ? trim(string.replace(/<\/?[^>]+(>|$)/gm, '').replace(/&nbsp;/g, ' ')) : string;
// };

export const downloadFile = (url) => {
  var a = document.createElement('a');
  a.href = url;
  a.setAttribute('download', 'something.txt');
  document.body.appendChild(a);
  a.click();
  a.remove();
};

export function downloadFile2(url, filename) {
  fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem(
        LOCAL_STORAGE.GOOGLE_ACCESS_TOKEN
      )}`,
    },
  })
    .then((response) => {
      if (response.ok) {
        return response;
      }
    })
    .then((response) => response.blob())
    .then((blob) => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    })
    .catch(() => {

    });
}

export const convertToLowerCase = (text) => isString(text) ? text.toLowerCase() : text;

export const getColor = (array) => {
  const itemArray = filter(array, (item) => !item.template.holiday);
  let pickedColor = colors[0];
  if (itemArray) {
    return (pickedColor = colors[itemArray.length % colors.length]);
  } 
    return pickedColor;
  
};

// export const getSchoolYearStatus = (value, compareField, returnField) => {
//   let status = {};
//   if(compareField) {
//     status = schoolYearStatus.find(status => status[compareField] === value);
//   }
//   status = schoolYearStatus.find(status => status.id === value);
//   return returnField ? returnField :status.name;
// };

export const convertDateTimeToUtc = (
  date,
  format = '',
  ignoreStartOf = false
) => {
  if (ignoreStartOf) {
    return moment.utc(date).format(format);
  }
  return (
    moment
      .utc(date)
      // FixBug: TL-1140
      .startOf('day')
      .format(format)
  );
};

export const objectToParams = (data) => {
  const object = { ...data };
  if (object) {
    return Object.keys(object)
      .map((i) => {
        if (Array.isArray(object[i])) {
          const searchParams = new URLSearchParams();
          object[i].forEach((item) => {
            searchParams.append(`${i}[]`, item);
          });
          return `${searchParams.toString()}`;
        }
        if (typeof object[i] === 'object') {
          return `${i}=${JSON.stringify(encodeURIComponent(object[i]))}`;
        }
        if (object[i]) {
          return `${i}=${encodeURIComponent(object[i])}`;
        }

        return `${i}=`;
      })
      .join('&');
  }
  return '';
};

export const objectToParamsNew = (data) => {
  const object = { ...data };
  if (object) {
    return Object.keys(object)
      .map((i) => {
        if (Array.isArray(object[i])) {
          const searchParams = new URLSearchParams();
          object[i].forEach((item) => {
            searchParams.append(`${i}[]`, item);
          });
          return `${searchParams.toString()}`;
        }
        if (typeof object[i] === 'object') {
          return `${i}=${JSON.stringify((object[i]))}`;
        }
        if (object[i]) {
          return `${i}=${encodeURIComponent(object[i])}`;
        }

        return `${i}=`;
      })
      .join('&');
  }
  return '';
};

export const getNumberWithOrdinal = (n) => {
  var s = ['th', 'st', 'nd', 'rd'],
    v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

export const splitNameAndExtension = (string, type) => {
  if (type === 'name') {
    return string.slice(0, string.lastIndexOf('.'));
  } 
    return string.slice(string.lastIndexOf('.'));
  
};

export const renderFileIcon = (extension) => {
  switch (extension.toLowerCase()) {
    case '.png':
    case '.jpg':
    case '.bmp':
    case '.tiff':
    case '.gif':
    case '.jpeg':
      return 'icon-icn_file_image';
    case '.pdf':
      return 'icon-icn_file_pdf';
    case '.mp3':
      return 'icon-icn_file_audio';
    case '.mp4':
    case '.webm':
    case '.ogg':
      return 'icon-icn_file_video';
    default:
      return 'icon-icn_file_document';
  }
};

export const checkPermission = (currentUser, roles) => {
  if (roles) {
    if (currentUser && currentUser.roles) {
      for (let i = 0; i < roles.length; i++) {
        const isIncludes = filter(
          currentUser.roles,
          (item) => item.roleName === roles[i]
        );
        if (!isEmpty(isIncludes)) {
          return true;
        }
      }
    }
    return false;
  }
  return true;
};
export const isTimeIncludedInPeriod = (
  time = '',
  startCheck = '',
  endCheck = '',
  format = '',
  checkStart = true,
  checkBoth = false
) => {
  if (time === '' || startCheck === '' || endCheck === '' || format === '') {
    return undefined;
  } 
    const momentTime = moment(time, format);
    const momentStartCheck = moment(startCheck, format);
    const momentEndCheck = moment(endCheck, format);
    if (checkBoth) {
      if (
        momentTime.isSame(momentStartCheck) ||
        momentTime.isSame(momentEndCheck) ||
        momentTime.isBetween(momentStartCheck, momentEndCheck)
      ) {
        return true;
      }
      return false;
    } 
      if (checkStart) {
        if (
          momentTime.isSame(momentStartCheck) ||
          momentTime.isBetween(momentStartCheck, momentEndCheck)
        ) {
          return true;
        }
        return false;
      } 
        if (
          momentTime.isSame(momentEndCheck) ||
          momentTime.isBetween(momentStartCheck, momentEndCheck)
        ) {
          return true;
        }
        return false;
  
};

export const isPeriodSubsetOfPeriod = (
  start = '',
  end = '',
  startCheck = '',
  endCheck = '',
  format = ''
) => {
  if (
    (start === '' && end === '') ||
    startCheck === '' ||
    endCheck === '' ||
    format === ''
  ) {
    return undefined;
  } 
    if (start !== '' && end !== '') {
      if (
        isTimeIncludedInPeriod(
          start,
          startCheck,
          endCheck,
          format,
          true,
          false
        ) &&
        isTimeIncludedInPeriod(end, startCheck, endCheck, format, false, false)
      ) {
        return true;
      }
      return false;
    } 
      if (start !== '') {
        if (
          isTimeIncludedInPeriod(
            start,
            startCheck,
            endCheck,
            format,
            true,
            false
          )
        ) {
          return true;
        }
        return false;
      } 
        if (
          isTimeIncludedInPeriod(
            end,
            startCheck,
            endCheck,
            format,
            false,
            false
          )
        ) {
          return true;
        }
        return false;
  
};

// Example: input: 2020-02, output: [[1,2], [3,9], [10,16], [17,23], [24,29]]
export const getWeekRangeOfMonth = (month) => {
  month = moment(month, 'YYYY-MM').startOf('month');
  const first = month.day() === 0 ? 7 : month.day();
  let day = 7 - first;
  const last = month.daysInMonth();
  const count = (last - day) / 7;
  const weeks = [];
  if (day > 0) {
    weeks.push([1, day]);
  }

  for (let i = 0; i < count; i++) {
    weeks.push([day + 1, Math.min((day += 7), last)]);
  }
  return weeks;
};

// Example: input: weekRange=[3,9], month=2020-02, output: 2
export const getWeekInMonth = (weekRange, month) => {
  const weekRangeOfMonth = getWeekRangeOfMonth(month);
  const index = weekRangeOfMonth.findIndex((item) => isEqual(item, weekRange));
  return index + 1;
};

export const getTimeValues = (firstDate, lastDate) => {
  var dateStart = moment(firstDate);
  var dateEnd = moment(lastDate);
  var timeValues = [];

  while (dateEnd > dateStart || dateStart.format('M') === dateEnd.format('M')) {
    timeValues.push(dateStart.format('YYYY-MM'));
    dateStart.add(1, 'month');
  }
  return timeValues;
};

export function humanFileSize(bytes, si = false, dp = 1) {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return `${bytes } B`;
  }

  const units = si
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  let u = -1;
  const r = 10 ** dp;

  do {
    bytes /= thresh;
    ++u;
  } while (
    Math.round(Math.abs(bytes) * r) / r >= thresh &&
    u < units.length - 1
  );

  return `${bytes.toFixed(dp) } ${ units[u]}`;
}

export function replaceHTMLTag(
  string,
  except = ['a', 'img', 'video', 'table']
) {
  // const strRegex = '(<\\/?(?!img)[^>]*>)|<[^>]+>';
  const strRegex = `<\\/?(?!${except.join('|')})\\w*\\b[^>]*>`;
  const regex = new RegExp(strRegex, 'ig');
  // const regex = /<\/?(?!a)(?!img)\w*\b[^>]*>/gi;
  // console.log(new RegExp(strRegex, 'ig'), regex, string?.replace(regex, ''));
  return string?.replace(regex, '');
}

export function generateCalendarSchedule(
  schedules = [],
  options,
  typeCanDraggable = [],
  isDisabledColorViewOnly = true
) {
  // const TYPE_BLOCK = {
  //   COURSE: 1,
  //   TASK: 2,
  //   ACTIVITY: 3,
  //   STUDY_HALL: 4,
  // };
  const updateModel = (item) => {
    let tmpTimeTo = moment(item.timeTo);
    const isReadOnly =
      !typeCanDraggable.includes(item.type) ||
      (!item.isIndicator && item.type !== TYPE_BLOCK_CALENDAR.ACTIVITY);
    // NOTE: TL-3848 Show background disabled in schedule and reschedule screen
    const isShowBackgroundDisabled = isReadOnly && isDisabledColorViewOnly;
    // with times are missed 'seconds'. ex: 23:59:00
    if (tmpTimeTo.hour() === HOUR_RANGE.END - 1 && tmpTimeTo.minute() === 59) {
      tmpTimeTo.seconds(59);
    }

    return {
      raw: {
        ...item,
        isCourse: item.type === TYPE_BLOCK_CALENDAR.COURSE,
        isTask: item.type === TYPE_BLOCK_CALENDAR.TASK,
        isActivity: item.type === TYPE_BLOCK_CALENDAR.ACTIVITY,
        indicator: !!item.isIndicator,
        timeTo: tmpTimeTo.format(),
        color: isShowBackgroundDisabled ? blockViewOnlyColor.color : item.color,
        subColor: isShowBackgroundDisabled
          ? blockViewOnlyColor.bgColor
          : item.subColor,
        borderColor: isShowBackgroundDisabled
          ? blockViewOnlyColor.borderColor
          : item.borderColor,
        isDisabled: isReadOnly && options.disabledBlock,
      },
      id: item.id || uniqueId(),
      calendarId: '1',
      title: item.name,
      category: 'time',
      start: item.timeFrom,
      end: tmpTimeTo.format(),
      color: item.color,
      isReadOnly: isReadOnly,
      ...options,
    };
  };
  const newSchedules = [];
  const collisions = [];
  const scheduleLength = schedules.length;

  const yyyymmdd = (time) => `${time.year()}${time.month() + 1}${time.date()}`;

  const days = {};
  for (let i = 0; i < scheduleLength; i++) {
    const current = schedules[i];
    const currentFrom = moment(current?.timeFrom);
    const formatDate = yyyymmdd(currentFrom);

    days[formatDate]
      ? days[formatDate].push(current)
      : (days[formatDate] = [current]);
  }

  for (let i = 0; i < scheduleLength; i++) {
    const current = updateModel(schedules[i]);
    const currentFrom = moment(current?.raw.timeFrom);
    const currentTo = moment(current?.raw.timeTo);
    const sameDate = days[yyyymmdd(currentFrom)];
    for (let j = 0, jLength = sameDate.length; j < jLength; j++) {
      const other = updateModel(sameDate[j]);
      const otherFrom = moment(other?.raw.timeFrom);
      const otherTo = moment(other?.raw.timeTo);
      if (
        currentFrom.date() !== otherFrom.date() ||
        current.id === other.id ||
        current.isCollision
      ) {
        continue;
      }
      if (
        currentFrom.isSame(otherFrom) ||
        currentFrom.isBetween(otherFrom, otherTo) ||
        otherFrom.isBetween(currentFrom, currentTo)
      ) {
        current.isCollision = true;
        // current.raw.subColor = 'red';
        collisions.push({ start: currentFrom, end: currentTo });
      }
    }
    newSchedules.push(current);
  }

  const sortedCollisions = collisions.sort((a, b) => {
    if (a.start < b.start) return -1;
    if (a.start > b.start) return 1;
    return 0;
  });

  const mergeMoment = (ranges) => {
    let result = [],
      last;
    ranges.forEach((current) => {
      if (!last || current.start > last.end) {
        result.push((last = current));
      } else if (current.end > last.end) {
        last.end = current.end;
      }
    });
    return result;
  };

  return { schedules: newSchedules, collision: mergeMoment(sortedCollisions) };
}

export function calculatorTime(start, end, returnType = 'minutes') {
  const startTime = new Date(start);
  const endTime = new Date(end);

  const offset = endTime.getTime() / 1000 - startTime.getTime() / 1000; // take the deviation of two time points, the unit is millisecond
  const totalDays = Math.round(offset / 60 / 60 / 24);

  const totalHours = Math.round(offset / 60 / 60);

  const totalMinutes = Math.round(offset / 60);

  const totalSeconds = Math.round(offset);

  switch (returnType) {
    case 'days':
      return totalDays;
    case 'hours':
      return totalHours;
    case 'seconds':
      return totalSeconds;
    case 'offset':
      return offset;
    default:
      return totalMinutes;
  }
}

export const fixedDecimalNumber = (num = 0) => {
  const numParsed = Number(num);
  if (numParsed % 1 !== 0) {
    return Number(numParsed.toFixed(2));
  }
  return numParsed;
};

export const setUrlParam = (
  location,
  history,
  objParam,
  type,
  searchParams,
  pathname
) => {
  const urlSearchParams = searchParams || new URLSearchParams(location.search);
  for (const [key, value] of urlSearchParams.entries()) {
    if (value.length === 0) {
      urlSearchParams.delete(key);
    }
  }
  Object.keys(objParam).forEach((item) => {
    urlSearchParams.set(item, objParam[item]);
  });
  history[type || 'push'](
    `${pathname || location.pathname}?${urlSearchParams.toString()}`
  );
};

export const convertValueToUrlParam = (str) => {
  if (isString(str)) {
    return str.toLowerCase().split(' ').join('-');
  }
  return str;
};

export const removeSchoolYear = () => {
  localStorage.removeItem(LOCAL_STORAGE.SCHOOL_YEAR);
};
export const removeDeviceToken = () => {
  localStorage.removeItem(LOCAL_STORAGE.DEVICE_TOKEN);
};

export const removeToken = () => {
  localStorage.removeItem(LOCAL_STORAGE.ACCESS_TOKEN);
};

export const setCurrentSchoolYear = (schoolYear) => {
  localStorage.setItem(LOCAL_STORAGE.SCHOOL_YEAR, JSON.stringify(schoolYear));
};

export const getCurrentSchoolYear = (schoolYears = []) => {
  const schoolYear =
    JSON.parse(localStorage.getItem(LOCAL_STORAGE.SCHOOL_YEAR)) ||
    getCurrentSchoolYearDefault(schoolYears);
  return { id: schoolYear?.id, name: schoolYear?.name };
};

export const getCurrentSchoolYearDefault = (schoolYears) => {
  if (schoolYears.length > 0) {
    const currentDay = moment().startOf('day');
    const index = schoolYears.findIndex((schoolYear) =>
      currentDay.isBetween(schoolYear.firstDay, schoolYear.lastDay, null, '[]')
    );
    if (index === -1) {
      // Return the latest School year
      const upComingSchoolYearIndex = schoolYears.findIndex((schoolYear) =>
        currentDay.isBefore(schoolYear.firstDay)
      );

      return upComingSchoolYearIndex !== -1
        ? schoolYears[upComingSchoolYearIndex]
        : schoolYears[0] ?? {};
    }
    return schoolYears[index];
  }
};

export const validURL = (str) => {
  const pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i'
  ); // fragment locator
  return !!pattern.test(str);
};
export function findNestedObj(entireObj, keyToFind, valToFind) {
  let foundObj;
  JSON.stringify(entireObj, (_, nestedValue) => {
    if (nestedValue && nestedValue[keyToFind] === valToFind) {
      foundObj = nestedValue;
    }
    return nestedValue;
  });
  return foundObj;
}
export const floatRegex = /[+-]?([0-9]*[.])?[0-9]+/;
export const float2Decimal = /^\d+(\.\d{0,2})?$/;
