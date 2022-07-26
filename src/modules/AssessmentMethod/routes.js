import { SCHOOL_MANAGER } from 'utils/roles';

import loadable from '@loadable/component';
import { ReactComponent as IcnMenu } from 'assets/images/icn_assessmentMethods.svg';

import { ROUTE_ASSESSMENT_METHOD } from './constantsRoute';

const AssessmentMethod = loadable(() => import('./containers'));

export default [
  {
    path: ROUTE_ASSESSMENT_METHOD.DEFAULT,
    component: AssessmentMethod,
    private: true,
    exact: true,
    roles: [SCHOOL_MANAGER],
    menu: {
      title: 'Assessment Methods',
      group: 'Course Administration',
      icon: IcnMenu,
      order: 3,
      groupOrder: 1
    }
  }
];
