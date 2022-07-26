import createReducers from 'utils/createReducers';

import { actions } from './constants';

export const initialState = {
  // getSchoolYearListSuccess: false,
  courseValidation: {},
  allCoursesList: [],
  teachers: [],
  assistantTeachers: [],
  primaryTeacher: {},
  basicInfo: {},
  getBasicInfoSuccess: false,
  getBasicInfoFailed: null,
  updateBasicInfoSuccess: false,
  updateBasicInfoFailed: null,
  defaultUrlParams: {
    sort: 'desc',
    page: 1,
    limit: 50,
    search: '',
  },
  sectionsAndMeetingTimes: {},
  getSectionsAndMeetingTimesSuccess: false,
  getSectionsAndMeetingTimesFailed: null,

  updateSectionsAndMeetingTimesSuccess: false,
  updateSectionsAndMeetingTimesFailed: null,

  deleteSectionSuccess: false,
  deleteSectionFailed: null,
};

export default createReducers(initialState, actions, actions.ALL_COURSES_RESET);
