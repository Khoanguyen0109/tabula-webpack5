import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';

import TblButton from 'components/TblButton';
import Confirm from 'components/TblConfirmDialog';
import TblDialog from 'components/TblDialog';
import TblInputs from 'components/TblInputs';

import { Field, Formik } from 'formik';
import PropTypes from 'prop-types';
import * as Yup from 'yup';

import contactUsActions from '../actions';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiDialog-paper': {
      minWidth: 560,
    },
  },
  contentSuccess: {
    textAlign: 'center',
  },
  successIcon: {
    fontSize: 52,
    color: theme.mainColors.green[0],
  },
}));

function ContactUs(props) {
  const classes = useStyles();

  const { onCancel, open } = props;

  const { t } = useTranslation(['contactUs', 'common']);
  const formikFormRef = useRef(null);
  const dispatch = useDispatch();
  const [confirm, setConfirm] = useState(null);

  const sendFeedbackSuccess = useSelector(
    (state) => state.ContactUs.sendFeedbackSuccess
  );

  useEffect(() => {
    if (sendFeedbackSuccess) {
      onCancel();
      formikFormRef.current.resetForm();
      dispatch(
        contactUsActions.contactUsSetState({
          sendFeedbackSuccess: false,
        })
      );
      setConfirm({ open: true });
    }
  }, [dispatch, onCancel, sendFeedbackSuccess]);

  const onCancelDialog = () => {
    onCancel();
    formikFormRef.current.resetForm();
  };

  const onSubmit = useCallback(
    (values) =>
      dispatch(
        contactUsActions.sendFeedback({
          data: values,
        })
      ),
    [dispatch]
  );

  const renderMessageConfirmSuccess = () => (
      <div className={classes.contentSuccess}>
        <CheckCircleIcon className={classes.successIcon} />
        <Typography variant='headingSmall' color='primary'>
          {t('contact_form_submitted')}
        </Typography>
        <Typography variant='bodyMedium' color='primary'>
          {t('thank_for_send_feedback')}
        </Typography>
      </div>
    );
  // const onConfirmed = () => {};
  const formSchema = Yup.object().shape({
    subject: Yup.string().trim().required(t('common:required_message')),
  });
  return (
    <div>
      <Confirm
        open={confirm?.open}
        width={466}
        hasCloseIcon={false}
        // open={true}
        title={null}
        okText={t('common:ok')}
        cancelText={null}
        message={renderMessageConfirmSuccess()}
        onConfirmed={() => setConfirm({ open: false })}
        // onCancel={onCancel}
        classesButton={classes.button}
      />
      <Formik
        // enableReinitialize
        validateOnChange={true}
        validateOnBlur={false}
        initialValues={{ subject: '', message: '' }}
        validationSchema={formSchema}
        innerRef={formikFormRef}
        onSubmit={(values) => onSubmit(values)}
      >
        {({
          values,
          setFieldValue,
          errors,
          handleSubmit,
          setFieldTouched,
          touched,
          submitCount,
        }) => (
            <TblDialog
              open={open}
              title={t('contact_us')}
              className={classes.root}
              footer={
                <>
                  <TblButton
                    variant='outlined'
                    color='primary'
                    onClick={onCancelDialog}
                  >
                    {t('common:discard')}
                  </TblButton>
                  <TblButton
                    variant='contained'
                    color='primary'
                    onClick={handleSubmit}
                  >
                    {t('common:submit')}
                  </TblButton>
                </>
              }
            >
              <div className={classes.root}>
                <Box>
                  <Field
                    name='subject'
                    as={TblInputs}
                    placeholder={t('enter_subject')}
                    errorMessage={
                      errors.subject && (touched.subject || submitCount)
                        ? errors.subject
                        : false
                    }
                    label={t('subject')}
                    value={values?.subject}
                    onChange={(e) => {
                      setFieldValue('subject', e.target.value);
                      setFieldTouched('subject', true);
                    }}
                    inputProps={{ maxLength: 256 }}
                    required
                  />
                </Box>

                <Box>
                  <Field
                    name='message'
                    as={TblInputs}
                    label={t('message')}
                    multiline
                    value={values?.message}
                    rows={10}
                    onChange={(e) => {
                      setFieldValue('message', e.target.value);
                      setFieldTouched('message', true);
                    }}
                    inputProps={{ maxLength: 1000 }}
                    placeholder={t('common:enter_message')}
                  />
                </Box>
              </div>
            </TblDialog>
          )}
      </Formik>
    </div>
  );
}

ContactUs.propTypes = {
  onCancel: PropTypes.func,
  open: PropTypes.bool,
};

ContactUs.defaultProps = {};

export default ContactUs;
