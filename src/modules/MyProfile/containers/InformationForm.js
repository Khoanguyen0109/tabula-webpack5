import React from 'react';

import { Box } from '@mui/material';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import makeStyles from '@mui/styles/makeStyles';

import TblButton from 'components/TblButton';
import TblInputs from 'components/TblInputs';

import { Field, Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import * as Yup from 'yup';

const useStyles = makeStyles((theme) => ({
  avatar: {
    minWidth: 80,
    minHeight: 80,
    marginBottom: theme.spacing(2),
  },
}));

const InformationForm = (props) => {
  const classes = useStyles();
  const { t, isBusy, onSubmit, currentUser } = props;
  const handleErrorMessage = () => {
    const { error } = props;
    let errorMessage = '';
    if (error) {
      errorMessage = error.message;
    }
    return errorMessage;
  };
  const errorMessage = handleErrorMessage();
  const formSchema = Yup.object().shape({
    firstName: Yup.string().trim().required(t('error:require_message')),
    lastName: Yup.string().trim().required(t('error:require_message')),
    email: Yup.string(),
    phone: Yup.string(),
  });

  return (
    <>
      <Avatar className={classes.avatar}>
        {currentUser?.firstName ? currentUser.firstName[0] : ''}
      </Avatar>
      <Formik
        initialValues={{
          firstName: currentUser.firstName,
          lastName: currentUser.lastName,
          email: currentUser.email,
          phone: currentUser?.phone?.substring(1) || '',
        }}
        enableReinitialize={true}
        validationSchema={formSchema}
        onSubmit={onSubmit}
      >
        {({ errors, touched, values, setFieldValue }) => (
            <Form className='myProfileInformationForm'>
              {!!errorMessage && <Alert severity='error'>{errorMessage}</Alert>}
              <Field
                name='firstName'
                as={TblInputs}
                placeholder={t('common:first_name')}
                errorMessage={
                  errors.firstName && touched.firstName ? (
                    <div>{errors.firstName}</div>
                  ) : (
                    false
                  )
                }
                label={<span>{t('common:first_name')}</span>}
                required
                inputProps={{
                  maxLength: 40,
                }}
              />
              <Field
                name='lastName'
                as={TblInputs}
                placeholder={t('common:last_name')}
                errorMessage={
                  errors.lastName && touched.lastName ? (
                    <div>{errors.lastName}</div>
                  ) : (
                    false
                  )
                }
                label={<span>{t('common:last_name')}</span>}
                required
                inputProps={{
                  maxLength: 80,
                }}
              />
              <Field
                name='email'
                as={TblInputs}
                placeholder={t('common:email_address')}
                errorMessage={
                  errors.identity && touched.identity ? (
                    <div>{errors.identity}</div>
                  ) : (
                    false
                  )
                }
                label={<span>{t('common:email_address')}</span>}
                disabled
              />
              <Field
                name='phone'
                as={TblInputs}
                // placeholder={'xxx-xxx-xxxx'}
                errorMessage={
                  errors.phone && touched.phone ? (
                    <div>{errors.phone}</div>
                  ) : (
                    false
                  )
                }
                label={<span>{t('common:phone_number')}</span>}
                inputType='phone'
                mask='  '
                value={values.phone || ''}
                country={'us'}
                onChange={(value) => {
                  setFieldValue('phone', value);
                }}
              />
              <Box mb={2}>
                <TblButton
                  isShowCircularProgress={isBusy}
                  size='medium'
                  color='primary'
                  variant='contained'
                  type='submit'
                  disabled={isBusy}
                >
                  {t('common:update')}
                </TblButton>
              </Box>
            </Form>
          )}
      </Formik>
    </>
  );
};

InformationForm.propTypes = {
  domain: PropTypes.string,
  isBusy: PropTypes.bool,
  t: PropTypes.func,
  onSubmit: PropTypes.func,
  error: PropTypes.array,
  currentUser: PropTypes.object,
};

InformationForm.defaultProps = {
  currentUser: {},
};

export default InformationForm;
