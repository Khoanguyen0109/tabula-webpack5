import createReducers from 'utils/createReducers';

import { actions } from './constants';

const lessonState = {
  lessonsContents: [],
  lessonDetail: {
  }
};

const initialState = {
  ...lessonState,
};

export { lessonState, initialState };

export default createReducers(initialState, actions);
