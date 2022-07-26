import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grid from '@mui/material/Grid';
import ListSubheader from '@mui/material/ListSubheader';
import MenuItem from '@mui/material/MenuItem';

import TblActivityIcon from 'components/TblActivityIcon';
import TblDialog from 'components/TblDialog';
import TblSelect from 'components/TblSelect';

import { COURSE_ITEM_TYPE } from 'utils/constants';

import { USER_BEHAVIOR } from 'shared/User/constants';

import { AuthDataContext } from 'AppRoute/AuthProvider';
import { useFormik } from 'formik';
import myCoursesActions from 'modules/MyCourses/actions';
import {
  convertedCourseDay,
  getInitialScrollOffset,
} from 'modules/MyCourses/utils';
import PropTypes from 'prop-types';
import { setUrlParam } from 'utils';
import * as Yup from 'yup';

import DialogActions from './DialogActions';
import Helper from './Helper';

function LessonDueTimeDialog(props) {
  const dispatch = useDispatch();
  const { t } = useTranslation(['myCourses', 'common', 'dialog']);
  const authContext = useContext(AuthDataContext);
  const {
    organizationId,
    settings: { behavior },
  } = authContext.currentUser; 
  const { visible, toggleCloseDialog } = props;
  const lessonDetail = useSelector((state) => state.AllCourses.lessonDetail);
  const history = useHistory();
  const location = useLocation();
  const { unitId, courseId, id } = lessonDetail;
  const courseDays = useSelector((state) => state.AllCourses.courseDays);
  const currentDayId = useSelector((state) => state.AllCourses.currentDayId);
  const mcUpdateMasterItemSuccess = useSelector(
    (state) => state.AllCourses.mcUpdateMasterItemSuccess
  );
  const [modalError, setModalError] = useState('');
  const convertedData = convertedCourseDay(courseDays);

  const handlePublish = (values) => {
    dispatch(
      myCoursesActions.mcUpdateMasterItem({
        orgId: organizationId,
        courseDayId: values.assignDateId,
        courseId,
        unitId,
        activity: {
          lessonId: id,
          isPublish: true,
        },
      })
    );
  };

  const validation = Yup.object().shape({
    assignDateId: Yup.number().required(t('common:required_message')),
  });

  const formik = useFormik({
    initialValues: {
      assignDateId: '',
    },
    validationSchema: validation,
    onSubmit: handlePublish,
  });
  const {
    values,
    touched,
    errors,
    setFieldValue,
    // setFieldTouched,
    resetForm,
    isSubmitting,
    // setFieldError,
    // validateForm,
    setSubmitting,
    submitCount,
    handleSubmit,
  } = formik;

  const handleChange = (name, value) => {
    setFieldValue(name, value);
    setModalError('');
  };

  const onClose = () => {
    resetForm();
    toggleCloseDialog();
  };

  useEffect(() => {
    if (mcUpdateMasterItemSuccess) {
      setSubmitting(false);
      toggleCloseDialog();
      if (!behavior.includes(USER_BEHAVIOR.HAVE_PLANED)) {
        dispatch(
          myCoursesActions.myCoursesSetState({
            currentCourseDayId: values.assignDateId.toString(),
            firstTime: true,
          })
        );
        setUrlParam(location, history, { active: 'plan' }, null);
      }
    }
    return () => {
      dispatch(
        myCoursesActions.myCoursesSetState({
          lessonDetail: {},
          mcUpdateMasterItemSuccess: null,
        })
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mcUpdateMasterItemSuccess]);

  return (
    <TblDialog
      open={visible}
      onClose={onClose}
      title={
        <TblActivityIcon
          type={COURSE_ITEM_TYPE.LESSON}
          name={lessonDetail.lessonName}
        />
      }
      fullWidth
      footer={
        <DialogActions
          isSubmit={isSubmitting}
          onPublish={handleSubmit}
          onSkip={onClose}
        />
      }
    >
      <Helper />
      <form>
        {modalError && (
          <Box mb={2}>
            <Alert severity='error'>{modalError}</Alert>
          </Box>
        )}
        <div>
          <Grid container>
            <Grid item xs={12}>
              <Box mr={1.5}>
                {/* NOTE: Using TblInputs instead of TblSelect to improve performance, because of this field always disabled */}
                {/* <TblInputs required disabled label={t('assigned_on')} value={assignDateData?.courseDayName} placeholder='' /> */}
                <TblSelect
                  required
                  placeholder={t('common:please_select')}
                  label={t('delivered__on')}
                  name='assignDateId'
                  value={values.assignDateId}
                  onChange={(e) => handleChange('assignDateId', e.target.value)}
                  errorMessage={
                    !!(
                      errors.assignDateId &&
                      (touched.assignDateId || submitCount)
                    )
                      ? errors.assignDateId
                      : false
                  }
                  error={!!(errors.assignDateId && touched.assignDateId)}
                  initialScrollOffset={getInitialScrollOffset(
                    convertedData,
                    currentDayId,
                    44
                  )}
                >
                  {courseDays?.map((semester, semesterIndex) => [
                    <ClickAwayListener mouseEvent={false}>
                      <ListSubheader color='primary' disableSticky>
                        {semester?.termName}
                      </ListSubheader>
                    </ClickAwayListener>,
                    semester?.dates?.map((courseDay, courseDayIndex) => (
                      <MenuItem
                        value={Number(courseDay?.id)}
                        key={[semesterIndex, courseDayIndex]}
                      >
                        {courseDay?.courseDayName}
                      </MenuItem>
                    )),
                  ])}
                </TblSelect>
              </Box>
            </Grid>
          </Grid>
        </div>
      </form>
    </TblDialog>
  );
}

LessonDueTimeDialog.propTypes = {
  toggleCloseDialog: PropTypes.func,
  visible: PropTypes.bool,
};

export default LessonDueTimeDialog;
