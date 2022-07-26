import React, { useRef } from 'react';
import { withTranslation } from 'react-i18next';

import trim from 'lodash/trim';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';

import TblButton from 'components/TblButton';
import TblDialog from 'components/TblDialog';
import TblInputs from 'components/TblInputs';
import TblSelect from 'components/TblSelect';

import { Field, Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
function CreateDailyTemplate(props) {
  const {
    isVisible,
    t,
    toggleDialog,
    onSubmit,
    createDailyTemplateError,
    isLoading,
  } = props;
  const CreateDailyTemplateSchema = Yup.object().shape({
    templateName: Yup.string().trim().required(t('common:required_message')),
    quickApply: Yup.array(),
  });
  const dayNameOfWeek = [
    { id: 1, value: t('monday') },
    { id: 2, value: t('tuesday') },
    { id: 3, value: t('wednesday') },
    { id: 4, value: t('thursday') },
    { id: 5, value: t('friday') },
  ];
  const formikRef = useRef();

  const handleSubmit = () => {
    if (formikRef.current) {
      const { values } = formikRef.current;
      formikRef.current.submitForm(() => onSubmit(values));
    }
  };

  function checkSubcode(subcode) {
    switch (subcode) {
      case 409:
        return t('common:this_name_already_exists');
      default:
        return t('error:general_error');
    }
  }

  function getErrorMessage() {
    let errorMessage = undefined;
    if (!!createDailyTemplateError) {
      errorMessage = createDailyTemplateError.subcode
        ? checkSubcode(createDailyTemplateError.subcode)
        : t('error:general_error');
    }
    return errorMessage;
  }

  const onCancel = () => {
    toggleDialog();
  };
  return (
    <>
      {isVisible && (
        <TblDialog
          open={isVisible}
          title={t('new_daily_template')}
          fullWidth={true}
          footer={
            <>
              <TblButton
                variant='outlined'
                color='primary'
                onClick={() => onCancel()}
              >
                {t('common:cancel')}
              </TblButton>
              <TblButton
                size='medium'
                variant='contained'
                color='primary'
                onClick={() => handleSubmit()}
                disabled={isLoading}
                isShowCircularProgress={isLoading}
              >
                {t('common:create')}
              </TblButton>
            </>
          }
        >
          <Formik
            innerRef={formikRef}
            initialValues={{
              templateName: '',
              quickApply: [],
            }}
            validationSchema={CreateDailyTemplateSchema}
            onSubmit={(value) => {
              onSubmit(
                Object.assign(value, { templateName: trim(value.templateName) })
              );
            }}
          >
            {({ errors, touched, values, handleChange }) => (
              <Form>
                {!!getErrorMessage() && (
                  <Alert severity='error'>{getErrorMessage()}</Alert>
                )}
                <Field
                  as={TblInputs}
                  name='templateName'
                  label={t('common:name')}
                  required
                  inputProps={{ maxLength: 254 }}
                  error={errors.templateName && touched.templateName}
                  errorMessage={
                    errors.templateName && touched.templateName
                      ? errors.templateName
                      : false
                  }
                />
                <Box mt={2}>
                  <Field
                    label={t('quickly_apply_to')}
                    name='quickApply'
                    as={TblSelect}
                    onChange={handleChange}
                    multiple
                    value={values.quickApply}
                    // helperLabel={t('quickly_apply_to')}
                    keyValue='id'
                    keyDisplay='value'
                    checkboxOption={true}
                    options={dayNameOfWeek}
                  >
                    {/* {dayNameOfWeek.map(item => (
                      <MenuItem key={item.id} value={item.id}>{item.value}</MenuItem>
                    ))} */}
                  </Field>
                </Box>
              </Form>
            )}
          </Formik>
        </TblDialog>
      )}
    </>
  );
}

CreateDailyTemplate.propTypes = {
  t: PropTypes.func,
  isVisible: PropTypes.bool,
  toggleDialog: PropTypes.func,
  onSubmit: PropTypes.func,
  isCreateDailyTemplateSuccess: PropTypes.bool,
  setState: PropTypes.func,
  createDailyTemplateError: PropTypes.object,
  isLoading: PropTypes.bool,
};

export default withTranslation(['schoolYear', 'common', 'error'])(
  CreateDailyTemplate
);
