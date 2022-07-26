import { SCHOOL_MANAGER } from 'utils/roles';

import loadable from '@loadable/component';
import { ReactComponent as IcnMenu } from 'assets/images/icn_subjects.svg';

import { ROUTE_SUBJECT } from './constantsRoute';

const Subject = loadable(() => import('./containers'));

export default [
  {
    path: ROUTE_SUBJECT.DEFAULT,
    component: Subject,
    roles: [SCHOOL_MANAGER],
    private: true,
    exact: true,
    menu: {
      title: 'Subjects',
      group: 'Course Administration',
      icon: IcnMenu,
      order: 2,
      groupOrder: 1
    }
  }
];
