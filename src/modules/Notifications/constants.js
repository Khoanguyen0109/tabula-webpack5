export const VARIANT_ICON = {
  INFO: 'info',
  SUCCESS: 'success',
  WARNING: 'warning',
  ERROR: 'error',
};
export const NOTIFICATION_SERIES = {
  SERIES_9A: '9a',
  SERIES_9B: '9b',
  SERIES_11A: '11a',
  SERIES_11B: '11b',
  SERIES_1: '1',
  SERIES_2: '2',
  SERIES_25: '25'
};

export const NOTIFICATION_STEPS = {
  STEP_PRE: '0',
  STEP_1: '1',
  STEP_2: '2',
  STEP_3: '3',
  STEP_4: '4',
  STEP_5: '5',
  STEP_6: '6',
};

export const NOTIFICATION_STATUS = {
  REMIND_STUDENT_START_TIME: 'remind_student_start_time',
  USER_HAD_BEEN_SUSPENDED: 'user_have_been_suspended',
};

export const actions = {
  NOTIFICATION_SET_STATE: 'NOTIFICATION_SET_STATE',

  CHECK_NOTIFICATION_VALID: 'CHECK_NOTIFICATION_VALID',
  CHECK_NOTIFICATION_VALID_SUCCESS: 'CHECK_NOTIFICATION_VALID_SUCCESS',
  CHECK_NOTIFICATION_VALID_FAILED: 'CHECK_NOTIFICATION_VALID_FAILED',

  GET_SSE_TOKEN: 'GET_SSE_TOKEN',
  GET_SSE_TOKEN_SUCCESS: 'GET_SSE_TOKEN_SUCCESS',
  GET_SSE_TOKEN_FAILED: 'GET_SSE_TOKEN_FAILED',

  RECEIVED_SSE: 'RECEIVED_SSE',
  REPLY_SSE_SUCCESS: 'REPLY_SSE_SUCCESS',

  START_URGENT_TASK: 'START_URGENT_TASK',
  START_URGENT_TASK_SUCCESS: 'START_URGENT_TASK_SUCCESS',
  START_URGENT_TASK_FAILED: 'START_URGENT_TASK_FAILED',

  SEND_NUDGE_TEXT: 'SEND_NUDGE_TEXT',
  SEND_NUDGE_TEXT_SUCCESS: 'SENd_NUDGE_TEXT_SUCCESS',
  SEND_NUDGE_TEXT_FAILED: 'SEND_NUDGE_TEXT_FAILED',

  RESET_STATE_NOTIFICATION: 'RESET_STATE_NOTIFICATION',
  SETUP_DEVICE_TOKEN: 'SETUP_DEVICE_TOKEN ',
  SETUP_DEVICE_TOKEN_FAILED: 'SETUP_DEVICE_TOKEN_FAILED',
  SETUP_DEVICE_TOKEN_SUCCESS: 'SETUP_DEVICE_TOKEN_SUCCESS',
};

export const END_POINT = {
  setup_device_token: {
    method: 'POST',
    url: `${process.env.REACT_APP_API_URL}/organizations/users/devices`
  },
  sse_token: {
    url: () => `${process.env.REACT_APP_API_NOTIFICATION}/sse-token`,
    method: 'GET',
  },
  sse_url: {
    url: (userId) => `${process.env.REACT_APP_API_NOTIFICATION}/notification-sub?id=${userId}`
  },
  reply_sse: {
    url: () => `${process.env.REACT_APP_API_NOTIFICATION}/notifications/sse`,
    method: 'PUT'
  },
  check_valid_notification: {
    url: (notificationId) =>
      `${process.env.REACT_APP_API_NOTIFICATION}/notifications/${notificationId}`,
    method: 'GET',
  },
  start_urgent_task: {
    url: () => `${process.env.REACT_APP_API_NOTIFICATION}/notifications/actions`,
    method: 'POST',
  },
  send_nudge_text: {
    url: () => `${process.env.REACT_APP_API_NOTIFICATION}/notifications/message`,
    method: 'POST',
    
  },

};

export const DESKTOP_ACTIONS = {
  start_urgent_task: 'start',
  send_nudge: 'send',
  view_task_details: 'view',
  notification_click: 'notificationclick'
};

export const testData = {
  data: {
    notificationId: 'noti Id test',
    seri: '1',
    step: '1',
    studentId: '9238',
    taskId: '35308',
    taskStatus: '2'
  },
  notification: {
    title: 'out App',
    body: 'out app',
  },
};
