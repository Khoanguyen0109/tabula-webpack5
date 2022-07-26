import React from 'react';
import { withTranslation } from 'react-i18next';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import FormGroup from '@mui/material/FormGroup';
import Typography from '@mui/material/Typography';

import TblButton from 'components/TblButton';
import TblInputs from 'components/TblInputs';

import { Field, Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import * as Yup from 'yup';

class ForgotPasswordForm extends React.PureComponent {
  state = {
    errorMessage: null,
  }

  componentDidUpdate(prevProps) {
    const { error, t } = this.props;
    if (error && error?.message && error !== prevProps.error) {
      const errorMessage = t('error:forgot_password');
      this.setState({ errorMessage });
    }
  }

  render() {
    const { t, isBusy, onSubmit } = this.props;
    const { errorMessage } = this.state;
    const DomainSchema = Yup.object().shape({
      email: Yup.string()
        .email(t('common:email_valid_message'))
        .required(t('email_require_message'))
    });
    return (
      <Formik
        initialValues={{
          email: '',
        }}
        validationSchema={DomainSchema}
        onSubmit={(values) => {
          onSubmit(values);
        }}
        validateOnChange={true}
        validateOnBlur={false}
      >
        {({ errors, touched }) => (
          <Form className='forgotPasswordForm'>
            <Typography variant='labelLarge' color='primary'>{t('reset_your_password')}</Typography>
            <Box mt={1} mb={1}>
              <Typography component='div' variant='bodySmall'>{t('enter_your_email_address')}</Typography>
            </Box>
            {!!errorMessage &&
              <Alert severity='error'>
                {errorMessage}
              </Alert>
            }
            <FormGroup>
              <Field name='email'
                as={TblInputs}
                placeholder={t('email')}
                error={
                  errors.email && touched.email
                }
                label={<span>{t('email')}</span>}
                errorMessage={errors.email && touched.email ? errors.email : ''}
              />
            </FormGroup>
            <Box style={{ textAlign: 'center' }} className='btn-group' mt={1}>
              <TblButton color='primary' variant='contained' type='submit' disabled={isBusy}>{t('get_reset_link')}</TblButton>
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

ForgotPasswordForm.propTypes = {
  isBusy: PropTypes.bool,
  t: PropTypes.func,
  error: PropTypes.func,
  classes: PropTypes.object,
  onSubmit: PropTypes.func,
  theme: PropTypes.object
};

export default withTranslation(['auth', 'common', 'error'])(ForgotPasswordForm);