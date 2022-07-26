/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import isEmpty from 'lodash/isEmpty';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import TblInputs from 'components/TblInputs';

import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import * as Yup from 'yup';

function DailyTemplateName({
  template,
  updateTemplate,
  error,
}) {
  const { t } = useTranslation(['schoolYear', 'common', 'error']);
  const validationSchema = Yup.object()
    .nullable()
    .shape({
      name: Yup.string().trim().required(t('common:required_message')),
    });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: { name: template?.templateName },
    validationSchema: validationSchema,
    validateOnChange: true,
    validateOnBlur: false,
  });

  const {
    values: { name },
    errors,
    setFieldValue,
    setFieldTouched,
    resetForm,
    setFieldError,
  } = formik;

  const onSave = () => {
    // if (name !== template.templateName) {
    //   updateTemplate(name, template.id);
    // }

    if (!errors?.name) {
      if (name !== template.templateName) {
        updateTemplate(name, template.id);
      } else {
        // enqueueSnackbar(t('common:change_saved'), { variant: 'success' });
      }
    }
  };

  useEffect(() => {
    const { id } = template;
    const { subcode, templateId } = error || {};
    if (!isEmpty(error) && subcode === 409 && +templateId === +id) {
      setFieldError('name', t('common:this_name_already_exists'));
    }
  }, [error]);

  return (
    <div>
      {/* {showGeneralError && <Grid xs={12} sm={8}>
        <Alert severity='error'>
          {t('error:general_error')}
        </Alert>
      </Grid>} */}
      <form onSubmit={(e) => e.preventDefault()}>
        <Grid container spacing={1} alignContent='center' alignItems='center'>
          <Grid item xs={12} sm={8}>
            <TblInputs
              name='name'
              singleSave
              required
              label={t('daily_template_name')}
              type='text'
              error={!!errors.name}
              errorMessage={errors.name ? <div>{errors.name}</div> : false}
              inputProps={{ maxLength: 254 }}
              value={name}
              onChange={(e) => {
                setFieldValue('name', e.target.value);
                setFieldTouched('name', true);
              }}
              onAbort={resetForm}
              onSave={onSave}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Box
              size='small'
              component='div'
              style={{ backgroundColor: template?.color, marginTop: 24 }}
              width='24px'
              mt={1}
              height='24px'
              borderRadius='4px'
            />
          </Grid>
        </Grid>
      </form>
    </div>
  );
}

DailyTemplateName.propTypes = {
  location: PropTypes.object,
  template: PropTypes.object,
  updateTemplate: PropTypes.func,
  authContext: PropTypes.object,
  enqueueSnackbar: PropTypes.func,
  error: PropTypes.object,
};

export default React.memo(DailyTemplateName);
