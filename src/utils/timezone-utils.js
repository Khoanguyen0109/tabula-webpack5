import { timeZonesNames } from '@vvo/tzdb';
import { format, utcToZonedTime } from 'date-fns-tz';

export const getOffset = (tz) => {
  const zonedDate = utcToZonedTime(new Date(), tz);
  let timezoneOffset = format(zonedDate, 'OOOO', { timeZone: tz });
  return timezoneOffset;
};

export const getFormatTimezone = (tz) => `(${getOffset(tz)}) ${tz}`;

export const timezoneList = timeZonesNames.map((tz) => getFormatTimezone(tz)).sort((a, b) => {
  var re = /^\(GMT([+-]\d{1,2}):(\d{1,2})\).*$/;
  var aOffset = parseFloat(a.replace(re, '$1.$2'));
  var bOffset = parseFloat(b.replace(re, '$1.$2'));
  return aOffset < bOffset ? -1 : aOffset > bOffset ? 1 : 0;
});
