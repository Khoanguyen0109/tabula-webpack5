import React, { useRef, useState } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';

import TblButton from 'components/TblButton';
import TblDialog from 'components/TblDialog';
import TblIndicator from 'components/TblIndicator';
import TblSelect from 'components/TblSelect';
import TblSplitButton from 'components/TblSplitButton';

import { Field, Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import * as Yup from 'yup';

const indicatorStyle = {
  fontSize: '12px',
  background: '#FFFFFF',
  padding: '4px 0px',
  lineHeight: '1.5',
};
let clickViewDetail = false;
function SaveAsTemplateDialog(props) {
  const { t, isOpenDialog, onSubmit, toggleDialog, gradeLevel } = props;
  const formikRef = useRef();
  const [isDisableButton, setIsDisableButton] = useState(false);
  const SaveAsTemplateSchema = Yup.object().shape({
    graveLevel: Yup.string().required(t('common:required_message')),
  });
  const handleSubmit = ({ isViewDetail }) => {
    clickViewDetail = !!isViewDetail;
    setIsDisableButton(!!isViewDetail);
    if (formikRef.current) {
      formikRef.current.submitForm();
    }
  };
  const options = [
    {
      label: 'Save and edit detail',
      onItemClick: () => handleSubmit({ isViewDetail: true }),
    },
  ];

  return (
    <TblDialog
      open={isOpenDialog}
      maxWidth='xs'
      title={t('common:save_as_template')}
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
              color='primary'
              onClick={toggleDialog}
            >
              {t('common:cancel')}
            </TblButton>
          </Box>
        </Box>
      }
    >
      <TblIndicator
        style={indicatorStyle}
        content={t('common:save_as_template_content')}
      />
      <Formik
        innerRef={formikRef}
        initialValues={{
          graveLevel: '',
        }}
        validationSchema={SaveAsTemplateSchema}
        validateOnChange={false}
        validateOnBlur={false}
        onSubmit={(value) => {
          onSubmit({ ...value, clickViewDetail });
        }}
      >
        {({ errors, values }) => (
            <Form>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <Box>
                    <Field
                      as={TblSelect}
                      name='graveLevel'
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
SaveAsTemplateDialog.propTypes = {
  classes: PropTypes.object,
  isOpenDialog: PropTypes.bool,
  t: PropTypes.func,
  onSubmit: PropTypes.func,
  toggleDialog: PropTypes.func,
  gradeLevel: PropTypes.array,
};

SaveAsTemplateDialog.defaultProps = {
  isOpenDialog: false,
  gradeLevel: [],
};

export default SaveAsTemplateDialog;
