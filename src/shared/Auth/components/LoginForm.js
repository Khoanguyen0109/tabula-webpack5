import React from 'react';

import isEmpty from 'lodash/isEmpty';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Alert from '@mui/material/Alert';
// More detail https://github.com/jquense/yup
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import FormGroup from '@mui/material/FormGroup';
import InputAdornment from '@mui/material/InputAdornment';
import Typography from '@mui/material/Typography';

import TblButton from 'components/TblButton';
import TblCheckBox from 'components/TblCheckBox/CheckBoxWithLabel';
import TblIconButton from 'components/TblIconButton';
import TblInputs from 'components/TblInputs';

import { Field, Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import * as Yup from 'yup';

import { ROUTE_AUTH } from '../constantsRoute';

class LoginFrom extends React.PureComponent {
  state = {
    passwordType: 1
  }

  // componentDidUpdate(prevProps) {
  //   const { error, t } = this.props;
  //   console.log(error);
  //   if (error && error !== prevProps.error) {
  //     if (error) {
  //       const errorMessage = error.subcode
  //         ? this.checkSubcode(error.subcode)
  //         : t('incorrect_email_or_password');
  //       this.setState({ errorMessage: errorMessage });
  //     }
  //   } else {
  //     this.setState({errorMessage: ''});
  //   }
  // }

  checkSubcode = (subcode) => {
    const { t } = this.props;
    switch (subcode) {
      case -1:
        return t('changed_password_error');
      case -2:
        return t('suspended_error');
      case -3:
        return t('changed_email_error');
      case 0:
        return t('incorrect_email_or_password');
      case 1:
        return t('error:domain_suspended');
      // case 2:
      //   return t('suspended_error');
      default:
        return t('incorrect_email_or_password');
    }
  };

  errorMessage = () => {
    const { error, t } = this.props;
    let errorMessage = '';
    if (!isEmpty(error)) {
      errorMessage = error.subcode
        ? this.checkSubcode(error.subcode)
        : t('incorrect_email_or_password');

    }
    return errorMessage;
  }

  render() {

    const { t, isBusy, onSubmit } = this.props;
    const { passwordType } = this.state;
    const errorMessage = this.errorMessage();
    const DomainSchema = Yup.object().shape({
      identity: Yup.string()
        .email(t('common:email_valid_message'))
        .required(t('email_require_message')),
      password: Yup.string().required(t('password_require_message')),
      remember: Yup.boolean()
    });
    return (
      <Formik
        initialValues={{
          identity: '',
          password: '',
          remember: true
        }}
        validationSchema={DomainSchema}
        onSubmit={(values) => {
          // console.log(values);
          onSubmit(values);
        }}
        validateOnChange={true}
        validateOnBlur={false}
      >
        {({ errors, touched, values }) => (
            <Form className='loginForm'>
              {!!errorMessage &&
                <Alert severity='error'>
                  {errorMessage}
                </Alert>
              }
              <FormGroup>
                <Field name='identity'
                  required
                  as={TblInputs}
                  type='email'
                  placeholder={t('email')}
                  error={errors.identity && touched.identity}
                  errorMessage={errors.identity && touched.identity ? <div>{errors.identity}</div> : false}
                  label={<span>{t('email')}</span>}
                />
                <Field name='password'
                  required
                  as={TblInputs}
                  placeholder={t('password')}
                  type={passwordType ? 'password' : 'text'}
                  error={errors.password && touched.password}
                  errorMessage={errors.password && touched.password ? <div>{errors.password}</div> : false}
                  endAdornment={
                    <InputAdornment position='end'>
                      <TblIconButton
                        aria-label='toggle password visibility'
                        onClick={() => { this.setState({ passwordType: !passwordType }); }}
                        size='large'>
                        {passwordType ? <VisibilityOff /> : <Visibility />}
                      </TblIconButton>
                    </InputAdornment>
                  }
                  label={<span>{t('password')}</span>}
                />
                <Field
                  name='remember'
                  as={TblCheckBox}
                  checked={values.remember}
                  label={t('remember_me')}
                />
              </FormGroup>
              <Box style={{ textAlign: 'center' }} className='btn-group' mt={1}>
                <TblButton color='primary' variant='contained' type='submit' disabled={isBusy}>{t('signin')}</TblButton>
                {isBusy &&
                  <CircularProgress size={24} />
                }
              </Box>
              <Box mt={2} display='flex' justifyContent='center'>
                <Typography component='a' variant='bodyMedium' color='primary' align='center' href={ROUTE_AUTH.FORGOT_PASSWORD}>{t('forgot_password')}</Typography>
              </Box>
            </Form>
          )}
      </Formik>
    );
  }
}
LoginFrom.propTypes = {
  domain: PropTypes.string,
  isBusy: PropTypes.bool,
  t: PropTypes.func,
  errorMessage: PropTypes.string,
  onSubmit: PropTypes.func,
  error: PropTypes.object
};

export default LoginFrom;