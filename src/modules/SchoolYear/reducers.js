import createReducers from 'utils/createReducers';

import { actions } from './constants';

export const initialState = {
  getSchoolYearListSuccess: false,
  schoolYearList: [],
  termsList: [],

  schoolYearDetail: {},
  schoolYearValidation: {},
  isUpdatingTemplate: false,
  createSchoolYearSuccess: false,
  createSchoolYearFailed: null,
  isFetchingSchedules: false,
  schedules: {},

  getSchoolYearInformationSuccess: false,
  getSchoolYearInformationFailed: null,

  updateSchoolYearInformationSuccess: false,
  updateSchoolYearInformationFailed: null,

  updateTermsSuccess: false,

  dailyTemplates: [],
  createTimeSlotSuccess: false,
  createTimeSlotFailed: null,

  updateTimeSlotSuccess: false,
  updateTimeSlotFailed: null,
  isCreateDailyTemplateSuccess: false,
  schoolYearStatus: 0,

  isLoadingCreateDailyTemplate: false,

  getTermsBySchoolYearSuccess: false
};

export default createReducers(initialState, actions, actions.SCHOOL_YEAR_RESET);
