import React, { useEffect } from 'react';
import { Route } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

import { detectForMobile } from 'utils/detectMobileBrowsing';

import PropTypes from 'prop-types';

const PublicRoute = ({ component, ...rest }) => {
  const location = useLocation();

  useEffect(() => {
    const organizationInfo = {
      email: new URLSearchParams(location.search).get('email'),
      subdomain: new URLSearchParams(location.search).get('subdomain'),
    };
    const domain = window.location.hostname.split('.');
    if (
      domain[0] === 'app' &&
      organizationInfo.subdomain !== 'app' &&
      !!!detectForMobile()
    ) {
      const fullUrl = `${window.location.protocol}//${organizationInfo.subdomain}.${domain[1]}.${domain[2]}:${window.location.port}${window.location.pathname}${window.location.search}`;
      window.location.replace(fullUrl);
    }
  }, [location.search]);
  return <Route {...rest} key='route' component={component} />;
};
PublicRoute.propTypes = {
  component: PropTypes.node,
};

export default PublicRoute;
