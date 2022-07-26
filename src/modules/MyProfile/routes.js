import loadable from '@loadable/component';

import { ROUTE_MY_PROFILE } from './constantsRoute';

const MyProfile = loadable(() => import('./containers/MyProfile'));

export default [
    {
        path: ROUTE_MY_PROFILE.DEFAULT,
        component: MyProfile,
        private: true,
        exact: true,
        userMenu: {
            title: 'My Profile',
            order: 1
        }
    }
];