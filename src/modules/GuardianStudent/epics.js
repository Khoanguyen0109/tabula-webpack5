import { ofType } from 'redux-observable';
import { of } from 'rxjs';
import { catchError, mergeMap, switchMap } from 'rxjs/operators';

import { makeAjaxRequest } from '../../utils/ajax';

import userActions from './actions';
import { END_POINT, actions } from './constants';

const fetchStudentsEpic = (action$) =>
  action$.pipe(
    ofType(actions.GET_STUDENT_LIST),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.get_student_list.methods,
        END_POINT.get_student_list.url(
          action.payload.orgId,
          action.payload.params
        )
      ).pipe(
        mergeMap((data) => {
          if (data.response.errors) {
            return userActions.getStudentListFailed({
              error: data.response.errors,
              fetchingUser: false,
            });
          }
          const users = data.response.users;
          return of(
            userActions.getStudentListSuccess({
              users,
              totalUser: data.response.total,
              fetchingUser: false,
            })
          );
        }),
        catchError(() => {})
      )
    )
  );

const fetchGuardiansEpic = (action$) =>
  action$.pipe(
    ofType(actions.GET_GUARDIAN_LIST),
    mergeMap((action) =>
      makeAjaxRequest(
        END_POINT.get_guardian_list.methods,
        END_POINT.get_guardian_list.url(
          action.payload.orgId,
          action.payload.params
        )
      ).pipe(
        mergeMap((data) => {
          const users = data?.response?.users;
          return of(
            userActions.getGuardianListSuccess({
              users,
              totalUser: data?.response?.total,
              fetchingUser: false,
            })
          );
        }),
        catchError((error) =>
          of(
            userActions.getGuardianListFailed({
              error: error?.response?.errors,
              fetchingUser: false,
            })
          )
        )
      )
    )
  );

const getGuardiansForCreatingStudentEpic = (action$) =>
  action$.pipe(
    ofType(actions.GET_GUARDIAN_LIST_FOR_CREATING_STUDENT),
    mergeMap((action) =>
      makeAjaxRequest(
        END_POINT.get_guardian_list.methods,
        END_POINT.get_guardian_list.url(
          action.payload.orgId,
          action.payload.params
        )
      ).pipe(
        mergeMap((data) => {
          const guardians = data?.response?.users;
          return of(
            userActions.getGuardianListForCreatingStudentSuccess({ guardians })
          );
        }),
        catchError((error) =>
          of(
            userActions.getGuardianListForCreatingStudentFailed({
              error: error?.response?.errors,
            })
          )
        )
      )
    )
  );

const inviteStudentEpic = (action$) =>
  action$.pipe(
    ofType(actions.INVITE_STUDENT),
    mergeMap((action) =>
      makeAjaxRequest(
        END_POINT.invite_student.method,
        END_POINT.invite_student.url(action.payload.orgId),
        action.payload.user
      ).pipe(
        mergeMap(() =>
          of(
            userActions.inviteStudentSuccess({
              isInviteUserSuccess: true,
              isInvitingUser: false,
            })
          )
        ),
        catchError((error) =>
          of(
            userActions.inviteStudentFailed({
              error: error?.response?.errors,
              isInvitingUser: false,
            })
          )
        )
      )
    )
  );

const inviteGuardianEpic = (action$) =>
  action$.pipe(
    ofType(actions.INVITE_GUARDIAN),
    mergeMap((action) =>
      makeAjaxRequest(
        END_POINT.invite_guardian.method,
        END_POINT.invite_guardian.url(action.payload.orgId),
        action.payload.user
      ).pipe(
        mergeMap(() =>
          of(
            userActions.inviteGuardianSuccess({
              isInviteUserSuccess: true,
              isInvitingUser: false,
            })
          )
        ),
        catchError((error) =>
          of(
            userActions.inviteGuardianFailed({
              error: error?.response?.errors,
              isInvitingUser: false,
            })
          )
        )
      )
    )
  );

const editStudentEpic = (action$) =>
  action$.pipe(
    ofType(actions.EDIT_STUDENT),
    mergeMap((action) =>
      makeAjaxRequest(
        END_POINT.edit_student.method,
        END_POINT.edit_student.url(
          action.payload.orgId,
          action.payload.studentId
        ),
        action.payload.user
      ).pipe(
        mergeMap(() =>
          of(
            userActions.editStudentSuccess({
              isEditUserSuccess: true,
              isEditingUser: false,
            })
          )
        ),
        catchError((error) =>
          of(
            userActions.editStudentFailed({
              error: error?.response?.errors,
              isEditingUser: false,
            })
          )
        )
      )
    )
  );

const editGuardianEpic = (action$) =>
  action$.pipe(
    ofType(actions.EDIT_GUARDIAN),
    mergeMap((action) =>
      makeAjaxRequest(
        END_POINT.edit_guardian.method,
        END_POINT.edit_guardian.url(
          action.payload.orgId,
          action.payload.guardianId
        ),
        action.payload.user
      ).pipe(
        mergeMap(() =>
          of(
            userActions.editGuardianSuccess({
              isEditUserSuccess: true,
              isEditingUser: false,
            })
          )
        ),
        catchError((error) =>
          of(
            userActions.editGuardianFailed({
              error: error?.response?.errors,
              isEditingUser: false,
            })
          )
        )
      )
    )
  );

const updateDomainUserStatusEpic = (action$) =>
  action$.pipe(
    ofType(actions.SG_UPDATE_DOMAIN_USER_STATUS),
    mergeMap((action) =>
      makeAjaxRequest(
        END_POINT.update_domain_user_status.method,
        END_POINT.update_domain_user_status.url(
          action.payload.organizationId,
          action.payload.userId
        ),
        action.payload.requestParams
      ).pipe(
        mergeMap(() =>
          of(
            userActions.sgUpdateDomainUserStatusSuccess({
              isEditUserSuccess: true,
              isEditingUser: false,
            })
          )
        ),
        catchError((error) =>
          of(
            userActions.sgUpdateDomainUserStatusFailed({
              error: error?.response?.errors,
              isEditingUser: false,
            })
          )
        )
      )
    )
  );

const forceResetPasswordEpic = (action$) =>
  action$.pipe(
    ofType(actions.SG_FORCE_RESET_PASSWORD),
    mergeMap((action) =>
      makeAjaxRequest(
        END_POINT.force_reset_password.method,
        END_POINT.force_reset_password.url(
          action.payload.orgId,
          action.payload.id
        )
      ).pipe(
        mergeMap(() =>
          of(
            userActions.sgForceResetPasswordSuccess({
              isEditUserSuccess: true,
              isEditingUser: false,
            })
          )
        ),
        catchError((error) =>
          of(
            userActions.sgForceResetPasswordFailed({
              error: error?.response?.errors,
              isEditingUser: false,
            })
          )
        )
      )
    )
  );

const resendInvitationEpic = (action$) =>
  action$.pipe(
    ofType(actions.SG_RESEND_INVITATION),
    mergeMap((action) =>
      makeAjaxRequest(
        END_POINT.resend_invitation.method,
        END_POINT.resend_invitation.url(action.payload.orgId, action.payload.id)
      ).pipe(
        mergeMap(() =>
          of(
            userActions.sgResendInvitationSuccess({
              isEditUserSuccess: true,
              isEditingUser: false,
            })
          )
        ),
        catchError((error) =>
          of(
            userActions.sgResendInvitationFailed({
              error: error?.response?.errors,
              isEditingUser: false,
            })
          )
        )
      )
    )
  );

const resendResetPasswordEpic = (action$) =>
  action$.pipe(
    ofType(actions.SG_RESEND_RESET_PASSWORD),
    mergeMap((action) =>
      makeAjaxRequest(
        END_POINT.resend_reset_password.method,
        END_POINT.resend_reset_password.url(
          action.payload.orgId,
          action.payload.id
        )
      ).pipe(
        mergeMap(() =>
          of(
            userActions.sgResendResetPasswordSuccess({
              isEditUserSuccess: true,
              isEditingUser: false,
            })
          )
        ),
        catchError((error) =>
          of(
            userActions.sgResendResetPasswordFailed({
              error: error?.response?.errors,
              editingUser: false,
            })
          )
        )
      )
    )
  );
const deletePendingGsUserEpic = (action$) =>
  action$.pipe(
    ofType(actions.DELETE_PENDING_GS_USER),
    mergeMap((action) =>
      makeAjaxRequest(
        END_POINT.delete_pending_gs_user.method,
        END_POINT.delete_pending_gs_user.url(
          action.payload.orgId,
          action.payload.userId
        )
      ).pipe(
        mergeMap((data) => {
          if (data.response.errors) {
            return of(
              userActions.deletePendingGsUserFailed({
                error: data?.response?.errors,
                deletingPendingGsUser: false,
              })
            );
          }
          return of(
            userActions.deletePendingGsUserSuccess({
              deletingPendingGsUser: false,
            })
          );
        }),
        catchError((error) =>
          of(
            userActions.deletePendingGsUserFailed({
              error: error?.response?.errors,
              deletingPendingGsUser: false,
            })
          )
        )
      )
    )
  );
export default [
  fetchStudentsEpic,
  fetchGuardiansEpic,
  inviteStudentEpic,
  inviteGuardianEpic,
  getGuardiansForCreatingStudentEpic,
  editStudentEpic,
  editGuardianEpic,
  updateDomainUserStatusEpic,
  resendInvitationEpic,
  resendResetPasswordEpic,
  forceResetPasswordEpic,
  deletePendingGsUserEpic,
];
