import React from 'react';
import { Redirect } from 'react-router-dom';

import PropTypes from 'prop-types';

function SSO({match}) {
  const { token } = match.params;
  localStorage.setItem('access_token', token);
  return <Redirect to={{ pathname: '/get-started' }}/>;
}

SSO.propTypes = {
  match: PropTypes.object
};
export default SSO;