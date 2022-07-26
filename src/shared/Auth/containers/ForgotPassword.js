import React, { PureComponent } from 'react';
import { withTranslation } from 'react-i18next';
import { Trans } from 'react-i18next';
import { connect } from 'react-redux';

import isNil from 'lodash/isNil';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import Skeleton from '@mui/material/Skeleton';
import Slide from '@mui/material/Slide';
import Typography from '@mui/material/Typography';

import PropTypes from 'prop-types';

import authActions from '../actions';
import ForgotPasswordForm from '../components/ForgotPasswordForm';
import Layout from '../components/Layout';
import SubDomainForm from '../components/SubDomainForm';
import { ROUTE_AUTH } from '../constantsRoute';

class ForgotPassword extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      hasSubdomain: false,
      subdomain: '',
      checkingSubdomain: true,
      domain: '',
      isBusy: false,
    };
    // this.layoutRef = React.createRef(null);
  }

  componentDidMount() {
    const domain = process.env.REACT_APP_BASE_URL;
    const subdomain = window.location.hostname.split('.');
    const subdomain2 = new URL(window.location).searchParams.get('subdomain');
    const ignoreDomains = process.env.REACT_APP_IGNORE_DOMAIN.split(',');
    const currentHostname = window.location.hostname;
    if (
      currentHostname === domain ||
      ignoreDomains.indexOf(currentHostname) !== -1
    ) {
      this.setState({ hasSubdomain: false, domain, checkingSubdomain: false });
    } else {
      if (!isNil(subdomain2)) {
        this.checkDomain({ subdomain: subdomain2 });
      }
      this.setState({
        subdomain: !isNil(subdomain2) ? subdomain2 : subdomain[0],
        hasSubdomain: true,
        domain,
        checkingSubdomain: true,
      });
    }
  }

  componentDidUpdate() {
    if (!this.props.isBusy && this.state.checkingSubdomain) {
      this.setState({ checkingSubdomain: false });
    }
  }

  checkDomain = (values) => {
    this.setState({ ...values });
    this.props.authCheckDomainStatus({ ...values, isBusy: true });
  };

  forgotPassword = (values) => {
    this.setState({ isBusy: true, ...values }, () => {
      this.props.forgotPassword({
        ...values,
        subdomain: this.state.subdomain,
        isBusy: true,
      });
    });
  };

  // Fix The scrollbar appear when slide animation running
  onExited = () => {
    if (this.layoutRef.current) {
      this.layoutRef.current.updateScroll();
    }
  };

  render() {
    const { t, isBusy, error, subDomainStatus, isForgotPasswordSuccessfully } =
      this.props;
    const { hasSubdomain, domain, subdomain, checkingSubdomain, email } =
      this.state;
    // Show loader instead of login form
    if ((this.context.fetching || checkingSubdomain) && isBusy) {
      return (
        <Layout t={t}>
          <Skeleton animation='wave' variant='text' height={40} />
          <Skeleton animation='wave' variant='text' height={40} />
          <Skeleton animation='wave' variant='text' height={40} />
        </Layout>
      );
    }
    return (
      <Layout t={t}>
        {!hasSubdomain && !subDomainStatus && (
          <SubDomainForm
            t={t}
            domain={domain}
            onSubmit={this.checkDomain}
            subDomainStatus={subDomainStatus}
            isBusy={isBusy}
            subdomain={subdomain}
          />
        )}
        {/* Implement later case user input invalid domain in the url */}
        {hasSubdomain && !subDomainStatus && !isBusy && (
          <div className='suspended-wrapper'>
            <Alert severity='error'>{t('invalid_domain')}</Alert>
          </div>
        )}
        {isForgotPasswordSuccessfully ? (
          <>
            <Box>
              <Typography variant='labelLarge' color='primary'>
                {t('email_sent')}
              </Typography>
            </Box>
            <Box mt={1} mb={2}>
              <Typography variant='bodySmall'>
                <Trans i18nKey='check_email'>
                  Check your{' '}
                  <Typography
                    component='span'
                    variant='bodySmall'
                    color='secondary'
                  >
                    {{ email }}
                  </Typography>{' '}
                  inbox now. We've sent you a link to reset your password.
                </Trans>
              </Typography>
            </Box>
            <div className='link'>
              <a href={ROUTE_AUTH.LOGIN}>{t('back_to_sign_in')}</a>
            </div>
          </>
        ) : (
          <Slide in={!!subDomainStatus} direction='up'>
            <Box>
              <Fade in={!!subDomainStatus} timeout={1000}>
                <Box className='box-fade'>
                  <ForgotPasswordForm
                    domain={domain}
                    isBusy={isBusy}
                    error={error}
                    onSubmit={this.forgotPassword}
                  />
                </Box>
              </Fade>
            </Box>
          </Slide>
        )}
      </Layout>
    );
  }
}

ForgotPassword.propTypes = {
  t: PropTypes.func,
  authCheckDomainStatus: PropTypes.func,
  isBusy: PropTypes.bool,
  subdomainValid: PropTypes.bool,
  error: PropTypes.object,
  subDomainStatus: PropTypes.number,
  forgotPassword: PropTypes.func,
  isForgotPasswordSuccessfully: PropTypes.bool,
  classes: PropTypes.object,
};

const mapStateToProps = (state) => ({
  error: state.Auth.error,
  isBusy: state.Auth.isBusy,
  subDomainStatus: state.Auth.subDomainStatus,
  isForgotPasswordSuccessfully: state.Auth.isForgotPasswordSuccessfully,
});

const mapDispatchToProps = (dispatch) => ({
  authCheckDomainStatus: (payload) =>
    dispatch(authActions.authCheckDomainStatus(payload)),
  forgotPassword: (payload) =>
    dispatch(authActions.authForgotPassword(payload)),
});

export default withTranslation(['auth', 'common'])(
  connect(mapStateToProps, mapDispatchToProps)(ForgotPassword)
);
