import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';

import TblActivityIcon from 'components/TblActivityIcon';
import TblDialog from 'components/TblDialog';

import { COURSE_ITEM_TYPE } from 'utils/constants';

import loadable from '@loadable/component';
import myCoursesActions from 'modules/MyCourses/actions';
import { getCourseItemInfo } from 'modules/MyCourses/utils';
import PropTypes from 'prop-types';
const ConsolidateActions = loadable(() =>
  import('modules/MyCourses/components/Plan/ConsolidateActions')
);
function ConsolidatePopQuiz({ updatePlanningData, orgId, courseId }) {
  const dispatch = useDispatch();
  const { t } = useTranslation(['dialog']);
  const consolidatePopQuizState =
    useSelector((state) => state.AllCourses.consolidatePopQuizState) ?? {};
  const courseItemByUnit = useSelector(
    (state) => state.AllCourses.courseItemByUnit
  );
  const mcConsolidateQuizSuccess = useSelector(
    (state) => state.AllCourses.mcConsolidateQuizSuccess
  );
  const mcConsolidateQuizFailed = useSelector(
    (state) => state.AllCourses.mcConsolidateQuizFailed
  );
  const nonGeneratedSections = useSelector(
    (state) => state.AllCourses.nonGeneratedSections
  );

  const [isSubmit, setIsSubmit] = useState(false);

  const { visible, sourceId, courseDayId, unitId } = consolidatePopQuizState;
  const courseItems = courseItemByUnit?.items || {};
  const courseItemInfo = getCourseItemInfo(courseItems, sourceId);
  const { name, id, executeDateId } = courseItemInfo;

  const payload = {
    executeDateId: courseDayId,
    announceDateId: courseDayId,
  };
  const toggleCloseDrawer = useCallback((infoDialog = {}) => {
    setIsSubmit(false);
    dispatch(
      myCoursesActions.myCoursesSetState({
        consolidatePopQuizState: {},
        mcConsolidateQuizSuccess: false,
        mcConsolidateQuizFailed: null,
        ...infoDialog,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateConsolidatePopQuiz = useCallback(
    (body) => {
      dispatch(
        myCoursesActions.mcConsolidateQuiz({
          orgId: orgId,
          courseId,
          unitId,
          masterId: id,
          body,
        })
      );
    },
    [courseId, dispatch, id, orgId, unitId]
  );

  const handleSave = useCallback(
    (payloadData) => {
      setIsSubmit(true);
      updateConsolidatePopQuiz({ ...payloadData });
    },
    [updateConsolidatePopQuiz]
  );

  const handlePublish = useCallback(() => {
    handleSave({ ...payload, isPublish: true });
  }, [payload, handleSave]);

  const handleSaveAsDraft = useCallback(() => {
    handleSave({ ...payload, isPublish: false });
  }, [payload, handleSave]);

  useEffect(() => {
    if (mcConsolidateQuizSuccess && courseDayId) {
      const dialogInfo = nonGeneratedSections?.length
        ? {
            visible: true,
            messageKey: 'dialog:consolidate_dialog_information',
            values: { object: nonGeneratedSections?.join(', ') },
            components: [<strong />],
            count: nonGeneratedSections?.length,
          }
        : {};
      updatePlanningData([courseDayId, executeDateId]);
      toggleCloseDrawer({
        dialogInformationState: dialogInfo,
      });
    }
  }, [
    courseDayId,
    executeDateId,
    mcConsolidateQuizSuccess,
    toggleCloseDrawer,
    updatePlanningData,
    nonGeneratedSections,
  ]);

  if (!!!courseDayId) {
    return <></>;
  }

  return (
    <>
      <TblDialog
        open={visible}
        onClose={toggleCloseDrawer}
        title={<TblActivityIcon type={COURSE_ITEM_TYPE.QUIZ} name={name} />}
        fullWidth
        footer={
          <ConsolidateActions
            toggleClose={toggleCloseDrawer}
            handleSaveAsDraft={handleSaveAsDraft}
            handlePublish={handlePublish}
            isSubmit={isSubmit}
          />
        }
      >
        {mcConsolidateQuizFailed?.message && (
          <Box mb={2}>
            <Alert severity='error'>{mcConsolidateQuizFailed?.message}</Alert>
          </Box>
        )}
        {t('dialog:consolidateMessage')}
      </TblDialog>
    </>
  );
}

ConsolidatePopQuiz.propTypes = {
  orgId: PropTypes.number,
  courseId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  updatePlanningData: PropTypes.func,
};

ConsolidatePopQuiz.defaultProps = {
  updatePlanningData: () => {},
};

export default ConsolidatePopQuiz;
