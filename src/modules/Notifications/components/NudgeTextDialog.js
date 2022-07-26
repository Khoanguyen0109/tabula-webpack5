import React, { useEffect, useRef, useState } from 'react';
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

import notificationActions from '../actions';

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

function NudgeTextDialog(props) {
  const classes = useStyles();
  // Wait for info from BA

  // eslint-disable-next-line react/prop-types
  const { onCancel, open, info } = props;

  const { t } = useTranslation('notification', 'common');
  const formikFormRef = useRef(null);
  const dispatch = useDispatch();
  const [confirm, setConfirm] = useState(null);

  const sendNudgeTextSuccess = useSelector(
    (state) => state.Notification.sendNudgeTextSuccess
  );

  useEffect(() => {
    if (sendNudgeTextSuccess) {
      onCancel();
      formikFormRef.current.resetForm();
      dispatch(
        notificationActions.notificationSetState({
          sendNudgeTextSuccess: false,
        })
      );
      setConfirm({ open: true });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sendNudgeTextSuccess]);

  const onCancelDialog = () => {
    onCancel();
    return formikFormRef.current.resetForm();
  };

  const onSubmit = (values) => {
    dispatch(
      notificationActions.sendNudgeText({
        message: values.message,
        notificationId: info?.notificationId
      })
    );
    return onCancelDialog();
  };
  
  const renderMessageConfirmSuccess = () => (
      <div className={classes.contentSuccess}>
        <CheckCircleIcon className={classes.successIcon} />
        <Typography variant='bodyMedium' color='primary'>
          {t('your_nude_have_been_sent')}
        </Typography>
      </div>
    );
  const formSchema = Yup.object().shape({
    message: Yup.string().trim().required(t('common:required_message')),
  });
  return (
    <div>
        <Confirm
        open={confirm?.open}
        width={466}
        title={null}
        okText={t('ok')}
        cancelText={null}
        message={renderMessageConfirmSuccess()}
        onConfirmed={() => setConfirm({ open: false })}
        classesButton={classes.button}
      />
      <Formik
        // enableReinitialize
        validateOnChange={true}
        validateOnBlur={false}
        initialValues={{ message: '' }}
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
              title={t('nudge_text')}
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
                    {t('common:send')}
                  </TblButton>
                </>
              }
            >
              <div className={classes.root}>
                <Box>
                  <Field
                    required
                    name='message'
                    as={TblInputs}
                    label={t('message')}
                    errorMessage={
                        errors.message && (touched.message || submitCount)
                          ? errors.message
                          : false
                      }
                    multiline
                    value={values?.message}
                    rows={5}
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

NudgeTextDialog.propTypes = {
  info: PropTypes.shape({
    notificationId: PropTypes.string
  }),
  onCancel: PropTypes.func,
  open: PropTypes.bool
};

NudgeTextDialog.defaultProps = {};

export default NudgeTextDialog;
