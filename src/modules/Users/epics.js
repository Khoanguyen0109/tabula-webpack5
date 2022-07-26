import handleErrorsFromServer from 'utils/handleErrors';

import { ofType } from 'redux-observable';
import { of } from 'rxjs';
import { catchError, mergeMap, switchMap } from 'rxjs/operators';

import { makeAjaxRequest } from '../../utils/ajax';

import userActions from './actions';
import { END_POINT, actions } from './constants';

const inviteUserEpic = (action$, state$) =>
  action$.pipe(
    ofType(actions.INVITE_USER),
    mergeMap((action) =>
      makeAjaxRequest(
        END_POINT.invite_user.method,
        END_POINT.invite_user.url(action.payload.orgId),
        action.payload.user
      ).pipe(
        mergeMap((data) => {
          if (data.response.errors) {
            return of(
              userActions.inviteUserFailed({
                error: data.response.errors,
                invitingUser: false,
              })
            );
          }
          return of(
            userActions.inviteUserSuccess({ invitingUser: false }),
            userActions.fetchUsers({
              orgId: action.payload.orgId,
              params: state$.value.Users.params,
            })
          );
        }),
        catchError((error) =>
          of(
            userActions.inviteUserFailed({
              error: error.response.errors,
              invitingUser: false,
            })
          )
        )
      )
    )
  );

const fetchUsersEpic = (action$) =>
  action$.pipe(
    ofType(actions.FETCH_USERS),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.fetch_users.methods,
        END_POINT.fetch_users.url(action.payload.orgId, action.payload.params)
      ).pipe(
        mergeMap((data) => {
          if (data.response.errors) {
            return userActions.fetchUsersFailed({
              error: data.response.errors,
              fetchingUser: false,
            });
          }
          const users = data.response.users;
          return of(
            userActions.fetchUsersSuccess({
              users,
              totalUser: data.response.total,
              fetchingUser: false,
            })
          );
        }),
        catchError((error) => {
          const errorResponse = handleErrorsFromServer(error);
          return userActions.fetchUsersFailed({
            error: errorResponse?.errors,
            fetchingUser: false,
          });
        })
      )
    )
  );
const fetchUserRolesListEpic = (action$) =>
  action$.pipe(
    ofType(actions.FETCH_USER_ROLES),
    mergeMap(() =>
      makeAjaxRequest(
        END_POINT.get_user_roles_list.method,
        END_POINT.get_user_roles_list.url
      ).pipe(
        mergeMap((data) => {
          if (data.response.errors) {
            return of(userActions.fetchUserRolesFailed(data.response.errors));
          }
          return of(
            userActions.fetchUserRolesSuccess({ roles: data.response.role })
          );
        }),
        catchError(() => {
          // return of(userActions.getUserRolesListFailed(errorResponse), {});
        })
        // startWith({ type: 'SHOW_LOADING' })
      )
    )
  );
const editUserEpic = (action$, state$) =>
  action$.pipe(
    ofType(actions.EDIT_USER),
    mergeMap((action) =>
      makeAjaxRequest(
        END_POINT.edit_user.method,
        END_POINT.edit_user.url(action.payload.orgId, action.payload.user.id),
        action.payload.user
      ).pipe(
        mergeMap((data) => {
          if (data.response.errors) {
            return of(
              userActions.editUserFailed({
                error: data.response.errors,
                editingUser: false,
              })
            );
          }
          return of(
            userActions.editUserSuccess({ editingUser: false }),
            userActions.fetchUsers({
              orgId: action.payload.orgId,
              params: state$.value.Users.params,
            })
          );
        }),
        catchError((error) =>
          of(
            userActions.editUserFailed({
              error: error.response.errors,
              editingUser: false,
            })
          )
        )
      )
    )
  );
const deletePendingUserEpic = (action$, state$) =>
  action$.pipe(
    ofType(actions.DELETE_PENDING_USER),
    mergeMap((action) =>
      makeAjaxRequest(
        END_POINT.delete_pending_user.method,
        END_POINT.delete_pending_user.url(
          action.payload.orgId,
          action.payload.userId
        )
      ).pipe(
        mergeMap((data) => {
          if (data.response.errors) {
            return of(
              userActions.deletePendingUserFailed({
                error: data.response.errors,
                deletingPendingUser: false,
              })
            );
          }
          return of(
            userActions.deletePendingUserSuccess({
              deletingPendingUser: false,
            }),
            userActions.fetchUsers({
              orgId: action.payload.orgId,
              params: state$.value.Users.params,
            })
          );
        }),
        catchError((error) =>
          of(
            userActions.deletePendingUserFailed({
              error: error.response.errors,
              deletingPendingUser: false,
            })
          )
        )
      )
    )
  );

const updateDomainUserStatusEpic = (action$, state$) =>
  action$.pipe(
    ofType(actions.UPDATE_DOMAIN_USER_STATUS),
    mergeMap((action) =>
      makeAjaxRequest(
        END_POINT.update_domain_user_status.method,
        END_POINT.update_domain_user_status.url(
          action.payload.organizationId,
          action.payload.userId
        ),
        action.payload.requestParams
      ).pipe(
        mergeMap((data) => {
          if (data.response.errors) {
            return of(
              userActions.updateDomainUserStatusFailed({
                error: data.response.errors,
                editingUser: false,
              })
            );
          }
          return of(
            userActions.updateDomainUserStatusSuccess({ editingUser: false }),
            userActions.fetchUsers({
              orgId: action.payload.organizationId,
              params: state$.value.Users.params,
            })
          );
        }),
        catchError((error) =>
          of(
            userActions.updateDomainUserStatusFailed({
              error: error.response.errors,
              editingUser: false,
            })
          )
        )
      )
    )
  );
const forceResetPasswordEpic = (action$, state$) =>
  action$.pipe(
    ofType(actions.FORCE_RESET_PASSWORD),
    mergeMap((action) =>
      makeAjaxRequest(
        END_POINT.force_reset_password.method,
        END_POINT.force_reset_password.url(
          action.payload.orgId,
          action.payload.id
        )
      ).pipe(
        mergeMap((data) => {
          if (data.response.errors) {
            return of(
              userActions.forceResetPasswordFailed({
                error: data.response.errors,
                editingUser: false,
              })
            );
          }
          return of(
            userActions.forceResetPasswordSuccess({ editingUser: false }),
            userActions.fetchUsers({
              orgId: action.payload.orgId,
              params: state$.value.Users.params,
            })
          );
        }),
        catchError((error) =>
          of(
            userActions.updateDomainUserStatusFailed({
              error: error.response.errors,
              editingUser: false,
            })
          )
        )
      )
    )
  );

const resendInvitationEpic = (action$, state$) =>
  action$.pipe(
    ofType(actions.RESEND_INVITATION),
    mergeMap((action) =>
      makeAjaxRequest(
        END_POINT.resend_invitation.method,
        END_POINT.resend_invitation.url(action.payload.orgId, action.payload.id)
      ).pipe(
        mergeMap((data) => {
          if (data.response.errors) {
            return of(
              userActions.resendInvitationFailed({
                error: data.response.errors,
                editingUser: false,
              })
            );
          }
          return of(
            userActions.resendInvitationSuccess({ editingUser: false }),
            userActions.fetchUsers({
              orgId: action.payload.orgId,
              params: state$.value.Users.params,
            })
          );
        }),
        catchError((error) =>
          of(
            userActions.resendInvitationFailed({
              error: error.response.errors,
              editingUser: false,
            })
          )
        )
      )
    )
  );
const resendResetPasswordEpic = (action$, state$) =>
  action$.pipe(
    ofType(actions.RESEND_RESET_PASSWORD),
    mergeMap((action) =>
      makeAjaxRequest(
        END_POINT.resend_reset_password.method,
        END_POINT.resend_reset_password.url(
          action.payload.orgId,
          action.payload.id
        )
      ).pipe(
        mergeMap((data) => {
          if (data.response.errors) {
            return of(
              userActions.resendResetPasswordFailed({
                error: data.response.errors,
                editingUser: false,
              })
            );
          }
          return of(
            userActions.resendResetPasswordSuccess({ editingUser: false }),
            userActions.fetchUsers({
              orgId: action.payload.orgId,
              params: state$.value.Users.params,
            })
          );
        }),
        catchError((error) =>
          of(
            userActions.resendResetPasswordFailed({
              error: error.response.errors,
              editingUser: false,
            })
          )
        )
      )
    )
  );
export default [
  fetchUsersEpic,
  fetchUserRolesListEpic,
  inviteUserEpic,
  editUserEpic,
  deletePendingUserEpic,
  updateDomainUserStatusEpic,
  forceResetPasswordEpic,
  resendInvitationEpic,
  resendResetPasswordEpic,
];
