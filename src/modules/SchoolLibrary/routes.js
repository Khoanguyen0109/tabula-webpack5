import React from 'react';

import Loading from 'components/TblLoading';
import withReducer from 'components/TblWithReducer';

import { SCHOOL_MANAGER, TEACHER } from 'utils/roles';

import loadable from '@loadable/component';
import { ReactComponent as IcnMenu } from 'assets/images/icn_myCourses.svg';
import reducerManageCourseTemplate from 'modules/ManageCourseTemplate/reducers';

import { ROUTE_SCHOOL_LIBRARY } from './constantsRoute';
import reducer from './reducers';

const SchoolLibrary = loadable(() => import('modules/SchoolLibrary/containers'), {
  fallback: <Loading />,
});
const ViewLibraryTemplateDetail = loadable(() =>
  import('modules/ManageCourseTemplate/containers/ViewCourseTemplateDetail')
);

export default [
  {
    path: ROUTE_SCHOOL_LIBRARY.DEFAULT,
    component: withReducer('SchoolLibrary', reducer)(SchoolLibrary),
    roles: [TEACHER, SCHOOL_MANAGER],
    private: true,
    exact: true,
    menu: {
      title: 'School Curriculum Library',
      group: 'noname',
      icon: IcnMenu,
      order: 3,
    },
  },
  {
    path: ROUTE_SCHOOL_LIBRARY.LIBRARY_TEMPLATE_DETAIL(':templateId'),
    component: withReducer(
      'ManageCourseTemplate',
      reducerManageCourseTemplate
    )(ViewLibraryTemplateDetail),
    private: true,
    exact: true,
    roles: [TEACHER, SCHOOL_MANAGER],
  },
];
