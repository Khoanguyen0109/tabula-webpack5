export const HOUR_RANGE = {
  START: 0,
  END: 24
};
export const SEARCH_DEBOUNCE = 700;
export const LOCAL_STORAGE = {
  DEVICE_TOKEN: 'device_token_fb',
  ACCESS_TOKEN: 'access_token',
  SCHOOL_YEAR: 'schoolYear',
  RE_REQUEST_NOTIFICATION_PERMISSION: 'reRequestNotificationDate',
  GOOGLE_ACCESS_TOKEN: 'googleAccessToken',
  GOOGLE_ACCESS_TOKEN_EXPIRED_DATE: 'expiryDate',
};

export const colors = [
  '#c9c8d8',
  '#b8e0cb',
  '#9de4eb',
  '#7cbce6',
  '#e7da99',
  '#b19ad5',
  '#81c6a7',
  '#73ccf8',
  '#a5a2ff',
  '#f3d190',
  '#76cad5',
  '#f1b1a9'
];

export const gradingPeriodColors = [
  '#feca2e',
  '#73ccf8',
  '#fda643',
  '#a3a0fb',
  '#9de4eb',
  '#71d1a6'
];

export const schoolYearStatus = [
  { id: 0, name: 'Draft' },
  { id: 1, name: 'Active' },
  { id: -1, name: 'Archived' }
];

export const dateFormatConstants = {
  YEAR: 'YYYY',
  MONTH: 'MMM YYYY',
  FULL_MONTH_NAME: 'MMMM',
  SHORT_MONTH_NAME: 'MMM',
  ISO_MONTH: 'YYYY-MM',
  DATE: 'MMM D, YYYY',
  ISO_DATE: 'YYYY-MM-DD',
  DATE_TIME: 'D MMM YYYY HH:mm:ss',
  FULL_TIME: 'h:mm a',
  TWELVE_HOURS_TWO_DIGITS_TIME: 'hh:mm A',
  DATE_OF_WEEK: 'dddd, MMMM DD, YYYY'
};

export const courseBackgroundColors = {
  '#4b4a69': '#d4d3db',
  '#f59a1b': '#fce7c8',
  '#67ced9': '#daf3f6',
  '#523ec4': '#d5d1f1',
  '#bb66db': '#efdaf7',
  '#6dbde6': '#dceff9',
  '#e0692a': '#f8dbcc',
  '#27496d': '#cbd3dc',
  '#47770f': '#d3dec5',
  '#3c4245': '#d0d1d2',
};

// TODO: Need to refactor to use theme of the app
export const blockViewOnlyColor = {
  color: '#868E96', // Gray 2
  bgColor: '#e9ecef', // Gray 6
  borderColor: '#e9ecef' // Gray 6
};

export const SUB_CODE = {
  CAN_NOT_CHANGE_EMAIL: 1,
  END_SESSION: 2,
  CAN_NOT_CHANGE_ROLE: 3,
  LIMITED_FILE_UPDATE: 4,
  CAN_NOT_DELETE: 5,
  ASSIGNMENT_CLOSED: 6,
  CAN_NOT_CHANGE_STATUS: 7,
  FILE_EXISTS: 8,
  EMPTY_STUDENT: 9,
  STATUS_INVALID: 10
};
export const MAX_UPLOAD = 5;
export const MAX_GOOGLE_UPLOAD_FILES = 10;

export const COURSE_ITEM_TYPE = {
  LESSON: 0,
  ASSIGNMENT: 1,
  QUIZ: 3
};

export const TYPE_BLOCK_CALENDAR = {
  COURSE: 1,
  TASK: 2,
  ACTIVITY: 3,
  STUDY_HALL: 4,
};
