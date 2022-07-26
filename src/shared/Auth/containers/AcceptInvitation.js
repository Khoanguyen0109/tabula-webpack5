import React, { PureComponent } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import isEmpty from 'lodash/isEmpty';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Fade from '@mui/material/Fade';
import FormGroup from '@mui/material/FormGroup';
import Skeleton from '@mui/material/Skeleton';
import Slide from '@mui/material/Slide';
import Typography from '@mui/material/Typography';

import TblButton from 'components/TblButton';
import TblInputs from 'components/TblInputs';

import { convertToLowerCase } from 'utils/index';

import { AuthDataContext } from 'AppRoute/AuthProvider';
import { Field, Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import * as Yup from 'yup';

import authActions from '../actions';
import InvalidLink from '../components/InvalidLink';
import Layout from '../components/Layout';
import { ROUTE_AUTH } from '../constantsRoute';

// function equalTo(ref, msg) {
// 	return this.test({
// 		name: 'equalTo',
// 		exclusive: false,
//     // eslint-disable-next-line no-template-curly-in-string
//     message: msg || '${path} must be the same as ${reference}',
// 		params: {
// 			reference: ref.path
// 		},
// 		test: function(value) {
//       return value === this.resolve(ref);
// 		}
// 	});
// };
// Yup.addMethod(Yup.string, 'equalTo', equalTo);

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
  }

  static contextType = AuthDataContext;

  static getDerivedStateFromProps(props) {
    const { error } = props;
    if (error && !isEmpty(error)) {
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
    const { error, organization, accepting } = this.props;
    if (
      prevProps.accepting &&
      !accepting &&
      this.state.password &&
      organization?.id &&
      isEmpty(error)
    ) {
      this.context.resetData();
      const payload = {
        identity: convertToLowerCase(this.state.email),
        password: this.state.password,
      };
      this.props.login({
        ...payload,
        subdomain: this.props.organization.subdomain,
        isBusy: true,
      });
    }
    if (prevProps.isBusy && this.state.password && !this.props.accepting) {
      this.props.history.push(ROUTE_AUTH.LOGIN);
    }
  }

  checkDomain = (values) => {
    this.setState({ ...values });
    this.props.authCheckDomainStatus({ ...values, isBusy: true });
  };

  onSubmit = (values) => {
    const { acceptInvitationDomain, match } = this.props;
    this.setState({ password: values.password });
    acceptInvitationDomain({
      ...values,
      token: match.params.token,
      error: null,
      accepting: true,
    });
  };

  render() {
    const { t, isBusy, organization, error } = this.props;
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
    });
    return (
      <Layout t={t}>
        <Typography
          variant='headingSmall'
          color='primary'
          style={{ textAlign: 'center' }}
        >
          {t('set_up_your_account')}
        </Typography>
        <div className='slogan'>
          {t('email_to_login_information', { email })}
        </div>
        <Slide in={!invalidLink} direction='up'>
          <Box>
            <Fade in={!invalidLink} timeout={1000}>
              <Box className='box-fade'>
                <Formik
                  initialValues={{
                    password: '',
                    confirmPassword: '',
                  }}
                  validationSchema={schema}
                  onSubmit={this.onSubmit}
                  validateOnChange={true}
                  validateOnBlur={false}
                >
                  {({ errors, touched }) => (
                    <Form>
                      <FormGroup>
                        <Field
                          name='password'
                          required
                          as={TblInputs}
                          placeholder={t('password')}
                          inputType='password'
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
                          inputType='password'
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
                          }
                          label={<span>{t('confirm_password')}</span>}
                        />
                      </FormGroup>
                      <Box
                        style={{ textAlign: 'center' }}
                        className='btn-group'
                        mt={1}
                      >
                        <TblButton
                          color='primary'
                          variant='contained'
                          type='submit'
                          disabled={isBusy}
                        >
                          {t('continue')}
                        </TblButton>
                        {isBusy && <CircularProgress size={24} />}
                      </Box>
                    </Form>
                  )}
                </Formik>
              </Box>
            </Fade>
          </Box>
        </Slide>
      </Layout>
    );
  }
}

ForgotPassword.propTypes = {
  t: PropTypes.func,
  history: PropTypes.object,
  location: PropTypes.object,
  authCheckDomainStatus: PropTypes.func,
  isBusy: PropTypes.bool,
  accepting: PropTypes.bool,
  subdomainValid: PropTypes.bool,
  error: PropTypes.object,
  subDomainStatus: PropTypes.number,
  forgotPassword: PropTypes.func,
  getOrganizationInfo: PropTypes.func,
  isForgotPasswordSuccessfully: PropTypes.bool,
  classes: PropTypes.object,
  organization: PropTypes.object,
  login: PropTypes.func,
  acceptInvitationDomain: PropTypes.func,
  match: PropTypes.object,
};

const mapStateToProps = (state) => ({
  error: state.Auth.error,
  isBusy: state.Auth.isBusy,
  accepting: state.Auth.accepting,
  subDomainStatus: state.Auth.subDomainStatus,
  organization: state.Auth.organization,
});

const mapDispatchToProps = (dispatch) => ({
  getOrganizationInfo: (payload) =>
    dispatch(authActions.getOrganizationInfo(payload)),
  acceptInvitationDomain: (payload) =>
    dispatch(authActions.acceptInvitationDomain(payload)),
  login: (payload) => dispatch(authActions.authLogin(payload)),
});

export default withTranslation(['auth', 'common'])(
  connect(mapStateToProps, mapDispatchToProps)(ForgotPassword)
);
