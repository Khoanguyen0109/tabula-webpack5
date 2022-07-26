import React, { useEffect, useRef, useState } from 'react';
import { Trans } from 'react-i18next';

import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';

// import isNil from 'lodash/isNil';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';

import TblConfirmDialog from 'components/TblConfirmDialog';
import TblSelect from 'components/TblSelect';

import { UPDATE_COURSE_SUBCODE } from 'shared/MyCourses/constants';

import { Field, Form, Formik } from 'formik';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
const defaultConfirmData = {
  show: false,
  message: '',
  fieldValue: '',
  newData: '',
  oldData: '',
  payloadData: '',
};
function ModifySchoolYearAndTerms(props) {
  const formikRef = useRef();
  const {
    t,
    formData,
    schoolYearList,
    termsList,
    hasPermission,
    updateSectionsAndMeetingTimes,
    updateSectionsAndMeetingTimesFailed,
    disabled
  } = props;
  // NOTE: initial states and props
  const [confirm, setConfirm] = useState(defaultConfirmData);

  const validationSchema = Yup.object().shape({
    termIds: Yup.array()
      .required(t('common:required_message'))
      .test(
        'termIds',
        t('error:restriction_of_course_meeting_time_input', {
          objectName: t('common:term', { count: 2 }),
        }),
        () => updateSectionsAndMeetingTimesFailed?.subcode !== UPDATE_COURSE_SUBCODE.CAN_NOT_UPDATE_TERM
      ),
    schoolYearId: Yup.string().required(t('common:required_message')),
  });

  useEffect(() => {
    if (!isEmpty(formData) && !!formikRef.current) {
      formikRef.current.resetForm();
    }
  }, [formData]);

  useEffect(() => {
    const subcode = updateSectionsAndMeetingTimesFailed?.subcode;
    if (!!formikRef.current && !!subcode) {
      switch (subcode) {
        case 1:
          formikRef.current.setFieldError(
            'schoolYearId',
            t('error:restriction_of_course_meeting_time_input', {
              objectName: t('common:school_year'),
            })
          );
          break;
        case UPDATE_COURSE_SUBCODE.CAN_NOT_UPDATE_TERM:
          formikRef.current.setFieldValue('termIds', formData?.termIds);
          // formikRef.current.setFieldError('termIds',t('error:restriction_of_course_meeting_time_input',{objectName: t('common:term', {count: 2})}));
          break;
        default:
          break;
      }
    }
  }, [formData, t, updateSectionsAndMeetingTimesFailed]);

  return (
    <div>
      {confirm.show && (
        <TblConfirmDialog
          open={confirm.show}
          cancelText={t('common:cancel')}
          okText={t('common:save')}
          title={t('common:warning')}
          message={confirm.message}
          onCancel={() => {
            formikRef.current.setFieldValue(
              `${confirm.fieldValue}`,
              confirm.oldData
            );
            setConfirm(defaultConfirmData);
          }}
          onConfirmed={() => {
            formikRef.current.setFieldValue(
              `${confirm.fieldValue}`,
              confirm.newData
            );
            updateSectionsAndMeetingTimes(confirm.data);
            setConfirm(defaultConfirmData);
          }}
        />
      )}
      <Formik
        enableReinitialize={true}
        innerRef={formikRef}
        initialValues={{
          schoolYearId: formData?.schoolYearId,
          termIds: formData?.termIds || [],
        }}
        validationSchema={validationSchema}
      >
        {({ values, errors, touched }) => (
            <Form>
              <Grid container>
                <Grid sm={8}>
                  <Field
                    as={TblSelect}
                    name='schoolYearId'
                    label={t('allCourses:school_year')}
                    placeholder={t('common:select')}
                    spacing='true'
                    disabled={!hasPermission || disabled}
                    error={!!(errors.schoolYearId && touched.schoolYearId)}
                    errorMessage={
                      !!(errors.schoolYearId && touched.schoolYearId)
                        ? errors.schoolYearId
                        : false
                    }
                    required
                    value={Number(values?.schoolYearId)}
                    children={schoolYearList.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.name}
                      </MenuItem>
                    ))}
                    onChange={(event) => {
                      if (!!!errors?.schoolYearId) {
                        setConfirm({
                          show: true,
                          message: (
                            <Trans i18nKey='warning_lose_course_content'>
                              You will lose all course content associated with
                              this {{ objectName: 'school year' }}. Are you
                              sure?
                            </Trans>
                          ),
                          fieldValue: 'schoolYearId',
                          newData: event.target.value,
                          oldData: formData?.schoolYearId,
                          data: {
                            schoolYearId: event.target.value,
                          },
                        });
                      }
                    }}
                  />
                </Grid>
                <Grid sm={8}>
                  <Field
                    as={TblSelect}
                    name='termIds'
                    multiple
                    label={t('allCourses:terms')}
                    spacing='true'
                    disabled={!hasPermission || disabled}
                    required
                    error={errors?.termIds}
                    errorMessage={errors?.termIds ?? false}
                    // children={termsList.map(item => (
                    //   <MenuItem key={item.id} value={item.id}>{item.termName}</MenuItem>
                    // ))}
                    placeholder
                    keyValue='id'
                    keyDisplay='termName'
                    checkboxOption={true}
                    options={termsList}
                    onClose={() => {
                      if (
                        !!!errors?.termIds &&
                        !isEqual(values.termIds, formData?.termIds)
                      ) {
                        setConfirm({
                          show: true,
                          message: (
                            <Trans i18nKey='warning_lose_course_content'>
                              You will lose all course content associated with
                              this {{ objectName: 'terms' }}. Are you sure?
                            </Trans>
                          ),
                          fieldValue: 'termIds',
                          oldData: formData?.termIds,
                          newData: values.termIds,
                          data: {
                            terms: values.termIds,
                          },
                        });
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Form>
          )}
      </Formik>
    </div>
  );
}

ModifySchoolYearAndTerms.propTypes = {
  t: PropTypes.func,
  formData: PropTypes.object,
  hasPermission: PropTypes.bool,
  updateSectionsAndMeetingTimes: PropTypes.func,
  schoolYearList: PropTypes.array,
  updateSectionsAndMeetingTimesFailed: PropTypes.shape({
    subcode: PropTypes.number
  }),
  termsList: PropTypes.array,
  disabled: PropTypes.bool
};

ModifySchoolYearAndTerms.defaultProps = {
  disabled: false
};

export default ModifySchoolYearAndTerms;
