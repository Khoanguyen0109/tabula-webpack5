import React, { PureComponent } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import Skeleton from '@mui/material/Skeleton';

import { AuthDataContext } from 'AppRoute/AuthProvider';
import PropTypes from 'prop-types';

import authActions from '../actions';
import InvalidLink from '../components/InvalidLink';

import ResetPassword from './ResetPassword';

class SetUpPassword extends PureComponent {
  state = {
    organizationInfo: {
      email: new URLSearchParams(this.props.location.search).get('email'),
    },
  };
  static contextType = AuthDataContext;

  componentDidMount() {
    // Force user logout
    this.context.resetData();
    const { match } = this.props;
    const payload = {
      token: match.params.token,
      type: 'forgot',
      checkingToken: true
    };
    this.props.checkToken(payload);
  }

  render() {
    const {
      isResetPasswordSuccessfully,
      currentUser,
      checkingToken,
      isValidToken
    } = this.props;
    // const type = new URLSearchParams(this.props.location.search).get('type');
    const { organizationInfo } = this.state;
    if (checkingToken) {
      return <>
          <Skeleton variant='text' />
          <Skeleton variant='text' />
          <Skeleton variant='text' />
        </>;
    }
    // if (type === 'forgot') {
      
    // }
    if (isResetPasswordSuccessfully && currentUser) {
      return <Redirect to={{ pathname: '/' }} />;
    }

    if (!isValidToken) {
      return <InvalidLink />;
    }

    return <ResetPassword email={organizationInfo.email} token={this.props.match.params.token} />;

  }
}

SetUpPassword.propTypes = {
  resetPassword: PropTypes.func,
  isResetPasswordSuccessfully: PropTypes.bool,
  currentUser: PropTypes.object,
  checkToken: PropTypes.func,
  t: PropTypes.func,
  form: PropTypes.object,
  location: PropTypes.object,
  match: PropTypes.object,
  checkingToken: PropTypes.bool,
  isValidToken: PropTypes.bool
};

const mapStateToProps = (state) => ({
  isValidToken: state.Auth.isValidToken,
  isResetPasswordSuccessfully: state.Auth.isResetPasswordSuccessfully,
  currentUser: state.Auth.currentUser,
  checkingToken: state.Auth.checkingToken
});

const mapDispatchToProps = (dispatch) => ({
  checkToken: (payload) => dispatch(authActions.authCheckToken(payload))
});

export default
  withTranslation(['auth', 'common'])
    (connect(
      mapStateToProps,
      mapDispatchToProps
    )(SetUpPassword));