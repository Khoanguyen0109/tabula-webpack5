import React from 'react';

import Alert from '@mui/material/Alert';

import TblButton from 'components/TblButton';
import TblInputs from 'components/TblInputs';

import { Field, Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import * as Yup from 'yup';

const PasswordForm = (props) => {
  const handleErrorMessage = () => {
    const { error } = props;
    let errorMessage = '';
    if (error) {
      errorMessage = error.message;
    }
    return errorMessage;
  };

  const validateConfirmPassword = (value, formValues) => {
    let error;
    if (value !== formValues.newPassword) {
      error = props.t('auth:invalid_confirm_password_message');
    }
    return error;
  };

  const { t, isBusy, onSubmit } = props;
  const errorMessage = handleErrorMessage();
  const formSchema = Yup.object().shape({
    oldPassword: Yup.string()
      .min(8, t('auth:invalid_password_message'))
      .max(40, t('auth:invalid_password_message'))
      .required(t('auth:password_require_message')),
    newPassword: Yup.string()
      .min(8, t('auth:invalid_password_message'))
      .max(40, t('auth:invalid_password_message'))
      .required(t('auth:password_require_message')),
    confirmPassword: Yup.string()
      .min(8, t('auth:invalid_password_message'))
      .max(40, t('auth:invalid_password_message'))
      .required(t('auth:password_require_message')),
  });

  return (
    <Formik
      initialValues={{
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      }}
      validateOnBlur={false}
      validationSchema={formSchema}
      onSubmit={(values) => {
        onSubmit(values);
      }}
    >
      {({ errors, touched, values }) => (
        <Form className='myProfilePasswordForm'>
          {!!errorMessage && <Alert severity='error'>{errorMessage}</Alert>}
          <Field
            name='oldPassword'
            as={TblInputs}
            placeholder={t('current_password')}
            errorMessage={
              errors.oldPassword && touched.oldPassword ? (
                <div>{errors.oldPassword}</div>
              ) : (
                false
              )
            }
            label={<span>{t('current_password')}</span>}
            required
            type='password'
          />
          <Field
            name='newPassword'
            as={TblInputs}
            placeholder={t('new_password')}
            errorMessage={
              errors.newPassword && touched.newPassword ? (
                <div>{errors.newPassword}</div>
              ) : (
                false
              )
            }
            label={<span>{t('new_password')}</span>}
            required
            type='password'
          />
          <Field
            name='confirmPassword'
            as={TblInputs}
            placeholder={t('confirm_new_password')}
            errorMessage={
              errors.confirmPassword && touched.confirmPassword ? (
                <div>{errors.confirmPassword}</div>
              ) : (
                false
              )
            }
            label={<span>{t('confirm_new_password')}</span>}
            required
            type='password'
            validate={(passwordValue) =>
              validateConfirmPassword(passwordValue, values)
            }
          />

          <div className='btn-group'>
            <TblButton
              isShowCircularProgress={isBusy}
              size='medium'
              color='primary'
              variant='contained'
              type='submit'
              disabled={isBusy}
            >
              {t('common:change')}
            </TblButton>
          </div>
        </Form>
      )}
    </Formik>
  );
};

PasswordForm.propTypes = {
  domain: PropTypes.string,
  isBusy: PropTypes.bool,
  t: PropTypes.func,
  onSubmit: PropTypes.func,
  error: PropTypes.array,
};

export default PasswordForm;
