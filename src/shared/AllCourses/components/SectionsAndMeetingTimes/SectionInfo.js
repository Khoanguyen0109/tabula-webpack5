import React, { useContext, useEffect, useRef, useState } from 'react';
import { Trans } from 'react-i18next';

import trim from 'lodash/trim';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';

import TblConfirmDialog from 'components/TblConfirmDialog';
import TblInputs from 'components/TblInputs';

import { isTeacher } from 'utils/roles';

import { AuthDataContext } from 'AppRoute/AuthProvider';
import { Field, Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import * as Yup from 'yup';

const useStyles = makeStyles((theme) => ({
  root: {

  },
  btn: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    '& .MuiTypography-root': {
      color: theme.mainColors.red[0],
    }
  },
  title: {
    fontSize: theme.fontSize.small,
    paddingLeft: theme.spacing(1),
    fontWeight: theme.fontWeight.semi,
    marginBottom: theme.spacing(0.5)
  }
}));
function SectionInfo(props) {
  const classes = useStyles();
  const formikRef = useRef();
  const authContext = useContext(AuthDataContext);
  const isTeacherRole = isTeacher(authContext?.currentUser);

  const { t, data, saveData, deleteSection, saveDataFailed, hasPermission, disabled } = props;
  const [showConfirm, setShowConfirm] = useState({
    show: false,
    name: ''
  });

  const validationSchema = Yup.object().shape({
    name: Yup.string().trim()
      .required(t('common:required_message'))
  });

  useEffect(() => {
    if (saveDataFailed && saveDataFailed?.subcode === 5 && saveDataFailed?.sectionId === data.id && formikRef.current) {
      formikRef.current.setFieldError('name', t('common:this_name_already_exists'));
    };
  }, [data.id, saveDataFailed, t]);
  return (
    <div>
      {showConfirm.show && <TblConfirmDialog
        open={showConfirm.show}
        title={t('common:confirmation')}
        cancelText={t('common:cancel')}
        okText={t('common:remove')}
        message={<Trans i18nKey="'dialog:remove_object">Remove <b>{{ objectName: showConfirm.name }}</b> from this {{ object: 'course' }}?</Trans>}
        onCancel={() => setShowConfirm({ show: false, name: '' })}
        onConfirmed={() => {
          deleteSection(data?.id);
          setShowConfirm({ show: false, name: '' });
        }}
      />}
      <Formik
        innerRef={formikRef}
        initialValues={{ name: data?.name, physicalLocation: data.physicalLocation || '', url: data?.url || '' }}
        initialErrors={props.errors}
        validationSchema={validationSchema}
      >
        {({ values, setFieldValue, errors }) => (
            <Form>
              <Box mb={0.5}>
              <Grid container>
                <Grid sm={8}>
                  <Field
                    as={TblInputs}
                    singleSave
                    name='name'
                    label={t('section_name')}
                    required
                    disabled={!hasPermission}
                    errors={errors?.name}
                    errorMessage={errors?.name}
                    onAbort={() => {
                      setFieldValue('name', data.name);
                    }}
                    inputProps={{ maxLength: 254 }}
                    values={values.name}
                    onSave={() => {
                      if (!!!errors.name && data?.name !== values.name) {
                        saveData({
                          section: {
                            id: data.id,
                            sectionName: trim(values.name)
                          }
                        });
                      }
                    }}
                  />
                </Grid>
                {(hasPermission && !disabled )&& <Grid className={classes.btn}>
                  <Box ml={1} mt={3}>
                    <Typography
                      component='a'
href='#'
                      onClick={() => setShowConfirm({ show: true, name: values.name })}
                      variant='bodyMedium'
                    >{t('common:remove')}</Typography>
                  </Box>
                </Grid>
                }
              </Grid>
              </Box>
              
              <Grid container>
                <Grid item sm={4}>
                  <Box mr={1.5}>
                    <Field
                      as={TblInputs}
                      placeholder={t('enter_location')}
                      singleSave
                      name='physicalLocation'
                      label={t('physical_location')}
                      
                      disabled={!hasPermission && !isTeacherRole}
                      onAbort={() => {
                        setFieldValue('physicalLocation', data?.physicalLocation || '');
                      }}
                      inputProps={{ maxLength: 254 }}
                      values={values.physicalLocation}
                      onSave={() => {
                        if (!!!errors.physicalLocation && (data.physicalLocation || '') !== values.physicalLocation) {
                          saveData({
                            section: {
                              id: data.id,
                              physicalLocation: trim(values.physicalLocation)
                            }
                          });
                        }
                      }}
                    />
                  </Box>
                </Grid>
                <Grid item sm={4}>
                  <Box ml={1.5}>
                    <Field
                      as={TblInputs}
                      placeholder={t('enter_url')}
                      singleSave
                      name='url'
                      label={t('distance_learning_url')}
                      disabled={!hasPermission && !isTeacherRole}
                      onAbort={() => {
                        setFieldValue('url', data?.url || '');
                      }}
                      inputProps={{ maxLength: 254 }}
                      values={values.url}
                      onSave={() => {
                        if (!!!errors.url && (data.url || '') !== values.url) {
                          saveData({
                            section: {
                              id: data.id,
                              url: trim(values.url)
                            }
                          });
                        }
                      }}
                    />
                  </Box>
                </Grid>

              </Grid>
            </Form>
          )}
      </Formik>
    </div>
  );
}

SectionInfo.propTypes = {
  t: PropTypes.func,
  saveData: PropTypes.func,
  hasPermission: PropTypes.bool,
  errors: PropTypes.object,
  data: PropTypes.object,
  deleteSection: PropTypes.func,
  saveDataFailed: PropTypes.shape({
    subcode: PropTypes.number,
    sectionId: PropTypes.number
  }),
  disabled: PropTypes.bool
};
SectionInfo.defaultProps = {
  disabled: false
};
export default SectionInfo;
