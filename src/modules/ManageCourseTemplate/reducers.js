import createReducers from 'utils/createReducers';

import { actions } from './constants';

const manageCourseTemplateState = {
  courseTemplateList: [],
  isBusy: false,
  totalCourseTemplate: 0,
  templateDetail: {},
  schoolSetting: {},
  availableGradeLevel: [],
  viewDetailTermsAndGradingPeriod: [],
  isCurrentTemplatePublished: false
};

const initialState = {
  ...manageCourseTemplateState,
};

export { manageCourseTemplateState, initialState };

export default createReducers(initialState, actions);
