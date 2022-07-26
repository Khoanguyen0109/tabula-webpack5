import React, { useCallback, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import isEmpty from 'lodash/isEmpty';

import Box from '@mui/material/Box';

import TblButton from 'components/TblButton';
import TblDialog from 'components/TblDialog';
import TblInputs from 'components/TblInputs';

import { AuthDataContext } from 'AppRoute/AuthProvider';
import { useFormik } from 'formik';
import moment from 'moment';
import * as Yup from 'yup';

import myCoursesActions from '../../actions';

function UpdateMakeUpDeadline() {
  const { t } = useTranslation('myCourses', 'common', 'error');
  const dispatch = useDispatch();

  const isShowUpdateMakeUpDeadlineModal = useSelector(
    (state) => state.AllCourses.isShowUpdateMakeUpDeadlineModal
  );
  const shadowQuizDetail = useSelector(
    (state) => state.AllCourses.shadowQuizDetail
  );
  const confirmData = useSelector((state) => state.AllCourses.confirmData);
  const relinkShadowItemSuccess = useSelector(
    (state) => state.AllCourses.relinkShadowItemSuccess
  );
  const isUpdateMakeUpDeadline = useSelector(
    (state) => state.AllCourses.isUpdateMakeUpDeadline
  );
  const error = useSelector((state) => state.AllCourses.error);
  const sectionDetail = useSelector((state) => state.AllCourses.sectionDetail);
  const authContext = useContext(AuthDataContext);

  const validationSchema = Yup.object().shape({
    makeupDeadline: Yup.date()
      .nullable()
      .typeError(t('common:invalid_date_format'))
      .test(
        'checkBeforeAfter',
        t('error:error_last_greater_equal_first', {
          first: t('taken_on'),
          last: t('make_up_deadline'),
        }),
        function (makeupDeadline) {
          const endTime = sectionDetail?.endTime;
          return !(
            makeupDeadline &&
            moment(makeupDeadline).isBefore(moment(endTime), 'day')
          );
        }
      ),
  });

  const onSubmit = useCallback(
    (values) => {
      if (
        !!confirmData?.type &&
        !!confirmData?.orgId &&
        !!confirmData?.id &&
        !!confirmData?.courseId
      ) {
        const { orgId, courseId, type, id } = confirmData;
        const newValues = { ...values };
        const data = {
          // NOTE: Set 23:59 to makeupDeadline follow TL-3091
          makeupDeadline: moment(newValues.makeupDeadline).isValid()
            ? moment(newValues.makeupDeadline).hour('23').minute('59').format()
            : null,
        };
        const payload = {
          orgId,
          courseId,
          type,
          shadowId: id,
          data: { relink: true, ...data },
          relinkShadowItemSuccess: false,
          isUpdateMakeUpDeadline: true,
        };
        dispatch(myCoursesActions.relinkShadowItem(payload));
      }
    },
    [confirmData, dispatch]
  );

  const formik = useFormik({
    initialValues: { makeupDeadline: shadowQuizDetail?.makeupDeadline ?? null },
    enableReinitialize: true,
    validationSchema: validationSchema,
    validateOnChange: true,
    validateOnBlur: false,
    onSubmit: onSubmit,
  });

  const {
    values,
    touched,
    errors,
    setFieldValue,
    resetForm,
    // validateForm,
    submitCount,
    handleSubmit,
    setFieldTouched,
    setFieldError,
  } = formik;

  const onCloseDialog = useCallback(() => {
    resetForm({ errors: {}, touched: {} });
    dispatch(
      myCoursesActions.myCoursesSetState({
        isShowUpdateMakeUpDeadlineModal: false,
        error: {},
        isUpdateMakeUpDeadline: false,
      })
    );
  }, [dispatch, resetForm]);

  useEffect(() => {
    if (isShowUpdateMakeUpDeadlineModal) {
      const { orgId, courseId } = confirmData;
      const courseDayId = shadowQuizDetail?.masterQuiz?.executeDateId;
      const sectionId = shadowQuizDetail?.executeDate?.sectionId;
      if (orgId && courseId && courseDayId && sectionId) {
        const {
          organization: { timezone },
        } = authContext.currentUser;
        dispatch(
          myCoursesActions.getSectionDetail({
            orgId,
            courseId,
            courseDayId,
            sectionId,
            urlParams: { timezone },
          })
        );
      }
    }
  }, [
    authContext.currentUser,
    confirmData,
    dispatch,
    isShowUpdateMakeUpDeadlineModal,
    shadowQuizDetail,
  ]);

  useEffect(() => {
    if (
      (relinkShadowItemSuccess || !isEmpty(error)) &&
      isUpdateMakeUpDeadline &&
      isShowUpdateMakeUpDeadlineModal
    ) {
      onCloseDialog();
    }
  }, [
    error,
    isShowUpdateMakeUpDeadlineModal,
    isUpdateMakeUpDeadline,
    onCloseDialog,
    relinkShadowItemSuccess,
  ]);

  useEffect(() => {
    if (isShowUpdateMakeUpDeadlineModal) {
      setFieldError(
        'makeupDeadline',
        t('error:error_last_greater_equal_first', {
          first: t('taken_on'),
          last: t('make_up_deadline'),
        })
      );
      setFieldTouched('makeupDeadline', true);
    }
  }, [isShowUpdateMakeUpDeadlineModal, setFieldError, setFieldTouched, t]);

  return (
    <TblDialog
      open={isShowUpdateMakeUpDeadlineModal}
      footer={
        <>
          <TblButton variant='outlined' color='primary' onClick={onCloseDialog}>
            {t('undo_relinking')}
          </TblButton>
          <TblButton variant='contained' color='primary' onClick={handleSubmit}>
            {t('common:save')}
          </TblButton>
        </>
      }
    >
      {t('make_up_deadline_pop_up_content', {
        sectionName: shadowQuizDetail?.executeDate?.section?.sectionName,
      })}
      <Box mt={2}>
        <form>
          <TblInputs
            name='makeupDeadline'
            label={t('make_up_deadline')}
            inputType='date'
            onChange={(value) => {
              if (value !== values.makeupDeadline) {
                setFieldValue('makeupDeadline', value);
                setFieldTouched('makeupDeadline', true);
              }
            }}
            error={
              !!(
                errors.makeupDeadline &&
                (touched.makeupDeadline || submitCount)
              )
            }
            errorMessage={
              !!(
                errors.makeupDeadline &&
                (touched.makeupDeadline || submitCount)
              )
                ? errors.makeupDeadline
                : false
            }
            value={values?.makeupDeadline}
          />
        </form>
      </Box>
    </TblDialog>
  );
}

export default UpdateMakeUpDeadline;
