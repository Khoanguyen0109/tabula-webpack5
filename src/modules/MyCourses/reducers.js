import createReducers from 'utils/createReducers';

import { initialState as allCourseInitState } from 'shared/AllCourses/reducers';
import { initialState as lessonInitState } from 'shared/Lesson/reducers';

import { actions } from './constants';
import gradeBookStates from './initialStates/gradeBookStates';
import gradeWeightingStates from './initialStates/gradeWeightingStates';

const myCoursesState = {
  myCoursesList: [],
  course: {},
  termsListByCourse: [],
  isFetchingTermsList: false,
  syllabus: {},
  assignmentsContents: [],
  lessonsContents: [],
  typeOfCreate: 0,
  unitList: [],
  courseItemByUnit: {},
  assignment: {},
  courseDaysByGradingPeriod: {},
  courseDayDetail: {},
  allDataInPlanning: {},
  planningData: {},
  queueUpdate: {},
  // shadowHeight: {},
  courseDaysHeight: {
    maxMasterCourseDayId: null,
    maxMaster: 100,
    maxShadow: [],
    maxShadowCourseDayId: [],
  },
  activityDetails: {},

  isShowConfirmRelinkModal: false,
  sortStudentSubmissionParams: { sort: 'asc', sortField: 'section' }
};

const initialState = {
  ...allCourseInitState,
  ...lessonInitState,
  ...gradeWeightingStates,
  ...gradeBookStates,
  ...myCoursesState,
};

export { myCoursesState, initialState };

export default createReducers(initialState, actions);
