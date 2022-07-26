import authActions from 'shared/Auth/actions';

import { ofType } from 'redux-observable';
import { of } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';

import { makeAjaxRequest } from '../../utils/ajax';

import myProfileActions from './actions';
import { END_POINT, actions } from './constants';
import { checkPhoneNumber } from './utils';

const updateProfileEpic = (action$) =>
  action$.pipe(
    ofType(actions.UPDATE_MY_PROFILE),
    mergeMap((action) => {
      const { phone } = action.payload;
      if (phone && phone !== '') {
        action.payload.phone = checkPhoneNumber(phone);
      }
      return makeAjaxRequest(
        END_POINT.update_my_profile.method,
        END_POINT.update_my_profile.url,
        action.payload
      ).pipe(
        mergeMap((data) => {
          if (data.response.errors) {
            return of(
              myProfileActions.updateMyProfileFailed({ isBusy: false })
            );
          }
          return of(
            myProfileActions.updateMyProfileSuccess({
              error: undefined,
              isBusy: false,
              isChangeProfileSuccess: true,
            }),
            authActions.authFetchUser()
          );
        }),
        catchError((error) =>
          of(
            { type: 'GLOBAL_ERROR', payload: { error } },
            myProfileActions.updateMyProfileFailed({
              error: error?.response?.errors,
              isBusy: false,
            })
          )
        )
      );
    })
  );

const changePasswordEpic = (action$) =>
  action$.pipe(
    ofType(actions.CHANGE_PASSWORD),
    mergeMap((action) =>
      makeAjaxRequest(
        END_POINT.change_password.method,
        END_POINT.change_password.url,
        action.payload
      ).pipe(
        mergeMap((data) => {
          if (data.response.errors) {
            return of(myProfileActions.changePasswordFailed({ isBusy: false }));
          }
          return of(
            myProfileActions.changePasswordSuccess({
              error: undefined,
              isBusy: false,
              isChangePassWordSuccess: true,
            })
          );
        }),
        catchError((error) =>
          of(
            { type: 'GLOBAL_ERROR', payload: { error } },
            myProfileActions.changePasswordFailed({
              error: error?.response?.errors,
              isBusy: false,
            })
          )
        )
      )
    )
  );

const updateBedtimePreferenceEpic = (action$) =>
  action$.pipe(
    ofType(actions.UPDATE_BEDTIME_PREFERENCE),
    mergeMap((action) =>
      makeAjaxRequest(
        END_POINT.update_my_profile.method,
        END_POINT.update_my_profile.url,
        action.payload
      ).pipe(
        mergeMap(() =>
          of(
            myProfileActions.updateBedtimePreferenceSuccess({
              error: undefined,
              isBusy: false,
              isChangeBedtimePreferenceSuccess: true,
            }),
            authActions.authFetchUser()
          )
        ),
        catchError((error) =>
          of(
            { type: 'GLOBAL_ERROR', payload: { error } },
            myProfileActions.updateBedtimePreferenceFailed({
              error: error?.response?.errors,
              isBusy: false,
            })
          )
        )
      )
    )
  );

export default [
  updateProfileEpic,
  changePasswordEpic,
  updateBedtimePreferenceEpic,
];
