import { ofType } from 'redux-observable';
import { of } from 'rxjs';
import { catchError, mergeMap, switchMap } from 'rxjs/operators';

import { makeAjaxRequest } from '../../utils/ajax';

import domainSettingActions from './actions';
import { END_POINT, actions } from './constants';

const updateDomainSettingEpic = (action$) =>
  action$.pipe(
    ofType(actions.DOMAIN_SETTINGS_UPDATE_DOMAIN_SETTING),
    mergeMap((action) =>
      makeAjaxRequest(
        END_POINT.update_domain_setting.method,
        END_POINT.update_domain_setting.url(action.payload.orgId),
        action.payload.domain
      ).pipe(
        mergeMap(() =>
          of(
            domainSettingActions.domainSettingsUpdateDomainSettingSuccess({
              isUpdateDomainSettingSuccess: true,
              isUpdateDomainSettingFailed: false,
            }),
            {
              type: 'AUTH_FETCH_USER',
            }
          )
        ),
        catchError(() =>
          of(
            domainSettingActions.domainSettingsUpdateDomainSettingFailed({
              isUpdateDomainSettingFailed: true,
              isUpdateDomainSettingSuccess: false,
            })
          )
        )
      )
    )
  );

const getTermsEpic = (action$) =>
  action$.pipe(
    ofType(actions.DOMAIN_SETTINGS_GET_TERMS),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.get_terms.method,
        END_POINT.get_terms.url(action.payload.orgId)
      ).pipe(
        mergeMap((data) => {
          const { terms } = data.response;
          return of(
            domainSettingActions.domainSettingsGetTermsSuccess({
              terms,
              isLoadingTerms: false,
            })
          );
        }),
        catchError((error) =>
          of(
            domainSettingActions.domainSettingsGetTermsFailed({
              errorCode: error.status,
              isLoadingTerms: false,
            })
          )
        )
      )
    )
  );

const getGradingPeriodsEpic = (action$) =>
  action$.pipe(
    ofType(actions.DOMAIN_SETTINGS_GET_GRADING_PERIODS),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.get_grading_periods.method,
        END_POINT.get_grading_periods.url(action.payload.orgId)
      ).pipe(
        mergeMap((data) => {
          const { gradingPeriods } = data.response;
          return of(
            domainSettingActions.domainSettingsGetGradingPeriodsSuccess({
              gradingPeriods,
              isLoadingGradingPeriods: false,
            })
          );
        }),
        catchError((error) =>
          of(
            domainSettingActions.domainSettingsGetGradingPeriodsFailed({
              errorCode: error.status,
              isLoadingGradingPeriods: false,
            })
          )
        )
      )
    )
  );

const updateTermEpic = (action$) =>
  action$.pipe(
    ofType(actions.DOMAIN_SETTINGS_UPDATE_TERM),
    mergeMap((action) =>
      makeAjaxRequest(
        END_POINT.update_term.method,
        END_POINT.update_term.url(action.payload.orgId),
        action.payload.termData
      ).pipe(
        mergeMap((data) => {
          const { terms } = data.response;
          return of(
            domainSettingActions.domainSettingsUpdateTermSuccess({
              terms,
              isUpdateTermSuccess: true,
              isUpdateTermFailed: false,
            })
          );
        }),
        catchError((error) =>
          of(
            domainSettingActions.domainSettingsUpdateTermFailed({
              error: error.response,
              isUpdateTermFailed: true,
              isUpdateTermSuccess: false,
            })
          )
        )
      )
    )
  );

const updateGradingPeriodEpic = (action$) =>
  action$.pipe(
    ofType(actions.DOMAIN_SETTINGS_UPDATE_GRADING_PERIOD),
    mergeMap((action) =>
      makeAjaxRequest(
        END_POINT.update_grading_period.method,
        END_POINT.update_grading_period.url(action.payload.orgId),
        action.payload.gradingPeriodData
      ).pipe(
        mergeMap((data) => {
          const { gradingPeriods } = data.response;
          return of(
            domainSettingActions.domainSettingsUpdateGradingPeriodSuccess({
              gradingPeriods,
              isUpdateGradingPeriodSuccess: true,
              isUpdateGradingPeriodFailed: false,
            })
          );
        }),
        catchError((error) =>
          of(
            domainSettingActions.domainSettingsUpdateGradingPeriodFailed({
              error: error.response,
              isUpdateGradingPeriodFailed: true,
              isUpdateGradingPeriodSuccess: false,
            })
          )
        )
      )
    )
  );

export default [
  updateDomainSettingEpic,
  getTermsEpic,
  getGradingPeriodsEpic,
  updateTermEpic,
  updateGradingPeriodEpic,
];
