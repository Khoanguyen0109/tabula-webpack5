import { objectToParams } from 'utils';
export const actions = {
  SCHOOL_YEAR_RESET: 'SCHOOL_YEAR_RESET',
  SCHOOL_YEAR_SET_STATE: 'SCHOOL_YEAR_SET_STATE',

  GET_SCHOOL_YEAR_LIST: 'GET_SCHOOL_YEAR_LIST',
  GET_SCHOOL_YEAR_LIST_SUCCESS: 'GET_SCHOOL_YEAR_LIST_SUCCESS',
  GET_SCHOOL_YEAR_LIST_FAILED: 'GET_SCHOOL_YEAR_LIST_FAILED',

  CREATE_SCHOOL_YEAR: 'CREATE_SCHOOL_YEAR',
  CREATE_SCHOOL_YEAR_FAILED: 'CREATE_SCHOOL_YEAR_FAILED',
  CREATE_SCHOOL_YEAR_SUCCESS: 'CREATE_SCHOOL_YEAR_SUCCESS',

  GET_SCHOOL_YEAR_SCHEDULES: 'GET_SCHOOL_YEAR_SCHEDULES',
  GET_SCHOOL_YEAR_SCHEDULES_SUCCESS: 'GET_SCHOOL_YEAR_SCHEDULES_SUCCESS',
  GET_SCHOOL_YEAR_SCHEDULES_FAILED: 'GET_SCHOOL_YEAR_SCHEDULES_FAILED',

  GET_SCHOOL_YEAR_INFORMATION: 'GET_SCHOOL_YEAR_INFORMATION',
  GET_SCHOOL_YEAR_INFORMATION_FAILED: 'GET_SCHOOL_YEAR_INFORMATION_FAILED',
  GET_SCHOOL_YEAR_INFORMATION_SUCCESS: 'GET_SCHOOL_YEAR_INFORMATION_SUCCESS',

  UPDATE_SCHOOL_YEAR_INFORMATION: 'UPDATE_SCHOOL_YEAR_INFORMATION',
  UPDATE_SCHOOL_YEAR_INFORMATION_FAILED:
    'UPDATE_SCHOOL_YEAR_INFORMATION_FAILED',
  UPDATE_SCHOOL_YEAR_INFORMATION_SUCCESS:
    'UPDATE_SCHOOL_YEAR_INFORMATION_SUCCESS',

  DELETE_SCHOOL_YEAR_DRAFT: 'DELETE_SCHOOL_YEAR_DRAFT',
  DELETE_SCHOOL_YEAR_DRAFT_SUCCESS: 'DELETE_SCHOOL_YEAR_DRAFT_SUCCESS',
  DELETE_SCHOOL_YEAR_DRAFT_FAILED: 'DELETE_SCHOOL_YEAR_DRAFT_FAILED',

  GET_TERMS_GRADING_PERIODS_LIST: 'GET_TERMS_GRADING_PERIODS_LIST',
  GET_TERMS_GRADING_PERIODS_LIST_SUCCESS:
    'GET_TERMS_GRADING_PERIODS_LIST_SUCCESS',
  GET_TERMS_GRADING_PERIODS_LIST_FAILED:
    'GET_TERMS_GRADING_PERIODS_LIST_FAILED',

  UPDATE_TERMS: 'UPDATE_TERMS',
  UPDATE_TERMS_SUCCESS: 'UPDATE_TERMS_SUCCESS',
  UPDATE_TERMS_FAILED: 'UPDATE_TERMS_FAILED',

  UPDATE_GRADING_PERIODS: 'UPDATE_GRADING_PERIODS',
  UPDATE_GRADING_PERIODS_SUCCESS: 'UPDATE_GRADING_PERIODS_SUCCESS',
  UPDATE_GRADING_PERIODS_FAILED: 'UPDATE_GRADING_PERIODS_FAILED',

  CREATE_DAILY_TEMPLATE: 'CREATE_DAILY_TEMPLATE',
  CREATE_DAILY_TEMPLATE_FAILED: 'CREATE_DAILY_TEMPLATE_FAILED',
  CREATE_DAILY_TEMPLATE_SUCCESS: 'CREATE_DAILY_TEMPLATE_SUCCESS',

  GET_SCHOOL_YEAR_DAILY_TEMPLATE: 'GET_SCHOOL_YEAR_DAILY_TEMPLATE',
  GET_SCHOOL_YEAR_DAILY_TEMPLATE_SUCCESS:
    'GET_SCHOOL_YEAR_DAILY_TEMPLATE_SUCCESS',
  GET_SCHOOL_YEAR_DAILY_TEMPLATE_FAILED:
    'GET_SCHOOL_YEAR_DAILY_TEMPLATE_FAILED',

  DELETE_SCHOOL_YEAR_PERIOD: 'DELETE_SCHOOL_YEAR_PERIOD',
  DELETE_SCHOOL_YEAR_PERIOD_SUCCESS: 'DELETE_SCHOOL_YEAR_PERIOD_SUCCESS',
  DELETE_SCHOOL_YEAR_PERIOD_FAILED: 'DELETE_SCHOOL_YEAR_PERIOD_FAILED',

  UPDATE_SCHOOL_YEAR_TEMPLATE: 'UPDATE_SCHOOL_YEAR_TEMPLATE',
  UPDATE_SCHOOL_YEAR_TEMPLATE_SUCCESS: 'UPDATE_SCHOOL_YEAR_TEMPLATE_SUCCESS',
  UPDATE_SCHOOL_YEAR_TEMPLATE_FAILED: 'UPDATE_SCHOOL_YEAR_TEMPLATE_FAILED',

  CREATE_TIME_SLOT: 'CREATE_TIME_SLOT',
  CREATE_TIME_SLOT_SUCCESS: 'CREATE_TIME_SLOT_SUCCESS',
  CREATE_TIME_SLOT_FAILED: 'CREATE_TIME_SLOT_FAILED',

  UPDATE_TIME_SLOT: 'UPDATE_TIME_SLOT',
  UPDATE_TIME_SLOT_SUCCESS: 'UPDATE_TIME_SLOT_SUCCESS',
  UPDATE_TIME_SLOT_FAILED: 'UPDATE_TIME_SLOT_FAILED',

  GET_SCHOOL_YEAR_VALIDATION: 'GET_SCHOOL_YEAR_VALIDATION',
  GET_SCHOOL_YEAR_VALIDATION_SUCCESS: 'GET_SCHOOL_YEAR_VALIDATION_SUCCESS',
  GET_SCHOOL_YEAR_VALIDATION_FAILED: 'GET_SCHOOL_YEAR_VALIDATION_FAILED',

  SET_SCHEDULE: 'SET_SCHEDULE',
  SET_SCHEDULE_FAILED: 'SET_SCHEDULE_FAILED',
  SET_SCHEDULE_SUCCESS: 'SET_SCHEDULE_SUCCESS',

  COPY_AND_PASTE_A_WEEK: 'COPY_AND_PASTE_A_WEEK',
  COPY_AND_PASTE_A_WEEK_FAILED: 'COPY_AND_PASTE_A_WEEK_FAILED',
  COPY_AND_PASTE_A_WEEK_SUCCESS: 'COPY_AND_PASTE_A_WEEK_SUCCESS',

  GET_SETTING_TERMS_AND_GRADING_PERIODS:
    'GET_SETTING_TERMS_AND_GRADING_PERIODS',
  GET_SETTING_TERMS_AND_GRADING_PERIODS_SUCCESS:
    'GET_SETTING_TERMS_AND_GRADING_PERIODS_SUCCESS',
  GET_SETTING_TERMS_AND_GRADING_PERIODS_FAILED:
    'GET_SETTING_TERMS_AND_GRADING_PERIODS_FAILED',
  UPDATE_SETTING_TERMS_AND_GRADING_PERIODS:
    'UPDATE_SETTING_TERMS_AND_GRADING_PERIODS',
  UPDATE_SETTING_TERMS_AND_GRADING_PERIODS_SUCCESS:
    'UPDATE_SETTING_TERMS_AND_GRADING_PERIODS_SUCCESS',
  UPDATE_SETTING_TERMS_AND_GRADING_PERIODS_FAILED:
    'UPDATE_SETTING_TERMS_AND_GRADING_PERIODS_FAILED',
  GET_TERMS_BY_SCHOOL_YEAR: 'GET_TERMS_BY_SCHOOL_YEAR',
  GET_TERMS_BY_SCHOOL_YEAR_FAILED: 'GET_TERMS_BY_SCHOOL_YEAR_FAILED',
  GET_TERMS_BY_SCHOOL_YEAR_SUCCESS: 'GET_TERMS_BY_SCHOOL_YEAR_SUCCESS',

  UPDATE_SCHOOL_YEAR_STATUS: 'UPDATE_SCHOOL_YEAR_STATUS',
  UPDATE_SCHOOL_YEAR_STATUS_SUCCESS: 'UPDATE_SCHOOL_YEAR_STATUS_SUCCESS',
  UPDATE_SCHOOL_YEAR_STATUS_FAILED: 'UPDATE_SCHOOL_YEAR_STATUS_FAILED',

  RESET_SCHOOL_YEAR_REDUCER: 'RESET_SCHOOL_YEAR_REDUCER',
};

const schoolYearInformationAPI = (methodType) => ({
    url: (orgId, schoolYearId, urlParams) =>
      `${
        process.env.REACT_APP_API_URL
      }/organization/${orgId}/school-year/${schoolYearId}/info?${objectToParams(
        urlParams
      )}`,
    method: methodType,
  });

const timeSlotAPI = (methodType) => ({
    url: (orgId, templateId) => `${process.env.REACT_APP_API_URL}/organization/${orgId}/daily-template/${templateId}/periods`,
    method: methodType,
  });

const settingTermsAndGradingPeriodsAPI = (methodType) => ({
    url: (orgId, schoolYearId) => `${process.env.REACT_APP_API_URL}/organization/${orgId}/school-year/${schoolYearId}/structure`,
    method: methodType,
  });

const schoolYearSchedule = (methodType) => ({
    url: (orgId, schoolYearId, urlParams) =>
      `${
        process.env.REACT_APP_API_URL
      }/organization/${orgId}/school-year/${schoolYearId}/schedules?${objectToParams(
        urlParams
      )}`,
    method: methodType,
  });

export const END_POINT = {
  get_school_year_list: {
    url: (id, urlParams) =>
      `${
        process.env.REACT_APP_API_URL
      }/organization/${id}/school-years?${objectToParams(urlParams)}`,
    method: 'GET',
  },
  create_school_year: {
    url: (orgId) =>
      `${process.env.REACT_APP_API_URL}/organization/${orgId}/school-year`,
    method: 'POST',
  },
  delete_school_year_draft: {
    url: (orgId, schoolYearId) =>
      `${process.env.REACT_APP_API_URL}/organization/${orgId}/school-year/${schoolYearId}`,
    method: 'DELETE',
  },
  get_terms_grading_periods_list: {
    url: (orgId, schoolYearId) =>
      `${process.env.REACT_APP_API_URL}/organization/${orgId}/school-year/${schoolYearId}/term-grading-period`,
    method: 'GET',
  },
  update_terms: {
    url: (orgId, schoolYearId, termId, urlParams) =>
      `${
        process.env.REACT_APP_API_URL
      }/organization/${orgId}/school-year/${schoolYearId}/term/${termId}?${objectToParams(
        urlParams
      )}`,
    method: 'PUT',
  },
  update_grading_periods: {
    url: (orgId, schoolYearId, termId, urlParams) =>
      `${
        process.env.REACT_APP_API_URL
      }/organization/${orgId}/school-year/${schoolYearId}/term/${termId}/grading-periods?${objectToParams(
        urlParams
      )}`,
    method: 'PUT',
  },
  get_daily_template: {
    method: 'GET',
    url: (orgId, schoolYearId, urlParams) =>
      `${
        process.env.REACT_APP_API_URL
      }/organization/${orgId}/school-year/${schoolYearId}/daily-template/periods/all?${objectToParams(
        urlParams
      )}`,
  },
  delete_period: {
    method: 'DELETE',
    url: (orgId, templateId, periodId) =>
      `${process.env.REACT_APP_API_URL}/organization/${orgId}/daily-template/${templateId}/periods/${periodId}`,
  },
  update_template: {
    method: 'PUT',
    url: (orgId, schoolYearId, templateId) =>
      `${process.env.REACT_APP_API_URL}/organization/${orgId}/school-year/${schoolYearId}/daily-template/${templateId}`,
  },
  get_school_year_information: schoolYearInformationAPI('GET'),
  update_school_year_information: schoolYearInformationAPI('PUT'),
  create_time_slot: timeSlotAPI('POST'),
  update_time_slot: {
    method: 'PUT',
    url: (orgId, templateId, periodId) =>
      `${process.env.REACT_APP_API_URL}/organization/${orgId}/daily-template/${templateId}/periods/${periodId}`,
  },
  create_daily_template: {
    url: (orgId, schoolYearId) =>
      `${process.env.REACT_APP_API_URL}/organization/${orgId}/school-year/${schoolYearId}/daily-template`,
    method: 'POST',
  },
  get_school_year_validation: {
    method: 'GET',
    url: (orgId, schoolYearId) =>
      `${process.env.REACT_APP_API_URL}/organization/${orgId}/school-year/${schoolYearId}/validation`,
  },
  get_school_year_schedules: schoolYearSchedule('GET'),
  set_schedule: schoolYearSchedule('PUT'),
  copy_and_paste_a_week: {
    url: (orgId, schoolYearId) =>
      `${process.env.REACT_APP_API_URL}/organization/${orgId}/school-year/${schoolYearId}/weekly-schedule`,
    method: 'PUT',
  },

  get_setting_terms_and_grading_periods:
    settingTermsAndGradingPeriodsAPI('GET'),
  update_setting_terms_and_grading_periods: {
    method: 'PUT',
    url: (orgId, schoolYearId) =>
      `${process.env.REACT_APP_API_URL}/organization/${orgId}/school-year/${schoolYearId}/term-grading-period/setting`,
  },
  get_terms_by_school_year: {
    url: (orgId, schoolYearId) =>
      `${process.env.REACT_APP_API_URL}/organization/${orgId}/school-year/${schoolYearId}/terms`,
    method: 'GET',
  },
};

export const DAY_OF_WEEK = {
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
  SUNDAY: 0,
};

export const SCHOOL_YEAR_STATUS = {
  ARCHIVED: -1,
  DRAFT: 0,
  PUBLISHED: 1,
};
