import createReducers from 'utils/createReducers';

import { actions } from './constants';

const schoolLibraryState = {
  schoolTemplateList: [],
  totalCourseTemplate: 0,
  isBusy: false,
};

const initialState = {
  ...schoolLibraryState,
};

export { schoolLibraryState, initialState };

export default createReducers(initialState, actions);
