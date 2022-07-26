import React from 'react';

import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';

import TblButton from 'components/TblButton';
import TblDialog from 'components/TblDialog';
import TblInputs from 'components/TblInputs';

import { Field, Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import * as Yup from 'yup';

class ManageUnit extends React.PureComponent {

  componentDidUpdate(prevProps) {
    const { error, t } = this.props;
    if (!isEqual(prevProps.error, error) && error?.subcode === 409) {
      if (this.formikRef) {
        this.formikRef.setFieldError('unitName', t('common:this_name_already_exists'));
      }
    }
  }

  render() {
    const { t, unitInfo, open, isSubmitting, error } = this.props;
    const validationSchema = Yup.object()
      .shape({
        unitName: Yup.string()
          .trim()
          .required(t('common:required_message'))
      });
    return (
      <Formik
        innerRef={(node) => (this.formikRef = node)}
        initialValues={{ unitName: unitInfo?.unitName ?? '' }}
        validationSchema={validationSchema}
        validateOnChange={true}
        validateOnBlur={false}
        onSubmit={(values) => {
          if (this.props.onSubmit) {
            this.props.onSubmit(values);
          }
        }}
      >
        {({ errors, touched, handleSubmit, resetForm, submitCount }) => (
          <TblDialog
            fullWidth
            open={open}
            title={t(!isEmpty(unitInfo) ? 'edit_unit' : 'new_unit')}
            footer={
              <>
                <TblButton
                  size='medium'
variant='outlined'
color='primary'
                  onClick={() => {
                    if (this.props.onCancel) {
                      this.props.onCancel();
                    }
                    resetForm();
                  }}
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
                  {!isEmpty(unitInfo) ? t('common:save') : t('common:create')}
                </TblButton>
              </>
            }
          >
            <Form>
              {!isEmpty(error) && error?.subcode !== 409 &&
                <Box mb={2}>
                  <Alert severity='error'>
                    {error?.message}
                  </Alert>
                </Box>
              }
              <Field
                name='unitName'
                as={TblInputs}
                required
                inputProps={{ maxLength: 254 }}
                label={t('unit_name')}
                error={!!(errors.unitName && (touched.unitName || submitCount))}
                errorMessage={!!(errors.unitName && (touched.unitName || submitCount)) ? errors.unitName : ''}
              />
            </Form>
          </TblDialog>
        )}
      </Formik>
    );
  }
}

ManageUnit.propTypes = {
  t: PropTypes.func,
  unitInfo: PropTypes.object,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  isSubmitting: PropTypes.bool,
  open: PropTypes.bool,
  error: PropTypes.object
};

export default ManageUnit;