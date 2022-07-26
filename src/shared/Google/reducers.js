import createReducers from 'utils/createReducers';

import { actions } from './constants';
const initialState = {
  getGoogleTokenSuccess: null,
  getGoogleTokenFailed: null,
  messageOauthPopup: null,
  openOauthPopup: false,
  getGoogleFileSuccess: null,
  getGoogleFileFailed: null,
  googleFile: null,
  onAction: null,
  };

export default createReducers(initialState, actions);