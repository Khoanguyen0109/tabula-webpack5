import React from 'react';

import Loading from 'components/TblLoading';
import withReducer from 'components/TblWithReducer';

import { GuardianMW } from 'utils/middlewareRoute';
import { GUARDIAN, STUDENT, TEACHER, isGuardian } from 'utils/roles';

import loadable from '@loadable/component';
import { ReactComponent as IcnMenu } from 'assets/images/icn_myCourses.svg';

import { EmptyStudentPage, ForbiddenPage } from './components/ErrorPage';
import { ROUTE_MY_COURSES } from './constantsRoute';
import reducer from './reducers';

const MyCourses = loadable(() => import('./containers'), {
  fallback: <Loading />,
});
const MyCoursesDetail = loadable(() => import('./containers/MyCoursesDetail'), {
  fallback: <Loading />,
});
const appendReducer = (currentState) => !!!currentState?.myCoursesList;

// const { EmptyStudentPage, ForbiddenPage } = loadable(() => import('components/TblErrorPage'));

export default [
  {
    path: ROUTE_MY_COURSES.DEFAULT,
    component: withReducer('AllCourses', reducer, appendReducer)(MyCourses),
    roles: [TEACHER, STUDENT],
    private: true,
    exact: true,
    menu: {
      title: 'Courses',
      group: 'noname',
      icon: IcnMenu,
      order: 0,
    },
  },
  {
    path: [
      ROUTE_MY_COURSES.MY_COURSES_GUARDIAN(':studentId'),
      ROUTE_MY_COURSES.MY_COURSES_GUARDIAN_NO_STUDENT(),
    ],
    component: withReducer(
      'AllCourses',
      reducer
    )(
      GuardianMW(
        {
          defaultPath: ROUTE_MY_COURSES.MY_COURSES_GUARDIAN(':studentId'),
          defaultRedirect: (studentId) =>
            ROUTE_MY_COURSES.MY_COURSES_GUARDIAN(studentId),
          DefaultComponent: MyCourses,
        },
        {
          errorPath: ROUTE_MY_COURSES.MY_COURSES_GUARDIAN_NO_STUDENT(),
          errorRedirect: () =>
            ROUTE_MY_COURSES.MY_COURSES_GUARDIAN_NO_STUDENT(),
          ErrorComponent: EmptyStudentPage,
        }
      )
    ),
    roles: [GUARDIAN],
    menu: {
      title: 'Courses',
      group: 'noname',
      icon: IcnMenu,
      order: 0,
    },
    exact: true,
    private: true,
    getSelectedPath: (context) => {
      if (isGuardian(context?.currentUser)) {
        if (!!context?.currentStudentId) {
          return ROUTE_MY_COURSES.MY_COURSES_GUARDIAN(context.currentStudentId);
        }
        return ROUTE_MY_COURSES.MY_COURSES_GUARDIAN_NO_STUDENT();
      }
      return ROUTE_MY_COURSES.DEFAULT;
    },
  },
  {
    path: ROUTE_MY_COURSES.MY_COURSES_DETAIL(':courseId'),
    component: withReducer('AllCourses', reducer)(MyCoursesDetail),
    private: true,
    exact: true,
    roles: [TEACHER, STUDENT],
  },
  {
    path: [
      ROUTE_MY_COURSES.MY_COURSES_DETAIL_GUARDIAN(':studentId', ':courseId'),
      ROUTE_MY_COURSES.MY_COURSES_DETAIL_GUARDIAN_NO_STUDENT(':courseId'),
    ],
    component: withReducer(
      'AllCourses',
      reducer
    )(
      GuardianMW(
        {
          defaultPath: ROUTE_MY_COURSES.MY_COURSES_DETAIL_GUARDIAN(
            ':studentId',
            ':courseId'
          ),
          defaultRedirect: (studentId, params) =>
            ROUTE_MY_COURSES.MY_COURSES_DETAIL_GUARDIAN(
              studentId,
              params?.courseId
            ),
          DefaultComponent: MyCoursesDetail,
        },
        {
          errorPath:
            ROUTE_MY_COURSES.MY_COURSES_DETAIL_GUARDIAN_NO_STUDENT(':courseId'),
          errorRedirect: null,
          ErrorComponent: ForbiddenPage,
        }
      )
    ),
    private: true,
    exact: true,
    roles: [GUARDIAN],
  },
];
