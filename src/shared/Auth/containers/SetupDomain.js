import React, { PureComponent } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import isEmpty from 'lodash/isEmpty';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import Skeleton from '@mui/material/Skeleton';
import Slide from '@mui/material/Slide';
import Typography from '@mui/material/Typography';

import TblAutocomplete from 'components/TblAutocomplete';
import TblButton from 'components/TblButton';
import TblInputs from 'components/TblInputs';

import { convertToLowerCase } from 'utils/index';
import { timezoneList } from 'utils/timezone-utils';

import { ROUTE_AUTH } from 'shared/Auth/constantsRoute';

import { Field, Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import { removeToken } from 'utils';
import * as Yup from 'yup';

import authActions from '../actions';
import InvalidLink from '../components/InvalidLink';
import Layout from '../components/Layout';

function equalTo(ref, msg) {
  return this.test({
    name: 'equalTo',
    exclusive: false,
    // eslint-disable-next-line no-template-curly-in-string
    message: msg || '${path} must be the same as ${reference}',
    params: {
      reference: ref.path,
    },
    test: function (value) {
      return value === this.resolve(ref);
    },
  });
}
Yup.addMethod(Yup.string, 'equalTo', equalTo);

// const getOffset = tz => `(GMT${moment().tz(tz).utcOffset() >= 0 ? `+${moment().tz(tz).utcOffset() / 60}` : `${moment().tz(tz).utcOffset() / 60}`})`;
// const timeZoneList = moment.tz.names().map(tz => `${tz} ${getOffset(tz)}`);

class ForgotPassword extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      email: new URLSearchParams(this.props.location.search).get('email'),
      subdomain: '',
      checkingSubdomain: true,
      invalidLink: false,
      domain: '',
      isBusy: false,
    };
    // this.layoutRef = React.createRef(null);
  }

  static getDerivedStateFromProps(props, state) {
    const { error } = props;
    if (error && !isEmpty(error) && !state.subdomain) {
      return {
        invalidLink: true,
      };
    }
    return null;
  }

  componentDidMount() {
    const { getOrganizationInfo, match } = this.props;
    getOrganizationInfo({
      token: match.params.token,
      isBusy: true,
      error: null,
    });
  }

  componentDidUpdate(prevProps) {
    const { error, organization, installing } = this.props;
    if (
      prevProps.installing &&
      !installing &&
      this.state.password &&
      organization?.id &&
      isEmpty(error)
    ) {
      const payload = {
        identity: convertToLowerCase(this.state.email),
        subdomain: this.state.subdomain,
        password: this.state.password,
      };
      this.props.login({ ...payload, isBusy: true });
    }
    // if (!!error) {
    //   this.scrollTop();
    // }
  }

  checkDomain = (values) => {
    this.setState({ ...values });
    this.props.authCheckDomainStatus({ ...values, isBusy: true });
  };

  onSubmit = (values) => {
    const { setupDomain, match } = this.props;
    this.setState({ password: values.password, subdomain: values.subdomain });
    const newValue = Object.assign(values, {
      timezone: values.timezone.split(' ')[1],
    });
    setupDomain({
      ...newValue,
      token: match.params.token,
      error: null,
      installing: true,
      isBusy: true,
    });
  };

  // Fix The scrollbar appear when slide animation running
  // onExited = () => {
  //   if (this.layoutRef.current) {
  //     this.layoutRef.current.updateScroll();
  //   }
  // }

  /** Auto scroll on top when has error alert, to show error for users. */
  // scrollTop = () => {
  //   if (!!this._scrollRef) {
  //     this._scrollRef.scrollTop = 0;
  //   }
  // }

  render() {
    const { t, isBusy, organization, error, installing, currentUser } =
      this.props;
    const { subdomain } = this.state;
    const domain = process.env.REACT_APP_BASE_URL;
    const { email } = this.state;
    // Show loader instead of login form
    if (!organization && !error) {
      return (
        <Layout t={t}>
          <Skeleton animation='wave' variant='text' height={40} />
          <Skeleton animation='wave' variant='text' height={40} />
          <Skeleton animation='wave' variant='text' height={40} />
        </Layout>
      );
    }
    if (!installing && !isEmpty(currentUser)) {
      let fullUrl = '';
      if (domain && subdomain && domain.indexOf(subdomain) === -1) {
        fullUrl = `${window.location.protocol}//${subdomain}.${domain}:${window.location.port}`;
      }
      // Replace setup subdomain if exiting
      // if (fullUrl.indexOf('setup.') !== -1) {
      //   fullUrl = fullUrl.replace('setup.', '');
      // }
      const accessToken = localStorage.getItem('access_token');
      if (accessToken) {
        // Remove access token
        removeToken();
        window.location =
          `${fullUrl + ROUTE_AUTH.LOGIN }?access_token=${accessToken}`;
      }
    }
    const { invalidLink } = this.state;
    if (invalidLink) {
      return <InvalidLink />;
    }
    const schema = Yup.object().shape({
      password: Yup.string()
        .required(t('password_require_message'))
        .test(
          'len',
          t('invalid_password_message'),
          (val = '') => val.length >= 8 && val.length <= 40
        ),
      confirmPassword: Yup.string()
        .required(t('password_require_message'))
        .oneOf(
          [Yup.ref('password'), null],
          t('invalid_confirm_password_message')
        ),
      // password: Yup.string().min(8).max(40).required(t('password_require_message')),
      // confirmPassword: Yup.string().min(8).max(40).equalTo(Yup.ref('password'), t('invalid_confirm_password_message')),
      timezone: Yup.string().required(t('domain_require_message')),
      organizationName: Yup.string()
        .max(254)
        .required(t('domain_require_message')),
      subdomain: Yup.string()
        .max(63)
        .matches(
          /^(?!-|.*[-]{2,}.*|.*-$)[a-zA-Z0-9-]{1,}$/g,
          t('domain_valid_message')
        )
        .required(t('domain_require_message')),
    });
    return (
      <Layout t={t}>
        <Typography
          variant='bodyLarge'
          color='primary'
          style={{ textAlign: 'center' }}
        >
          {t('set_up_your_organization')}
        </Typography>
        <div className='slogan'>{t('set_up_domain_help')}</div>
        <Slide in={!invalidLink} direction='up'>
          <Box height='calc(100% - 120px)'>
            {/* <PefectScrollbar containerRef={(ref) => {this._scrollRef = ref;}}> */}
            <Fade in={!invalidLink} timeout={1000}>
              <Box className='box-fade'>
                <Formik
                  initialValues={{
                    password: '',
                    confirmPassword: '',
                    subdomain: '',
                    timezone: '',
                    organizationName: organization?.organizationName,
                  }}
                  validationSchema={schema}
                  onSubmit={this.onSubmit}
                  validateOnChange={true}
                >
                  {({ errors, touched, setFieldValue }) => (
                      <Form>
                        {!!error && (
                          <Alert severity='error'>{error.message}</Alert>
                        )}
                        <Typography
                          variant='labelLarge'
                          className='organization-title'
                        >
                          {t('your_organization')}
                        </Typography>
                        <Field
                          name='organizationName'
                          required
                          as={TblInputs}
                          placeholder={t('organization_name')}
                          error={errors.organizationName}
                          errorMessage={
                            errors.organizationName &&
                            touched.organizationName ? (
                              <div>{errors.organizationName}</div>
                            ) : (
                              false
                            )
                          }
                          label={<span>{t('organization_name')}</span>}
                        />
                        <Field
                          name='subdomain'
                          required
                          as={TblInputs}
                          fullWidth={true}
                          label={t('choose_domain')}
                          placeholder={t('choose_domain')}
                          endAdornment={
                            <span className='subdomain-domain-name'>
                              .{domain}
                            </span>
                          }
                          error={errors.subdomain && touched.subdomain}
                          helperText={t('domain_help_message')}
                          errorMessage={
                            errors.subdomain && touched.subdomain ? (
                              <div>{errors.subdomain}</div>
                            ) : (
                              false
                            )
                          }
                        />
                        <Box mb={1} />
                        <Typography
                          component='p'
                          className='help-text domain'
                          variant='bodySmall'
                        >
                          {t('domain_help_message')}
                        </Typography>
                        <Field
                          name='timezone'
                          required
                          as={TblAutocomplete}
                          disableClearable={true}
                          options={timezoneList}
                          // getOptionLabel={(option) => option}
                          label={t('common:time_zone')}
                          error={errors.timezone && touched.timezone}
                          onChange={(e, value) =>
                            setFieldValue('timezone', value)
                          }
                          errorMessage={
                            errors.timezone && touched.timezone
                              ? errors.timezone
                              : false
                          }
                          // renderInput={(params) => <TextField {...params} placeholder='Select' variant='outlined' />}
                        />
                        <Typography
                          variant='labelLarge'
                          color='primary'
                          className='login-info'
                        >
                          {t('your_login_information')}
                        </Typography>
                        <Typography
                          component='p'
                          className='help-text'
                          variant='bodySmall'
                        >
                          {t('your_login_information_message', { email })}
                        </Typography>
                        <Field
                          name='password'
                          required
                          as={TblInputs}
                          placeholder={t('password')}
                          type='password'
                          error={errors.password && touched.password}
                          errorMessage={
                            errors.password && touched.password ? (
                              <div>{errors.password}</div>
                            ) : (
                              false
                            )
                          }
                          label={<span>{t('password')}</span>}
                        />
                        <Field
                          name='confirmPassword'
                          required
                          as={TblInputs}
                          placeholder={t('confirm_password')}
                          type='password'
                          error={
                            errors.confirmPassword && touched.confirmPassword
                          }
                          errorMessage={
                            errors.confirmPassword &&
                            touched.confirmPassword ? (
                              <div>{errors.confirmPassword}</div>
                            ) : (
                              false
                            )
                          } // add touched.confirmPassword to show err only when the confirm password field is touched
                          label={<span>{t('confirm_password')}</span>}
                        />
                        <Box
                          mt={3}
                          style={{ textAlign: 'center' }}
                          className='btn-group'
                        >
                          <TblButton
                            isShowCircularProgress={isBusy}
                            color='primary'
                            variant='contained'
                            type='submit'
                            disabled={isBusy}
                          >
                            {t('continue')}
                          </TblButton>
                        </Box>
                      </Form>
                    )}
                </Formik>
              </Box>
            </Fade>
            {/* </PefectScrollbar> */}
          </Box>
        </Slide>
      </Layout>
    );
  }
}

ForgotPassword.propTypes = {
  t: PropTypes.func,
  currentUser: PropTypes.object,
  history: PropTypes.object,
  location: PropTypes.object,
  authCheckDomainStatus: PropTypes.func,
  isBusy: PropTypes.bool,
  installing: PropTypes.bool,
  subdomainValid: PropTypes.bool,
  error: PropTypes.object,
  subDomainStatus: PropTypes.number,
  forgotPassword: PropTypes.func,
  getOrganizationInfo: PropTypes.func,
  isForgotPasswordSuccessfully: PropTypes.bool,
  classes: PropTypes.object,
  organization: PropTypes.object,
  login: PropTypes.func,
  setupDomain: PropTypes.func,
  match: PropTypes.object,
};

const mapStateToProps = (state) => ({
  error: state.Auth.error,
  isBusy: state.Auth.isBusy,
  currentUser: state.Auth.currentUser,
  installing: state.Auth.installing,
  subDomainStatus: state.Auth.subDomainStatus,
  organization: state.Auth.organization,
});

const mapDispatchToProps = (dispatch) => ({
  getOrganizationInfo: (payload) =>
    dispatch(authActions.getOrganizationInfo(payload)),
  setupDomain: (payload) => dispatch(authActions.setupDomain(payload)),
  login: (payload) => dispatch(authActions.authLogin(payload)),
});

export default withTranslation(['auth', 'common'])(
  connect(mapStateToProps, mapDispatchToProps)(ForgotPassword)
);
