import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import PropTypes from 'prop-types';

import authActions from '../actions';
import InvalidLink from '../components/InvalidLink';
import Layout from '../components/Layout';
import ResetPasswordForm from '../components/ResetPasswordForm';
import { ROUTE_AUTH } from '../constantsRoute';

class ResetPassword extends React.PureComponent {

  resetPassword = (values) => {
    const { password, token } = values;
    this.props.resetPassword({ password, token, isBusy: true });
  }
  render() {
    const { t, email, isResetPasswordSuccessfully, token, isValidToken, isBusy } = this.props;
    if (isValidToken) {
      return (
        <Layout t={t}>
          {isResetPasswordSuccessfully
            ? <>
                <Typography variant='labelLarge' color='primary'>{t('reset_your_password')}</Typography>
                <Box mt={1} mb={2}>
                  <Typography variant='bodySmall' component='div'>
                    {t('password_changed')}
                  </Typography>
                </Box>
                <div className='link'>
                  <a href={ROUTE_AUTH.LOGIN}>{t('back_to_sign_in')}</a>
                </div>
              </>
            : <ResetPasswordForm email={email} onSubmit={this.resetPassword} token={token} isBusy={isBusy}/>}
        </Layout>
      );
    }
    return <InvalidLink />;
  }
}

ResetPassword.propTypes = {
  resetPassword: PropTypes.func,
  t: PropTypes.func,
  email: PropTypes.string,
  isResetPasswordSuccessfully: PropTypes.bool,
  token: PropTypes.string,
  isValidToken: PropTypes.bool,
  isBusy: PropTypes.bool
};

const mapStateToProps = (state) => ({
  isResetPasswordSuccessfully: state.Auth.isResetPasswordSuccessfully,
  isValidToken: state.Auth.isValidToken,
  isBusy: state.Auth.isBusy
});

const mapDispatchToProps = (dispatch) => ({
  resetPassword: (payload) => dispatch(authActions.authResetPassword(payload)),
  checkToken: (payload) => dispatch(authActions.authCheckToken(payload))
});

export default withTranslation(['auth', 'common'])(connect(mapStateToProps, mapDispatchToProps)(ResetPassword));