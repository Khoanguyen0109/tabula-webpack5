import React, { useRef, useState } from 'react';

// import withStyles from '@mui/styles/withStyles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';

import TblButton from 'components/TblButton';
// import makeStyles from '@mui/styles/makeStyles';
import TblDialog from 'components/TblDialog';
import TblIndicator from 'components/TblIndicator';
import TblInputs from 'components/TblInputs';
import TblSelect from 'components/TblSelect';
import TblSplitButton from 'components/TblSplitButton';

import { Field, Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import * as Yup from 'yup';

// const useStyles = makeStyles((theme) => ({}));
const indicatorStyle = {
  fontSize: '12px',
  background: '#FFFFFF',
  padding: '4px 0px',
  lineHeight: '1.5',
};
let clickViewDetail = false;
function CreateTemplateDialog(props) {
  const { t, isOpenDialog, onSubmit, toggleDialog, myCoursesList } = props;
  const [isSelectCourse, setIsSelectCourse] = useState(false);
  const [gradeLevel, setGradeLevel] = useState([]);
  // const classes = useStyles();
  const formikRef = useRef();
  const [isDisableButton, setIsDisableButton] = useState(false);
  const CreateNewTemplateSchema = Yup.object().shape({
    templateName: Yup.string().required(t('common:required_message')),
    course: Yup.string().required(t('common:required_message')),
    subject: Yup.string().required(t('common:required_message')),
    graveLevel: Yup.string().required(t('common:required_message')),
  });
  const handleSubmit = ({ isViewDetail }) => {
    clickViewDetail = !!isViewDetail;
    setIsDisableButton(!!isViewDetail);
    if (formikRef.current) {
      formikRef.current.submitForm();
    }
  };

  const handleSelectCourse = (course) => {
    setGradeLevel(course.subject.subjectGradeLevel);
    setIsSelectCourse(true);
    formikRef.current.setValues({
      ...formikRef.current.values,
      subject: course.subject.subjectName,
      subjectId: course.subject.subjectId,
      course: course.id,
      graveLevel: '',
    });
  };
  const options = [ { label: 'Save and edit detail' , onItemClick: () => handleSubmit({ isViewDetail: true }) }];
  // const handleChange = (fieldName, value) => {
  //   if (formikRef) {
  //     formikRef.current.setFieldValue(fieldName, value);
  //     formikRef.current.setFieldTouched(fieldName, true);
  //   }
  // };
  return (
    <TblDialog
      open={isOpenDialog}
      maxWidth='xs'
      title={t('create_template')}
      fullWidth={true}
      footer={
        <Box
          mt={2}
          style={{
            display: 'flex',
            width: '100%',
            flexDirection: 'row-reverse',
          }}
        >
          <Box>
            <TblSplitButton
              primaryLabel={t('common:save')}
              disabled={isDisableButton}
              optionItems={options}
              onClickPrimary={handleSubmit}
            />
          </Box>
          <Box mr={1}>
            <TblButton
              variant='outlined'
              size='medium'
              color='primary'
              onClick={toggleDialog}
            >
              {t('common:cancel')}
            </TblButton>
          </Box>
        </Box>
      }
    >
      <Formik
        innerRef={formikRef}
        initialValues={{
          templateName: '',
          subject: '',
          graveLevel: '',
          course: '',
          subjectId: '',
        }}
        enableReinitialize
        validationSchema={CreateNewTemplateSchema}
        validateOnChange={true}
        validateOnBlur={true}
        onSubmit={(value) => {
          onSubmit({ ...value, clickViewDetail });
        }}
      >
        {({ errors, touched, values }) => (
            <Form>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Box>
                    <Field
                      as={TblInputs}
                      name='templateName'
                      label={t('common:template_name')}
                      placeholder={t('common:enter_template_name')}
                      value={values.templateName}
                      required
                      inputProps={{ maxLength: 100 }}
                      error={errors.templateName}
                      errorMessage={errors.templateName}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Box>
                    <Field
                      as={TblSelect}
                      name='course'
                      label={t('common:course')}
                      placeholder={t('common:select_a_course')}
                      value={values.course}
                      required
                      children={myCoursesList.map((course) => (
                        <MenuItem
                          onClick={() => handleSelectCourse(course)}
                          key={course.id}
                          value={course.id}
                        >
                          {course.courseName}
                        </MenuItem>
                      ))}
                      error={errors.course && touched.course}
                      errorMessage={errors?.course ?? ''}
                    />
                  </Box>

                  <TblIndicator
                    style={{
                      ...indicatorStyle,
                      marginTop: '4px',
                    }}
                    content={t('common:create_template_indicator')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box>
                    <Field
                      as={TblInputs}
                      name='subject'
                      disabled={true}
                      label={t('common:subject')}
                      placeholder={t('common:subject_name')}
                      required
                      error={errors.subject && touched.subject}
                      errorMessage={
                        errors.subject && touched.subject
                          ? errors.subject
                          : false
                      }
                    />
                  </Box>
                  <TblIndicator
                    style={indicatorStyle}
                    content={t('common:subject_indicator')}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box>
                    <Field
                      as={TblSelect}
                      name='graveLevel'
                      disabled={!isSelectCourse}
                      label={t('common:grade_level')}
                      value={values.graveLevel}
                      placeholder={t('common:select_grade_level')}
                      required
                      children={gradeLevel.map((glv) => (
                        <MenuItem key={glv.id} value={glv.id}>
                          {glv.name}
                        </MenuItem>
                      ))}
                      error={errors.graveLevel}
                      errorMessage={errors.graveLevel}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Form>
          )}
      </Formik>
    </TblDialog>
  );
}
CreateTemplateDialog.propTypes = {
  classes: PropTypes.object,
  isOpenDialog: PropTypes.bool,
  setOpenDialog: PropTypes.func,
  t: PropTypes.func,
  onSubmit: PropTypes.func,
  toggleDialog: PropTypes.func,
  myCoursesList: PropTypes.array,
};

CreateTemplateDialog.defaultProps = {
  isOpenDialog: false,
};

export default CreateTemplateDialog;
