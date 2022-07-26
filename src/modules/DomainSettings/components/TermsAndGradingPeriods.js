import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import fromPairs from 'lodash/fromPairs';
import isEmpty from 'lodash/isEmpty';
import map from 'lodash/map';
import trim from 'lodash/trim';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Skeleton from '@mui/material/Skeleton';

import TblButton from 'components/TblButton';
import TabulaCheckbox from 'components/TblCheckBox/CheckBoxWithLabel';
import TblDialog from 'components/TblDialog';
import TblInputs from 'components/TblInputs';
import TblSelect from 'components/TblSelect';

import { Field, Form, Formik } from 'formik';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import * as Yup from 'yup';

import { NUMBER_OF_GRADING_PERIODS, TERMS } from '../constants';

function getInitialValues(array = [], isTerm = true) {
  if (array.length > 0) {
    const newArray = [...array].map((item) =>
      isTerm
        ? { key: `term${item.id}`, value: item.termName }
        : { key: `gradingPeriod${item.id}`, value: item.gradingPeriodName }
    );
    const initialValues = fromPairs(map(newArray, (i) => [i.key, i.value]));
    return initialValues;
  }
}

function getValidationValues(array = [], t, isTerm = true) {
  if (array.length > 0) {
    const newArray = [...array].map((item) =>
      isTerm ? { key: `term${item.id}` } : { key: `gradingPeriod${item.id}` }
    );
    const arrayToValidate = [...array].map((item) =>
      isTerm
        ? { key: `term${item.id}`, value: item.termName }
        : { key: `gradingPeriod${item.id}`, value: item.gradingPeriodName }
    );
    const validationValues = fromPairs(
      map(newArray, (i) => [
        i.key,
        Yup.string()
          .trim()
          .required(t('common:required_message'))
          .test({
            name: 'unique',
            exclusive: true,
            params: { arrayToValidate },
            message: t('common:this_name_already_exists'),
            test: (value) =>
              value === null ||
              arrayToValidate
                .filter((item) => item.key !== i.key)
                .every((element) => element.value !== trim(value)),
          }),
      ])
    );
    return validationValues;
  }
}

function TermsAndGradingPeriods(props) {
  const { t } = useTranslation(['domain', 'common']);
  const {
    terms,
    gradingPeriods,
    updateTermSetting,
    updateGradingPeriodSetting,
    isUpdateTermSuccess,
    isUpdateTermFailed,
    isUpdateGradingPeriodSuccess,
    isUpdateGradingPeriodFailed,
    setReducer,
    isLoadingTerms,
    isShowNotificationForUpdatingGradingPeriod,
  } = props;
  const termStructureArray = [
    { value: 0, text: t('no_terms') },
    { value: 2, text: t('semesters') },
    { value: 3, text: t('trimesters') },
    { value: 4, text: t('quarters') },
  ];

  const [isVisibleConfirmDialog, setIsVisibleConfirmDialog] = useState(false);
  const [value, setValue] = useState(0);
  const [funcName, setFuncName] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  const termSchema = Yup.object().shape(getValidationValues(terms, t));
  const gradingPeriodSchema = Yup.object().shape(
    getValidationValues(gradingPeriods, t, false)
  );

  const onChangeNumberOfTerms = (value) => {
    if (value === 0) {
      updateTermSetting({ numberOfTerms: 0 });
      //NOTE: Don't show notification for update grading period because of existed notification
      updateGradingPeriodSetting({
        numberOfGradingPeriods: 0,
        isShowNotificationForUpdatingGradingPeriod: false,
      });
    } else {
      updateTermSetting({ numberOfTerms: value });
    }
  };
  const onChangeBreakGradingPeriods = (checked) => {
    updateGradingPeriodSetting({ numberOfGradingPeriods: !checked ? 0 : 2 });
  };
  const onChangeNumberOfGradingPeriods = (value) => {
    updateGradingPeriodSetting({ numberOfGradingPeriods: value });
  };

  useEffect(() => {
    props.getTermList();
    props.getGradingPeriodList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      isUpdateTermSuccess ||
      (isUpdateGradingPeriodSuccess &&
        isShowNotificationForUpdatingGradingPeriod)
    ) {
      let message = t('common:change_saved');
      let variant = 'success';
      enqueueSnackbar(message, { variant });
      setReducer({
        isUpdateGradingPeriodSuccess: false,
        isUpdateTermSuccess: false,
      });
    }
    if (
      !isShowNotificationForUpdatingGradingPeriod &&
      isUpdateGradingPeriodSuccess
    ) {
      setReducer({
        isShowNotificationForUpdatingGradingPeriod: true,
        isUpdateGradingPeriodSuccess: false,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdateTermSuccess, isUpdateGradingPeriodSuccess]);

  const handleSave = (fieldName, fieldValue, previousData, propsInForm) => {
    const { errors } = propsInForm;
    const value = trim(fieldValue);
    if (!!!errors[fieldName] && value !== previousData) {
      const id = Number(fieldName.match(/\d+/)[0]);
      const type = fieldName.replace(/[0-9]/g, '');
      type === 'term'
        ? updateTermSetting({ [type]: { id, name: value } })
        : updateGradingPeriodSetting({ [type]: { id, name: value } });
    }
    //NOTE: Don't show message if field have the same value
    // if (!!!errors[fieldName] && value === previousData) {
    //   let message = t('common:change_saved');
    //   let variant = 'success';
    //   enqueueSnackbar(message,
    //     { variant }
    //   );
    // }
  };

  const handleCancel = (fieldName, previousData, propsInForm) => {
    propsInForm.setFieldValue(fieldName, previousData);
  };

  function renderTermsOrGradingPeriods(
    t,
    object = { array: [], isTerm: true, propsInForm: {} }
  ) {
    const {
      array,
      isTerm,
      propsInForm: { errors, values },
      propsInForm,
    } = object;
    if (array.length > 0) {
      return array.map((item) => {
        const name = isTerm ? `term${item.id}` : `gradingPeriod${item.id}`;
        return (
          <Box mt={2} key={item.id}>
            <Field
              name={name}
              as={TblInputs}
              label={t(
                isTerm ? 'term_and_number' : 'grading_period_and_number',
                { number: isTerm ? item.termNumber : item.gradingPeriodNumber }
              )}
              inputProps={{ maxLength: 254 }}
              error={!isEmpty(errors) && errors[name] ? !!errors[name] : false}
              errorMessage={
                !isEmpty(errors) && errors[name] ? errors[name] : ''
              }
              singleSave
              required
              onSave={() =>
                handleSave(
                  name,
                  values[name],
                  isTerm ? item.termName : item.gradingPeriodName,
                  propsInForm
                )
              }
              onAbort={() =>
                handleCancel(
                  name,
                  isTerm ? item.termName : item.gradingPeriodName,
                  propsInForm
                )
              }
            />
          </Box>
        );
      });
    }
  }

  return (
    <>
      <Grid container>
        {isVisibleConfirmDialog && (
          <TblDialog
            open={isVisibleConfirmDialog}
            title={t('common:confirmation')}
            onClose={() => setIsVisibleConfirmDialog(false)}
            footer={
              <>
                <TblButton
                  variant='outlined'
                  size='medium'
                  color='primary'
                  onClick={() => setIsVisibleConfirmDialog(false)}
                >
                  {t('common:cancel')}
                </TblButton>
                <TblButton
                  size='medium'
                  variant='contained'
                  color='primary'
                  onClick={() => {
                    switch (funcName) {
                      case 'onChangeNumberOfTerms':
                        onChangeNumberOfTerms(value);
                        break;
                      case 'onChangeBreakGradingPeriods':
                        onChangeBreakGradingPeriods(value);
                        break;
                      case 'onChangeNumberOfGradingPeriods':
                        onChangeNumberOfGradingPeriods(value);
                        break;
                      default:
                        break;
                    }
                    setIsVisibleConfirmDialog(false);
                  }}
                >
                  {t('save')}
                </TblButton>
              </>
            }
          >
            {t('common:message_confirmation_domain_settings')}
          </TblDialog>
        )}
        {isLoadingTerms ? (
          <Grid item xs={8}>
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </Grid>
        ) : (
          <Grid item xs={8}>
            <Grid item xs={6} container>
              <Grid item xs={12}>
                {(isUpdateTermFailed || isUpdateGradingPeriodFailed) && (
                  <Box mb={2}>
                    <Alert severity='error'>{t('error:general_error')}</Alert>
                  </Box>
                )}
                <TblSelect
                  label={t('my_school_uses')}
                  value={terms?.length ?? 0}
                  required
                  onChange={(event) => {
                    setIsVisibleConfirmDialog(true);
                    setValue(event.target.value);
                    setFuncName('onChangeNumberOfTerms');
                  }}
                  options={termStructureArray}
                >
                  {termStructureArray.map((item) => (
                    <MenuItem value={item.value} key={item.value}>
                      {item.text}
                    </MenuItem>
                  ))}
                </TblSelect>
              </Grid>
            </Grid>
            {terms.length !== TERMS.NO_TERMS && (
              <Grid item xs={12} container>
                <Grid item xs={12}>
                  <Formik
                    initialValues={getInitialValues(terms)}
                    enableReinitialize={true}
                    validationSchema={termSchema}
                  >
                    {(propsInForm) => (
                      <Form>
                        {renderTermsOrGradingPeriods(t, {
                          array: terms,
                          isTerm: true,
                          propsInForm,
                        })}
                      </Form>
                    )}
                  </Formik>
                  <Box mt={5}>
                    <TabulaCheckbox
                      label={t('number_of_grading_periods')}
                      checked={gradingPeriods.length > 1}
                      onChange={(event) => {
                        setIsVisibleConfirmDialog(true);
                        setValue(event.target.checked);
                        setFuncName('onChangeBreakGradingPeriods');
                      }}
                    />
                  </Box>
                </Grid>
                {gradingPeriods.length > 1 && (
                  <Grid item xs={12} container>
                    <Grid item xs={6}>
                      <Box mt={2}>
                        <TblSelect
                          label={t('number_of_grading_periods')}
                          value={gradingPeriods.length}
                          required
                          onChange={(event) => {
                            setIsVisibleConfirmDialog(true);
                            setValue(event.target.value);
                            setFuncName('onChangeNumberOfGradingPeriods');
                          }}
                          options={NUMBER_OF_GRADING_PERIODS}
                        >
                          {NUMBER_OF_GRADING_PERIODS.map((item) => (
                            <MenuItem value={item} key={item}>
                              {item}
                            </MenuItem>
                          ))}
                        </TblSelect>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Formik
                        initialValues={getInitialValues(gradingPeriods, false)}
                        enableReinitialize={true}
                        validationSchema={gradingPeriodSchema}
                      >
                        {(propsInForm) => (
                          <Form>
                            {renderTermsOrGradingPeriods(t, {
                              array: gradingPeriods,
                              isTerm: false,
                              propsInForm,
                            })}
                          </Form>
                        )}
                      </Formik>
                    </Grid>
                  </Grid>
                )}
              </Grid>
            )}
          </Grid>
        )}
      </Grid>
    </>
  );
}

TermsAndGradingPeriods.propTypes = {
  t: PropTypes.func,
  getGradingPeriodList: PropTypes.func,
  getTermList: PropTypes.func,
  terms: PropTypes.array,
  gradingPeriods: PropTypes.array,
  updateTermSetting: PropTypes.func,
  updateGradingPeriodSetting: PropTypes.func,
  isUpdateGradingPeriodSuccess: PropTypes.bool,
  isUpdateTermSuccess: PropTypes.bool,
  isUpdateTermFailed: PropTypes.bool,
  isUpdateGradingPeriodFailed: PropTypes.bool,
  setReducer: PropTypes.func,
  isLoadingTerms: PropTypes.bool,
  isShowNotificationForUpdatingGradingPeriod: PropTypes.bool,
};
export const TermsAndGradingPeriodsWrapper = React.memo(TermsAndGradingPeriods);
