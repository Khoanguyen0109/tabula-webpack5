import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import isEmpty from 'lodash/isEmpty';

import TblAutocomplete from 'components/TblAutocomplete';
import TblButton from 'components/TblButton';
import TblDialog from 'components/TblDialog';

import { AuthDataContext } from 'AppRoute/AuthProvider';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import * as Yup from 'yup';

import allCoursesActions from '../actions';

function AddPrimaryTeacher(props) {
  const { isVisible, toggleDialog, teachers, primaryTeacher, isBusy } = props;
  const dispatch = useDispatch();
  const authContext = useContext(AuthDataContext);
  const { organizationId } = authContext.currentUser;
  const { t } = useTranslation(['allCourses', 'common', 'error']);

  const onCancel = () => {
    toggleDialog();
  };

  const handleSubmit = () => {
    setFieldTouched('teacher', true);

    if (isEmpty(errors)) {
      dispatch(
        allCoursesActions.updateTeachersInCourse({
          orgId: organizationId,
          courseId: props.location.pathname.split('/')[2],
          isBusy: true,
          data: { teacher: formik.values.teacher.id },
        })
      );
    }
  };

  const handleChange = (e, value) => {
    setFieldValue('teacher', value);
    setFieldTouched('teacher', true);
  };

  const validationSchema = Yup.object().shape({
    teacher: Yup.string().nullable().required(t('common:required_message')),
  });

  const formik = useFormik({
    initialValues: { teacher: primaryTeacher },
    validationSchema: validationSchema,
    validateOnChange: true,
    validateOnBlur: false,
  });

  const {
    // values: { teacher },
    touched,
    errors,
    setFieldValue,
    setFieldTouched,
  } = formik;
  useEffect(() => {
    setFieldValue('teacher', primaryTeacher);
  }, [primaryTeacher, setFieldValue]);

  return (
    <>
      {isVisible && (
        <TblDialog
          open={isVisible}
          title={t('allCourses:add_primary_teacher')}
          fullWidth={true}
          footer={
            <>
              <TblButton
                variant='outlined'
                color='primary'
                onClick={onCancel}
              >
                {t('common:cancel')}
              </TblButton>
              <TblButton
                disabled={isBusy}
                isShowCircularProgress={isBusy}
                variant='contained'
                color='primary'
                onClick={handleSubmit}
              >
                {t('common:add')}
              </TblButton>
            </>
          }
        >
          <form>
            <TblAutocomplete
              name='teacher'
              keyValue='name'
              required
              value={formik.values.teacher}
              options={teachers}
              // getOptionLabel={(option) => option?.name}
              onChange={handleChange}
              label={t('common:primary_teacher')}
              error={errors.teacher && touched.teacher}
              errorMessage={touched.teacher ? errors.teacher : null}
            />
          </form>
        </TblDialog>
      )}
    </>
  );
}

AddPrimaryTeacher.propTypes = {
  t: PropTypes.func,
  isVisible: PropTypes.bool,
  toggleDialog: PropTypes.func,
  onSubmit: PropTypes.func,
  isBusy: PropTypes.bool,
  location: PropTypes.object,
  teachers: PropTypes.array,
  primaryTeacher: PropTypes.object,
};

AddPrimaryTeacher.defaultProps = {
  teachers: [],
  isBusy: false,
};

export default AddPrimaryTeacher;
