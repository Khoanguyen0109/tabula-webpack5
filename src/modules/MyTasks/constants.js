import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

import { COURSE_ITEM_TYPE } from 'utils/constants';

import {
  OPPORTUNITY_TYPE,
  TIME_BLOCK_STT,
  TURN_IN_STT,
} from 'shared/MyTasks/constants';

import {
  actions as allCourseActions,
  END_POINT as allCourseEndPoint,
} from 'modules/MyCourses/constants';
import { objectToParams } from 'utils';

import theme from '../../themes/v1/open-color.json';

export const actions = {
  //TODO : Refactor reducer confuse with My Course Reducer
  ...allCourseActions,
  GET_SCHEDULED_TASKS: 'GET_SCHEDULED_TASKS',
  GET_SCHEDULED_TASKS_SUCCESS: 'GET_SCHEDULED_TASKS_SUCCESS',
  GET_SCHEDULED_TASKS_FAILED: 'GET_SCHEDULED_TASKS_FAILED',

  GET_UNSCHEDULED_TASKS: 'GET_UNSCHEDULED_TASKS',
  GET_UNSCHEDULED_TASKS_SUCCESS: 'GET_UNSCHEDULED_TASKS_SUCCESS',
  GET_UNSCHEDULED_TASKS_FAILED: 'GET_UNSCHEDULED_TASKS_FAILED',

  GET_COMPLETED_TASKS: 'GET_COMPLETED_TASKS',
  GET_COMPLETED_TASKS_SUCCESS: 'GET_COMPLETED_TASKS_SUCCESS',
  GET_COMPLETED_TASKS_FAILED: 'GET_COMPLETED_TASKS_FAILED',

  GET_DETAIL_TASK: 'GET_DETAIL_TASK',
  GET_DETAIL_TASK_SUCCESS: 'GET_DETAIL_TASK_SUCCESS',
  GET_DETAIL_TASK_FAILED: 'GET_DETAIL_TASK_FAILED',

  DELETE_TIME_BLOCK: 'DELETE_TIME_BLOCK',
  DELETE_TIME_BLOCK_SUCCESS: 'DELETE_TIME_BLOCK_SUCCESS',
  DELETE_TIME_BLOCK_FAILED: 'DELETE_TIME_BLOCK_FAILED',

  GET_TIME_BLOCKS_BY_TASK: 'GET_TIME_BLOCKS_BY_TASK',
  GET_TIME_BLOCKS_BY_TASK_SUCCESS: 'GET_TIME_BLOCKS_BY_TASK_SUCCESS',
  GET_TIME_BLOCKS_BY_TASK_FAILED: 'GET_TIME_BLOCKS_BY_TASK_FAILED',

  WORKING_ON_TIME_BLOCK: 'WORKING_ON_TIME_BLOCK',
  WORKING_ON_TIME_BLOCK_SUCCESS: 'WORKING_ON_TIME_BLOCK_SUCCESS',
  WORKING_ON_TIME_BLOCK_FAILED: 'WORKING_ON_TIME_BLOCK_FAILED',

  GET_CALENDAR_SCHEDULES: 'GET_CALENDAR_SCHEDULES',
  GET_CALENDAR_SCHEDULES_SUCCESS: 'GET_CALENDAR_SCHEDULES_SUCCESS',
  GET_CALENDAR_SCHEDULES_FAILED: 'GET_CALENDAR_SCHEDULES_FAILED',

  GET_DAILY_CALENDAR_SCHEDULES: 'GET_DAILY_CALENDAR_SCHEDULES',
  GET_DAILY_CALENDAR_SCHEDULES_SUCCESS: 'GET_DAILY_CALENDAR_SCHEDULES_SUCCESS',
  GET_DAILY_CALENDAR_SCHEDULES_FAILED: 'GET_DAILY_CALENDAR_SCHEDULES_FAILED',

  GET_CALENDAR_SCHOOL_YEAR: 'GET_CALENDAR_SCHOOL_YEAR',
  GET_CALENDAR_SCHOOL_YEAR_SUCCESS: 'GET_CALENDAR_SCHOOL_YEAR_SUCCESS',
  GET_CALENDAR_SCHOOL_YEAR_FAILED: 'GET_CALENDAR_SCHOOL_YEAR_FAILED',

  CREATE_TASK: 'CREATE_TASK',
  CREATE_TASK_SUCCESS: 'CREATE_TASK_SUCCESS',
  CREATE_TASK_FAILED: 'CREATE_TASK_FAILED',

  RESCHEDULE_TASK: 'RESCHEDULE_TASK',
  RESCHEDULE_TASK_SUCCESS: 'RESCHEDULE_TASK_SUCCESS',
  RESCHEDULE_TASK_FAILED: 'RESCHEDULE_TASK_FAILED',

  SET_CALENDAR_SCHOOL_YEAR: 'SET_CALENDAR_SCHOOL_YEAR',

  RESET_MY_TASKS_REDUCER: 'RESET_MY_TASKS_REDUCER',

  UPDATE_TIME_BLOCKS_BY_TASK: 'UPDATE_TIME_BLOCKS_BY_TASK',

  MT_GET_TASK_DETAILS: 'MT_GET_TASK_DETAILS',
  MT_GET_TASK_DETAILS_SUCCESS: 'MT_GET_TASK_DETAILS_SUCCESS',
  MT_GET_TASK_DETAILS_FAILED: 'MT_GET_TASK_DETAILS_FAILED',

  MT_GET_TASK_IN_PROGRESS: 'MT_GET_TASK_IN_PROGRESS',
  MT_GET_TASK_IN_PROGRESS_SUCCESS: 'MT_GET_TASK_IN_PROGRESS_SUCCESS',
  MT_GET_TASK_IN_PROGRESS_FAILED: 'MT_GET_TASK_IN_PROGRESS_FAILED',

  MT_START_URGENT_TASK: 'MT_START_URGENT_TASK',
  MT_START_URGENT_TASK_SUCCESS: 'MT_START_URGENT_TASK_SUCCESS',
  MT_START_URGENT_TASK_FAILED: 'MT_START_URGENT_TASK_FAILED',

  MT_USE_GOOGLE_TEMPLATE: 'MT_USE_GOOGLE_TEMPLATE',
  MT_USE_GOOGLE_TEMPLATE_SUCCESS: 'MT_USE_GOOGLE_TEMPLATE_SUCCESS',
  MT_USE_GOOGLE_TEMPLATE_FAILED: 'MT_USE_GOOGLE_TEMPLATE_FAILED',

  MY_TASKS_SET_STATE: 'MY_TASKS_SET_STATE',
};

export const END_POINT = {
  ...allCourseEndPoint,
  get_scheduled_tasks: {
    method: 'GET', // params: schoolYearId, timezone
    url: (orgId, params) =>
      `${
        process.env.REACT_APP_API_URL
      }/organizations/${orgId}/students/dashboard/scheduled-tasks?${objectToParams(
        params
      )}`,
  },
  get_unscheduled_tasks: {
    method: 'GET', // params: schoolYearId, timezone
    url: (orgId, params) =>
      `${
        process.env.REACT_APP_API_URL
      }/organizations/${orgId}/students/dashboard/unscheduled-tasks?${objectToParams(
        params
      )}`,
  },
  get_completed_tasks: {
    method: 'GET', // params: schoolYearId, timezone
    url: (orgId, params) =>
      `${
        process.env.REACT_APP_API_URL
      }/organizations/${orgId}/students/dashboard/completed-tasks?${objectToParams(
        params
      )}`,
  },
  get_detail_task: {
    method: 'GET', // params: timezone
    url: (orgId, taskId, params) =>
      `${
        process.env.REACT_APP_API_URL
      }/organizations/${orgId}/students/dashboard/tasks/${taskId}?${objectToParams(
        params
      )}`,
  },
  get_calendar_schedules: {
    method: 'GET',
    url: (orgId, params) =>
      `${
        process.env.REACT_APP_API_URL
      }/organizations/${orgId}/students/dashboard/calendar?${objectToParams(
        params
      )}`,
  },
  get_calendar_school_year: {
    method: 'GET',
    url: (orgId, studentId, params) =>
      `${
        process.env.REACT_APP_API_URL
      }/organizations/${orgId}/users/${studentId}/school-years?${objectToParams(
        params
      )}`,
  },
  create_task: {
    method: 'POST',
    url: (orgId, taskId, params) =>
      `${
        process.env.REACT_APP_API_URL
      }/organizations/${orgId}/students/dashboard/tasks/${taskId}?${objectToParams(
        params
      )}`,
  },
  reschedule_task: {
    method: 'PUT',
    url: (orgId, taskId, params) =>
      `${
        process.env.REACT_APP_API_URL
      }/organizations/${orgId}/students/dashboard/tasks/${taskId}?${objectToParams(
        params
      )}`,
  },
  mt_get_task_details: {
    method: 'GET',
    url: (orgId, taskId, params) =>
      `${
        process.env.REACT_APP_API_URL
      }/organizations/${orgId}/students/dashboard/tasks/${taskId}?${objectToParams(
        params
      )}`,
  },
  working_on_time_block: {
    method: 'PUT',
    url: (orgId, taskId, timeBlockId) =>
      `${process.env.REACT_APP_API_URL}/organizations/${orgId}/students/dashboard/tasks/${taskId}/time-blocks/${timeBlockId}`,
  },
  delete_time_block: {
    method: 'DELETE',
    url: (orgId, taskId, timeBlockId) =>
      `${process.env.REACT_APP_API_URL}/organizations/${orgId}/students/dashboard/tasks/${taskId}/time-blocks/${timeBlockId}`,
  },
  get_time_blocks_by_task: {
    method: 'GET',
    url: (orgId, taskId, params) =>
      `${
        process.env.REACT_APP_API_URL
      }/organizations/${orgId}/students/dashboard/tasks/${taskId}?${objectToParams(
        params
      )}`,
  },
  mt_get_task_in_progress: {
    method: 'GET',
    url: (orgId, params) =>
      `${
        process.env.REACT_APP_API_URL
      }/organizations/${orgId}/students/dashboard/task-in-progress?${objectToParams(
        params
      )}`,
  },
  start_urgent_task: {
    method: 'PUT',
    url: (orgId, taskId, params) =>
      `${
        process.env.REACT_APP_API_URL
      }/organizations/${orgId}/students/dashboard/urgent-task/${taskId}?${objectToParams(
        params
      )}`,
  },
  use_google_template: {
    method: 'POST',
    url: () => `${process.env.REACT_APP_API_URL}/assignments/use-template`,
  },
};

export function infoByType(type) {
  switch (type) {
    case COURSE_ITEM_TYPE.ASSIGNMENT:
      return {
        typeName: 'Finish',
        typeLabel: 'Complete assignment',
        typeIcon: 'icon-icn_assignment',
      };
    case COURSE_ITEM_TYPE.QUIZ:
      return {
        typeName: 'Study',
        typeLabel: 'Study for',
        typeIcon: 'icon-icn_test1',
      };
    default:
      return {
        typeName: 'N/A',
        typeLabel: 'N/A',
        typeIcon: 'no-icon',
      };
  }
}

export const turnInStatus = (type) => {
  switch (type) {
    case TURN_IN_STT.MISSING:
      return 'turn-in-stt_missing';
    case TURN_IN_STT.MISSED:
      return 'turn-in-stt_missed';
    case TURN_IN_STT.TURNED_IN_LATE:
      return 'turn-in-stt_late-turned-in';
    case TURN_IN_STT.NOT_STARTED: //FIXED: https://communicate.atlassian.net/browse/TL-3030 ([u1] Initial status of a submission status is “Not Turned In“. [/u1])
    case TURN_IN_STT.IN_PROGRESS:
      return 'turn-in-stt_not_turned-in';
    case TURN_IN_STT.TURNED_IN:
      return 'turn-in-stt_turned-in';
    case TURN_IN_STT.COMPLETED:
      return 'turn-in-stt_completed';
    case TURN_IN_STT.GRADED:
      return 'turn-in-stt_graded';
    default:
      return null;
  }
};

export const turnInStatusLabel = (type) => {
  switch (type) {
    case TURN_IN_STT.MISSING:
      return {
        label: 'turn-in-stt_missing',
        IconComponent: CloseRoundedIcon,
        color: 'red',
      };
    case TURN_IN_STT.MISSED:
      return {
        label: 'turn-in-stt_missed',
        IconComponent: CloseRoundedIcon,
        color: 'red',
      };
    case TURN_IN_STT.TURNED_IN_LATE:
      return {
        label: 'turn-in-stt_late-turned-in',
        IconComponent: CheckRoundedIcon,
        color: 'green',
      };
    case TURN_IN_STT.NOT_STARTED: //FIXED: https://communicate.atlassian.net/browse/TL-3030 ([u1] Initial status of a submission status is “Not Turned In“. [/u1])
    case TURN_IN_STT.IN_PROGRESS:
      return {
        label: 'turn-in-stt_not_turned-in',
        IconComponent: CheckRoundedIcon,
        color: 'green',
      };
    case TURN_IN_STT.TURNED_IN:
      return {
        label: 'turn-in-stt_turned-in',
        IconComponent: CheckRoundedIcon,
        color: 'green',
      };
    case TURN_IN_STT.COMPLETED:
      return {
        label: 'turn-in-stt_completed',
        IconComponent: CheckRoundedIcon,
        color: 'green',
      };
    case TURN_IN_STT.GRADED:
      return {
        label: 'turn-in-stt_graded',
        IconComponent: CheckRoundedIcon,
        color: 'green',
      };
    default:
      return {};
  }
};

export const completedByType = (opportunities = [], type) => {
  switch (true) {
    case opportunities?.includes(OPPORTUNITY_TYPE.LATE_ASSIGNMENT):
      return 'time-new_deadline';
    case opportunities?.includes(OPPORTUNITY_TYPE.RETAKE_TEST):
      return 'time-retake_deadline';
    case opportunities?.includes(OPPORTUNITY_TYPE.MAKE_UP_TEST):
      return 'time-makeup_deadline';
    case type === COURSE_ITEM_TYPE.ASSIGNMENT:
      return 'time-due_date';
    case type === COURSE_ITEM_TYPE.QUIZ:
      return 'time-test_date';
    default:
      return null;
  }
};

export const taskTimeBlockStatus = (timeBlock) => {
  switch (timeBlock) {
    case TIME_BLOCK_STT.UPCOMING:
      return 'time-block-stt_upcoming';
    case TIME_BLOCK_STT.IN_PROGRESS:
      return 'time-block-stt_in_progress';
    case TIME_BLOCK_STT.ENDED:
      return 'time-block-stt_ended';
    case TIME_BLOCK_STT.SKIPPED:
      return 'time-block-stt_skipped';
    case TIME_BLOCK_STT.ON_BREAK:
      return 'time-block-stt_on_break';
    default:
      return null;
  }
};

export const TASK_STATUS = {
  UNSCHEDULED: 1,
  SCHEDULED: 2,
  COMPLETED: 3,

  // use for render
  1: 'unscheduled',
  2: 'scheduled',
  3: 'completed',
};

export const TASK_TIME_BLOCK_STATUS = {
  UP_COMING: 1,
  IN_PROGRESS: 2,
  ENDED: 3,
  SKIPPED: 4,
  ON_BREAK: 5,
};

export const TASK_IMPORTANCE_LEVEL = {
  URGENT: 1,
  PRESSING: 2,
  UPCOMING: 3,

  //use for rendering
  1: 'Urgent',
  2: 'Pressing',
  3: 'Upcoming',
};

export const TASK_IMPORTANCE_LEVEL_STATUS = {
  URGENT: 'Urgent',
  PRESSING: 'Pressing',
  UPCOMING: 'Upcoming',
};

export const TASK_IMPORTANCE_LEVEL_COLOR = {
  1: {
    color: theme.red[8],
    bgColor: theme.red[0],
  },
  2: {
    color: theme.yellow[8],
    bgColor: theme.yellow[0],
  },
  3: {
    color: theme.violet[8],
    bgColor: theme.violet[0],
  },
};
export const MAX_ATTEMPT_TIMES = 3;
export const ERROR_MESSAGE_MAX_ATTEMPT = `Unable to edit submission files because the maximum submission attempt is ${MAX_ATTEMPT_TIMES}.`;
export const ERROR_MESSAGE_ASSIGNMENT_CLOSE = 'Assignment has been closed';
export const ERROR_GOOGLE_FILE = [
  'invalid_grant',
  'Can not copy Google files.',
];
export const LIST_HANDLE_ERROR_MESSAGE = [
  ERROR_MESSAGE_MAX_ATTEMPT,
  ERROR_MESSAGE_ASSIGNMENT_CLOSE,
  ...ERROR_GOOGLE_FILE,
];
export const LIST_DISCARD_MESSAGE = [
  ERROR_MESSAGE_MAX_ATTEMPT,
  ERROR_MESSAGE_ASSIGNMENT_CLOSE,
];
