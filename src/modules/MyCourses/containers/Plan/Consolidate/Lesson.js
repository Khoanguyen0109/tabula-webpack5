import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import isEqual from 'lodash/isEqual';

import TblActivityIcon from 'components/TblActivityIcon';
import TblDialog from 'components/TblDialog';

import { COURSE_ITEM_TYPE } from 'utils/constants';

import loadable from '@loadable/component';
import myCoursesActions from 'modules/MyCourses/actions';
import { getKeyName } from 'modules/MyCourses/utils';
import PropTypes from 'prop-types';
const ConsolidateActions = loadable(() =>
  import('modules/MyCourses/components/Plan/ConsolidateActions')
);

function ConsolidateLesson({ updateMasterItem }) {
  const dispatch = useDispatch();

  const consolidateLessonState = useSelector(
    (state) => state.AllCourses.consolidateLessonState
  );
  const courseItemByUnit = useSelector(
    (state) => state.AllCourses.courseItemByUnit
  );

  const { visible, sourceId, courseDayId, unitId, courseActivityId } =
    consolidateLessonState ?? {};
  const courseActivityData =
    courseItemByUnit?.items?.lessons?.find((i) => i.id === sourceId)?.data ||
    {};
  const { name } = courseActivityData;
  const payload = {
    [`${getKeyName(COURSE_ITEM_TYPE.LESSON)}`]: courseActivityId,
  };

  const { t } = useTranslation(['dialog']);

  const toggleCloseDrawer = useCallback(() => {
    dispatch(
      myCoursesActions.myCoursesSetState({
        consolidateLessonState: {},
        queueUpdate: { [`${courseActivityData?.course_day?.id}`]: true },
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseActivityData]);

  const handleSave = useCallback(
    (payloadData) => {
      updateMasterItem(courseDayId, sourceId, unitId, payloadData);
      toggleCloseDrawer();
    },
    [updateMasterItem, courseDayId, sourceId, unitId, toggleCloseDrawer]
  );

  const handlePublish = useCallback(() => {
    handleSave({ ...payload, isPublish: true });
  }, [handleSave, payload]);

  const handleSaveAsDraft = useCallback(() => {
    handleSave({ ...payload, isPublish: false });
  }, [handleSave, payload]);

  if (!!!courseDayId) {
    return <></>;
  }

  return (
    <>
      <TblDialog
        open={visible}
        onClose={toggleCloseDrawer}
        title={<TblActivityIcon type={COURSE_ITEM_TYPE.LESSON} name={name} />}
        fullWidth
        footer={
          <ConsolidateActions
            toggleClose={toggleCloseDrawer}
            handleSaveAsDraft={handleSaveAsDraft}
            handlePublish={handlePublish}
          />
        }
      >
        {t('dialog:consolidateMessage')}
      </TblDialog>
    </>
  );
}

ConsolidateLesson.propTypes = {
  updateMasterItem: PropTypes.func,
};

ConsolidateLesson.defaultProps = {
  updateMasterItem: () => {},
};

export default React.memo(ConsolidateLesson, isEqual);
