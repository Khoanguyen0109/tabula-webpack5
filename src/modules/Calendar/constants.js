import { objectToParams } from 'utils';
export const actions = {
  CALENDAR_SET_STATE: 'CALENDAR_SET_STATE',
  RESET_CALENDAR_REDUCER: 'RESET_CALENDAR_REDUCER',
  GET_SCHEDULES: 'GET_SCHEDULES',
  GET_SCHEDULES_SUCCESS: 'GET_SCHEDULES_SUCCESS',
  GET_SCHEDULES_FAILED: 'GET_SCHEDULES_FAILED',

  GET_CALENDAR_SCHOOL_YEAR: 'GET_CALENDAR_SCHOOL_YEAR',
  GET_CALENDAR_SCHOOL_YEAR_SUCCESS: 'GET_CALENDAR_SCHOOL_YEAR_SUCCESS',
  GET_CALENDAR_SCHOOL_YEAR_FAILED: 'GET_CALENDAR_SCHOOL_YEAR_FAILED',

  CREATE_CURRICULAR: 'CREATE_CURRICULAR',
  CREATE_CURRICULAR_SUCCESS: 'CREATE_CURRICULAR_SUCCESS',
  CREATE_CURRICULAR_FAILED: 'CREATE_CURRICULAR_FAILED',

  UPDATE_CURRICULAR: 'UPDATE_CURRICULAR',
  UPDATE_CURRICULAR_SUCCESS: 'UPDATE_CURRICULAR_SUCCESS',
  UPDATE_CURRICULAR_FAILED: 'UPDATE_CURRICULAR_FAILED',

  DELETE_CURRICULAR: 'DELETE_CURRICULAR',
  DELETE_CURRICULAR_SUCCESS: 'DELETE_CURRICULAR_SUCCESS',
  DELETE_CURRICULAR_FAILED: 'DELETE_CURRICULAR_FAILED'
};

export const END_POINT = {
  // get_scheduled: {
  //   method: 'GET',
  //   url: (orgId, schoolYearId, timezone) => `${process.env.REACT_APP_API_URL}/organizations/${orgId}/students/dashboard/calendar`
  // },
  get_schedules: {
    method: 'GET',
    url: (orgId, params) => `${process.env.REACT_APP_API_URL}/organizations/${orgId}/students/dashboard/calendar?${objectToParams(params)}`
  },
  get_calendar_school_year: {
    method: 'GET',
    url: (orgId, studentId, params) => `${process.env.REACT_APP_API_URL}/organizations/${orgId}/users/${studentId}/school-years?${objectToParams(params)}`
  },

  create_curricular: {
    method: 'POST',
    url: (orgId, params) => `${process.env.REACT_APP_API_URL}/organizations/${orgId}/users/curricular-activities?${objectToParams(params)}`
  },
  update_curricular: {
    method: 'PUT',
    url: (orgId, curricularId, params) => `${process.env.REACT_APP_API_URL}/organizations/${orgId}/users/curricular-activities/${curricularId}?${objectToParams(params)}`
  },
  delete_curricular: {
    method: 'DELETE',
    url: (orgId, curricularId, params) => `${process.env.REACT_APP_API_URL}/organizations/${orgId}/users/curricular-activities/${curricularId}?${objectToParams(params)}`
  }
};