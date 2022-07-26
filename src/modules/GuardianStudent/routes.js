import withReducer from 'components/TblWithReducer';

import { USER_MANAGER } from 'utils/roles';

import loadable from '@loadable/component';
import { ReactComponent as IcnMenu } from 'assets/images/icn_students_n_guardians.svg';

import { ROUTE_GUARDIAN_SETTINGS } from './constantsRoute';
import reducer from './reducers';

const Students = loadable(() => import('./containers/Students'));

export default [
    {
        path: ROUTE_GUARDIAN_SETTINGS.DEFAULT,
        component: withReducer('GuardianStudent', reducer)(Students),
        private: true,
        exact: true,
        roles: [USER_MANAGER],
        menu: {
            title: 'Students & Guardians',
            group: 'School Administration',
            icon: IcnMenu,
            order: 2,
            groupOrder: 2
        }
    }
];