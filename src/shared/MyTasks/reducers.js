import createReducers from 'utils/createReducers';

import { actions } from './constants';

export const initialState = {
  taskInProgressShared: {},
  isFetchingMTTaskInProgress: false,
  errorMTTaskInProgress: null,
};

export default createReducers(initialState, actions);
