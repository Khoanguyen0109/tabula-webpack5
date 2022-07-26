import React, { useEffect, useRef } from 'react';
import { withTranslation } from 'react-i18next';

import isEmpty from 'lodash/isEmpty';
import trim from 'lodash/trim';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';

import TblButton from 'components/TblButton';
import TblDialog from 'components/TblDialog';
import TblInputs from 'components/TblInputs';
import TblSelect from 'components/TblSelect';

import { Field, Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import * as Yup from 'yup';

function CreateDraftCourse(props) {
  const formikRef = useRef();
  const { isVisible, t, toggleDialog, createNewDraftCourseError, getTermsBySchoolYear, onSubmit } = props;
  const CreateNewDraftCourseSchema = Yup.object().shape({
    courseName: Yup.string()
      .required(t('common:required_message')),
    subject: Yup.object()
      .required(t('common:required_message')),
    termIds: Yup.array()
      .required(t('common:required_message')),
    schoolYearId: Yup.string()
      .required(t('common:required_message')),
  });

  const handleSubmit = () => {
    if (formikRef.current) {
      const { values } = formikRef.current;
      const payload = {...values};
      formikRef.current.submitForm(() => onSubmit(payload));
    }
  };

  const processPayload = (values) => {
      const payload = {...values};
      payload.courseName = trim(payload.courseName);
      return payload;
  };

  function getErrorMessage() {
    let errorMessage = undefined;
    if (!!createNewDraftCourseError) {
      errorMessage = createNewDraftCourseError.message
        ? createNewDraftCourseError.message
        : t('error:general_error');
    }
    return errorMessage;
  };

  const onCancel = () => {
    toggleDialog();
  };

  const handleChangeSchoolYear = (event, child) => {
    if (formikRef.current) {
      formikRef.current.setValues({...formikRef.current.values, schoolYearId: child?.props?.value, termIds: []});
      formikRef.current.setFieldTouched('termIds', false);
      getTermsBySchoolYear(child?.props?.value);
    }
  };

  useEffect(() => {
    if(formikRef.current) {
      if(isEmpty(formikRef.current?.values?.termIds)) {
        formikRef.current.setFieldValue('termIds', props.termsList.map((term) => term.id ));
      }
    }
  }, [props.termsList]);

  return (
    <>
      {isVisible &&
        <TblDialog
          open={isVisible}
          title={t('allCourses:new_course')}
          fullWidth={true}
          footer={
            <>
              <TblButton variant='outlined' size='medium' color='primary' onClick={onCancel}>{t('common:cancel')}</TblButton>
              <TblButton disabled={props.isBusy} isShowCircularProgress={props.isBusy} size='medium' variant='contained' color='primary' onClick={handleSubmit}>{t('common:create')}</TblButton>
            </>
          }
        >
          <Formik
            innerRef={formikRef}
            initialValues={{
              courseName: '',
              termIds: [],
              schoolYearId: '',
              subject: ''
            }}
            validationSchema={CreateNewDraftCourseSchema}
            onSubmit={(value) => {
              onSubmit(processPayload(value));
            }}
            validateOnChange={true}
            validateOnBlur={false}
          >
            {({ errors, touched, values }) => (
              <Form>
                {!!getErrorMessage() &&
                  <Alert severity='error'>
                    {getErrorMessage()}
                  </Alert>
                }
                <Grid container spacing={0} >
                  <Grid item xs={6} >
                    <Box mr={1.5}>
                      <Field
                        as={TblInputs}
                        name='courseName'
                        label={t('common:name')}
                        value={values.courseName}
                        required
                        inputProps={{ maxLength: 254 }}
                        error={errors.courseName && touched.courseName}
                        errorMessage={errors.courseName && touched.courseName ? errors.courseName : false}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={6} >
                    <Box ml={1.5}>
                      <Field
                        as={TblSelect}
                        name='subject'
                        label={t('allCourses:subject')}
                        placeholder={t('common:select')}
                        value={values.subject}
                        required
                        error={errors.subject && touched.subject}
                        errorMessage={errors.subject && touched.subject ? errors.subject : false}
                        // options={props.subjectsList}
                        children={props.subjectsList.map((item) => (
                          <MenuItem key={item.id} value={item}>{item.subjectName}</MenuItem>
                        ))}
                      />
                    </Box>
                  </Grid>
                </Grid>
                <Box mt={1}>
                  <Field
                    as={TblSelect}
                    name='schoolYearId'
                    value={values.schoolYearId}
                    label={t('allCourses:school_year')}
                    placeholder={t('common:select')}
                    required
                    error={errors.schoolYearId && touched.schoolYearId}
                    errorMessage={errors.schoolYearId && touched.schoolYearId ? errors.schoolYearId : false}
                    children={props.schoolYearList.map((item) => (
                      <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
                    ))}
                    onChange={handleChangeSchoolYear}
                  />
                </Box>
                <Box mt={2}>
                  <Field
                    as={TblSelect}
                    name='termIds'
                    multiple
                    value={ values.termIds }
                    label={t('allCourses:terms')}
                    required
                    placeholder={!values.schoolYearId ? t('allCourses:select_school_year_first') : t('common:select')}
                    labelField='termName'
                    error={errors.termIds && touched.termIds}
                    errorMessage={errors.termIds && touched.termIds ? errors.termIds : false}
                    // children={props.termsList.map(item => (
                    //   <MenuItem key={item} value={item}>{item.termName}</MenuItem>
                    // ))}
                    keyValue='id'
                    keyDisplay='termName'
                    checkboxOption={true}
                    options={props.termsList}
                  />
                </Box>
              </Form>
            )}
          </Formik>
        </TblDialog>
      }
    </>
  );
}

CreateDraftCourse.propTypes = {
  t: PropTypes.func,
  isVisible: PropTypes.bool,
  toggleDialog: PropTypes.func,
  onSubmit: PropTypes.func,
  isCreateNewDraftCourseSuccess: PropTypes.bool,
  setState: PropTypes.func,
  createNewDraftCourseError: PropTypes.object,
  subjectsList: PropTypes.array,
  schoolYearList: PropTypes.array,
  termsList: PropTypes.array,
  isBusy: PropTypes.bool,
  getTermsBySchoolYear: PropTypes.func
};

CreateDraftCourse.defaultProps = {
  subjectsList: [],
  schoolYearList: [],
  termsList: [],
  isBusy: false
};

export default withTranslation(['schoolYear', 'common', 'error'])(CreateDraftCourse);