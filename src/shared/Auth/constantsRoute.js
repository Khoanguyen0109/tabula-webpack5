export const ROUTE_AUTH = {
    DEFAULT: '/',
    LOGIN: '/login',
    LOGOUT: '/logout',
    FORGOT_PASSWORD: '/forgot-password',
    SET_PASSWORD: (token) => `/set-password/${ token}`,
    SET_UP_DOMAIN: (token) => `/setup-domain/${ token}`,
    SET_UP_ACCOUNT: (token) => `/setup-account/${ token}`,
    CONFIRM_EMAIL: (token) => `/users/confirm-email/${ token}`,
    MOBILE_BROWSER: '/mobile-browser'
};
