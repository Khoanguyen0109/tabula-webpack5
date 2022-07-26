import React from 'react';
import { connect } from 'react-redux';

import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';

import { AuthDataContext } from 'AppRoute/AuthProvider';
import momentTimezone from 'moment-timezone';
import PropTypes from 'prop-types';

import commonActions from '../../Common/actions';
import authActions from '../actions';
import { ROUTE_AUTH } from '../constantsRoute';

class CurrentUser extends React.PureComponent {

  static contextType = AuthDataContext;
  componentDidMount() {
    const { currentUser, fetchingUser } = this.props;
    // const domain = window.location.hostname;
    // const subdomain = domain.split('.');
    const searchParams = new URLSearchParams(window.location.search);
    const token = searchParams.get('access_token');
    if ((this.context.token || token) && isEmpty(currentUser) && !fetchingUser) {
      this.context.setData({fetchingUser: true}, 'user');
      this.props.fetchUser({fetchingUser: true, token});
    }
  }

  componentDidUpdate(prevProps) {
    const { currentUser, errorCode, fetchingUser, error } = this.props;
    if (this.context.token && isEmpty(currentUser) && !fetchingUser) {
        this.context.setData({fetchingUser: true});
        this.props.fetchUser({fetchingUser: true});
    }

    if (!isEqual(currentUser, prevProps.currentUser)) {
      const studentId = +window.location.pathname.split('/')[3];
      let currentStudentId;
      if (currentUser?.students?.find((e) => e.id === studentId)) {
        currentStudentId = studentId;
      } else {
        currentStudentId = get(currentUser, 'students[0].id');
      }
      this.context.setData({ currentUser, fetchingUser: false, currentStudentId }, 'user');
      momentTimezone.tz.setDefault(currentUser?.organization?.timezone ?? momentTimezone.tz.guess());
    }

    if (errorCode === 401 && isEmpty(currentUser)) {
      this.props.setState({errorCode: undefined});
      this.context.resetData();
    }
    // Any ajax request return 401. Force app logout
    if (error && error.status === 401 && !isEmpty(currentUser)) {
      this.props.setState({currentUser: {}});
      this.props.setError({error: {}});
      this.context.resetData();
      window.location = ROUTE_AUTH.LOGIN;
    }
  }

  render() {
    return null;
  }

}

CurrentUser.propTypes = {
  t: PropTypes.func,
  currentUser: PropTypes.object,
  errorCode: PropTypes.number,
  location: PropTypes.object,
  error: PropTypes.object,
  fetchUser: PropTypes.func,
  setError: PropTypes.func,
  setState: PropTypes.func,
  isBusy: PropTypes.bool,
  fetchingUser: PropTypes.bool
  
};

const mapStateToProps = (state) => ({
  currentUser: state.Auth.currentUser,
  errorCode: state.Auth.errorCode,
  fetchingUser: state.Auth.fetchingUser,
  error: state.Common.error
});

const mapDispatchToProps = (dispatch) => ({
  fetchUser: (payload) => dispatch(authActions.authFetchUser(payload)),
  setState: (payload) => dispatch(authActions.authSetState(payload)),
  setError: (payload) => dispatch(commonActions.setError(payload))
});

export default connect(mapStateToProps, mapDispatchToProps)(CurrentUser);