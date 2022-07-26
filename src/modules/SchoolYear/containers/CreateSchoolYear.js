import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import isNil from 'lodash/isNil';
import trim from 'lodash/trim';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import TblButton from 'components/TblButton';
import TblDialog from 'components/TblDialog';
import TblInputs from 'components/TblInputs';

import { useFormik } from 'formik';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import * as Yup from 'yup';

import schoolYearActions from '../actions';
import { ROUTE_SCHOOL_YEAR } from '../constantsRoute';

function ModifySchoolYear(props) {
  // NOTE: get context
  const { t } = useTranslation(['schoolYear', 'common', 'error']);
  const { enqueueSnackbar } = useSnackbar();

  // NOTE: connect redux
  const dispatch = useDispatch();
  const { schoolYearDetail, createSchoolYearSuccess, createSchoolYearFailed } =
    useSelector((state) => state.SchoolYear);

  // NOTE: get data from props
  const { history, authContext, visibleDialog, toggleDialog } = props;

  // NOTE: common functions

  const createSchoolYear = (payload) => {
    const {
      organizationId,
      organization: { timezone },
    } = authContext.currentUser;
    dispatch(
      schoolYearActions.createSchoolYear({
        orgId: organizationId,
        schoolYear: { ...payload, timezone },
      })
    );
  };

  // NOTE: handle with form formik
  const validationSchema = Yup.object()
    .default(null)
    .nullable()
    .shape({
      name: Yup.string().trim().required(t('common:required_message')),
      firstDay: Yup.date()
        .nullable()
        .typeError(t('common:invalid_date_format'))
        .required(t('common:required_message'))
        .compareDate(
          Yup.ref('lastDay'),
          t('error:error_first_less_last', {
            first: t('first_date'),
            last: t('last_date'),
          }),
          'isBefore'
        )
        .compareDateDuration(
          Yup.ref('lastDay'),
          t('error:error_school_year_span', { count: 30 }),
          30
        ),
      lastDay: Yup.date()
        .nullable()
        .typeError(t('common:invalid_date_format'))
        .required(t('common:required_message'))
        .compareDate(
          Yup.ref('firstDay'),
          t('error:error_last_greater_first', {
            first: t('first_date'),
            last: t('last_date'),
          }),
          'isAfter'
        )
        .compareDateDuration(
          Yup.ref('firstDay'),
          t('error:error_school_year_span', { count: 30 }),
          30
        ),
    });

  const formik = useFormik({
    initialValues: { name: '', firstDay: null, lastDay: null },
    validationSchema: validationSchema,
    validateOnChange: true,
    validateOnBlur: false,
    onSubmit: (values) => {
      const { name, firstDay, lastDay } = values;
      const payload = {
        name: trim(name),
        firstDay: moment(firstDay).startOf('day').format(),
        lastDay: moment(lastDay).startOf('day').format(),
      };
      createSchoolYear(payload);
    },
  });

  const {
    values: { name, firstDay, lastDay },
    errors,
    touched,
    isSubmitting,
    setFieldValue,
    setFieldError,
    setSubmitting,
    resetForm,
    setFieldTouched,
  } = formik;

  // NOTE: handle react lifecycle
  useEffect(() => {
    if (createSchoolYearSuccess) {
      enqueueSnackbar(
        t('common:object_created', { objectName: t('common:school_year') }),
        { variant: 'success' }
      );
      toggleDialog(false);
      setSubmitting(false);
      resetForm();
      history.push(ROUTE_SCHOOL_YEAR.SCHOOL_YEAR_DETAIL(schoolYearDetail.id));
      dispatch(schoolYearActions.schoolYearReset());
    }
  }, [createSchoolYearSuccess]);

  useEffect(() => {
    if (!isNil(createSchoolYearFailed)) {
      setFieldError('name', t('common:this_name_already_exists'));
      setSubmitting(false);
    }
  }, [createSchoolYearFailed]);

  return (
    <div>
      {visibleDialog && (
        <TblDialog
          open={visibleDialog}
          title={t('new_school_year')}
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
                isShowCircularProgress={isSubmitting}
                disabled={isSubmitting}
              >
                {t('common:create')}
              </TblButton>
            </>
          }
          onClose={toggleDialog}
        >
          <form onSubmit={formik.handleSubmit}>
            <Grid container spacing={0}>
              <Grid item xs={12}>
                <TblInputs
                  name='name'
                  placeholder={t('common:enter_name')}
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
              </Grid>
            </Grid>
            <Grid container spacing={0}>
              <Grid item xs={6}>
                <Box mr={1.5}>
                  <TblInputs
                    name='firstDay'
                    required
                    inputType='date'
                    label={t('first_date')}
                    error={
                      !!(errors.firstDay && (touched.firstDay || isSubmitting))
                    }
                    errorMessage={
                      !!(
                        errors.firstDay &&
                        (touched.firstDay || isSubmitting)
                      ) ? (
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
                    spacing={0}
                    // onBlur={formik.handleBlur}
                  />
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box ml={1.5}>
                  <TblInputs
                    name='lastDay'
                    required
                    inputType='date'
                    label={t('last_date')}
                    error={
                      !!(errors.lastDay && (touched.lastDay || isSubmitting))
                    }
                    errorMessage={
                      !!(
                        errors.lastDay &&
                        (touched.lastDay || isSubmitting)
                      ) ? (
                        <div>{errors.lastDay}</div>
                      ) : (
                        false
                      )
                    }
                    onChange={(value) => {
                      setFieldValue('lastDay', value);
                      setFieldTouched('lastDay', true);
                    }}
                    spacing={0}
                    // onBlur={formik.handleBlur}
                    value={lastDay}
                  />
                </Box>
              </Grid>
            </Grid>
          </form>
        </TblDialog>
      )}
    </div>
  );
}

ModifySchoolYear.propTypes = {
  history: PropTypes.object,
  authContext: PropTypes.object,
  visibleDialog: PropTypes.bool,
  toggleDialog: PropTypes.func,
};

export default ModifySchoolYear;
