/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';

// import isNil from 'lodash/isNil';
import trim from 'lodash/trim';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import TblButton from 'components/TblButton';
import TblCheckBox from 'components/TblCheckBox';
import TblDialog from 'components/TblDialog';
import TblInputs from 'components/TblInputs';

import { useFormik } from 'formik';
import moment from 'moment';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
// import styled from '../../containers/styled';
function ModifyTimeSlot(props) {
  // NOTE: initial states and props
  const [errorMessage, setErrorMessage] = useState('');
  const {
    t,
    visibleDialog,
    toggleDialog,
    isEdit,
    timeSlotDetail,
    saveData,
    createTimeSlotSuccess,
    createTimeSlotFailed,
    updateTimeSlotSuccess,
    updateTimeSlotFailed,
  } = props;

  // NOTE: handle with form formik
  const validationSchema = Yup.object()
    .default(null)
    .nullable()
    .shape({
      name: Yup.string().trim().required(t('common:required_message')),
      timeFrom: Yup.date()
        .nullable()
        .typeError(t('common:invalid_date_format'))
        .required(t('common:required_message'))
        .compareTime(Yup.ref('timeTo'), t('invalidated_time_range'), true)
        .compareTimeDuration(
          Yup.ref('timeTo'),
          t('common:from_less_than_to'),
          false
        ),
      timeTo: Yup.date()
        .nullable()
        .typeError(t('common:invalid_date_format'))
        .required(t('common:required_message'))
        .compareTime(Yup.ref('timeFrom'), t('invalidated_time_range'), false)
        .compareTimeDuration(
          Yup.ref('timeFrom'),
          t('common:to_more_than_from'),
          true
        ),
    });

  const formik = useFormik({
    initialValues: {
      name: timeSlotDetail?.periodName ?? '',
      timeFrom: timeSlotDetail?.timeFrom ?? new Date(),
      timeTo: timeSlotDetail?.timeTo ?? new Date(),
      study: !(timeSlotDetail?.study ?? true),
      studyHall: timeSlotDetail?.studyHall ?? false,
    },
    validationSchema: validationSchema,
    validateOnChange: true,
    validateOnBlur: false,
    onSubmit: (values) => {
      const { name, timeFrom, timeTo, study, studyHall } = values;
      let timeSlot = {
        dailyTemplateId: visibleDialog,
        periodName: trim(name),
        timeFrom: moment(timeFrom).format('hh:mma'),
        timeTo: moment(timeTo).format('hh:mma'),
        study: !!!study,
        studyHall: !!studyHall,
      };
      let payload = {
        timeSlot,
      };
      if (isEdit) {
        payload = {
          ...payload,
          periodId: timeSlotDetail.id,
        };
      }
      saveData(payload);
    },
  });

  const {
    values: { name, timeFrom, timeTo, study, studyHall },
    errors,
    touched,
    isSubmitting,
    setFieldValue,
    setSubmitting,
    resetForm,
    setFieldTouched,
  } = formik;

  // NOTE: handle react lifecycle

  useEffect(() => {
    if (createTimeSlotSuccess || updateTimeSlotSuccess) {
      toggleDialog(false);
      setSubmitting(false);
      resetForm();
      setErrorMessage('');
    }
  }, [createTimeSlotSuccess, updateTimeSlotSuccess]);

  useEffect(() => {
    if (createTimeSlotFailed?.subcode || updateTimeSlotFailed?.subcode) {
      const subcode =
        createTimeSlotFailed?.subcode || updateTimeSlotFailed?.subcode;
      switch (subcode) {
        case 1:
          setErrorMessage(
            t('error:restriction_of_school_year', {
              objectName: "time slot's time",
            })
          );
          break;
        case 2:
          setErrorMessage(
            t('error:restriction_of_school_year', {
              objectName: "time slot's type",
            })
          );
          break;
        case 3:
          setErrorMessage(t('common:this_name_already_exists'));
          break;
        case 4:
          setErrorMessage(t('common:conflict_time_slot'));
          break;
        default:
          setErrorMessage(t('error:general_error'));
          break;
      }
      // setFieldError('name', t('common:this_name_already_exists'));
      setSubmitting(false);
    }
  }, [createTimeSlotFailed, updateTimeSlotFailed]);

  return (
    <div>
      {!!visibleDialog && (
        <TblDialog
          open={!!visibleDialog}
          title={isEdit ? t('edit_time_slot') : t('new_time_slot')}
          size='large'
          fullWidth={true}
          footer={
            <>
              <TblButton
                variant='outlined'
                color='primary'
                onClick={() => {
                  toggleDialog(false);
                  formik.handleReset();
                }}
              >
                {t('common:cancel')}
              </TblButton>
              <TblButton
                variant='contained'
                color='primary'
                type='submit'
                onClick={formik.handleSubmit}
                disabled={isSubmitting}
                isShowCircularProgress={isSubmitting}
              >
                {isEdit ? t('common:save') : t('common:create')}
              </TblButton>
            </>
          }
          onClose={toggleDialog}
        >
          <form onSubmit={formik.handleSubmit}>
            {errorMessage && (
              <Grid container spacing={0}>
                <Grid item xs={12}>
                  <Alert severity='error'>{errorMessage}</Alert>
                </Grid>
              </Grid>
            )}
            <Grid container spacing={0}>
              <Grid item xs={12}>
                <Box mb={0}>
                  <TblInputs
                    name='name'
                    required
                    label={t('common:name')}
                    type='text'
                    error={!!(errors.name && (touched.name || isSubmitting))}
                    errorMessage={
                      !!(errors.name && (touched.name || isSubmitting)) ? (
                        <div>{errors.name}</div>
                      ) : (
                        false
                      )
                    }
                    inputProps={{ maxLength: 254 }}
                    value={name}
                    onChange={formik.handleChange}
                  />
                </Box>
              </Grid>
            </Grid>
            <Grid container spacing={0}>
              <Grid item xs={6}>
                <Box mr={1.5}>
                  <TblInputs
                    name='timeFrom'
                    required
                    inputType='time'
                    label={t('from')}
                    error={
                      !!(errors.timeFrom && (touched.timeFrom || isSubmitting))
                    }
                    errorMessage={
                      !!(
                        errors.timeFrom &&
                        (touched.timeFrom || isSubmitting)
                      ) ? (
                        <div>{errors.timeFrom}</div>
                      ) : (
                        false
                      )
                    }
                    onChange={(value) => {
                      setFieldValue('timeFrom', value);
                      setFieldTouched('timeFrom', true);
                    }}
                    value={timeFrom}
                    // onBlur={formik.handleBlur}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box ml={1.5}>
                  <TblInputs
                    name='timeTo'
                    required
                    inputType='time'
                    label={t('to')}
                    error={
                      !!(errors.timeTo && (touched.timeTo || isSubmitting))
                    }
                    errorMessage={
                      !!(errors.timeTo && (touched.timeTo || isSubmitting)) ? (
                        <div>{errors.timeTo}</div>
                      ) : (
                        false
                      )
                    }
                    onChange={(value) => {
                      setFieldValue('timeTo', value);
                      setFieldTouched('timeTo', true);
                    }}
                    value={timeTo}
                  />
                </Box>
              </Grid>
            </Grid>
            <Grid container spacing={0}>
              <Grid item xs={3}>
                <Box display='flex' alignItems='center' ml={-1}>
                  <Box>
                    <TblCheckBox
                      checked={study}
                      onChange={(e) => {
                        const { checked } = e.target;
                        if (checked) {
                          setFieldValue('studyHall', false);
                        }
                        setFieldValue('study', checked);
                      }}
                    />
                  </Box>
                  <Box style={{ fontSize: '15px' }}>
                    {t('schoolYear:break')}
                  </Box>
                </Box>
              </Grid>
              <Grid item xs={3}>
                <Box display='flex' alignItems='center' ml={-1}>
                  <Box>
                    <TblCheckBox
                      checked={studyHall}
                      onChange={(e) => {
                        const { checked } = e.target;
                        if (checked) {
                          setFieldValue('study', false);
                        }
                        setFieldValue('studyHall', checked);
                      }}
                    />
                  </Box>
                  <Box style={{ fontSize: '15px' }}>
                    {t('schoolYear:study_hall')}
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </form>
        </TblDialog>
      )}
    </div>
  );
}

ModifyTimeSlot.propTypes = {
  t: PropTypes.func,
  history: PropTypes.object,
  authContext: PropTypes.object,
  visibleDialog: PropTypes.bool,
  isEdit: PropTypes.bool,
  toggleDialog: PropTypes.func,
  timeSlotDetail: PropTypes.object,
  saveData: PropTypes.func,

  createTimeSlotSuccess: PropTypes.bool,
  createTimeSlotFailed: PropTypes.object,
  updateTimeSlotSuccess: PropTypes.bool,
  updateTimeSlotFailed: PropTypes.object,
};

export default ModifyTimeSlot;
