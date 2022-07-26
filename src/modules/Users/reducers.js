import createReducers from 'utils/createReducers';

import { actions } from './constants';

const initialState = {
  users: [],
  roles: [],
  invitingUser: false,
  deletingPendingUser: false
};

export default createReducers(initialState, actions);