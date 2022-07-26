import withReducer from 'components/TblWithReducer';

import loadable from '@loadable/component';
import { ReactComponent as IcnMyCourses } from 'assets/images/icn_teach.svg';

import { ROUTE_AGENDA } from './constantsRoute';
import reducer from './reducers';

const Agenda = loadable(() => import('./containers'));

export default [
  {
    path: ROUTE_AGENDA.DEFAULT,
    component: withReducer('Agenda', reducer)(Agenda),
    private: true,
    roles: ['Teacher'],
    exact: true,
    menu: {
      title: 'Teach',
      icon: IcnMyCourses,
      group: 'noname',
      order: 1
    },
  },
];
