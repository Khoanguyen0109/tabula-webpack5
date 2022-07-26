import loadable from '@loadable/component';

import MobileDownloadScreen from '../../AppRoute/MobileDownloadScreen';

import { ROUTE_AUTH } from './constantsRoute';

const Login = loadable(() => import('./containers/Login'));
const Logout = loadable(() => import('./containers/Logout'));
// const SSO = loadable(() => import('./containers/SSO'));
const ForgotPassword = loadable(() => import('./containers/ForgotPassword'));
const SetUpPassword = loadable(() => import('./containers/SetUpPassword'));
const AcceptInvitation = loadable(() => import('./containers/AcceptInvitation'));
const SetupDomain = loadable(() => import('./containers/SetupDomain'));
const ConfirmEmail = loadable(() => import('./containers/ConfirmEmail'));

export default [
    {
        path: ROUTE_AUTH.DEFAULT,
        component: Login,
        exact: true
    },
    {
        path: ROUTE_AUTH.LOGIN,
        component: Login,
    },
    // {
    //     path: '/sso/:token',
    //     component: SSO,
    //     exact: true
    // },
    {
        path: ROUTE_AUTH.LOGOUT,
        component: Logout,
        private: true,
        exact: true,
        userMenu: {
            title: 'Logout',
            order: 9
        }
    },
    {
      path: ROUTE_AUTH.FORGOT_PASSWORD,
      component: ForgotPassword
    },
    {
      path: ROUTE_AUTH.SET_PASSWORD(':token'),
      component: SetUpPassword,
      exact: true
    },
    {
        path: ROUTE_AUTH.SET_UP_DOMAIN(':token'),
        component: SetupDomain,
        exact: true
    },
    {
        path: ROUTE_AUTH.SET_UP_ACCOUNT(':token'),
        component: AcceptInvitation,
        exact: true
      },
    {
      path: ROUTE_AUTH.CONFIRM_EMAIL(':token'),
      component: ConfirmEmail,
      exact: true
    },
    {
      path: ROUTE_AUTH.MOBILE_BROWSER,
      component: MobileDownloadScreen,
      exact: true
    },
];