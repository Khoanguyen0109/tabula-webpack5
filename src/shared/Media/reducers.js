import createReducers from 'utils/createReducers';

import { actions } from './constants';

const initialState = {
  media: [],
  fetching: false,
  errors: null,
  deletingFiles: {}
};

export default createReducers(initialState, actions);