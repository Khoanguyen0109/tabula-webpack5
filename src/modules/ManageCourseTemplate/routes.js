import React from 'react';

import Loading from 'components/TblLoading';
import withReducer from 'components/TblWithReducer';

import { COURSE_MANAGER } from 'utils/roles';

import loadable from '@loadable/component';
import { ReactComponent as IcnMenu } from 'assets/images/icn_myCourses.svg';

import { ROUTE_MANAGE_COURSE_TEMPLATE } from './constantsRoute';
import reducer from './reducers';

const ManageCourseTemplate = loadable(
  () => import('modules/ManageCourseTemplate/containers'),
  {
    fallback: <Loading />,
  }
);
const ViewCourseTemplateDetail = loadable(() =>
  import('modules/ManageCourseTemplate/containers/ViewCourseTemplateDetail')
);
const appendReducer = (currentState) => !!!currentState?.myCoursesList;

// const { EmptyStudentPage, ForbiddenPage } = loadable(() => import('components/TblErrorPage'));

export default [
  {
    path: ROUTE_MANAGE_COURSE_TEMPLATE.DEFAULT,
    component: withReducer(
      'ManageCourseTemplate',
      reducer,
      appendReducer
    )(ManageCourseTemplate),
    roles: [COURSE_MANAGER],
    private: true,
    exact: true,
    menu: {
      title: 'Manage Course Templates',
      group: 'noname',
      icon: IcnMenu,
      order: 2,
    },
  },
  {
    path: ROUTE_MANAGE_COURSE_TEMPLATE.COURSE_TEMPLATE_DETAIL(':templateId'),
    component: withReducer(
      'ManageCourseTemplate',
      reducer
    )(ViewCourseTemplateDetail),
    private: true,
    exact: true,
    roles: [COURSE_MANAGER],
  },
];
