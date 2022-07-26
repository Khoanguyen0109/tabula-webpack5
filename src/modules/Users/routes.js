import withReducer from 'components/TblWithReducer';

import { USER_MANAGER } from 'utils/roles';

import loadable from '@loadable/component';
import { ReactComponent as IcnMenu } from 'assets/images/icn_people.svg';

import { ROUTE_USERS } from './constantsRoute';
import userReducer from './reducers';

const GetStarted = loadable(() => import('./containers/GetStarted'));
const Users = loadable(() => import('./containers'));

export default [
    {
        path: ROUTE_USERS.GET_STARTED,
        component: GetStarted,
        private: true,
        exact: true
    },
    {
        path: ROUTE_USERS.DEFAULT,
        component: withReducer('Users', userReducer)(Users),
        private: true,
        exact: true,
        roles: [USER_MANAGER],
        menu: {
            title: 'Users',
            group: 'School Administration',
            icon: IcnMenu,
            order: 1,
            groupOrder: 2
        }
    }
];