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

import { QUIZ_TYPE } from '../../constants';

import DialogActions from './DialogActions';
import Helper from './Helper';

function QuizDueTimeDialog(props) {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const { t } = useTranslation(['myCourses', 'common', 'dialog']);
  const authContext = useContext(AuthDataContext);
  const {
    organizationId,
    settings: { behavior },
  } = authContext.currentUser;
  const { visible, toggleCloseDialog, quizType } = props;
  const currentQuiz = useSelector((state) => state.AllCourses.currentQuiz);
  const { unitId, courseId, id } = currentQuiz;

  const courseDays = useSelector((state) => state.AllCourses.courseDays);
  const currentDayId = useSelector((state) => state.AllCourses.currentDayId);
  const convertedData = convertedCourseDay(courseDays);
  const mcConsolidateQuizSuccess = useSelector(
    (state) => state.AllCourses.mcConsolidateQuizSuccess
  );
  const mcConsolidateQuizFailed = useSelector(
    (state) => state.AllCourses.mcConsolidateQuizFailed
  );
  const nonGeneratedSections = useSelector(
    (state) => state.AllCourses.nonGeneratedSections
  );

  const [modalError, setModalError] = useState('');
  const [filterByTerm, setFilterByTerm] = useState(courseDays);
  const isAnnounce = quizType === QUIZ_TYPE.ANNOUNCED;

  const handlePublish = (values) => {
    dispatch(
      myCoursesActions.mcConsolidateQuiz({
        orgId: organizationId,
        courseId,
        unitId,
        masterId: id,
        body: {
          announceDateId: isAnnounce
            ? values.announceDateId
            : values.executeDateId,
          executeDateId: values.executeDateId,
          isPublish: true,
        },
      })
    );
  };
  const validation = Yup.object().shape({
    executeDateId: Yup.number().required(t('common:required_message')),
    announceDateId: isAnnounce
      ? Yup.number().required(t('common:required_message'))
      : null,
  });

  const formik = useFormik({
    initialValues: {
      announceDateId: isAnnounce ? '' : null,
      executeDateId: '',
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
    setFieldError,
    // validateForm,
    submitCount,
    setSubmitting,
    handleSubmit,
  } = formik;

  const { announceDateId, executeDateId } = values;
  const announceFirst = !!announceDateId && executeDateId === '';
  const takenOnFirst = !!!announceDateId && executeDateId !== '';

  const handleChange = (name, value) => {
    setFieldValue(name, value);
    setModalError('');
  };

  const onClose = () => {
    resetForm();
    toggleCloseDialog();
  };

  useEffect(() => {
    if (announceFirst) {
      const termIdOfAnnounce = courseDays?.find((i) =>
        i.dates?.find((d) => Number(d.id) === Number(announceDateId))
      )?.termId;
      const filterCourseDaysByTermIdOfAnnounce = courseDays?.filter(
        (date) => date?.termId === termIdOfAnnounce
      );
      setFilterByTerm(filterCourseDaysByTermIdOfAnnounce);
    } else if (takenOnFirst) {
      const termIdOfTakeOn = courseDays?.find((i) =>
        i.dates?.find((d) => Number(d.id) === Number(executeDateId))
      )?.termId;
      const filterCourseDaysByTermIdOfTakenOn = courseDays?.filter(
        (date) => date?.termId === termIdOfTakeOn
      );
      setFilterByTerm(filterCourseDaysByTermIdOfTakenOn);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseDays, values]);

  useEffect(() => {
    if (mcConsolidateQuizSuccess) {
      setSubmitting(false);
      if (!behavior?.includes(USER_BEHAVIOR.HAVE_PLANED)) {
        dispatch(
          myCoursesActions.myCoursesSetState({
            currentCourseDayId: values.executeDateId.toString(),
            firstTime: true,
          })
        );
      }

      if (!nonGeneratedSections?.length) {
        if (!behavior?.includes(USER_BEHAVIOR.HAVE_PLANED)) {
          setUrlParam(location, history, { active: 'plan' }, null);
        }
      } else {
        const dialogInfo = {
          visible: true,
          messageKey: 'dialog:consolidate_dialog_information',
          values: { object: nonGeneratedSections?.join(', ') },
          components: [<strong />],
          count: nonGeneratedSections?.length,
        };
        dispatch(
          myCoursesActions.myCoursesSetState({
            dialogInformationState: dialogInfo,
          })
        );
      }
      onClose();
    }
    return () => {
      dispatch(
        myCoursesActions.myCoursesSetState({
          currentQuiz: null,
          mcConsolidateQuizSuccess: null,
          mcConsolidateQuizFailed: null,
          consolidatePopQuizState: {},
        })
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mcConsolidateQuizSuccess]);

  useEffect(() => {
    if (mcConsolidateQuizFailed) {
      setSubmitting(false);
      const { subcode } = mcConsolidateQuizFailed;
      let message = '';
      switch (subcode) {
        case 1:
          message = t('error:error_last_greater_equal_first', {
            first: t('announced_on'),
            last: t('taken_on'),
          });
          break;
        default:
          setModalError(mcConsolidateQuizFailed?.message);
          break;
      }
      if (message) {
        setFieldError('executeDateId', message);
        // if (isAnnounce) {
        //   setFieldError('announceDateId', message);
        // }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mcConsolidateQuizFailed]);
  return (
    <TblDialog
      open={visible}
      onClose={onClose}
      title={
        <TblActivityIcon
          type={COURSE_ITEM_TYPE.QUIZ}
          name={currentQuiz?.quizName || ''}
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
            {isAnnounce && (
              <Grid item xs={6}>
                <Box mr={1.5}>
                  <TblSelect
                    required
                    placeholder={t('common:please_select')}
                    label={t('announced_on')}
                    name='announceDateId'
                    value={values.announceDateId}
                    onChange={(e) =>
                      handleChange('announceDateId', e.target.value)
                    }
                    errorMessage={
                      !!(
                        errors.announceDateId &&
                        (touched.announceDateId || submitCount)
                      )
                        ? errors.announceDateId
                        : false
                    }
                    error={!!(errors.announceDateId && touched.announceDateId)}
                    initialScrollOffset={getInitialScrollOffset(
                      announceFirst
                        ? convertedData
                        : convertedCourseDay(filterByTerm),
                      currentDayId,
                      44
                    )}
                  >
                    {(announceFirst ? courseDays : filterByTerm)?.map(
                      (semester, semesterIndex) => [
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
                      ]
                    )}
                  </TblSelect>
                </Box>
              </Grid>
            )}
            <Grid item xs={isAnnounce ? 6 : 12}>
              <Box ml={isAnnounce ? 1.5 : 0}>
                {filterByTerm && (
                  <TblSelect
                    required
                    placeholder={t('common:please_select')}
                    label={t('taken_on')}
                    name='executeDateId'
                    value={values.executeDateId}
                    onChange={(e) =>
                      handleChange('executeDateId', e.target.value)
                    }
                    errorMessage={
                      !!(
                        errors.executeDateId &&
                        (touched.executeDateId || submitCount)
                      )
                        ? errors.executeDateId
                        : false
                    }
                    error={!!(errors.executeDateId && touched.executeDateId)}
                    initialScrollOffset={getInitialScrollOffset(
                      takenOnFirst
                        ? convertedData
                        : convertedCourseDay(filterByTerm),
                      currentDayId,
                      44
                    )}
                  >
                    {(takenOnFirst ? courseDays : filterByTerm)?.map(
                      (semester, semesterIndex) => [
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
                      ]
                    )}
                  </TblSelect>
                )}
              </Box>
            </Grid>
          </Grid>
        </div>
      </form>
    </TblDialog>
  );
}

QuizDueTimeDialog.propTypes = {
  quizType: PropTypes.string,
  toggleCloseDialog: PropTypes.func,
  visible: PropTypes.bool,
};

export default QuizDueTimeDialog;
