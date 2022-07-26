import React, { useCallback, useEffect, useRef, useState } from 'react';

import cloneDeep from 'lodash/cloneDeep';
import last from 'lodash/last';
import toString from 'lodash/toString';

import CancelSharpIcon from '@mui/icons-material/CancelSharp';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import makeStyles from '@mui/styles/makeStyles';

import TblButton from 'components/TblButton';
import TblDialog from 'components/TblDialog';
import TblIndicator from 'components/TblIndicator';
import TblInputs from 'components/TblInputs';
import TblInputTable from 'components/TblInputTable';

import clsx from 'clsx';
import { Field, FieldArray, Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import * as Yup from 'yup';

const useStyles = makeStyles((theme) => ({
  root: {
    border: `1px solid ${theme.mainColors.gray[4]}`,
    borderBottom: 'none',
    marginRight: theme.spacing(3.5),
  },
  headerItem: {
    backgroundColor: theme.newColors.gray[100],
    padding: theme.spacing(1.2, 0, 1.2, 1),
    textTransform: 'uppercase',
    borderColor: theme.mainColors.gray[4],
    borderWidth: 1,
    borderStyle: 'solid',
    borderLeftWidth: 0,
    borderTopWidth: 0,
    fontSize: theme.fontSize.small,
    color: theme.mainColors.primary1[0],
    fontWeight: theme.fontWeight.semi,

    '&:last-child': {
      borderRightWidth: 0,
    },
  },
  fontItemWrapper: {
    position: 'relative',
  },
  formItem: {
    borderColor: theme.mainColors.gray[4],
    borderWidth: 1,
    borderStyle: 'solid',
    borderLeftWidth: 0,
    borderTopWidth: 0,

    '&:last-child': {
      // borderColor: theme.newColors.gray[800]
      borderRight: 0,
    },
  },

  error: {
    border: `1px solid ${theme.palette.error.main}`,
  },
  removeButton: {
    position: 'absolute',
    right: theme.spacing(-3),
    top: '50%',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
  },
  icon: {
    color: theme.mainColors.gray[6],
    fontSize: theme.fontSizeIcon.small,
  },
  addText: {
    color: theme.mainColors.status.active,
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  gradingScaleTitle: {
    fontSize: theme.fontSize.medium,
  },
  exampleText: {
    fontSize: theme.fontSize.small,
    marginBottom: theme.spacing(1),
  },
  errorText: {
    fontSize: theme.fontSize.small,
    color: theme.palette.error.main,
    marginTop: theme.spacing(1),
  },
}));

const ManageAssessmentMethod = (props) => {
  const classes = useStyles();
  const formikRef = useRef();
  const { t, open, isSubmitting, assessmentMethod } = props;
  const [errorMessage, setErrorMessage] = useState();
  const [isValidRanges, setIsValidRanges] = useState(false);

  let title = t('new_assessment_method');
  let buttonTitle = t('common:create');
  if (assessmentMethod && assessmentMethod.id) {
    title = t('edit_assessment_method');
    buttonTitle = t('common:save');
  }
  const validationSchema = Yup.object().shape({
    methodName: Yup.string().trim().required(t('common:required_message')),
    ranges: Yup.array().of(
      Yup.object().shape({
        name: Yup.string().trim().required(t('common:required_message')),
        rangeFrom: Yup.string()
          .nullable()
          .matches(/^[+-]?\d+(\.\d+)?$/, t('common:required_message')),
        // .required(t('common:required_message')),
        // rangeTo: Yup.string()
        //   .nullable()
        //   .matches(/^[+-]?\d+(\.\d+)?$/)
        //   .required(t('common:required_message')),
      })
    ),
  });

  const checkInvalidField = (errors, touched, index, fieldName) => (
      errors.ranges &&
      errors.ranges[index]?.[fieldName] &&
      touched.ranges &&
      touched.ranges[index]?.[fieldName]
    );

  const validMinMaxInput = (max) => (values) => {
    const maxNumber = max ? parseFloat(max) - 0.1 : 100;
    return (
      values.formattedValue === '' ||
      (values.floatValue >= 0 && values.floatValue <= maxNumber)
    );
  };

  const handleFormErrorMessage = (errors, touched, index, fieldName) => errors.ranges &&
      errors.ranges[index]?.[fieldName] &&
      touched.ranges &&
      touched.ranges[index]?.[fieldName]
      ? errors.ranges[index]?.[fieldName]
      : null;

  const onAddAnotherRow =
    (arrayHelpers, values = []) =>
    () => {
      setIsValidRanges(true); // to hide error invalid range 'error_invalid_ranges_assessment_method' onChange
      const rangeLength = values.length;
      if (parseFloat(values[rangeLength - 1]?.rangeFrom) > 0) {
        arrayHelpers.push({
          name: '',
          rangeFrom: '0',
          rangeTo: `< ${values[rangeLength - 1]?.rangeFrom}`,
        });
      }
    };

  const onRemoveRow = (index, arrayHelpers, ranges) => {
    setIsValidRanges(true); // to hide error invalid range 'error_invalid_ranges_assessment_method' onChange
    const newRanges = [...ranges];
    if (newRanges[index + 1]?.rangeTo) {
      newRanges[index + 1].rangeTo = ` ${newRanges[index].rangeTo}`; // fix bug 2587
    }

    newRanges.splice(index, 1);
    arrayHelpers.remove(index);
    formikRef.current.setFieldValue('ranges', newRanges);
  };

  const onChangeRangeFrom = useCallback((el, index, arrayHelpers, ranges) => {
    if (formikRef.current) {
      const newRanges = [...ranges];
      if (newRanges[index + 1]?.rangeTo) {
        newRanges[index + 1].rangeTo = `< ${el.target.value}`;
      }
      newRanges[index].rangeFrom = el.target.value;
      formikRef.current.setFieldValue('ranges', newRanges);
    }
    setIsValidRanges(true); // to hide error invalid range 'error_invalid_ranges_assessment_method' onChange
  }, []);

  const processPayload = (values = {}) => {
    const newValues = cloneDeep(values);
    const ranges = newValues.ranges?.map((range) => {
      range.rangeTo = toString(range.rangeTo).replace('< ', '');
      range.name = range.name.trim();
      return range;
    });
    if (Number(last(ranges).rangeFrom) !== 0) {
      setIsValidRanges(false);
    } else {
      setIsValidRanges(true);
    }
    return { ...newValues, ranges };
  };

  useEffect(() => {
    if (!!assessmentMethod) {
      const cloneAssessmentMethod = cloneDeep(assessmentMethod);
      const processAssessmentMethod = cloneAssessmentMethod?.ranges?.map(
        (range, index) => {
          if (index > 0) {
            range.rangeTo =
              toString(range.rangeTo).indexOf('<') === -1
                ? `< ${range.rangeTo}`
                : `${range.rangeTo}`;
          }

          return range;
        }
      );

      formikRef.current.setValues({
        methodName: assessmentMethod?.methodName?.trim(),
        ranges: processAssessmentMethod,
      });
    } else {
      !!formikRef && formikRef.current.resetForm();
    }
  }, [assessmentMethod]);

  useEffect(() => {
    if (!!props?.error) {
      if (props?.error.subcode) {
        const customError = [];
        switch (props?.error.subcode) {
          case 1: {
            customError[props.error?.mainPos] = {};
            customError[props.error?.mainPos].rangeTo = t(
              'scale_range_overlap_message'
            );
            formikRef.current.setFieldError('ranges', customError);
            break;
          }
          case 2: {
            customError[props.error?.mainPos] = {};
            customError[props.error?.mainPos].name = t(
              'common:this_name_already_exists'
            );
            formikRef.current.setFieldError('ranges', customError);
            break;
          }
          case 409: {
            formikRef.current.setFieldError(
              'methodName',
              t('common:this_name_already_exists')
            );
            break;
          }
          default: {
            setErrorMessage(props.error?.message || t('error:general_error'));
          }
        }
      }
    }
  }, [props, props.error, t]);

  return (
    <Formik
      innerRef={formikRef}
      initialValues={{
        ranges: [{ name: '', rangeFrom: '0', rangeTo: '100' }],
        methodName: '',
      }}
      validationSchema={validationSchema}
      validateOnChange={true}
      validateOnBlur={false}
      onSubmit={(values) => {
        const payload = processPayload(values);
        if (!!assessmentMethod) {
          props.onEditAssessmentMethod(payload);
        } else {
          props.onCreateAssessmentMethod(payload);
        }
      }}
    >
      {({ errors, touched, handleSubmit, values, submitCount }) => (
        <TblDialog
          title={title}
          open={open}
          fullWidth={true}
          maxWidth={'sm'}
          footer={
            <>
              <TblButton
                variant='outlined'
                size='medium'
                color='primary'
                onClick={props.onCancel}
              >
                {t('common:cancel')}
              </TblButton>
              <TblButton
                disabled={isSubmitting}
                isShowCircularProgress={isSubmitting}
                size='medium'
                variant='contained'
                color='primary'
                onClick={handleSubmit}
              >
                {buttonTitle}
              </TblButton>
            </>
          }
        >
          <TblIndicator content={t('unable_to_update_grading_scale')} />
          <Form>
            <Box>
              <Field
                as={TblInputs}
                placeholder={t('common:enter_name')}
                name='methodName'
                label={t('common:name')}
                value={values.methodName}
                required
                inputProps={{ maxLength: 254 }}
                error={errors.methodName && touched.methodName}
                errorMessage={
                  errors.methodName && touched.methodName
                    ? errors.methodName
                    : false
                }
              />
            </Box>
            <Box mt={3}>
              <FieldArray
                name='ranges'
                render={(arrayHelpers) => (
                  <div>
                    <Box>
                      <div className={classes.gradingScaleTitle}>
                        {t('define_your_grading_scale')}
                      </div>
                      <div className={classes.exampleText}>
                        {t('example_assessment_method')}
                      </div>
                      <div className={classes.root}>
                        <Grid container spacing={0}>
                          <Grid item xs={4} className={classes.headerItem}>
                            {t('common:name')}
                          </Grid>
                          <Grid item xs={4} className={classes.headerItem}>
                            {t('first_range')}
                          </Grid>
                          <Grid item xs={4} className={classes.headerItem}>
                            {t('second_range')}
                          </Grid>
                        </Grid>
                        {values.ranges &&
                          values.ranges.length > 0 &&
                          values.ranges.map((range, index) => (
                            <Grid
                              container
                              key={index}
                              spacing={0}
                              className={classes.fontItemWrapper}
                            >
                              <Grid
                                item
                                xs={4}
                                className={clsx(classes.formItem, {
                                  [classes.error]: checkInvalidField(
                                    errors,
                                    touched,
                                    index,
                                    'name'
                                  ),
                                })}
                              >
                                <Field
                                  as={TblInputTable}
                                  disabled={assessmentMethod?.courses?.length}
                                  value={range.name}
                                  name={`ranges[${index}].name`}
                                  inputProps={{ maxLength: 254 }}
                                  noneBorder
                                  placeholder={t('enter_letter_grade')}
                                  required
                                  errorMessage={handleFormErrorMessage(
                                    errors,
                                    touched,
                                    index,
                                    'name'
                                  )}
                                />
                              </Grid>
                              <Grid
                                item
                                xs={4}
                                className={clsx(classes.formItem, {
                                  [classes.error]: checkInvalidField(
                                    errors,
                                    touched,
                                    index,
                                    'rangeFrom'
                                  ),
                                })}
                              >
                                <Field
                                  as={TblInputTable}
                                  disabled={assessmentMethod?.courses?.length}
                                  value={range.rangeFrom}
                                  name={`ranges[${index}].rangeFrom`}
                                  noneBorder
                                  placeholder={t('enter_first_range')}
                                  required
                                  inputType='number'
                                  isAllowed={validMinMaxInput(
                                    values.ranges[index - 1]?.rangeFrom
                                  )}
                                  errorMessage={handleFormErrorMessage(
                                    errors,
                                    touched,
                                    index,
                                    'rangeFrom'
                                  )}
                                  decimalScale={2}
                                  onChange={(value) =>
                                    onChangeRangeFrom(
                                      value,
                                      index,
                                      arrayHelpers,
                                      values.ranges
                                    )
                                  }
                                />
                              </Grid>
                              <Grid
                                item
                                xs={4}
                                className={clsx(classes.formItem, {
                                  [classes.error]: checkInvalidField(
                                    errors,
                                    touched,
                                    index,
                                    'rangeTo'
                                  ),
                                })}
                              >
                                <Field
                                  as={TblInputTable}
                                  value={range.rangeTo}
                                  name={`ranges[${index}].rangeTo`}
                                  noneBorder
                                  placeholder={t('enter_second_range')}
                                  required
                                  errorMessage={handleFormErrorMessage(
                                    errors,
                                    touched,
                                    index,
                                    'rangeTo'
                                  )}
                                  disabled
                                  decimalScale={2}
                                />
                              </Grid>
                              {index !== 0 &&
                                !assessmentMethod?.courses?.length && (
                                  <div
                                    onClick={() =>
                                      onRemoveRow(
                                        index,
                                        arrayHelpers,
                                        values.ranges
                                      )
                                    }
                                    className={classes.removeButton}
                                  >
                                    <CancelSharpIcon className={classes.icon} />
                                  </div>
                                )}
                            </Grid>
                          ))}
                      </div>
                    </Box>
                    {!isValidRanges && submitCount ? (
                      <div className={classes.errorText}>
                        {t('error_invalid_ranges_assessment_method')}
                      </div>
                    ) : null}
                    <Box mt={2}>
                      <Box mb={1}>
                        {!!errorMessage && (
                          <Alert severity='error'>{errorMessage}</Alert>
                        )}
                      </Box>
                      {!assessmentMethod?.courses?.length && (
                        <span
                          className={classes.addText}
                          onClick={onAddAnotherRow(arrayHelpers, values.ranges)}
                        >
                          {t('add_another_row')}
                        </span>
                      )}
                    </Box>
                  </div>
                )}
              />
            </Box>
          </Form>
        </TblDialog>
      )}
    </Formik>
  );
};
ManageAssessmentMethod.propTypes = {
  onCancel: PropTypes.func,
  error: PropTypes.object,
  t: PropTypes.func,
  assessmentMethod: PropTypes.object,
  open: PropTypes.bool,
  onEditAssessmentMethod: PropTypes.func,
  onCreateAssessmentMethod: PropTypes.func,
  isSubmitting: PropTypes.bool,
};

export default ManageAssessmentMethod;
