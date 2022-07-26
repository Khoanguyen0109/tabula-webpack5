import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import isEmpty from 'lodash/isEmpty';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grid from '@mui/material/Grid';
import ListSubheader from '@mui/material/ListSubheader';
import MenuItem from '@mui/material/MenuItem';

import TblActivityIcon from 'components/TblActivityIcon';
import TblDialog from 'components/TblDialog';
import TblInputLabel from 'components/TblInputLabel';
import TblInputs from 'components/TblInputs';
import TblSelect from 'components/TblSelect';

import { COURSE_ITEM_TYPE } from 'utils/constants';

import loadable from '@loadable/component';
import myCoursesActions from 'modules/MyCourses/actions';
import {
  convertedCourseDay,
  getCourseDayInfo,
  getCourseItemInfo,
  getInitialScrollOffset,
} from 'modules/MyCourses/utils';
import PropTypes from 'prop-types';
const ConsolidateActions = loadable(() =>
  import('modules/MyCourses/components/Plan/ConsolidateActions')
);
const SelectDateBySection = loadable(() =>
  import('shared/MyCourses/components/SelectDateBySection')
);

function ConsolidateAssignment({ updatePlanningData, courseId, orgId }) {
  const dispatch = useDispatch();
  const { t } = useTranslation(['myCourses', 'common', 'dialog']);

  const consolidateAssignmentState =
    useSelector((state) => state.AllCourses.consolidateAssignmentState) ?? {};
  const courseItemByUnit = useSelector(
    (state) => state.AllCourses.courseItemByUnit
  );
  const courseDays = useSelector((state) => state.AllCourses.courseDays);
  const mcConsolidateAssignmentSuccess = useSelector(
    (state) => state.AllCourses.mcConsolidateAssignmentSuccess
  );
  const mcConsolidateAssignmentFailed = useSelector(
    (state) => state.AllCourses.mcConsolidateAssignmentFailed
  );
  const unLinkedShadows = useSelector(
    (state) => state.AllCourses.unLinkedShadows
  );
  const { visible, sourceId, courseDayId, unitId } = consolidateAssignmentState;
  const courseItems = courseItemByUnit?.items || {};
  const courseItemInfo = getCourseItemInfo(courseItems, sourceId);
  const { name, id } = courseItemInfo;
  const [dueDateId, setDueTimeId] = useState('');
  const [dueDateData, setDueDateData] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [unlinkShadowItems, setUnlinkShadowItems] = useState({});
  const [modalError, setModalError] = useState('');
  const [dueTimeMasterError, setDueTimeMasterError] = useState('');
  const dueTimeShadowErrors = Object.keys(unlinkShadowItems).filter((i) => {
    const { fieldValue } = unlinkShadowItems[`${i}`];
    return !!!fieldValue;
  });

  const assignDateData = getCourseDayInfo(courseDays, courseDayId);
  const sectionScheduleOfAssignDate = assignDateData?.sectionSchedules || [];
  const convertedData = convertedCourseDay(courseDays);

  const payload = {
    assignDateId: courseDayId,
    dueDateId: dueDateId,
  };

  // NOTE: Utils function

  const resetDueTimeMasterError = useCallback(() => {
    setIsSubmit(false);
    setModalError('');
    setDueTimeMasterError('');
  }, []);

  const getUnlinkShadowItems = useCallback(
    () =>
      Object.keys(unlinkShadowItems).map((index) => {
        const { fieldData, fieldValue } = unlinkShadowItems[`${index}`];
        const { sectionId } = fieldData || {};
        return {
          sectionId: sectionId,
          dueDateId: fieldValue,
        };
      }),
    [unlinkShadowItems]
  );

  // NOTE: Functions handler with  UI

  const toggleCloseDrawer = useCallback(() => {
    const dialogInfo = unLinkedShadows?.length
      ? {
          visible: true,
          messageKey: 'dialog:consolidate_dialog_information_assignment',
        }
      : {};
    setUnlinkShadowItems([]);
    setDueTimeId('');
    resetDueTimeMasterError();
    dispatch(
      myCoursesActions.myCoursesSetState({
        consolidateAssignmentState: {},
        mcConsolidateAssignmentSuccess: false,
        mcConsolidateAssignmentFailed: null,
        dialogInformationState: dialogInfo,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unLinkedShadows]);

  const handleChangeDueTime = (value) => {
    const dueDateData = getCourseDayInfo(courseDays, value);
    const sectionScheduleOfDueDate = dueDateData?.sectionSchedules || [];
    const sectionIdOfAssignDate = sectionScheduleOfAssignDate.map(
      (i) => i.sectionId
    );
    const sectionIdOfDueDate = sectionScheduleOfDueDate.map((i) => i.sectionId);
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
    resetDueTimeMasterError();
    setDueTimeId(value);
    setDueDateData(dueDateData);
    setUnlinkShadowItems(Object.assign({}, sectionsNeedToSetDueTime));
  };

  const handleChangeDueTimeOfSection = (value, index) => {
    const newUnlinkShadowItems = { ...unlinkShadowItems };
    newUnlinkShadowItems[`${index}`].fieldValue = value;
    setUnlinkShadowItems(newUnlinkShadowItems);
    setIsSubmit(false);
  };

  // NOTE: Functions handler with DB

  const handleSave = useCallback(
    (payloadData) => {
      setIsSubmit(true);
      if (!!!dueDateId || dueTimeShadowErrors.length) {
        return;
      }
      const newPayload = { ...payloadData };
      newPayload.unLinkedShadows = getUnlinkShadowItems();
      dispatch(
        myCoursesActions.mcConsolidateAssignment({
          orgId: orgId,
          courseId,
          unitId,
          masterId: id,
          unLinkedShadows: newPayload.unLinkedShadows,
          body: newPayload,
        })
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [dueDateId, dueTimeShadowErrors.length, getUnlinkShadowItems]
  );

  const handlePublish = useCallback(() => {
    handleSave({ ...payload, isPublish: true });
  }, [handleSave, payload]);

  const handleSaveAsDraft = useCallback(() => {
    handleSave({ ...payload, isPublish: false });
  }, [handleSave, payload]);

  // NOTE: Functions handler with lifecycle

  useEffect(() => {
    if (mcConsolidateAssignmentSuccess) {
      toggleCloseDrawer();
      updatePlanningData([courseDayId, courseItemInfo?.courseDayId]);
    }
  }, [
    courseDayId,
    updatePlanningData,
    mcConsolidateAssignmentSuccess,
    toggleCloseDrawer,
    courseItemInfo,
  ]);

  useEffect(() => {
    if (mcConsolidateAssignmentFailed) {
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
        setDueTimeMasterError(message);
      }
      setIsSubmit(false);
    }
  }, [mcConsolidateAssignmentFailed, t]);

  if (!!!courseDayId) {
    return <></>;
  }

  const renderContent = () => (
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
              {/* NOTE: Using TblInputs instead of TblSelect to improve performance, because of this field always disabled */}
              <TblInputs
                required
                disabled
                label={t('assigned_on')}
                value={assignDateData?.courseDayName}
                placeholder=''
              />
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box ml={1.5}>
              {courseDays && (
                <TblSelect
                  required
                  label={t('due_on')}
                  name='dueDateId'
                  value={Number(dueDateId)}
                  onChange={(e) => handleChangeDueTime(e.target.value)}
                  errorMessage={
                    isSubmit && !!!dueDateId
                      ? t('common:required_message')
                      : dueTimeMasterError
                  }
                  error={(isSubmit && !!!dueDateId) || dueTimeMasterError}
                  disabled={!!!assignDateData?.courseDayName} //NOTE: Disabled when finding assignDateData
                  initialScrollOffset={getInitialScrollOffset(
                    convertedData,
                    assignDateData?.id,
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
              )}
            </Box>
          </Grid>
        </Grid>
        {dueDateId && !isEmpty(unlinkShadowItems) ? (
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
                    index < Object.keys(unlinkShadowItems).length - 1 ? 3.25 : 0
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
                          isSubmit={isSubmit}
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
  );

  return (
    <>
      <TblDialog
        open={visible}
        onClose={toggleCloseDrawer}
        title={
          <TblActivityIcon type={COURSE_ITEM_TYPE.ASSIGNMENT} name={name} />
        }
        fullWidth
        footer={
          <ConsolidateActions
            toggleClose={toggleCloseDrawer}
            handleSaveAsDraft={handleSaveAsDraft}
            handlePublish={handlePublish}
            isSubmit={!!dueDateId && !dueTimeShadowErrors.length && isSubmit}
          />
        }
      >
        {renderContent()}
      </TblDialog>
    </>
  );
}

ConsolidateAssignment.propTypes = {
  updatePlanningData: PropTypes.func,
  orgId: PropTypes.number,
  courseId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

ConsolidateAssignment.defaultProps = {
  updatePlanningData: () => {},
};

export default ConsolidateAssignment;
