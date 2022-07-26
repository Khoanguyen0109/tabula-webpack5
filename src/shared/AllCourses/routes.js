import React from 'react';

import Loading from 'components/TblLoading';
import withReducer from 'components/TblWithReducer';

import { COURSE_MANAGER } from 'utils/roles';

import loadable from '@loadable/component';
import { ReactComponent as IcnMenu } from 'assets/images/icn_allCourses.svg';

import { ROUTE_ALL_COURSES } from './constantsRoute';
import reducer from './reducers';

const AllCourses = loadable(() => import('./containers'), { fallback: <Loading /> });
const AllCoursesDetail = loadable(() => import('./containers/AllCoursesDetail'), { fallback: <Loading /> });

// const SchoolYearDetail = Loadable({
//   loader: () => import('./containers/SchoolYearDetail'),
//   loading: Loading
// });

export default [
  // {
  //   path: '/school-year/:schoolYearId',
  //   component: SchoolYearDetail,
  //   exact: true,
  //   private: true,
  //   roles: [SCHOOL_MANAGER]
  // },
  {
    path: ROUTE_ALL_COURSES.DEFAULT,
    component: withReducer('AllCourses', reducer)(AllCourses),
    roles: [COURSE_MANAGER],
    private: true,
    exact: true,
    menu: {
      title: 'Course Administration',
      group: 'Course Administration',
      icon: IcnMenu,
      order: 1,
      groupOrder: 1
    }
  },
  {
    path: ROUTE_ALL_COURSES.ALL_COURSES_DETAIL(':courseId'),
    component: withReducer('AllCourses', reducer)(AllCoursesDetail),
    private: true,
    exact: true,
    roles: [COURSE_MANAGER]
  }
];
