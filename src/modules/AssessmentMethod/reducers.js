import createReducers from 'utils/createReducers';

import { actions } from './constants';

export const initialState = {
  assessmentMethodList: []
};

export default createReducers(initialState, actions);
