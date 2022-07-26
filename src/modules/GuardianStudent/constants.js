import { objectToParams } from 'utils';
export const actions = {
  GS_SET_STATE: 'GS_SET_STATE',
  GET_STUDENT_LIST: 'GET_STUDENT_LIST',
  GET_STUDENT_LIST_SUCCESS: 'GET_STUDENT_LIST_SUCCESS',
  GET_STUDENT_LIST_FAILED: 'GET_STUDENT_LIST_FAILED',
  GET_STUDENT_DETAIL: 'GET_STUDENT_DETAIL',
  GET_STUDENT_DETAIL_SUCCESS: 'GET_STUDENT_DETAIL_SUCCESS',
  GET_STUDENT_DETAIL_FAILED: 'GET_STUDENT_DETAIL_FAILED',
  GET_GUARDIAN_LIST: 'GET_GUARDIAN_LIST',
  GET_GUARDIAN_LIST_SUCCESS: 'GET_GUARDIAN_LIST_SUCCESS',
  GET_GUARDIAN_LIST_FAILED: 'GET_GUARDIAN_LIST_FAILED',
  EDIT_STUDENT: 'EDIT_STUDENT',
  EDIT_STUDENT_SUCCESS: 'EDIT_STUDENT_SUCCESS',
  EDIT_STUDENT_FAILED: 'EDIT_STUDENT_FAILED',
  INVITE_STUDENT: 'INVITE_STUDENT',
  INVITE_STUDENT_SUCCESS: 'INVITE_STUDENT_SUCCESS',
  INVITE_STUDENT_FAILED: 'INVITE_STUDENT_FAILED',
  INVITE_GUARDIAN: 'INVITE_GUARDIAN',
  INVITE_GUARDIAN_SUCCESS: 'INVITE_GUARDIAN_SUCCESS',
  INVITE_GUARDIAN_FAILED: 'INVITE_GUARDIAN_FAILED',
  EDIT_GUARDIAN: 'EDIT_GUARDIAN',
  EDIT_GUARDIAN_SUCCESS: 'EDIT_GUARDIAN_SUCCESS',
  EDIT_GUARDIAN_FAILED: 'EDIT_GUARDIAN_FAILED',

  DELETE_PENDING_GS_USER: 'DELETE_PENDING_GS_USER',
  DELETE_PENDING_GS_USER_SUCCESS: 'DELETE_PENDING_GS_USER_SUCCESS',
  DELETE_PENDING_GS_USER_FAILED: 'DELETE_PENDING_GS_USER_FAILED',

  GET_GUARDIAN_LIST_FOR_CREATING_STUDENT: 'GET_GUARDIAN_LIST_FOR_CREATING_STUDENT',
  GET_GUARDIAN_LIST_FOR_CREATING_STUDENT_SUCCESS: 'GET_GUARDIAN_LIST_FOR_CREATING_STUDENT_SUCCESS',
  GET_GUARDIAN_LIST_FOR_CREATING_STUDENT_SUCCESS_FAILED: 'GET_GUARDIAN_LIST_FOR_CREATING_STUDENT_SUCCESS_FAILED',
  SG_RESEND_INVITATION: 'SG_RESEND_INVITATION',
  SG_RESEND_INVITATION_SUCCESS: 'SG_RESEND_INVITATION_SUCCESS',
  SG_RESEND_INVITATION_FAILED: 'SG_RESEND_INVITATION_FAILED',
  SG_UPDATE_DOMAIN_USER_STATUS: 'SG_UPDATE_DOMAIN_USER_STATUS',
  SG_UPDATE_DOMAIN_USER_STATUS_SUCCESS: 'SG_UPDATE_DOMAIN_USER_STATUS_SUCCESS',
  SG_UPDATE_DOMAIN_USER_STATUS_FAILED: 'SG_UPDATE_DOMAIN_USER_STATUS_FAILED',
  SG_FORCE_RESET_PASSWORD: 'SG_FORCE_RESET_PASSWORD',
  SG_FORCE_RESET_PASSWORD_SUCCESS: 'SG_FORCE_RESET_PASSWORD_SUCCESS',
  SG_FORCE_RESET_PASSWORD_FAILED: 'SG_FORCE_RESET_PASSWORD_FAILED',
  SG_RESEND_RESET_PASSWORD: 'SG_RESEND_RESET_PASSWORD',
  SG_RESEND_RESET_PASSWORD_SUCCESS: 'SG_RESEND_RESET_PASSWORD_SUCCESS',
  RESET_INVITE_STUDENT_SUCCESS: 'RESET_INVITE_STUDENT_SUCCESS',
};
export const END_POINT = {
  get_student_list: {
    url: (id, urlParams) => `${process.env.REACT_APP_API_URL}/organization/${id}/students?${objectToParams(urlParams)}`,
    method: 'GET'
  },

  get_student_detail: {
    url: (orgId, studentId) =>
      `${process.env.REACT_APP_API_URL}/organization/${orgId}/students/${studentId}`,
    method: 'GET'
  },

  get_guardian_list: {
    url: (id, urlParams) =>
      `${process.env.REACT_APP_API_URL}/organization/${id}/guardians?${objectToParams(urlParams)}`,
    method: 'GET'
  },
  invite_student: {
    url: (id) => `${process.env.REACT_APP_API_URL}/organization/${id}/students`,
    method: 'POST'
  },

  edit_student: {
    url: (orgId, studentId) =>
      `${process.env.REACT_APP_API_URL}/organization/${orgId}/students/${studentId}`,
    method: 'PUT'
  },
  invite_guardian: {
    url: (id) => `${process.env.REACT_APP_API_URL}/organization/${id}/guardians`,
    method: 'POST'
  },
  edit_guardian: {
    url: (orgId, guardianId) => `${process.env.REACT_APP_API_URL}/organization/${orgId}/guardians/${guardianId}`,
    method: 'PUT'
  },
  force_reset_password: {
    url: (orgId, userId) =>
      `${process.env.REACT_APP_API_URL}/organizations/${orgId}/user/${userId}/reset-password`,
    method: 'POST'
  },
  resend_invitation: {
    url: (orgId, userId) =>
      `${process.env.REACT_APP_API_URL
      }/organization/${orgId}/users/${userId}/resend-invitation`,
    method: 'POST'
  },
  resend_reset_password: {
    url: (orgId, userId) =>
      `${process.env.REACT_APP_API_URL
      }/organizations/${orgId}/user/${userId}/resend-reset-password`,
    method: 'POST'
  },
  update_domain_user_status: {
    url: (id, userId) =>
      `${process.env.REACT_APP_API_URL}/organization/${id}/status/${userId}`,
    method: 'PUT'
  },
  delete_pending_gs_user: {
    url: (orgId, userId) =>
      `${process.env.REACT_APP_API_URL}/organization/${orgId}/users/${userId}`,
    method: 'DELETE'
  },
};
