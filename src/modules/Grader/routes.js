import withReducer from 'components/TblWithReducer';

import Grader from './container/Grader';
import reducer from './reducers';
import { ROUTE_GRADER } from './routeConstant';

export default [
    {
      path: ROUTE_GRADER.DEFAULT(':courseId'),
      component: withReducer('Grader', reducer)(Grader),
      private: true,
      roles: ['Teacher'],
      exact: true,
      // menu: {
      //   title: 'Teach',
      //   icon: IcnMyCourses,
      //   group: 'noname',
      //   order: 4
      // },
    },
];
