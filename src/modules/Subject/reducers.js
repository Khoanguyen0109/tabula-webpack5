import createReducers from 'utils/createReducers';

import { actions } from './constants';

export const initialState = {
  // getSchoolYearListSuccess: false,
  subjectList: [],
  getSubjectListSuccess: false,
  getSubjectListFailed: null
};

// const schoolYearReducer = handleActions(
//   {
//     GET_SCHOOL_YEAR_LIST_SUCCESS: (state, action) => ({
//       ...state,
//       schoolYearList: action.payload.schoolYear
//     }),
//   },
//   initialState
// );
// export default schoolYearReducer;
export default createReducers(initialState, actions);
