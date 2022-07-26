import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import isNil from 'lodash/isNil';
import trim from 'lodash/trim';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import makeStyles from '@mui/styles/makeStyles';

import Confirm from 'components/TblConfirmDialog';
import TblInputs from 'components/TblInputs';

import { useFormik } from 'formik';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import * as Yup from 'yup';

import schoolYearActions from '../actions';

const useStyles = makeStyles(() => ({
  root: {},
  button: {
    '& .MuiButton-label': {
      textTransform: 'none',
    },
  },
}));

function SchoolYearInformation(props) {
  // NOTE: get contexts
  const { t } = useTranslation(['schoolYear', 'common', 'error']);
  const { enqueueSnackbar } = useSnackbar();

  // NOTE: connect redux
  const dispatch = useDispatch();
  const {
    schoolYearDetail,
    updateSchoolYearInformationSuccess,
    updateSchoolYearInformationFailed,
    subcodeErrorUpdateSchoolYear,
  } = useSelector((state) => state.SchoolYear);
  const schoolYear = useSelector((state) => state.SchoolYear.schoolYear);
  // NOTE: styles
  const classes = useStyles();

  // NOTE: initial states
  const [showGeneralError, setShowGeneralError] = useState(false);
  const [askConfirm, setConfirm] = useState(null);
  // NOTE: get props
  const { authContext } = props;
  const {
    organizationId,
    organization: { timezone },
  } = authContext.currentUser;
  const schoolYearId = props.location.pathname.split('/')[2];
  const {
    name: nameValue,
    firstDay: firstDayValue,
    lastDay: lastDayValue,
  } = schoolYearDetail;
  // NOTE: handle with form formik
  const validationSchema = Yup.object()
    .nullable()
    .shape({
      name: Yup.string().trim().required(t('common:required_message')),
      firstDay: Yup.date()
        .nullable()
        .typeError(t('common:invalid_date_format'))
        .required(t('common:required_message'))
        .compareDate(
          moment(lastDayValue),
          t('error:error_first_less_last', {
            first: t('first_day'),
            last: t('last_day'),
          }),
          'isBefore'
        )
        .compareDateDuration(
          moment(lastDayValue),
          t('error:error_school_year_span', { count: 30 }),
          30
        ),
      lastDay: Yup.date()
        .nullable()
        .typeError(t('common:invalid_date_format'))
        .required(t('common:required_message'))
        .compareDate(
          moment(firstDayValue),
          t('error:error_last_greater_first', {
            first: t('first_day'),
            last: t('last_day'),
          }),
          'isAfter'
        )
        .compareDateDuration(
          moment(firstDayValue),
          t('error:error_school_year_span', { count: 30 }),
          30
        ),
    });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: nameValue,
      firstDay: firstDayValue,
      lastDay: lastDayValue,
    },
    validationSchema: validationSchema,
    validateOnChange: true,
    validateOnBlur: false,
  });

  const {
    values: { name, firstDay, lastDay },
    touched,
    errors,
    setFieldValue,
    setFieldTouched,
    resetForm,
    setFieldError,
  } = formik;

  // NOTE: common functions
  const showNotification = useCallback(() =>
    enqueueSnackbar(t('common:change_saved'), {
      variant: 'success',
    })
  );

  const getSchoolYearInformation = useCallback(() => {
    dispatch(
      schoolYearActions.getSchoolYearInformation({
        orgId: organizationId,
        schoolYearId,
        urlParams: {
          timezone,
        },
      })
    );
  }, [dispatch, organizationId, schoolYearId, timezone]);

  const updateSchoolYearInformation = useCallback(
    (payload) => {
      dispatch(
        schoolYearActions.updateSchoolYearInformation({
          orgId: organizationId,
          schoolYearId,
          schoolYear: payload,
          urlParams: {
            timezone,
          },
        })
      );
    },
    [dispatch, organizationId, schoolYearId, timezone]
  );

  const handleSave = (fieldName, fieldValue, fieldType = 'text') => {
    const value =
      fieldType === 'date'
        ? moment(fieldValue).startOf('day').format()
        : trim(fieldValue);
    if (!!!errors[fieldName] && touched[fieldName]) {
      if (value === schoolYearDetail[fieldName]) {
        showNotification();
      } else {
        updateSchoolYearInformation({
          [`${fieldName}`]: value,
        });
      }
    }
  };

  const handleCancel = (fieldName) => {
    const fieldValue = schoolYearDetail[fieldName];
    setFieldValue(`${fieldName}`, fieldValue);
  };

  // NOTE: handle react lifecycle
  useEffect(() => {
    getSchoolYearInformation();
  }, []);

  useEffect(() => {
    if (isEmpty(errors)) {
      resetForm();
    }
  }, [schoolYearDetail]);

  useEffect(() => {
    if (updateSchoolYearInformationSuccess) {
      showNotification();
      setShowGeneralError(false);
      dispatch(
        schoolYearActions.schoolYearSetState({
          updateSchoolYearInformationSuccess: false,
        })
      );
    }
  }, [dispatch, showNotification, updateSchoolYearInformationSuccess]);

  useEffect(() => {
    if (!isNil(updateSchoolYearInformationFailed)) {
      dispatch(
        schoolYearActions.schoolYearSetState({
          updateSchoolYearInformationFailed: null,
        })
      );
      if (
        [409, 7].includes(updateSchoolYearInformationFailed?.errors?.subcode)
      ) {
        switch (updateSchoolYearInformationFailed.errors.subcode) {
          case 409:
            setFieldError('name', t('common:this_name_already_exists'));
            break;
          case 7:
            const keyArray = Object.keys(schoolYear);
            if (keyArray.length > 0) {
              setFieldError(
                keyArray[0],
                t('error:restriction_of_school_year', {
                  objectName:
                    keyArray[0] === 'firstDay'
                      ? t('first_date')
                      : t('last_date'),
                })
              );
            }
            break;
          default:
            break;
        }
      } else {
        setShowGeneralError(true);
      }
    }
  }, [dispatch, updateSchoolYearInformationFailed, schoolYear]);

  const renderErrorUpdateFailed = () => {
    switch (subcodeErrorUpdateSchoolYear) {
      case 1:
        return t('update_school_year_subcode_1');
      case 2:
        return t('update_school_year_subcode_2');
      case 3:
        return t('update_school_year_subcode_3');
      case 5:
        return t('update_school_year_subcode_5');
      case 6:
      case 8:
        return t('update_school_year_subcode_6');
      default:
        return t('error:general_error');
    }
  };

  const onCancel = () => {
    setConfirm(null);
    handleCancel(askConfirm?.fieldName);
  };
  const askConfirmation = (fieldName, fieldValue, fieldType = 'text') => {
    if (!isEqual(schoolYearDetail[fieldName], fieldValue)) {
      setConfirm({
        isOpen: true,
        fieldName,
        callback: () => handleSave(fieldName, fieldValue, fieldType),
      });
    }
  };
  const onConfirmed = () => {
    askConfirm.callback && askConfirm.callback();
    onCancel();
  };

  return (
    <div className={classes.root}>
      {showGeneralError && (
        <Grid xs={12} sm={8}>
          <Alert severity='error'>{renderErrorUpdateFailed()}</Alert>
        </Grid>
      )}
      <Confirm
        open={askConfirm?.isOpen}
        title={t('common:warning')}
        okText={t('common:continue_to_save')}
        message={t('school_year_edit_duration_confirm')}
        onConfirmed={onConfirmed}
        onCancel={onCancel}
        classesButton={classes.button}
      />
      <form>
        <Grid container spacing={0}>
          <Grid item xs={12} sm={8}>
            <TblInputs
              name='name'
              singleSave
              required
              label={t('common:name')}
              type='text'
              error={!!errors.name}
              errorMessage={errors.name ? <div>{errors.name}</div> : false}
              inputProps={{ maxLength: 254 }}
              value={name}
              onChange={(e) => {
                setFieldValue('name', e.target.value);
                setFieldTouched('name', true);
              }}
              onAbort={() => handleCancel('name')}
              onSave={() => handleSave('name', name)}
            />
          </Grid>
        </Grid>
        <Grid container spacing={0}>
          <Grid item xs={12} sm={4}>
            <Box mr={1.5}>
              <TblInputs
                name='firstDay'
                singleSave
                required
                inputType='date'
                label={t('first_date')}
                error={!!(errors.firstDay && touched.firstDay)}
                errorMessage={
                  errors.firstDay && touched.firstDay ? (
                    <div>{errors.firstDay}</div>
                  ) : (
                    false
                  )
                }
                onChange={(value) => {
                  setFieldValue('firstDay', value);
                  setFieldTouched('firstDay', true);
                }}
                value={firstDay}
                onAbort={() => handleCancel('firstDay', setFieldValue)}
                onSave={() => askConfirmation('firstDay', firstDay, 'date')}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box ml={1.5}>
              <TblInputs
                name='lastDay'
                singleSave
                required
                inputType='date'
                label={t('last_date')}
                error={!!(errors.lastDay && touched.lastDay)}
                errorMessage={
                  errors.lastDay && touched.lastDay ? (
                    <div>{errors.lastDay}</div>
                  ) : (
                    false
                  )
                }
                onChange={(value) => {
                  setFieldValue('lastDay', value);
                  setFieldTouched('lastDay', true);
                }}
                value={lastDay}
                onAbort={() => handleCancel('lastDay', setFieldValue)}
                onSave={() => askConfirmation('lastDay', lastDay, 'date')}
              />
            </Box>
          </Grid>
        </Grid>
      </form>
    </div>
  );
}

SchoolYearInformation.propTypes = {
  location: PropTypes.object,
  authContext: PropTypes.object,
};

export default SchoolYearInformation;
