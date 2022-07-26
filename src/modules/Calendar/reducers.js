import createReducers from 'utils/createReducers';

import { actions } from './constants';

const initialState = {
  error: null,
  isBusy: false,
  calendarSchedules: []
};

export default createReducers(initialState, actions);