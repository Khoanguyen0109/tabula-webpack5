import { objectToParams } from 'utils';

export const actions = {
    AUTH_RESET: 'AUTH_RESET',
    AUTH_SET_STATE: 'AUTH_SET_STATE',
    AUTH_LOGIN: 'AUTH_LOGIN',
    AUTH_LOGIN_SUCCESS: 'AUTH_LOGIN_SUCCESS',
    AUTH_LOGIN_FAILED: 'AUTH_LOGIN_FAILED',
    AUTH_CHECK_DOMAIN_STATUS: 'AUTH_CHECK_DOMAIN_STATUS',
    AUTH_CHECK_DOMAIN_SUCCESS: 'AUTH_CHECK_DOMAIN_SUCCESS',
    AUTH_CHECK_DOMAIN_FAILED: 'AUTH_CHECK_DOMAIN_FAILED',
    AUTH_FETCH_USER: 'AUTH_FETCH_USER',
    AUTH_FETCH_USER_SUCCESS: 'AUTH_FETCH_USER_SUCCESS',
    AUTH_FETCH_USER_FAILED: 'AUTH_FETCH_USER_FAILED',
    AUTH_LOGOUT: 'AUTH_LOGOUT',
    AUTH_LOGOUT_SUCCESS: 'AUTH_LOGOUT_SUCCESS',
    AUTH_LOGOUT_FAILED: 'AUTH_LOGOUT_FAILED',   
    AUTH_FORGOT_PASSWORD: 'AUTH_FORGOT_PASSWORD',
    AUTH_FORGOT_PASSWORD_SUCCESS: 'AUTH_FORGOT_PASSWORD_SUCCESS',
    AUTH_FORGOT_PASSWORD_FAILED: 'AUTH_FORGOT_PASSWORD_FAILED',
    AUTH_RESET_PASSWORD: 'AUTH_RESET_PASSWORD',
    AUTH_RESET_PASSWORD_SUCCESS: 'AUTH_RESET_PASSWORD_SUCCESS',
    AUTH_RESET_PASSWORD_FAILED: 'AUTH_RESET_PASSWORD_FAILED',
    AUTH_CHECK_TOKEN: 'AUTH_CHECK_TOKEN',
    AUTH_CHECK_TOKEN_SUCCESS: 'AUTH_CHECK_TOKEN_SUCCESS',
    AUTH_CHECK_TOKEN_FAILED: 'AUTH_CHECK_TOKEN_FAILED',
    SETUP_DOMAIN: 'SETUP_DOMAIN',
    SETUP_DOMAIN_SUCCESS: 'SETUP_DOMAIN_SUCCESS',
    SETUP_DOMAIN_FAILED: 'SETUP_DOMAIN_FAILED',
    ACCEPT_INVITATION_DOMAIN: 'ACCEPT_INVITATION_DOMAIN',
    ACCEPT_INVITATION_DOMAIN_SUCCESS: 'ACCEPT_INVITATION_DOMAIN_SUCCESS',
    ACCEPT_INVITATION_DOMAIN_FAILED: 'ACCEPT_INVITATION_DOMAIN_FAILED',
    GET_ORGANIZATION_INFO: 'GET_ORGANIZATION_INFO',
    GET_ORGANIZATION_INFO_SUCCESS: 'GET_ORGANIZATION_INFO_SUCCESS',
    GET_ORGANIZATION_INFO_FAILED: 'GET_ORGANIZATION_INFO_FAILED',
    AUTH_CONFIRM_EMAIL: 'AUTH_CONFIRM_EMAIL',
    AUTH_CONFIRM_EMAIL_FAILED: 'AUTH_CONFIRM_EMAIL_FAILED',
    AUTH_CONFIRM_EMAIL_SUCCESS: 'AUTH_CONFIRM_EMAIL_SUCCESS',

    GET_CURRENT_USER_SCHOOL_YEARS: 'GET_CURRENT_USER_SCHOOL_YEAR',
    GET_CURRENT_USER_SCHOOL_YEARS_SUCCESS: 'GET_CURRENT_USER_SCHOOL_YEARS_SUCCESS',
    GET_CURRENT_USER_SCHOOL_YEARS_FAILED: 'GET_CURRENT_USER_SCHOOL_YEARS_FAILED',

    GET_SCHOOL_GRADE_LEVEL: 'GET_SCHOOL_GRADE_LEVEL',
    GET_SCHOOL_GRADE_LEVEL_SUCCESS: 'GET_SCHOOL_GRADE_LEVEL_SUCCESS',
    GET_SCHOOL_GRADE_LEVEL_FAILED: 'GET_SCHOOL_GRADE_LEVEL_FAILED'

};

export const END_POINT = {
    check_domain_status: {
        method: 'GET',
        url: (subdomain) => `${process.env.REACT_APP_API_URL}/organization/status?subdomain=${subdomain}`
    },
    login: {
        method: 'POST',
        url: `${process.env.REACT_APP_API_URL}/organization/session`
    },
    get_current_user: {
        method: 'GET',
        url: `${process.env.REACT_APP_API_URL}/organization/me`
    },
    get_current_user_school_years: {
      method: 'GET',
      url: (orgId, userId, params) => `${process.env.REACT_APP_API_URL}/organizations/${orgId}/users/${userId}/school-years?${objectToParams(params)}`
    },
    logout: {
        method: 'DELETE',
        url: `${process.env.REACT_APP_API_URL}/organization/session`
    },
    forgot_password: {
      method: 'POST',
      url: `${process.env.REACT_APP_API_URL}/organization/forgot-password`
    },
    reset_password: {
      method: 'POST',
      url: (token) => `${process.env.REACT_APP_API_URL}/organizations/set-password?token=${token}`
    },
    check_token: {
      method: 'GET',
      url: (token,type) => `${process.env.REACT_APP_API_URL}/check-token?token=${token}&type=${type}`
    },
    get_organization_info: {
      method: 'GET',
      url: (token) => `${process.env.REACT_APP_API_URL}/organization/${token}/info`
    },
    setup_domain: {
      method: 'POST',
      url: `${process.env.REACT_APP_API_URL}/organization/accept-invite`
    },
    accept_inivation_domain: {
      method: 'POST',
      url: `${process.env.REACT_APP_API_URL}/organization/user-accept-invite`
    },
    confirm_email: {
      method: 'PUT',
      url: (token) => `${process.env.REACT_APP_API_URL}/organization/confirm-email/${token}`
    },
    setup_device_token: {
      method: 'POST',
      url: `${process.env.REACT_APP_API_URL}/organizations/users/devices`
    },
    get_school_grade_level: {
      url: (organizationId) => `${process.env.REACT_APP_SCHOOL_PORTAL_URL}/grade-levels/organizations/${organizationId}`,
      method: 'GET',
    }
};
