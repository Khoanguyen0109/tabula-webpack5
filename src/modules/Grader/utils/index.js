import { convertTimezone } from 'utils/time';

import moment from 'moment';

// export const isOverTime7Days = (times, terms) => {
//   const formatString = 'YYYY-MM-DD';
//   const currentTime = convertTimezone().format(formatString);
//   let isOverTimeForInput = false;

//   terms.forEach((term) => {
//     const firstDayFormat = convertTimezone(term.firstDay).format(formatString);
//     const lastDayFormat = convertTimezone(term.lastDay).format(formatString);

//     if (
//       moment(firstDayFormat).isSameOrBefore(moment(times, formatString)) &&
//       moment(times, formatString).isSameOrBefore(moment(lastDayFormat))
//     ) {
//       if (moment(lastDayFormat).add(7, 'days').isBefore(currentTime))
//         isOverTimeForInput = true;
//     }
//   });
//   return isOverTimeForInput;
// };

export const isTermOver7Days = (term) => {
  const OVER_TERM_DAYS = 7;
  if (term) {
    const formatString = 'YYYY-MM-DD';
    const today = new Date();
    const currentTime = convertTimezone(today).format(formatString);
    const lastDayFormat = convertTimezone(term.lastDay).format(formatString);

    if (
      moment(lastDayFormat).add(OVER_TERM_DAYS, 'days').isBefore(currentTime)
    ) {
      return true;
    }
  }

  return false;
};
