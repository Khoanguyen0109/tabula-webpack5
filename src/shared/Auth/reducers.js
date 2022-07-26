import createReducers from 'utils/createReducers';

import { actions } from './constants';

const initialState = {
    isUserActive: true,
    currentUser: {},
    isLogging: false,
    isNewSession: false,
    gettingUser: false,
    error: null,
    token: null,
    isBusy: false,
    acceptInvitationSuccessfully: false,
    resetPasswordSuccessfully: false,
    setupDomainSuccessfully: false,
    subdomainValid: 0,
    isForgotPasswordSuccessfully: false,
    isResetPasswordSuccessfully: false,
    isValidToken: false,
    checkingToken: true,
    schoolGradeLevel: []
  };

export default createReducers(initialState, actions, actions.AUTH_RESET);