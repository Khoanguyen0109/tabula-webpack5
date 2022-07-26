import React from 'react';
import { withTranslation } from 'react-i18next';
import { Trans } from 'react-i18next';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import FormGroup from '@mui/material/FormGroup';
import Typography from '@mui/material/Typography';

import TblButton from 'components/TblButton';
import TblInputs from 'components/TblInputs';

import { Field, Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import * as Yup from 'yup';

class ResetPasswordForm extends React.PureComponent {
  render() {
    const { t, isBusy, onSubmit, token, email } = this.props;
    const DomainSchema = Yup.object().shape({
      password: Yup.string()
        .required(t('password_require_message'))
        .test('len', t('invalid_password_message'), (val = '') => val.length >= 8 && val.length <= 40),
      confirmPassword: Yup.string()
        .required(t('password_require_message'))
        .oneOf([Yup.ref('password'), null], t('invalid_confirm_password_message')),
    });
    return (
      <Formik
        initialValues={{
          password: '',
          confirmPassword: ''
        }}
        validationSchema={DomainSchema}
        onSubmit={(values) => {
          onSubmit(Object.assign(values, { token }));
        }}
        validateOnChange={true}
        validateOnBlur={false}
      >
        {({ errors, touched}) => (
          <Form className='resetPasswordForm'>
            <Typography variant='labelLarge' color='primary'>{t('reset_your_password')}</Typography>
            <Box mt={1} mb={1}>
              <Typography variant='bodySmall' component='div'>
                <Trans i18nKey='reset_password_message'>
                  Reset password for <Typography color='secondary' component='span' variant='bodySmall'>{{ email }}</Typography>. This will change your password for this domain only.
                </Trans>
              </Typography>
            </Box>
            <FormGroup>
              <Field name='password'
                as={TblInputs}
                placeholder={t('new_password')}
                inputType='password'
                error={
                  errors.password && touched.password
                }
                label={<span>{t('new_password')}</span>}
                errorMessage={errors.password && touched.password ? errors.password : ''}
                required
              />
              <Field name='confirmPassword'
                as={TblInputs}
                inputType='password'
                placeholder={t('confirm_new_password')}
                error={
                  errors.confirmPassword && touched.confirmPassword
                }
                label={<span>{t('confirm_new_password')}</span>}
                required
                errorMessage={errors.confirmPassword && touched.confirmPassword ? errors.confirmPassword : ''}
              />
            </FormGroup>
            <Box style={{ textAlign: 'center' }} className='btn-group' mt={3}>
              <TblButton color='primary' variant='contained' type='submit' disabled={isBusy}>{t('common:done')}</TblButton>
              {isBusy &&
                <CircularProgress size={24} />
              }
            </Box>
          </Form>
        )}
      </Formik>
    );
  }
}

ResetPasswordForm.propTypes = {
  isBusy: PropTypes.bool,
  t: PropTypes.func,
  error: PropTypes.func,
  onSubmit: PropTypes.func,
  token: PropTypes.string,
  email: PropTypes.string
};

export default withTranslation(['auth', 'common', 'error'])(ResetPasswordForm);