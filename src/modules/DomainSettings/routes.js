import withReducer from 'components/TblWithReducer';

import { DOMAIN_OWNER } from 'utils/roles';

import loadable from '@loadable/component';
import { ReactComponent as IcnMenu } from 'assets/images/icn_domainSettings.svg';

import { ROUTE_DOMAIN_SETTINGS } from './constantsRoute';
import reducer from './reducers';

const DomainSettings = loadable(() => import('./containers'));

export default [
  {
    path: ROUTE_DOMAIN_SETTINGS.DEFAULT,
    component: withReducer('DomainSettings', reducer)(DomainSettings),
    private: true,
    roles: [DOMAIN_OWNER],
    exact: true,
    menu: {
      title: 'Domain Settings',
      icon: IcnMenu,
      group: 'Domain',
      order: 1,
      groupOrder: 3
    }
  },
];
