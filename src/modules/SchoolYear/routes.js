import withReducer from 'components/TblWithReducer';

import { SCHOOL_MANAGER } from 'utils/roles';

import loadable from '@loadable/component';
import { ReactComponent as IcnMenu } from 'assets/images/icn_schoolyear.svg';

import { ROUTE_SCHOOL_YEAR } from './constantsRoute';
import reducer from './reducers';

const SchoolYear = loadable(() => import('./containers'));
const SchoolYearDetail = loadable(() => import('./containers/SchoolYearDetail'));

export default [
  {
    path: ROUTE_SCHOOL_YEAR.DEFAULT,
    component: withReducer('SchoolYear', reducer)(SchoolYear),
    private: true,
    exact: true,
    roles: [SCHOOL_MANAGER],
    menu: {
      title: 'School Years',
      group: 'School Administration',
      icon: IcnMenu,
      order: 3,
      groupOrder: 2
    }
  },
  {
    path: ROUTE_SCHOOL_YEAR.SCHOOL_YEAR_DETAIL(':schoolYearId'),
    component: withReducer('SchoolYear', reducer)(SchoolYearDetail),
    private: true,
    exact: true,
    roles: [SCHOOL_MANAGER]
  }
];
