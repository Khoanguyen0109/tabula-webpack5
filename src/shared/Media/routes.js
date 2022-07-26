import withReducer from 'components/TblWithReducer';

import loadable from '@loadable/component';

import { ROUTE_MEDIA } from './constantsRoute';
import epics from './epics';
import reducer from './reducers';

const MediaSample = loadable(() => import('./sample'));

export default [{
  path: ROUTE_MEDIA.DEFAULT,
  component: withReducer('Media', reducer, epics)(MediaSample),
  private: true
}];