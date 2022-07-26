import React, { PureComponent } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';

import PropTypes from 'prop-types';
import { removeToken } from 'utils';

import AuthActions from '../actions';
import InvalidLink from '../components/InvalidLink';
import Layout from '../components/Layout';

class ConfirmEmail extends PureComponent {
  state = {
    invalidLink: false
  };

  componentDidMount() {
    const payload = {
      token: this.props.match.params.token,
      isLoadingConfirmEmail: true
    };
    this.props.confirmEmail(payload);
  }

  componentDidUpdate() {
    const { isConfirmEmailSuccess, confirmEmailFailed } = this.props;
    if (isConfirmEmailSuccess) {
      if (localStorage.getItem('access_token')) {
        removeToken();
      }
      this.setState({ invalidLink: false });
    }
    if (confirmEmailFailed) {
      this.setState({ invalidLink: true });
    }
  }
  render() {
    const { t, isLoadingConfirmEmail } = this.props;
    const { invalidLink } = this.state;

    if (isLoadingConfirmEmail) {
      return <>
        <Skeleton variant='text' />
        <Skeleton variant='text' />
        <Skeleton variant='text' />
      </>;
    }
    if (invalidLink) {
      return <InvalidLink />;
    }
    return (
      <Layout t={t}>
        <Typography variant='bodyMedium'>
          {t('success_in_confirmation_email')}
        </Typography>
      </Layout>
    );
  }
}

ConfirmEmail.propTypes = {
  t: PropTypes.func,
  isConfirmEmailSuccess: PropTypes.func,
  confirmEmailFailed: PropTypes.object,
  confirmEmail: PropTypes.func,
  match: PropTypes.object,
  isLoadingConfirmEmail: PropTypes.bool
};

const mapStateToProps = (state) => ({
  isConfirmEmailSuccess: state.Auth.isConfirmEmailSuccess,
  confirmEmailFailed: state.Auth.confirmEmailFailed,
  isLoadingConfirmEmail: state.Auth.isLoadingConfirmEmail
});

const mapDispatchToProps = (dispatch) => ({
  confirmEmail: (payload) => dispatch(AuthActions.authConfirmEmail(payload))
});

export default withTranslation(['auth', 'common'])(connect(mapStateToProps, mapDispatchToProps)(ConfirmEmail));