import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grid from '@mui/material/Grid';
import ListSubheader from '@mui/material/ListSubheader';
import MenuItem from '@mui/material/MenuItem';

import TblActivityIcon from 'components/TblActivityIcon';
import TblDialog from 'components/TblDialog';
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

function ConsolidateAnnouncedQuiz({ updatePlanningData, courseId, orgId }) {
  const dispatch = useDispatch();
  const { t } = useTranslation(['myCourses', 'common', 'dialog']);

  const consolidateAnnouncedQuizState =
    useSelector((state) => state.AllCourses.consolidateAnnouncedQuizState) ??
    {};
  const courseItemByUnit = useSelector(
    (state) => state.AllCourses.courseItemByUnit
  );
  const courseDays = useSelector((state) => state.AllCourses.courseDays);

  const mcConsolidateQuizSuccess = useSelector(
    (state) => state.AllCourses.mcConsolidateQuizSuccess
  );
  const mcConsolidateQuizFailed = useSelector(
    (state) => state.AllCourses.mcConsolidateQuizFailed
  );
  const nonGeneratedSections = useSelector(
    (state) => state.AllCourses.nonGeneratedSections
  );

  const { visible, sourceId, courseDayId, unitId } =
    consolidateAnnouncedQuizState;
  const courseItems = courseItemByUnit?.items || {};
  const courseItemInfo = getCourseItemInfo(courseItems, sourceId);
  const { name, id } = courseItemInfo;

  const [announcedId, setAnnouncedId] = useState('');
  const [isSubmit, setIsSubmit] = useState(false);
  const [modalError, setModalError] = useState('');
  const [announcedTimeError, setAnnouncedTimeError] = useState('');

  const takenOnData = getCourseDayInfo(courseDays, courseDayId);
  const termIdOfTakeOn = courseDays?.find((i) =>
    i.dates?.find((d) => Number(d.id) === Number(courseDayId))
  )?.termId;
  const filterCourseDaysByTermIdOfTakenOn = courseDays?.filter(
    (date) => date?.termId === termIdOfTakeOn
  );
  const payload = {
    executeDateId: courseDayId,
    announceDateId: announcedId,
  };
  const convertedData = convertedCourseDay(filterCourseDaysByTermIdOfTakenOn);

  // NOTE: Utils function

  const resetError = useCallback(() => {
    setIsSubmit(false);
    setModalError('');
    setAnnouncedTimeError('');
  }, []);

  const updateConsolidateAnnouncedQuiz = useCallback(
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

  // NOTE: Functions handler with  UI

  const toggleCloseDrawer = useCallback(() => {
    const dialogInfo = nonGeneratedSections?.length
      ? {
          visible: true,
          messageKey: 'dialog:consolidate_dialog_information',
          values: { object: nonGeneratedSections?.join(', ') },
          components: [<strong />],
          count: nonGeneratedSections?.length,
        }
      : {};
    setAnnouncedId('');
    resetError();
    dispatch(
      myCoursesActions.myCoursesSetState({
        consolidateAnnouncedQuizState: {},
        mcConsolidateQuizSuccess: false,
        mcConsolidateQuizFailed: null,
        dialogInformationState: dialogInfo,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nonGeneratedSections]);

  const handleChangeAnnouncedTime = (value) => {
    resetError();
    setAnnouncedId(value);
  };

  // NOTE: Functions handler with DB

  const handleSave = useCallback(
    (payloadData) => {
      setIsSubmit(true);
      if (!!!announcedId) {
        return;
      }
      updateConsolidateAnnouncedQuiz({ ...payloadData });
    },
    [announcedId, updateConsolidateAnnouncedQuiz]
  );

  const handlePublish = useCallback(() => {
    handleSave({ ...payload, isPublish: true });
  }, [handleSave, payload]);

  const handleSaveAsDraft = useCallback(() => {
    handleSave({ ...payload, isPublish: false });
  }, [handleSave, payload]);

  // NOTE: Functions handler with lifecycle

  useEffect(() => {
    if (mcConsolidateQuizSuccess && courseDayId) {
      updatePlanningData([courseDayId, courseItemInfo?.executeDateId]);
      toggleCloseDrawer();
    }
  }, [
    courseDayId,
    updatePlanningData,
    mcConsolidateQuizSuccess,
    toggleCloseDrawer,
    courseItemInfo,
    nonGeneratedSections,
  ]);

  useEffect(() => {
    if (mcConsolidateQuizFailed && courseDayId) {
      const { subcode } = mcConsolidateQuizFailed;
      let message = '';
      switch (subcode) {
        case 1:
          message = t('error:error_first_less_equal_last', {
            first: t('announced_on'),
            last: t('taken_on'),
          });
          break;
        default:
          setModalError(mcConsolidateQuizFailed?.message);
          break;
      }
      if (message) {
        setAnnouncedTimeError(message);
      }
      setIsSubmit(false);
    }
  }, [courseDayId, mcConsolidateQuizFailed, t]);

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
              {filterCourseDaysByTermIdOfTakenOn && (
                <TblSelect
                  required
                  label={t('announced_on')}
                  name='announcedId'
                  value={Number(announcedId)}
                  onChange={(e) => handleChangeAnnouncedTime(e.target.value)}
                  errorMessage={
                    isSubmit && !!!announcedId
                      ? t('common:required_message')
                      : announcedTimeError
                  }
                  error={(isSubmit && !!!announcedId) || announcedTimeError}
                  disabled={!!!takenOnData?.courseDayName} //NOTE: Disabled when finding takenOnData
                  initialScrollOffset={getInitialScrollOffset(
                    convertedData,
                    takenOnData?.id
                  )}
                >
                  {filterCourseDaysByTermIdOfTakenOn?.map(
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
          <Grid item xs={6}>
            <Box ml={1.5}>
              {/* NOTE: Using TblInputs instead of TblSelect to improve performance, because of this field always disabled */}
              <TblInputs
                required
                disabled
                label={t('taken_on')}
                value={takenOnData?.courseDayName}
                placeholder=''
              />
            </Box>
          </Grid>
        </Grid>
      </div>
    </form>
  );

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
            isSubmit={!!announcedId && isSubmit}
          />
        }
      >
        {renderContent()}
      </TblDialog>
    </>
  );
}

ConsolidateAnnouncedQuiz.propTypes = {
  updatePlanningData: PropTypes.func,
  orgId: PropTypes.number,
  courseId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

ConsolidateAnnouncedQuiz.defaultProps = {
  updatePlanningData: () => {},
};

export default ConsolidateAnnouncedQuiz;
