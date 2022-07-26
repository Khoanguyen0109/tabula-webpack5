import React from 'react';

import SummarizeOutlinedIcon from '@mui/icons-material/SummarizeOutlined';

import Loading from 'components/TblLoading';
import withReducer from 'components/TblWithReducer';
import { EmptyStudentPage } from 'modules/MyCourses/components/ErrorPage';

import { GuardianMW } from 'utils/middlewareRoute';
import { GUARDIAN, STUDENT, isGuardian } from 'utils/roles';

import loadable from '@loadable/component';

import { ROUTE_GRADE_REPORT } from './contantsRoute';
import reducer from './reducers';

const GradeReport = loadable(() => import('./containers'), { fallback: <Loading /> });

export default [
    {
      path: ROUTE_GRADE_REPORT.DEFAULT,
      component: withReducer('GradeReport', reducer)(GradeReport),
      roles: [ STUDENT],
      private: true,
      exact: true,
      menu: {
        title: 'Grade Report',
        group: 'noname',
        icon: SummarizeOutlinedIcon,
        order: 3
      },
    }, 
    {
      path: [
        ROUTE_GRADE_REPORT.GUARDIAN_VIEW_GRADE_REPORT(':studentId'),
        ROUTE_GRADE_REPORT.GUARDIAN_VIEW_GRADE_REPORT_NO_STUDENT(),
      ],
      component: withReducer(
        'GradeReport',
        reducer
      )(
        GuardianMW(
          {
            defaultPath: ROUTE_GRADE_REPORT.GUARDIAN_VIEW_GRADE_REPORT(':studentId'),
            defaultRedirect: (studentId) =>
            ROUTE_GRADE_REPORT.GUARDIAN_VIEW_GRADE_REPORT(studentId),
            DefaultComponent: GradeReport,
          },
          {
            errorPath: ROUTE_GRADE_REPORT.GUARDIAN_VIEW_GRADE_REPORT_NO_STUDENT(),
            errorRedirect: () =>
            ROUTE_GRADE_REPORT.GUARDIAN_VIEW_GRADE_REPORT_NO_STUDENT(),
            ErrorComponent: EmptyStudentPage,
          }
        )
      ),
      roles: [GUARDIAN],
      menu: {
        title: 'Grade Report',
        group: 'noname',
        icon: SummarizeOutlinedIcon,
        order: 3
      },
      exact: true,
      private: true,
      getSelectedPath: (context) => {
        if (isGuardian(context?.currentUser)) {
          if (!!context?.currentStudentId) {
            return ROUTE_GRADE_REPORT.GUARDIAN_VIEW_GRADE_REPORT(context.currentStudentId);
          }
          return ROUTE_GRADE_REPORT.GUARDIAN_VIEW_GRADE_REPORT_NO_STUDENT();
        }
        return ROUTE_GRADE_REPORT.DEFAULT;
      },
    },
  ];
