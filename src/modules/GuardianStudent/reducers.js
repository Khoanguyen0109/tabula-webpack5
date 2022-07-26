import createReducers from 'utils/createReducers';

import { actions } from './constants';

export const initialState = {
  studentList: [],
  guardianList: [],
  // getStudentListSuccess: false,
  inviteStudentFailedError: null,
  studentInfo: null,
  isInviteStudentSuccess: false,
  deleteStudentSuccess: false,
  guardians: [],
  invitingUser: false,
  deletingPendingGsUser: false
};

export default createReducers(initialState, actions);