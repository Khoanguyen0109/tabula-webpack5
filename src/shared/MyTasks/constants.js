import { objectToParams } from 'utils';

export const actions = {
  MT_GET_TASK_IN_PROGRESS: 'MT_GET_TASK_IN_PROGRESS',
  MT_GET_TASK_IN_PROGRESS_SUCCESS: 'MT_GET_TASK_IN_PROGRESS_SUCCESS',
  MT_GET_TASK_IN_PROGRESS_FAILED: 'MT_GET_TASK_IN_PROGRESS_FAILED',
};
export const END_POINT = {
  mt_get_task_in_progress: {
    method: 'GET',
    url: (orgId, params) => `${process.env.REACT_APP_API_URL}/organizations/${orgId}/students/dashboard/task-in-progress?${objectToParams(params)}`,
  },
};

export const TURN_IN_STT = {
  MISSING: -3,
  MISSED: -2,
  TURNED_IN_LATE: -1,
  NOT_STARTED: 0,
  IN_PROGRESS: 1,
  COMPLETED: 2,
  TURNED_IN: 3,
  GRADED: 4
};

export const OPPORTUNITY_TYPE = {
  NONE: 0,
  EXTRA_CREDIT: 1,
  LATE_ASSIGNMENT: 2,
  RETAKE_TEST: 3,
  MAKE_UP_TEST: 4
};

export const TIME_BLOCK_STT = {
  UPCOMING: 1,
  IN_PROGRESS: 2,
  ENDED: 3,
  SKIPPED: 4,
  ON_BREAK: 5
};