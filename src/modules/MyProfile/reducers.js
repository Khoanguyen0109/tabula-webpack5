import createReducers from 'utils/createReducers';

import { actions } from './constants';

const initialState = {
    error: null,
    isBusy: false,
    isChangePassWordSuccess: false
  };

export default createReducers(initialState, actions);