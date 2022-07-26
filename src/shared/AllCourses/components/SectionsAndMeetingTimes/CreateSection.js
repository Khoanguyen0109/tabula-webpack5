/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';

import isNil from 'lodash/isNil';
import trim from 'lodash/trim';

import Grid from '@mui/material/Grid';

import TblButton from 'components/TblButton';
import TblDialog from 'components/TblDialog';
import TblInputs from 'components/TblInputs';

import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import * as Yup from 'yup';

function CreateSection(props) {
  // NOTE: get data from props
  const { t, saveData, saveDataFailed, visibleDialog, toggleDialog } = props;

  // NOTE: handle with form formik
  const validationSchema = Yup.object()
    .default(null)
    .nullable()
    .shape({
      name: Yup.string().trim().required(t('common:required_message')),
    });

  const formik = useFormik({
    initialValues: { name: '' },
    validationSchema: validationSchema,
    validateOnChange: true,
    validateOnBlur: false,
    onSubmit: (values) => {
      const { name } = values;
      const payload = {
        section: {
          sectionName: trim(name),
        },
      };
      saveData(payload);
    },
  });

  const {
    values: { name },
    errors,
    touched,
    isSubmitting,
    setFieldError,
    setSubmitting,
  } = formik;
  // NOTE: handle react lifecycle

  useEffect(() => {
    if (!isNil(saveDataFailed)) {
      setFieldError('name', t('common:this_name_already_exists'));
      setSubmitting(false);
    }
  }, [saveDataFailed]);

  return (
    <div>
      {visibleDialog && (
        <TblDialog
          open={visibleDialog}
          title={t('new_section')}
          size='large'
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
                disabled={isSubmitting}
                isShowCircularProgress={isSubmitting}
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
                  required
                  placeholder={t('common:enter_name')}
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
          </form>
        </TblDialog>
      )}
    </div>
  );
}

CreateSection.propTypes = {
  t: PropTypes.func,
  visibleDialog: PropTypes.bool,
  toggleDialog: PropTypes.func,
  saveData: PropTypes.func,
  saveDataFailed: PropTypes.object,
};

export default CreateSection;
