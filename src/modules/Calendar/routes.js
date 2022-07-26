import withReducer from 'components/TblWithReducer';

import { GuardianMW } from 'utils/middlewareRoute';
import { GUARDIAN, STUDENT, isGuardian } from 'utils/roles';

import loadable from '@loadable/component';
import { ReactComponent as IcnMenu } from 'assets/images/icn_calendar.svg';

import { EmptyStudentPage } from './components/ErrorPage';
import { ROUTE_CALENDAR } from './constantsRoute';
import reducer from './reducers';

const Calendar = loadable(() => import('./containers'));
// const { EmptyStudentPage } = loadable(() => import('components/TblErrorPage'));

export default [
  {
    path: ROUTE_CALENDAR.DEFAULT,
    component: withReducer('Calendar', reducer)(Calendar),
    private: true,
    exact: true,
    roles: [STUDENT],
    menu: {
      title: 'Calendar',
      icon: IcnMenu,
      group: 'noname',
      order: 2
    }
  }, {
    path: [
      ROUTE_CALENDAR.CALENDAR_GUARDIAN(':studentId'),
      ROUTE_CALENDAR.CALENDAR_GUARDIAN_NO_STUDENT()
    ],
    component: withReducer('Calendar', reducer)(
      GuardianMW({
        defaultPath: ROUTE_CALENDAR.CALENDAR_GUARDIAN(':studentId'),
        defaultRedirect: (studentId) => ROUTE_CALENDAR.CALENDAR_GUARDIAN(studentId),
        DefaultComponent: Calendar
      }, {
        errorPath: ROUTE_CALENDAR.CALENDAR_GUARDIAN_NO_STUDENT(),
        errorRedirect: () => ROUTE_CALENDAR.CALENDAR_GUARDIAN_NO_STUDENT(),
        ErrorComponent: EmptyStudentPage
      })
    ),
    private: true,
    exact: true,
    roles: [GUARDIAN],
    menu: {
      title: 'Calendar',
      icon: IcnMenu,
      group: 'noname',
      order: 2
    },
    getSelectedPath: (context) => {
      if (isGuardian(context?.currentUser)) {
        if (!!context?.currentStudentId) {
          return ROUTE_CALENDAR.CALENDAR_GUARDIAN(context.currentStudentId);
        }
        return ROUTE_CALENDAR.CALENDAR_GUARDIAN_NO_STUDENT();
      }
      return ROUTE_CALENDAR.DEFAULT;
    }
  }
];