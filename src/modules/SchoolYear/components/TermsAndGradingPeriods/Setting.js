/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';

import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Skeleton from '@mui/material/Skeleton';

import TblButton from 'components/TblButton';
import TabulaCheckbox from 'components/TblCheckBox/CheckBoxWithLabel';
import Confirm from 'components/TblConfirmDialog';
import TblDialog from 'components/TblDialog';
import TblInputs from 'components/TblInputs';
import TblSelect from 'components/TblSelect';

import { useFormik } from 'formik';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import * as Yup from 'yup';

export const TERMS = {
  NO_TERMS: 0,
  SEMESTERS: 2,
  TRIMESTERS: 3,
  QUARTERS: 4
};

// export const NUMBER_OF_GRADING_PERIODS = [2, 3, 4];
function Setting(props) {
  // NOTE: initial states and props
  const [errorMessage, setErrorMessage] = useState('');
  const [showSkeleton, setShowSkeleton] = useState(true);
  
  const {
    t,
    visibleDialog,
    toggleDialog,
    terms,
    gradingPeriods,
    saveData,
    getSettingsSuccess,
    updateSettingSuccess,
    updateSettingFailed
  } = props;
  const [termsValues, setTermsValues] = useState([]);
  const [askConfirm, setConfirm] = useState(null);
  // const [message, setMessage] = useState('');
  const [gradingPeriodsValues, setGradingPeriodsValues] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const message = t('change_setting_terms');
  const dupplicateMessge = ({value}) => {
    if (!value) {
      return t('common:required_message');
    }
    return t('common:duplicate_name');
  };
  // NOTE: handle with form formik
  const validationSchema = Yup.object()
    .default(null)
    .nullable()
    .shape({
      numberOfTerm: Yup.number(),
      numberOfGradingPeriods: Yup.number(),
      term_0: Yup.string()
        .when('numberOfTerm', (numberOfTerm) => {
          let listTerm = [];
          if (numberOfTerm > 3) {
            listTerm = [Yup.ref('term_1'), Yup.ref('term_2'), Yup.ref('term_3')];
          } else if (numberOfTerm > 2) {
            listTerm = [Yup.ref('term_1'), Yup.ref('term_2')];
          } else if (numberOfTerm >= 1) {
            listTerm = [Yup.ref('term_1')];
          }
          return numberOfTerm >= 1 ? Yup.string().trim().notOneOf(listTerm, dupplicateMessge).required(t('common:required_message')) : Yup.string();
        }),
      term_1: Yup.string()
      .when('numberOfTerm', (numberOfTerm) => {
        let listTerm = [];
        if (numberOfTerm > 3) {
          listTerm = [Yup.ref('term_0'), Yup.ref('term_2'), Yup.ref('term_3')];
        } else if (numberOfTerm > 2) {
          listTerm = [Yup.ref('term_0'), Yup.ref('term_2')];
        } else if (numberOfTerm > 1) {
          listTerm = [Yup.ref('term_0')];
        }
        return numberOfTerm >= 2 ? Yup.string().trim().notOneOf(listTerm, dupplicateMessge).required(t('common:required_message')) : Yup.string();
      }),
      term_2: Yup.string()
        .when('numberOfTerm', (numberOfTerm) => {
          let listTerm = [];
          if (numberOfTerm > 3) {
            listTerm = [Yup.ref('term_0'), Yup.ref('term_1'), Yup.ref('term_3')];
          } else if (numberOfTerm > 2) {
            listTerm = [Yup.ref('term_0'), Yup.ref('term_1')];
          } else if (numberOfTerm > 1) {
            listTerm = [Yup.ref('term_0')];
          }
          return numberOfTerm >= 3 ? Yup.string().trim().notOneOf(listTerm, dupplicateMessge).required(t('common:required_message')) : Yup.string();
        }),
      term_3: Yup.string()
        .when('numberOfTerm', (numberOfTerm) => {
          let listTerm = [];
          if (numberOfTerm > 3) {
            listTerm = [Yup.ref('term_0'), Yup.ref('term_1'), Yup.ref('term_2')];
          } else if (numberOfTerm > 2) {
            listTerm = [Yup.ref('term_0'), Yup.ref('term_1')];
          } else if (numberOfTerm > 1) {
            listTerm = [Yup.ref('term_0')];
          }
          return numberOfTerm >= 4 ? Yup.string().trim().notOneOf(listTerm, dupplicateMessge).required(t('common:required_message')) : Yup.string();
        }),
      grading_0: Yup.string()
        .when('numberOfGradingPeriods', (numberOfGradingPeriods) => {
          let listPeriod = [];
          if (numberOfGradingPeriods > 3) {
            listPeriod = [Yup.ref('grading_3'), Yup.ref('grading_1'), Yup.ref('grading_2')];
          } else if (numberOfGradingPeriods > 2) {
            listPeriod = [Yup.ref('grading_1'), Yup.ref('grading_2')];
          } else if (numberOfGradingPeriods > 1) {
            listPeriod = [Yup.ref('grading_1')];
          }
          return numberOfGradingPeriods >= 1 ? Yup.string().trim().notOneOf(listPeriod, dupplicateMessge).required(t('common:required_message')) : Yup.string();
        }),
      grading_1: Yup.string()
        .when('numberOfGradingPeriods', (numberOfGradingPeriods) => {
          let listPeriod = [];
          if (numberOfGradingPeriods > 3) {
            listPeriod = [Yup.ref('grading_3'), Yup.ref('grading_2'), Yup.ref('grading_0')];
          } else if (numberOfGradingPeriods > 2) {
            listPeriod = [Yup.ref('grading_0'), Yup.ref('grading_2')];
          } else if (numberOfGradingPeriods > 1) {
            listPeriod = [Yup.ref('grading_0')];
          }
          return numberOfGradingPeriods >= 2 ? Yup.string().trim().notOneOf(listPeriod, dupplicateMessge).required(t('common:required_message')) : Yup.string();
        }),
      grading_2: Yup.string()
        .when('numberOfGradingPeriods', (numberOfGradingPeriods) => {
          let listPeriod = [];
          if (numberOfGradingPeriods > 3) {
            listPeriod = [Yup.ref('grading_3'), Yup.ref('grading_1'), Yup.ref('grading_0')];
          } else if (numberOfGradingPeriods > 2) {
            listPeriod = [Yup.ref('grading_0'), Yup.ref('grading_1')];
          } else if (numberOfGradingPeriods > 1) {
            listPeriod = [Yup.ref('grading_0')];
          }
          return numberOfGradingPeriods >= 3 ? Yup.string().trim().notOneOf(listPeriod, dupplicateMessge).required(t('common:required_message')) : Yup.string();
        }),
      grading_3: Yup.string()
        .when('numberOfGradingPeriods', (numberOfGradingPeriods) => {
          let listPeriod = [];
          if (numberOfGradingPeriods > 3) {
            listPeriod = [Yup.ref('grading_2'), Yup.ref('grading_1'), Yup.ref('grading_0')];
          } else if (numberOfGradingPeriods > 2) {
            listPeriod = [Yup.ref('grading_0'), Yup.ref('grading_1')];
          } else if (numberOfGradingPeriods > 1) {
            listPeriod = [Yup.ref('grading_0')];
          }
          return numberOfGradingPeriods >= 4 ? Yup.string().trim().notOneOf(listPeriod, dupplicateMessge).required(t('common:required_message')) : Yup.string();
        }),
    });

  const onCancel = () => {
    setConfirm(null);
  };
  const initialTerms = () => {
    const data = {
      numberOfTerm: 0,
      numberOfGradingPeriods: 0
    };
    // const terms = termGenerate(termsValues.length);
    termsValues.forEach((item, index) => {
      let name = item.termName;
      // if(values[`term_${index}`]) {
      //   name = values[`term_${index}`];
      // }
      data[`term_${index}`] = name;
    });
    gradingPeriodsValues.forEach((item, index) => {
      data[`grading_${index}`] = item.gradingPeriodName;
    });
    data.numberOfTerm = termsValues.length;
    data.numberOfGradingPeriods = gradingPeriodsValues.length;
    return data;
  };
  
  // let formik = useFormik({});
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialTerms(),
    validationSchema: validationSchema,
    validateOnChange: true,
    validateOnBlur: false,
    onSubmit: (values) => {
      const terms = [];
      const gradingPeriods = [];
      for(let i = 0; i < values.numberOfTerm; i++ ) {
        terms.push({termNumber: (i + 1), termName: values[`term_${i}`]});
      }

      for(let i = 0; i < values.numberOfGradingPeriods; i++ ) {
        gradingPeriods.push({gradingPeriodNumber: (i + 1), gradingPeriodName: values[`grading_${i}`]});
      }
      saveData({terms, gradingPeriods});
    }
  });

  const { values,
    errors, touched, isSubmitting, handleSubmit,
    setFieldValue, setSubmitting, resetForm
  } = formik;

  const changeTerms = (e) => {
    // console.log(e.target.value);
    const value = e.target.value;
    setFieldValue('numberOfTerm', value);
    let name = 'Semester';
    if (value === 3) {
      name = 'Trimester';
    } else if (value === 4) {
      name = 'Quarter';
    }
    for(let i = 0; i < value; i++) {
      setFieldValue(`term_${i}`, `${name} ${i+1}`);
    }
  };
  
  const changePeriod = (e) => {
    const name = e.target.name;
    if (name === 'period_checkbox' && !e.target.checked) {
      setFieldValue('numberOfGradingPeriods', 0);
    } else {
      const value = Number(e.target.value);
      for(let i = 0; i < value; i++) {
        setFieldValue(`grading_${i}`, `Grading Period ${i+1}`);
      }
      setFieldValue('numberOfGradingPeriods', value);
      // setGradingPeriodsValues(periodGenerate(e.target.value));
    }
  };
  const askConfirmation = () => {
    if (isEqual(values, initialTerms())) {
      toggleDialog(false);
    } else {
      setConfirm(true);
    }
  };
  const onConfirmed = () => {
    handleSubmit();
    onCancel();
  };
  
  // NOTE: handle react lifecycle
  useEffect(() => {
    if (updateSettingSuccess) {
      toggleDialog(false);
      setSubmitting(false);
      resetForm();
      setErrorMessage('');
      enqueueSnackbar(t('common:change_saved'), {variant: 'success'});
    };
  }, [updateSettingSuccess]);

  useEffect(() => {
    if (updateSettingFailed && !isEmpty(updateSettingFailed)) {
      setSubmitting(false);
      enqueueSnackbar(updateSettingFailed.message, {variant: 'error'});
    }
  }, updateSettingFailed);

  useEffect(() => {
    props.getSettings();
  }, []);

  useEffect(() => {
    if (getSettingsSuccess) {
      setShowSkeleton(false);
      setTermsValues(terms);
      setGradingPeriodsValues(gradingPeriods);
    }
  }, [getSettingsSuccess]);

  useEffect(() => {
    formik.setFieldValue('numberOfGradingPeriods', termsValues.length);
    resetForm();
  }, [termsValues, gradingPeriodsValues]);
  
  const changeTermName = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFieldValue(name, value);
  };

  const renderTerms = () => {
    const terms = new Array(values.numberOfTerm).fill(null);
    return terms.map((item, index) => {
      const name = `term_${index}`;
      return (
        <Grid item xs={12} mb={2} key={index}>
          <Box mb={0}>
            <TblInputs
              name={name}
              required
              label={`Term ${index + 1}`}
              type='text'
              error={!!(errors[name] && (touched[name] || isSubmitting))}
              errorMessage={!!(errors[name] && (touched[name] || isSubmitting)) ? <div>{errors[name]}</div> : false}
              inputProps={{ maxLength: 254 }}
              value={values[name]}
              onChange={changeTermName}
            />
          </Box>
        </Grid>);
    });
  };

  const renderPeriods = () => {
    const periods = new Array(values.numberOfGradingPeriods).fill(null);
    return periods.map((item, index) => {
      const name = `grading_${index}`;
      return (
        <Grid item xs={12} key={index}>
          <Box mb={0}>
            <TblInputs
              name={name}
              required
              label={`Grading Period ${index + 1}`}
              type='text'
              error={!!(errors[name] && (touched[name] || isSubmitting))}
              errorMessage={!!(errors[name] && (touched[name] || isSubmitting)) ? <div>{errors[name]}</div> : false}
              inputProps={{ maxLength: 254 }}
              value={values[`${name}`]}
              onChange={formik.handleChange}
            />
          </Box>
        </Grid>
      );
    });
  };
  return (
    <div>
      {!!visibleDialog && (
        <TblDialog
          open={!!visibleDialog}
          title={t('edit_terms_and_grading_periods')}
          size='large'
          fullWidth={true}
          footer={
            <>
              <TblButton variant='outlined'
color='primary'
                onClick={() => {
                  toggleDialog(false);
                  formik.handleReset();
                }}>{t('common:cancel')}</TblButton>
                <TblButton variant='contained'
                  color='primary'
                  type='submit'
                  onClick={askConfirmation}
                  disabled={isSubmitting}
                  isShowCircularProgress={isSubmitting}
                    >
                  {t('common:save')}
                </TblButton>
            </>
          }
          onClose={toggleDialog}
        >
          {showSkeleton && <Grid item xs={12}>
            <Grid item xs={6}>
              <Skeleton variant='text' />
            </Grid>
            <Grid item xs={12}>
              <Skeleton variant='text' />
            </Grid>
            <Grid item xs={6}>
              <Skeleton variant='text' />
            </Grid>
            <Grid item xs={12}>
              <Skeleton variant='text' />
            </Grid>
          </Grid>}
          <Confirm open={askConfirm} title={t('common:confirmation')} okText={t('common:save')} message={message} onConfirmed={onConfirmed} onCancel={onCancel}/>
          {!showSkeleton && <form onSubmit={formik.handleSubmit}>
            {errorMessage && <Grid container spacing={0}>
              <Grid item xs={12}>
                <Alert severity='error'>
                  {errorMessage}
                </Alert>
              </Grid>
            </Grid>}
            {/* <input name='numberOfGradingPeriods' type='hidden' value={termsValues.length}/> */}
            {/* <input name='periodValue' type='hidden' value={gradingPeriodsValues.length}/> */}
            <Grid item xs={6} >
              <Box mb={2}>
                <TblSelect label={t('my_school_uses')}
value={values.numberOfTerm}
                  onChange={changeTerms}
                > 
                    <MenuItem value={0} key={0}>{t('no_terms')}</MenuItem>
                    <MenuItem value={2} key={2}>{t('semesters')}</MenuItem>
                    <MenuItem value={3} key={3}>{t('trimesters')}</MenuItem>
                    <MenuItem value={4} key={4}>{t('quarters')}</MenuItem>
                </TblSelect>
                </Box>
            </Grid>

            {values.numberOfTerm !== TERMS.NO_TERMS && (
              <>{renderTerms()}
            <Grid item xs={12}>
              <Box mb={2}>
                <TabulaCheckbox
                  label={t('number_of_grading_periods')}
                  value={2}
                  checked={values.numberOfGradingPeriods > 1}
                  name='period_checkbox'
                  onChange={changePeriod}
                />
              </Box>
            </Grid>
            {!!values?.numberOfGradingPeriods && (
              <>
                <Grid item xs={6}>
                  <Box mb={2}>
                    <TblSelect label={t('number_of_grading_periods')}
value={values?.numberOfGradingPeriods ?? 0}
required
                      onChange={changePeriod}
                    >
                      <MenuItem value={2} >2</MenuItem>
                      <MenuItem value={3} >3</MenuItem>
                      <MenuItem value={4} >4</MenuItem>
                    </TblSelect>
                  </Box>
                </Grid>
            
              {renderPeriods()}
              </>
            )}
            </>
            )}
          </form>}
        </TblDialog>
      )}
    </div>
  );
}

Setting.propTypes = {
  t: PropTypes.func,
  history: PropTypes.object,
  terms: PropTypes.array,
  gradingPeriods: PropTypes.array,
  authContext: PropTypes.object,
  visibleDialog: PropTypes.bool,
  isEdit: PropTypes.bool,
  getSettingsSuccess: PropTypes.bool,
  toggleDialog: PropTypes.func,
  settingDetails: PropTypes.object,
  saveData: PropTypes.func,
  getSettings: PropTypes.func,

  createTimeSlotSuccess: PropTypes.bool,
  updateSettingSuccess: PropTypes.bool,
  updateSettingFailed: PropTypes.object
};

export default Setting;