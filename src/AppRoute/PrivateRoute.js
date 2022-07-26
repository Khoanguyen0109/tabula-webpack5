import React from 'react';
import { Redirect, Route } from 'react-router-dom';

import isEmpty from 'lodash/isEmpty';

import CircularProgress from '@mui/material/CircularProgress';

import ErrorPage from 'components/TblErrorPage';

import { ROUTE_AUTH } from 'shared/Auth/constantsRoute';

import PropTypes from 'prop-types';
import { checkPermission } from 'utils';

import {
  detectIpad,
  detectMobAndroid,
  detectMobIOS,
} from '../utils/detectMobileBrowsing';

import { useAuthDataContext } from './AuthProvider';

const checkWindowScreen = window.innerWidth > 1024 || window.innerHeight > 1024 ;
const PrivateRoute = ({ component, routerRoles, ...rest }) => {
  const { currentUser, fetchingUser, token } = useAuthDataContext();
  //   const finalComponent = user ? component : <Redirect to= />;
  // return null;
  // console.log('private', fetchingUser, currentUser, token);
  if (fetchingUser && token) {
    return <CircularProgress color='primary' />;
  }
  if (isEmpty(currentUser)) {
    let to = ROUTE_AUTH.LOGIN;
    if (rest.to) {
      to = rest.to;
    }
    return <Redirect to={to} />;
  }
  const hasPermission = checkPermission(currentUser, routerRoles);
  if (!hasPermission) {
    return (
      <ErrorPage
        errorCode='403'
        shortDescription='forbidden'
        detailDescription='no_permission'
        isNotFoundPage={false}
        isPublic={true}
      />
    );
  }
  if (
    hasPermission &&
    ((detectMobAndroid() && !checkWindowScreen) || detectMobIOS() ||
      (detectIpad() && window.location.href.includes('app.tabulalearning')))
  ) {
    return <Redirect to={ROUTE_AUTH.MOBILE_BROWSER} />;
  }
  return <Route {...rest} component={component} />;
};

PrivateRoute.propTypes = {
  component: PropTypes.node,
  routerRoles: PropTypes.array,
};
export default PrivateRoute;
