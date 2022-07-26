import { LOCAL_STORAGE } from 'utils/constants';

import { ofType } from 'redux-observable';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { removeSchoolYear } from 'utils';

import { makeAjaxRequest } from '../../utils/ajax';

import authActions from './actions';
import { END_POINT, actions } from './constants';

const checkDomainEpic = (action$) =>
  action$.pipe(
    ofType(actions.AUTH_CHECK_DOMAIN_STATUS),
    mergeMap((action) => makeAjaxRequest(
        END_POINT.check_domain_status.method,
        END_POINT.check_domain_status.url(action.payload.subdomain)
      ).pipe(
        mergeMap((data) => {
          if (data.response.errors) {
            return of(
              authActions.authCheckDomainFailed({
                isBusy: false,
                error: data.response.errors,
              })
            );
          }
          return of(
            authActions.authCheckDomainSuccess({
              subDomainStatus: data.response.status,
              isBusy: false,
              error: undefined,
            })
          );
        }),
        catchError((error) => of(
            authActions.authCheckDomainFailed({
              error: error.response.errors,
              isBusy: false,
            })
          ))
      ))
  );

const loginEpic = (action$) =>
  action$.pipe(
    ofType(actions.AUTH_LOGIN),
    mergeMap((action) =>
      makeAjaxRequest(
        END_POINT.login.method,
        END_POINT.login.url,
        action.payload
      ).pipe(
        mergeMap((data) => {
          if (data.response.errors) {
            return of(
              authActions.authLoginFailed({
                isBusy: false,
                isNewSession: false,
              })
            );
          }
          localStorage.setItem(LOCAL_STORAGE.ACCESS_TOKEN, data.response.token);
          return of(
            authActions.authLoginSuccess({
              error: undefined,
              isNewSession: true,
              token: localStorage.getItem(LOCAL_STORAGE.DEVICE_TOKEN),
            }),
            authActions.authFetchUser()
          );
        }),
        catchError((error) => of(
            authActions.authLoginFailed({
              error: {
                message: error.response.errors.message,
                subcode: error.response.errors.subcode,
              },
              isBusy: false,
              isNewSession: false,
            })
          ))
      )
    )
  );

const getCurrentUserEpic = (action$) =>
  action$.pipe(
    ofType(actions.AUTH_FETCH_USER),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.get_current_user.method,
        END_POINT.get_current_user.url,
        false,
        false,
        false,
        action.payload?.token
      ).pipe(
        mergeMap((data) => {
          if (data.response.errors) {
            return authActions.authFetchUserFailed({
              error: data.response.errors,
              fetchingUser: false,
              isBusy: false,
            });
          }
          const currentUser = data.response.user;
          const timezone = data.response.timezone;
          return of(
            authActions.authFetchUserSuccess({
              currentUser,
              timezone,
              fetchingUser: false,
              isBusy: false,
            })
          );
        }),
        catchError((error) => of(
            authActions.authFetchUserFailed({
              error: error.response.errors,
              currentUser: {},
              errorCode: error.status,
              fetchingUser: false,
              isBusy: false,
            })
          ))
      )
    )
  );

const logoutEpic = (action$) =>
  action$.pipe(
    ofType(actions.AUTH_LOGOUT),
    mergeMap(() =>
      makeAjaxRequest(END_POINT.logout.method, END_POINT.logout.url).pipe(
        // Nothing implement now
        mergeMap(() => {
          removeSchoolYear();
          return of(authActions.authLogoutSuccess({ isBusy: false }));
        }),
        catchError(() => 
          // Ignore error from the server. Just deleted token in localstorage
           of(authActions.authLogoutSuccess({ isBusy: false }))
        )
      )
    )
  );

const forgotPasswordEpic = (action$) => action$.pipe(
    ofType(actions.AUTH_FORGOT_PASSWORD),
    mergeMap((action) => makeAjaxRequest(
        END_POINT.forgot_password.method,
        END_POINT.forgot_password.url,
        action.payload
      ).pipe(
        mergeMap(() => of(
            authActions.authForgotPasswordSuccess({
              isForgotPasswordSuccessfully: true,
              isBusy: false,
            })
          )),
        catchError((error) => of(
            authActions.authForgotPasswordFailed({
              error: error.response.errors,
              isBusy: false,
            })
          ))
      ))
  );

const resetPasswordEpic = (action$) => action$.pipe(
    ofType(actions.AUTH_RESET_PASSWORD),
    mergeMap((action) => makeAjaxRequest(
        END_POINT.reset_password.method,
        END_POINT.reset_password.url(action.payload.token),
        { password: action.payload.password }
      ).pipe(
        mergeMap(() => of(
            authActions.authResetPasswordSuccess({
              isResetPasswordSuccessfully: true,
              isBusy: false,
            })
          )),
        catchError((error) => of(
            authActions.authResetPasswordFailed({
              error: error.response.errors,
            })
          ))
      ))
  );

const checkTokenEpic = (action$) => action$.pipe(
    ofType(actions.AUTH_CHECK_TOKEN),
    mergeMap((action) => makeAjaxRequest(
        END_POINT.check_token.method,
        END_POINT.check_token.url(action.payload.token, action.payload.type)
      ).pipe(
        mergeMap(() => of(
            authActions.authCheckTokenSuccess({
              isValidToken: true,
              checkingToken: false,
            })
          )),
        catchError(() => of(
            authActions.authCheckTokenFailed({
              isValidToken: false,
              checkingToken: false,
            })
          ))
      ))
  );
const getSchoolGradeLevelEpic = (action$) =>
  action$.pipe(
    ofType(actions.GET_SCHOOL_GRADE_LEVEL),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.get_school_grade_level.method,
        END_POINT.get_school_grade_level.url(action.payload.organizationId)
      ).pipe(
        mergeMap((data) => of(
          authActions.getSchoolGradeLevelSuccess({
            schoolGradeLevel: data.response.data,
          })
        )),
        catchError((error) => of(
          { type: 'GLOBAL_ERROR', payload: { error } },
          authActions.getSchoolGradeLevelFailed({})
        ))
      )
    )
  );

const getOrganizationInfoEpic = (action$) =>
  action$.pipe(
    ofType(actions.GET_ORGANIZATION_INFO),
    mergeMap((action) =>
      makeAjaxRequest(
        END_POINT.get_organization_info.method,
        END_POINT.get_organization_info.url(action.payload.token)
      ).pipe(
        mergeMap((data) => {
          if (data.response.errors) {
            return of(
              authActions.getOrganizationInfoFailed({
                error: data.response.errors,
                isBusy: false,
              })
            );
          } 
            return of(
              authActions.getOrganizationInfoSuccess({
                ...data.response,
                isBusy: false,
              })
            );
          
        }),
        catchError((error) => of(
            authActions.getOrganizationInfoFailed({
              error: error.response,
              isBusy: false,
            })
          ))
      )
    )
  );

const setupDomainEpic = (action$) =>
  action$.pipe(
    ofType(actions.SETUP_DOMAIN),
    mergeMap((action) =>
      makeAjaxRequest(
        END_POINT.setup_domain.method,
        END_POINT.setup_domain.url,
        { ...action.payload }
      ).pipe(
        map((data) => {
          if (data.response.errors) {
            return authActions.setupDomainFailed({
              error: data.response.errors,
              installing: false,
              isBusy: false,
            });
          } 
            return authActions.setupDomainSuccess({ installing: false });
          
        }),
        catchError((error) => of(
            authActions.setupDomainFailed({
              error: error.response.errors,
              installing: false,
              isBusy: false,
            })
          ))
      )
    )
  );

const acceptInvitationEpic = ($action) =>
  $action.pipe(
    ofType(actions.ACCEPT_INVITATION_DOMAIN),
    mergeMap((action) =>
      makeAjaxRequest(
        END_POINT.accept_inivation_domain.method,
        END_POINT.accept_inivation_domain.url,
        action.payload
      ).pipe(
        mergeMap((data) => {
          if (data.response.errors) {
            return of(
              authActions.acceptInvitationDomainFailed({
                error: data.response.errors,
                accepting: false,
              })
            );
          } 
            return of(
              authActions.acceptInvitationDomainSuccess({ accepting: false })
            );
          
        }),
        catchError((error) => 
           of(
            authActions.acceptInvitationDomainFailed({
              error: error,
              accepting: false,
            })
          )
          // return of(
          //   sessionActions.acceptInvitationDomainFailed(errorResponse),
          //   { type: 'HIDE_LOADING' }
          // );
        )
      )
    )
  );

const confirmEmailEpic = (action$) => action$.pipe(
    ofType(actions.AUTH_CONFIRM_EMAIL),
    mergeMap((action) => makeAjaxRequest(
        END_POINT.confirm_email.method,
        END_POINT.confirm_email.url(action.payload.token)
      ).pipe(
        mergeMap(() => of(
            authActions.authConfirmEmailSuccess({
              isConfirmEmailSuccess: true,
              isLoadingConfirmEmail: false,
            })
          )),
        catchError((error) => of(
            authActions.authConfirmEmailFailed({
              confirmEmailFailed: error?.response?.errors,
              isLoadingConfirmEmail: false,
            })
          ))
      ))
  );

const getCurrentUserSchoolYearsEpic = (action$) => action$.pipe(
    ofType(actions.GET_CURRENT_USER_SCHOOL_YEARS),
    mergeMap(({ payload }) => makeAjaxRequest(
        END_POINT.get_current_user_school_years.method,
        END_POINT.get_current_user_school_years.url(
          payload?.orgId,
          payload?.userId,
          payload?.params
        )
      ).pipe(
        mergeMap((data) => of(authActions.getCurrentUserSchoolYearsSuccess({
            schoolYears: data.response?.schoolYear,

          }))),
        catchError(() => of(authActions.getCurrentUserSchoolYearsFailed({})))
      ))
  );

export default [
  checkDomainEpic,
  loginEpic,
  getCurrentUserEpic,
  logoutEpic,
  forgotPasswordEpic,
  resetPasswordEpic,
  checkTokenEpic,
  getOrganizationInfoEpic,
  acceptInvitationEpic,
  setupDomainEpic,
  confirmEmailEpic,
  getCurrentUserSchoolYearsEpic,
  getSchoolGradeLevelEpic
];
