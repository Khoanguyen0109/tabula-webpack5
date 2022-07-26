import { objectToParams } from 'utils';
export const actions = {
  USER_SET_STATE: 'USER_SET_STATE',
  INVITE_USER: 'INVITE_USER',
  INVITE_USER_SUCCESS: 'INVITE_USER_SUCCESS',
  INVITE_USER_FAILED: 'INVITE_USER_FAILED',
  SET_UP_ACCOUNT: 'SET_UP_ACCOUNT',
  SET_UP_ACCOUNT_SUCCESS: 'SET_UP_ACCOUNT_SUCCESS',
  SET_UP_ACCOUNT_FAILED: 'SET_UP_ACCOUNT_FAILED',
  FETCH_USERS: 'FETCH_USERS',
  FETCH_USERS_SUCCESS: 'FETCH_USERS_SUCCESS',
  FETCH_USERS_FAILED: 'FETCH_USERS_FAILED',
  FETCH_USER_ROLES: 'FETCH_USER_ROLES',
  FETCH_USER_ROLES_SUCCESS: 'FETCH_USER_ROLES_SUCCESS',
  FETCH_USER_ROLES_FAILED: 'FETCH_USER_ROLES_FAILED',
  EDIT_USER: 'EDIT_USER',
  EDIT_USER_SUCCESS: 'EDIT_USER_SUCCESS',
  EDIT_USER_FAILED: 'EDIT_USER_FAILED',

  DELETE_PENDING_USER: 'DELETE_PENDING_USER',
  DELETE_PENDING_USER_SUCCESS: 'DELETE_PENDING_USER_SUCCESS',
  DELETE_PENDING_USER_FAILED: 'DELETE_PENDING_USER_FAILED',

  RESEND_INVITATION: 'RESEND_INVITATION',
  RESEND_INVITATION_SUCCESS: 'RESEND_INVITATION_SUCCESS',
  RESEND_INVITATION_FAILED: 'RESEND_INVITATION_FAILED',
  UPDATE_DOMAIN_USER_STATUS: 'UPDATE_DOMAIN_USER_STATUS',
  UPDATE_DOMAIN_USER_STATUS_SUCCESS: 'UPDATE_DOMAIN_USER_STATUS_SUCCESS',
  UPDATE_DOMAIN_USER_STATUS_FAILED: 'UPDATE_DOMAIN_USER_STATUS_FAILED',
  FORCE_RESET_PASSWORD: 'FORCE_RESET_PASSWORD',
  FORCE_RESET_PASSWORD_SUCCESS: 'FORCE_RESET_PASSWORD_SUCCESS',
  FORCE_RESET_PASSWORD_FAILED: 'FORCE_RESET_PASSWORD_FAILED',
  RESEND_RESET_PASSWORD: 'RESEND_RESET_PASSWORD',
  RESEND_RESET_PASSWORD_SUCCESS: 'RESEND_RESET_PASSWORD_SUCCESS',
  RESEND_RESET_PASSWORD_FAILED: 'RESEND_RESET_PASSWORD_FAILED',
  RESEND_CONFIRM_EMAIL: 'RESEND_CONFIRM_EMAIL',
  RESEND_CONFIRM_EMAIL_SUCCESS: 'RESEND_CONFIRM_EMAIL_SUCCESS',
  RESEND_CONFIRM_EMAIL_FAILED: 'RESEND_CONFIRM_EMAIL_FAILED',
};

export const END_POINT = {
  get_user_detail: {
    url: (orgId, userId) =>
      `${process.env.REACT_APP_API_URL}/organization/${orgId}/users/${userId}`,
    method: 'GET'
  },
  invite_user: {
    url: (id) => `${process.env.REACT_APP_API_URL}/organization/${id}/users`,
    method: 'POST'
  },
  fetch_users: {
    url: (id, urlParams) =>
      `${process.env.REACT_APP_API_URL}/organizations/${id}/users?${objectToParams(urlParams)}`,
    method: 'GET'
  },
  edit_user: {
    url: (orgId, userId) =>
      `${process.env.REACT_APP_API_URL}/organization/${orgId}/users/${userId}`,
    method: 'PUT'
  },
  get_user_roles_list: {
    url: `${process.env.REACT_APP_API_URL}/roles`,
    method: 'GET'
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
  delete_pending_user: {
    url: (orgId, userId) =>
      `${process.env.REACT_APP_API_URL}/organization/${orgId}/users/${userId}`,
    method: 'DELETE'
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
  }
};
