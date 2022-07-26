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
import TblInputLabel from 'components/TblInputLabel';
import TblSelect from 'components/TblSelect';

import { COURSE_ITEM_TYPE } from 'utils/constants';

import { USER_BEHAVIOR } from 'shared/User/constants';

import { AuthDataContext } from 'AppRoute/AuthProvider';
import { useFormik } from 'formik';
import { isEmpty } from 'lodash-es';
import myCoursesActions from 'modules/MyCourses/actions';
import { getCourseDayInfo } from 'modules/MyCourses/utils';
import { convertedCourseDay, getInitialScrollOffset } from 'modules/MyCourses/utils';
import PropTypes from 'prop-types';
import { setUrlParam } from 'utils';
import * as Yup from 'yup';

import SelectDateBySection from '../SelectDateBySection';

import DialogActions from './DialogActions';
import Helper from './Helper';

function AssignmentDueTimeDialog(props) {
  const dispatch = useDispatch();
  const { t } = useTranslation(['myCourses', 'common']);
  const authContext = useContext(AuthDataContext);
  const {
    organizationId,
    settings: { behavior },
  } = authContext.currentUser;
  const history = useHistory();
  const location = useLocation();
  const { visible, toggleCloseDialog } = props;
  const assignment = useSelector((state) => state.AllCourses.assignment);
  const { unitId, courseId, id } = assignment;
  const [modalError, setModalError] = useState('');
  const [unlinkShadowItems, setUnlinkShadowItems] = useState({});
  const [dueDateData, setDueDateData] = useState({});

  const [sectionScheduleOfAssignDate, setSectionScheduleOfAssignDate] =
    useState([]);
  const courseDays = useSelector((state) => state.AllCourses.courseDays);
  const currentDayId = useSelector((state) => state.AllCourses.currentDayId);

  const convertedData = convertedCourseDay(courseDays);
  const mcConsolidateAssignmentSuccess = useSelector(
    (state) => state.AllCourses.mcConsolidateAssignmentSuccess
  );
  const unLinkedShadows = useSelector(
    (state) => state.AllCourses.unLinkedShadows
  );
  const mcConsolidateAssignmentFailed = useSelector(
    (state) => state.AllCourses.mcConsolidateAssignmentFailed
  );

  const getUnlinkShadowItems = () => Object.keys(unlinkShadowItems).map((index) => {
      const { fieldData, fieldValue } = unlinkShadowItems[`${index}`];
      const { sectionId } = fieldData || {};
      return {
        sectionId: sectionId,
        dueDateId: fieldValue,
      };
    });

  const handlePublish = (values) => {
    const unlinkShadowItems = getUnlinkShadowItems();
    const validateShadowItem = unlinkShadowItems.find(
      (item) => item.dueDateId === ''
    );
    if (unlinkShadowItems.length !== 0 && validateShadowItem) {
      setFieldError('sections', 'errors');
      setSubmitting(false);
      return;
    }
    dispatch(
      myCoursesActions.mcConsolidateAssignment({
        orgId: organizationId,
        courseId,
        unitId,
        masterId: id,
        unLinkedShadows: unlinkShadowItems,
        body: {
          assignDateId: values.assignDateId,
          dueDateId: values.dueDateId,
          isPublish: true,
          unLinkedShadows: unlinkShadowItems,
        },
      })
    );
  };

  const validation = Yup.object().shape({
    assignDateId: Yup.number().required(t('common:required_message')),
    dueDateId: Yup.number().required(t('common:required_message')),
  });
  const formik = useFormik({
    initialValues: {
      assignDateId: '',
      dueDateId: '',
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
    setSubmitting,
    submitCount,

    handleSubmit,
  } = formik;

  const handleChange = (name, value) => {
    setFieldValue(name, value);
    setModalError('');
  };

  const handleChangeDueTimeOfSection = (value, index) => {
    const newUnlinkShadowItems = { ...unlinkShadowItems };
    newUnlinkShadowItems[`${index}`].fieldValue = value;
    setUnlinkShadowItems(newUnlinkShadowItems);
    setSubmitting(false);
  };
  const onClose = () => {
    resetForm();
    toggleCloseDialog();
  };
  useEffect(() => {
    if (values.dueDateId && values.assignDateId) {
      const dueDateData = getCourseDayInfo(courseDays, values.dueDateId);
      setDueDateData(dueDateData);
      const assignDateData = getCourseDayInfo(courseDays, values.assignDateId);
      const sectionScheduleOfDueDate = dueDateData?.sectionSchedules || [];
      const sectionScheduleOfAssignDate =
        assignDateData?.sectionSchedules || [];
      setSectionScheduleOfAssignDate(sectionScheduleOfAssignDate);

      const sectionIdOfAssignDate = sectionScheduleOfAssignDate.map(
        (i) => i.sectionId
      );
      const sectionIdOfDueDate = sectionScheduleOfDueDate.map(
        (i) => i.sectionId
      );
      const filterSectionIdNeedToSetDueTime = sectionIdOfAssignDate.filter(
        (i) => !sectionIdOfDueDate.includes(i)
      );
      const sectionsNeedToSetDueTime = filterSectionIdNeedToSetDueTime.map(
        (id) => ({
            fieldName: `section_${id}`,
            fieldValue: '',
            fieldData: sectionScheduleOfAssignDate.find(
              (i) => Number(i.sectionId) === Number(id)
            ),
          })
      );
      setUnlinkShadowItems(Object.assign({}, sectionsNeedToSetDueTime));
    }
  }, [courseDays, dueDateData, sectionScheduleOfAssignDate, values]);

  useEffect(() => {
    if (mcConsolidateAssignmentSuccess) {
      setSubmitting(false);
      toggleCloseDialog();
      if (!behavior.includes(USER_BEHAVIOR.HAVE_PLANED)) {
        dispatch(
          myCoursesActions.myCoursesSetState({
            currentCourseDayId: values.assignDateId.toString(),
            firstTime: true,
          })
        );
      }
      if(!unLinkedShadows?.length){
        if (!behavior?.includes(USER_BEHAVIOR.HAVE_PLANED)){
          setUrlParam(location, history, { active: 'plan' }, null);
        }
      }else{
        const dialogInfo = {
            visible: true,
            sections: unLinkedShadows,
            messageKey: 'dialog:consolidate_dialog_information_assignment' 
          };
        dispatch(
          myCoursesActions.myCoursesSetState({
            dialogInformationState: dialogInfo,
          })
        );
      }

    }
    return () => {
      dispatch(
        myCoursesActions.myCoursesSetState({
          assignment: {},
          mcConsolidateAssignmentSuccess: null,
          mcConsolidateAssignmentFailed: null
        })
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mcConsolidateAssignmentSuccess]);

  useEffect(() => {
    if (mcConsolidateAssignmentFailed) {
      setSubmitting(false);
      const { subcode } = mcConsolidateAssignmentFailed;
      let message = '';
      switch (subcode) {
        case 1:
          message = t('error_set_due_time_master_assignment');
          break;
        case 2:
          message = t('error:error_last_greater_equal_first', {
            first: t('assigned_on'),
            last: t('due_on'),
          });
          break;
        default:
          setModalError(mcConsolidateAssignmentFailed?.message);
          break;
      }
      if (message) {
        // setFieldError('assignDateId', message);
        setFieldError('dueDateId', message);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mcConsolidateAssignmentFailed]);
  return (
    <>
      <TblDialog
        open={visible}
        onClose={onClose}
        title={
          <TblActivityIcon
            type={COURSE_ITEM_TYPE.ASSIGNMENT}
            name={assignment.assignmentName}
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
              <Grid item xs={6}>
                <Box mr={1.5}>
                  <TblSelect
                    required
                    label={t('assigned_on')}
                    name='assignDateId'
                    placeholder={t('common:please_select')}
                    value={values.assignDateId}
                    onChange={(e) =>
                      handleChange('assignDateId', e.target.value)
                    }
                    errorMessage={
                      !!(
                        errors.assignDateId &&
                        (touched.assignDateId || submitCount)
                      )
                        ? errors.assignDateId
                        : false
                    }
                    error={
                      !!(
                        errors.assignDateId &&
                        (touched.assignDateId)
                      )
                    }     
                    initialScrollOffset={getInitialScrollOffset(convertedData, currentDayId, 44)}
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
              <Grid item xs={6}>
                <Box ml={1.5}>
                  {courseDays && (
                    <TblSelect
                      required
                      label={t('due_on')}
                      name='dueDateId'
                      value={values.dueDateId }
                      placeholder={t('common:please_select')}
                      onChange={(e) =>
                        handleChange('dueDateId', e.target.value)
                      }
                      errorMessage={
                        !!(
                          errors.dueDateId &&
                          (touched.dueDateId || submitCount)
                        )
                          ? errors.dueDateId
                          : false
                      }
                      error={
                        !!(
                          errors.dueDateId &&
                          (touched.dueDateId)
                        )
                      }     
                      // disabled={!!!assignDateData?.courseDayName} //NOTE: Disabled when finding assignDateData
                      initialScrollOffset={getInitialScrollOffset(convertedData, currentDayId, 44)}
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
                  )}
                </Box>
              </Grid>
            </Grid>
            {values.assignDateId &&
            values.dueDateId &&
            !isEmpty(unlinkShadowItems) ? (
              <>
                <Box ml={1} mt={2} mb={3}>
                  {t('dialog:consolidate_due_time_info', {
                    dueTimeName: dueDateData?.courseDayName,
                  })}
                </Box>
                {Object.keys(unlinkShadowItems).map((index) => {
                  const { fieldName, fieldData, fieldValue } =
                    unlinkShadowItems[`${index}`];
                  const { sectionName, sectionId, id } = fieldData || {};
                  const sectionAppendAssignDateId =
                    sectionScheduleOfAssignDate.find(
                      (i) => Number(i.id) === Number(id)
                    );
                  return (
                    <Box
                      mb={
                        index < Object.keys(unlinkShadowItems).length - 1
                          ? 3.25
                          : 0
                      }
                    >
                      <Grid container>
                        <Grid item xs={6}>
                          <TblInputLabel required>{t('due_on')}</TblInputLabel>
                          <Box ml={1} mr={1} className='text-ellipsis'>
                            {sectionName}
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box ml={2}>
                            <SelectDateBySection
                              sectionId={sectionId}
                              fieldName={fieldName}
                              fieldValue={fieldValue}
                              startTime={sectionAppendAssignDateId.start}
                              handleChangeDueTimeOfSection={(value) =>
                                handleChangeDueTimeOfSection(value, index)
                              }
                              isSubmit={!!errors.sections}
                            />
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>
                  );
                })}
              </>
            ) : (
              <></>
            )}
          </div>
        </form>
      </TblDialog>
    </>
  );
}

AssignmentDueTimeDialog.propTypes = {
  assignment: PropTypes.shape({
    assignmentName: PropTypes.string,
    courseId: PropTypes.number,
    id: PropTypes.number,
    unitId: PropTypes.number,
  }),
  toggleCloseDialog: PropTypes.func,
  visible: PropTypes.bool,
};

export default AssignmentDueTimeDialog;
