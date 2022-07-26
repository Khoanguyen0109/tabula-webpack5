import React, { useCallback, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';
import isNull from 'lodash/isNull';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';

import TblInputs from 'components/TblInputs';
import TblInputTableWithConfirm from 'components/TblInputTableWithConfirm';
import TblTable from 'components/TblTable';

import { AuthDataContext } from 'AppRoute/AuthProvider';
import { useFormik } from 'formik';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import * as Yup from 'yup';

import schoolYearActions from '../actions';
import { SCHOOL_YEAR_STATUS } from '../constants';

const schoolYearSelector = (state) => state.SchoolYear;

function TermAndGradingPeriodsTable(props) {
  const { i, termInfo, location, t } = props;

  // const { t } = useTranslation(['schoolYear', 'common', 'error']);
  const { termsGradingPeriodsList } = useSelector(schoolYearSelector);
  const updateTermsFailed = useSelector(
    (state) => state.SchoolYear.updateTermsFailed
  );
  const termId = useSelector((state) => state.SchoolYear.termId);
  const updatedData = useSelector((state) => state.SchoolYear.termInfo);
  const status = useSelector((state) => state.SchoolYear.schoolYearStatus);
  const dispatch = useDispatch();
  const authContext = useContext(AuthDataContext);
  const { organizationId } = authContext.currentUser;
  const schoolYearId = location.pathname.split('/')[2];

  const updateTerms = useCallback(
    (payload) => {
      dispatch(
        schoolYearActions.updateTerms({
          orgId: organizationId,
          schoolYearId,
          termId: termInfo.id,
          urlParams: {
            timezone: authContext?.currentUser?.timezone,
          },
          termInfo: payload,
        })
      );
    },
    [authContext, dispatch, organizationId, schoolYearId, termInfo.id]
  );

  const updateGradingPeriods = useCallback(
    (payload) => {
      dispatch(
        schoolYearActions.updateGradingPeriods({
          orgId: organizationId,
          schoolYearId,
          termId: termInfo.id,
          urlParams: {
            timezone: authContext?.currentUser?.timezone,
          },
          gradingPeriods: payload.map((i) => {
            i.firstDay = moment(i.firstDay).isValid() ? moment(i.firstDay).startOf('day').format() : null;
            i.lastDay = moment(i.lastDay).isValid() ? moment(i.lastDay).startOf('day').format() : null;
            return i;
          }),
        })
      );
    },
    [authContext, dispatch, organizationId, schoolYearId, termInfo.id]
  );

  const generatePeriodName = () => {
    const generatedName = {};
    termInfo.grading_periods.forEach(() => {
      generatedName['lastDay'] = Yup.date()
        .nullable()
        .typeError(t('common:invalid_date_format'))
        .test('checkRequired', t('common:required_message'), function (
          lastDay
        ) {
          if (isNil(lastDay) && status === SCHOOL_YEAR_STATUS.PUBLISHED) {
            return false;
          }
          return true;
        })
        .test(
          'checkOverlapPeriod',
          t('error:error_last_greater_first', {
            first: t('first_date'),
            last: t('last_date'),
          }),
          function (lastDay) {
            const firstDay = this.resolve(Yup.ref('firstDay'));
            if (moment(firstDay).isSameOrAfter(moment(lastDay), 'day')) {
              return false;
            }
            return true;
          }
        );

      generatedName['firstDay'] = Yup.date()
        .nullable()
        .typeError(t('common:invalid_date_format'))
        .test('checkRequired', t('common:required_message'), function (
          firstDay
        ) {
          if (isNil(firstDay) && status === SCHOOL_YEAR_STATUS.PUBLISHED) {
            return false;
          }
          return true;
        })
        .test(
          'checkOverlapPeriod',
          t('error:error_first_less_last', {
            first: t('first_date'),
            last: t('last_date'),
          }),
          function (firstDay) {
            const lastDay = this.resolve(Yup.ref('lastDay'));
            if (moment(lastDay).isSameOrBefore(moment(firstDay), 'day')) {
              return false;
            }
            return true;
          }
        );
    });
    return generatedName;
  };
  const validationSchema = Yup.object()
    .nullable()
    .shape({
      firstDay: Yup.date()
        .nullable()
        // .required(t('common:required_message'))
        .test('checkRequired', t('common:required_message'), function (
          firstDay
        ) {
          if (isNil(firstDay) && status === SCHOOL_YEAR_STATUS.PUBLISHED) {
            return false;
          }
          return true;
        })
        .typeError(t('common:invalid_date_format'))
        .test(
          'checkMinDuration',
          t('error:error_duration_mins', {
            object: t('term'),
            limit: 7,
            unit: t('day_plural'),
          }),
          function (firstDay) {
            if (i === 0) return true;
            const lastDay = this.resolve(Yup.ref('lastDay'));
            if (moment(lastDay).diff(moment(firstDay), 'days') < 6) {
              return false;
            }
            return true;
          }
        )
        .test(
          'checkOverlapTerm',
          t('error:error_last_greater_first', {
            first: `Term ${i}.Last Date`,
            last: `Term ${i + 1}.First Date`,
          }),
          function (firstDay) {
            if (i === 0) return true;
            const previousTerm = termsGradingPeriodsList[i - 1];
            const prevLastDay = previousTerm.lastDay;
            if (
              previousTerm?.lastDay &&
              moment(firstDay).isSameOrBefore(moment(prevLastDay), 'day')
            ) {
              return false;
            }
            return true;
          }
        ),

      lastDay: Yup.date()
        .nullable()
        // .required(t('common:required_message'))
        .typeError(t('common:invalid_date_format'))
        .test('checkRequired', t('common:required_message'), function (
          lastDay
        ) {
          if (isNil(lastDay) && status === SCHOOL_YEAR_STATUS.PUBLISHED) {
            return false;
          }
          return true;
        })
        // .test(
        //   'checkLastAndFinalActivityDate',
        //   t('error:error_first_less_equal_last', {
        //     first: t('last_date'),
        //     last: t('date_of_final_activities'),
        //   }),
        //   function (lastDay) {
        //     if (i === termsGradingPeriodsList.length - 1) return true;
        //     const finalActivityDate = this.resolve(
        //       Yup.ref('finalActivityDate')
        //     );
        //     if (moment(lastDay).isAfter(moment(finalActivityDate), 'day')) {
        //       return false;
        //     }
        //     return true;
        //   }
        // )
        .test(
          'checkMinDuration',
          t('error:error_duration_mins', {
            object: t('term'),
            limit: 7,
            unit: t('day_plural'),
          }),
          function (lastDay) {
            if (i === termsGradingPeriodsList.length - 1) return true;
            const firstDay = this.resolve(Yup.ref('firstDay'));
            if (moment(lastDay).diff(moment(firstDay), 'days') < 6) {
              return false;
            }
            return true;
          }
        )
        .test(
          'checkOverlapTerm',
          t('error:error_first_less_last', {
            first: `Term ${i + 1}.Last Date`,
            last: `Term ${i + 2}.First Date`,
          }),

          function (lastDay) {
            if (i === termsGradingPeriodsList.length - 1) return true;
            const nextTerm = termsGradingPeriodsList[i + 1];
            const nextTermFirstDay = moment(nextTerm.firstDay);
            if (
              nextTerm?.firstDay &&
              moment(lastDay).isSameOrAfter(nextTermFirstDay, 'day')
            ) {
              return false;
            }
            return true;
          }
        ),

      // finalActivityDate: Yup.date()
      //   .nullable()
      //   .typeError(t('common:invalid_date_format'))
      //   .test(
      //     'checkOverLap',
      //     t('error:error_last_greater_equal_first', {
      //       first: t('last_date'),
      //       last: t('date_of_final_activities'),
      //     }),
      //     function (finalActivityDate) {
      //       const lastDay = this.resolve(Yup.ref('lastDay'));
      //       if (moment(finalActivityDate).isBefore(moment(lastDay), 'day')) {
      //         return false;
      //       }
      //       return true;
      //     }
      //   ),
      grading_periods: Yup.array().of(Yup.object().shape(generatePeriodName())),
    });
  const formik = useFormik({
    initialValues: termInfo,
    validationSchema: validationSchema,
    validateOnChange: true,
    validateOnBlur: false,
  });
  const {
    values: {
      firstDay,
      lastDay,
      // finalActivityDate,
      termName,
      grading_periods: gradingPeriods,
    },
    touched,
    errors,
    setFieldValue,
    setFieldTouched,
    // resetForm,
    setFieldError,
  } = formik;

  const handleSave = (fieldName, fieldValue) => {
    if (!!!errors[fieldName] && touched[fieldName]) {
      updateTerms({
        [`${fieldName}`]: moment(fieldValue).startOf('day').format(),
        updateTermsFailed: {},
      });
      setFieldTouched(fieldName, false);
    }
  };
  const handleSaveGradingPeriods = () => {
    if (!errors?.grading_periods && touched.grading_periods) {
      updateGradingPeriods(gradingPeriods);
      setFieldTouched('grading_periods', false);
    }
  };

  const handleCancel = (fieldName) => {
    const fieldValue = termInfo[fieldName];
    setFieldValue(`${fieldName}`, fieldValue);
    setFieldTouched(fieldName, false);
  };
  const columns = [
    {
      title: t('common:name'),
      dataIndex: 'gradingPeriodName',
      key: 'gradingPeriodName',
      render: (text) => (
          <TblInputTableWithConfirm inputType='text' disabled viewOnly value={text} />
        ),
      disabled: true,
    },
    {
      title: t('first_date'),
      dataIndex: 'firstDay',
      key: 'firstDay',
      render: (text, record, index) => {
        const gradingPeriod = gradingPeriods.find((g) => g.id === record.id);
        return (
          <TblInputTableWithConfirm
            inputType='date'
            // name={`firstDay_${record.id}`}
            viewOnly={index === 0}
            disabled={index === 0}
            name={`grading_periods[${index}].firstDay`}
            singleSave={index !== 0}
            value={gradingPeriod?.firstDay || null}
            onSave={() => handleSaveGradingPeriods()}
            onAbort={() => handleCancel('grading_periods')}
            errorMessage={
              errors.grading_periods &&
              errors.grading_periods[index] &&
              errors.grading_periods[index].firstDay
            }
            onChange={(value) => {
              const newFirstDay = !isNull(value)
                ? moment(value).format()
                : null;
              const newPrevLastDay = !isNull(value)
                ? moment(value, 'DD-MM-YYYY').add(-1, 'days').format()
                : null;
              const newGradingPeriods = gradingPeriods.map((g, i) => {
                if (i === index) return { ...g, firstDay: newFirstDay };
                if (i === index - 1) return { ...g, lastDay: newPrevLastDay };
                return g;
              });
              setFieldValue('grading_periods', newGradingPeriods);
              setFieldTouched('grading_periods', true);
            }}
          />
        );
      },
      hasError: (i) => (
          errors.grading_periods &&
          errors.grading_periods[i] &&
          errors.grading_periods[i].firstDay
        ),
      disabled: (i) => i === 0,
    },
    {
      title: t('last_date'),
      dataIndex: 'lastDay',
      key: 'lastDay',
      render: (text, record, index) => {
        const gradingPeriod = gradingPeriods.find((g) => g.id === record.id);
        return (
          <TblInputTableWithConfirm
            inputType='date'
            name={`grading_periods[${index}].lastDay`}
            errorMessage={
              errors.grading_periods &&
              errors.grading_periods[index] &&
              errors.grading_periods[index].lastDay
            }
            viewOnly={index === gradingPeriods.length - 1}
            disabled={index === gradingPeriods.length - 1}
            singleSave={index !== gradingPeriods.length - 1}
            // value={text}
            value={gradingPeriod?.lastDay || null}
            onSave={() => handleSaveGradingPeriods()}
            onAbort={() => handleCancel('grading_periods')}
            onChange={(value) => {
              const newLastDay = !isNull(value) ? moment(value).format() : null;
              const newNextFirstDay = !isNull(value)
                ? moment(value, 'DD-MM-YYYY').add(1, 'days').format()
                : null;
              // console.log(newNextFirstDay);
              const newGradingPeriods = gradingPeriods.map((g, i) => {
                if (i === index) return { ...g, lastDay: newLastDay };
                if (i === index + 1) return { ...g, firstDay: newNextFirstDay };
                return g;
              });
              setFieldValue('grading_periods', newGradingPeriods);
              setFieldTouched('grading_periods', true);
            }}
          />
        );
      },
      hasError: (i) => (
          errors.grading_periods &&
          errors.grading_periods[i] &&
          errors.grading_periods[i].lastDay
        ),
      disabled: (i) => i === gradingPeriods.length - 1,
    },
  ];

  useEffect(() => {
    if (isEmpty(updateTermsFailed) && !isEmpty(termInfo)) {
      setFieldValue('grading_periods', termInfo.grading_periods);
      setFieldValue('termName', termInfo.termName);
      setFieldValue('firstDay', termInfo.firstDay);
      setFieldValue('lastDay', termInfo.lastDay);
    }
  }, [setFieldValue, termInfo, updateTermsFailed]);

  useEffect(() => {
    if ([6, 7].includes(updateTermsFailed?.subcode) && termInfo?.id === termId) {
      const keyArray = Object.keys(updatedData);
      if (keyArray.length > 0 && updateTermsFailed?.subcode === 7) {
        const fieldName = keyArray[0];
        setFieldTouched(fieldName, true);
        let objectName = '';
        switch (fieldName) {
          case 'firstDay':
            objectName = t('first_date');
            break;
          case 'lastDay':
            objectName = t('last_date');
            break;
          // case 'finalActivityDate':
          //   objectName = t('date_of_final_activities');
          //   break;
          default:
            break;
        }
        setFieldError(
          fieldName,
          t('error:restriction_of_school_year', { objectName: objectName })
        );
      }
      //NOTE: Fix bug TL-3524
      if (updateTermsFailed?.subcode === 6) {
        setFieldTouched('lastDay', true);
        setFieldError(
          'lastDay',
          updateTermsFailed?.message ?? ''
        );
      }
    }
  }, [
    updateTermsFailed,
    updatedData,
    termId,
    termInfo,
    setFieldError,
    t,
    setFieldTouched,
  ]);

  /**
   * NOTE: Component will unmount, Fix bug TL-3058
   * Link: https://communicate.atlassian.net/browse/TL-3058
   */
  useEffect(() => () => {
      dispatch(
        schoolYearActions.schoolYearSetState({
          updateTermsFailed: {},
        })
      );
    }, [dispatch]);

  return (
    <Box mb={5}>
      <form key={i}>
        <Grid container spacing={0}>
          <Grid item xs={8}>
            <Box mr={3}>
              <TblInputs
                name='name'
                label={`${t('term_number', { count: i + 1 })}`}
                type='text'
                max={2}
                disabled
                viewOnly
                value={termName}
              />
            </Box>
          </Grid>
          {/* <Grid item xs={4}>
            <Box>
              <TblInputs
                name='finalActivityDate'
                inputType='date'
                label={t('date_of_final_activities')}
                helperLabel='Helper'
                onSave={() =>
                  handleSave('finalActivityDate', finalActivityDate)
                }
                errorMessage={
                  touched.finalActivityDate && errors.finalActivityDate
                }
                onChange={(value) => {
                  setFieldValue('finalActivityDate', value);
                  setFieldTouched('finalActivityDate', true);
                }}
                onAbort={() => handleCancel('finalActivityDate')}
                value={finalActivityDate}
                singleSave
              />
            </Box>
          </Grid> */}
        </Grid>
        <Grid container spacing={0}>
          <Grid item xs={4}>
            <Box mr={3}>
              <TblInputs
                name='firstDay'
                required={i !== 0}
                inputType='date'
                label={t('first_date')}
                onSave={() => handleSave('firstDay', firstDay)}
                errorMessage={touched.firstDay && errors.firstDay}
                onAbort={() => handleCancel('firstDay')}
                viewOnly={i === 0}
                disabled={i === 0}
                onChange={(value) => {
                  setFieldValue('firstDay', value);
                  setFieldTouched('firstDay', true);
                }}
                value={firstDay}
                singleSave={i !== 0}
              />
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box mr={3}>
              <TblInputs
                name='lastDay'
                required={i !== termsGradingPeriodsList.length - 1}
                inputType='date'
                label={t('last_date')}
                onSave={() => {
                  handleSave('lastDay', lastDay);
                }}
                errorMessage={touched.lastDay && errors.lastDay}
                onAbort={() => handleCancel('lastDay')}
                viewOnly={i === termsGradingPeriodsList.length - 1}
                disabled={i === termsGradingPeriodsList.length - 1}
                onChange={(value) => {
                  setFieldValue('lastDay', value);
                  setFieldTouched('lastDay', true);
                }}
                value={lastDay}
                singleSave={i !== termsGradingPeriodsList.length - 1}
              />
            </Box>
          </Grid>
        </Grid>

        <Grid>
          {termInfo.grading_periods?.length > 1 && (
            <TblTable
              tableLabel={`${t('grading_periods')} - ${t('term_number', {
                count: i + 1,
              })}`}
              requiredLabel
              rows={termInfo.grading_periods}
              columns={columns}
              noSideBorder={false}
            />

          )}
        </Grid>
      </form>
    </Box>
  );
}

function TermsAndGradingPeriods(props) {
  const { termsGradingPeriodsList, isBusy, updateTermsSuccess } = useSelector(
    schoolYearSelector
  );
  const dispatch = useDispatch();
  const authContext = useContext(AuthDataContext);
  const { organizationId } = authContext.currentUser;
  const schoolYearId = props.location.pathname.split('/')[2];
  const { t } = useTranslation(['schoolYear', 'common', 'error']);
  const { enqueueSnackbar } = useSnackbar();

  const showNotification = useCallback(() => enqueueSnackbar(t('common:change_saved'), {
      variant: 'success',
    }), [enqueueSnackbar, t]);

  const getTermsGradingPeriodsList = useCallback(() => {
    dispatch(
      schoolYearActions.getTermsGradingPeriodsList({
        orgId: organizationId,
        schoolYearId,
        isBusy: true,
      })
    );
  }, [dispatch, organizationId, schoolYearId]);

  useEffect(() => {
    getTermsGradingPeriodsList();
  }, [getTermsGradingPeriodsList]);

  useEffect(() => {
    if (updateTermsSuccess) {
      dispatch(
        schoolYearActions.getSchoolYearValidation({
          orgId: organizationId,
          schoolYearId,
        })
      );
      showNotification();
      dispatch(
        schoolYearActions.schoolYearSetState({
          updateTermsSuccess: false,
        })
      );
    }
  }, [
    dispatch,
    organizationId,
    schoolYearId,
    showNotification,
    updateTermsSuccess,
  ]);

  const renderSkeleton = () => (
      <Box mt={5}>
        <Box mr={3}>
          <Grid item xs={8}>
            <Skeleton variant='rectangular' height={44} />
          </Grid>
        </Box>
        <Box mt={4.5} mr={3}>
          <Grid item xs={4}>
            <Skeleton variant='rectangular' height={44} />
          </Grid>
        </Box>
      </Box>
    );
  return isBusy ? (
    renderSkeleton()
  ) : (
    <Box>
      {termsGradingPeriodsList?.length > 1
        ? termsGradingPeriodsList.map((item, i) => (
          <TermAndGradingPeriodsTable
            termInfo={{ ...item }}
            i={i}
            location={props.location}
            t={t}
          />
        ))
        : t('no_terms_and_grading_periods')}
    </Box>
  );
}

TermAndGradingPeriodsTable.propTypes = {
  onSave: PropTypes.func,
  i: PropTypes.number,
  t: PropTypes.func,
  termInfo: PropTypes.object,
  location: PropTypes.object,
};
TermsAndGradingPeriods.propTypes = {
  location: PropTypes.object,
};
export default TermsAndGradingPeriods;
