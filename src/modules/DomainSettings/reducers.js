import createReducers from 'utils/createReducers';

import { actions } from './constants';

const initialState = {
  isUpdateDomainSettingSuccess: false,
  isUpdateDomainSettingFailed: false,
  terms: [],
  gradingPeriods: [],
  isUpdateGradingPeriodSuccess: false,
  isUpdateTermSuccess: false,
  isUpdateTermFailed: false,
  isUpdateGradingPeriodFailed: false,
  isShowNotificationForUpdatingGradingPeriod: true
};

export default createReducers(initialState, actions, actions.DOMAIN_SETTINGS_RESET);