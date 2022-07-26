import createReducers from 'utils/createReducers';

import { actions as userActions } from 'modules/SchoolYear/constants';
import { initialState } from 'modules/SchoolYear/reducers';
const { 
  FETCH_USER_ROLES,
  FETCH_USER_ROLES_SUCCESS,
  FETCH_USER_ROLES_FAILED
} = userActions;

const actions = { 
  FETCH_USER_ROLES,
  FETCH_USER_ROLES_SUCCESS,
  FETCH_USER_ROLES_FAILED
};

export default createReducers(initialState, actions);