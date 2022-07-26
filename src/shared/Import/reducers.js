import createReducers from 'utils/createReducers';

import { actions } from './constants';
import { IMPORT_STATUS } from './utils';

const initialState = {
  importLogs: [],
  importStatus: IMPORT_STATUS.START_IMPORT
};

export default createReducers(initialState, actions);