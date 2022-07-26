import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import isEmpty from 'lodash/isEmpty';
import isNull from 'lodash/isNull';

import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import Skeleton from '@mui/material/Skeleton';

import TblButton from 'components/TblButton';
import TblConfirmDialog from 'components/TblConfirmDialog';
import TblIndicator from 'components/TblIndicator';
import TblUseSnackbar from 'components/TblUseSnackbar';

import { COURSE_MANAGER } from 'utils/roles';

import {
  COURSE_STATUS,
  UPDATE_COURSE_SUBCODE,
} from 'shared/MyCourses/constants';

import schoolYearActions from 'modules/SchoolYear/actions';
import PropTypes from 'prop-types';
import { checkPermission } from 'utils';

import allCoursesActions from '../actions';
import CreateSection from '../components/SectionsAndMeetingTimes/CreateSection';
import ModifySchoolYearAndTerms from '../components/SectionsAndMeetingTimes/ModifySchoolYearAndTerms';
import Section from '../components/SectionsAndMeetingTimes/Section';

const ROLES_UPDATE = [COURSE_MANAGER];
function SectionsAndMeetingTimes(props) {
  // NOTE: connect redux
  const dispatch = useDispatch();
  const schoolYearList = useSelector(
    (state) => state.SchoolYear.schoolYearList
  );
  const dailyTemplates = useSelector(
    (state) => state.SchoolYear.dailyTemplates
  );
  const termsList = useSelector((state) => state.SchoolYear.termsList);
  const sectionsAndMeetingTimes = useSelector(
    (state) => state.AllCourses.sectionsAndMeetingTimes
  );
  const getSectionsAndMeetingTimesSuccess = useSelector(
    (state) => state.AllCourses.getSectionsAndMeetingTimesSuccess
  );
  const updateSectionsAndMeetingTimesSuccess = useSelector(
    (state) => state.AllCourses.updateSectionsAndMeetingTimesSuccess
  );
  const updateSectionsAndMeetingTimesFailed = useSelector(
    (state) => state.AllCourses.updateSectionsAndMeetingTimesFailed
  );
  const deleteSectionSuccess = useSelector(
    (state) => state.AllCourses.deleteSectionSuccess
  );
  const deleteSectionFailed = useSelector(
    (state) => state.AllCourses.deleteSectionFailed
  );
  const isUpdatingSectionsAndMeetingTimes = useSelector(
    (state) => state.AllCourses.isUpdatingSectionsAndMeetingTimes
  );
  const basicInfo = useSelector((state) => state.AllCourses.basicInfo);
  // NOTE: initial states and props
  const { t, match, authContext } = props;
  const courseId = match?.params?.courseId;
  const studentId = match?.params?.studentId;
  const [formData, setFormData] = useState({});
  const [showCreateSectionModal, setShowCreateSectionModal] = useState(false);
  const [getInfoForCourseFlag, setGetInfoForCourseFlag] = useState(true);
  const organizationId = authContext?.currentUser?.organizationId;
  const timezone = authContext?.currentUser?.timezone;
  const hasPermission = checkPermission(authContext.currentUser, ROLES_UPDATE);
  const [updatedData, setUpdatedData] = useState({});
  const [createdData, setCreatedData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [isVisibleErrorModal, setIsVisibleErrorModal] = useState(false);
  const [disableEditField, setDisableEditField] = useState(false);

  const getSectionsAndMeetingTimes = useCallback(() => {
    dispatch(
      allCoursesActions.getSectionsAndMeetingTimes({
        orgId: organizationId,
        courseId,
        studentId: studentId ?? null,
      })
    );
  }, [courseId, dispatch, organizationId, studentId]);

  const updateSectionsAndMeetingTimes = useCallback(
    (data) => {
      setGetInfoForCourseFlag(!!data?.schoolYearId || !!data?.terms);
      dispatch(
        allCoursesActions.updateSectionsAndMeetingTimes({
          orgId: organizationId,
          courseId,
          data,
          isUpdatingSectionsAndMeetingTimes: true,
        })
      );
    },
    [courseId, dispatch, organizationId]
  );

  const deleteSection = useCallback(
    (sectionId) => {
      dispatch(
        allCoursesActions.deleteSection({
          orgId: organizationId,
          courseId,
          sectionId,
        })
      );
    },
    [courseId, dispatch, organizationId]
  );

  const getSchoolYearList = useCallback(() => {
    dispatch(
      schoolYearActions.getSchoolYearList({
        id: authContext?.currentUser?.organizationId,
        urlParams: { status: 1 },
      })
    );
  }, [authContext, dispatch]);

  const getTermsBySchoolYear = useCallback(
    (schoolYearId) => {
      dispatch(
        schoolYearActions.getTermsBySchoolYear({
          orgId: organizationId,
          schoolYearId,
        })
      );
    },
    [dispatch, organizationId]
  );

  const getSchoolYearDailyTemplate = useCallback(
    (schoolYearId) => {
      dispatch(
        schoolYearActions.getSchoolYearDailyTemplate({
          orgId: organizationId,
          schoolYearId,
          urlParams: {
            termIds: (
              sectionsAndMeetingTimes?.terms?.map((i) => i.id) ?? []
            ).join(','),
            timezone,
          },
        })
      );
    },
    [dispatch, organizationId, sectionsAndMeetingTimes, timezone]
  );

  const getInfoForCourse = useCallback(
    (schoolYearId) => {
      getTermsBySchoolYear(schoolYearId);
      getSchoolYearDailyTemplate(schoolYearId);
    },
    [getSchoolYearDailyTemplate, getTermsBySchoolYear]
  );

  useEffect(() => {
    getSchoolYearList();
    getSectionsAndMeetingTimes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (basicInfo?.isPlanned || basicInfo.status === COURSE_STATUS.PUBLISHED) {
      setDisableEditField(true);
    }
  }, [basicInfo.isPlanned, basicInfo.status]);
  useEffect(
    () => () => {
      // console.log('Unmount');
      dispatch(
        schoolYearActions.schoolYearSetState({
          schoolYearDetail: {},
          dailyTemplates: [],
        })
      );
    },
    [dispatch]
  );

  useEffect(() => {
    if (getSectionsAndMeetingTimesSuccess) {
      const newSYId = sectionsAndMeetingTimes?.schoolYear?.id;
      setFormData({
        schoolYearId: newSYId,
        termIds: sectionsAndMeetingTimes?.terms?.map((i) => i.id) ?? [],
      });
      if (getInfoForCourseFlag) {
        getInfoForCourse(newSYId);
      }
      dispatch(
        allCoursesActions.allCoursesSetState({
          getSectionsAndMeetingTimesSuccess: false,
        })
      );
    }
  }, [
    getSectionsAndMeetingTimesSuccess,
    dispatch,
    sectionsAndMeetingTimes,
    getSchoolYearDailyTemplate,
    getInfoForCourse,
    getInfoForCourseFlag,
  ]);

  useEffect(() => {
    if (
      updateSectionsAndMeetingTimesSuccess ||
      updateSectionsAndMeetingTimesFailed ||
      deleteSectionFailed
    ) {
      if (
        updateSectionsAndMeetingTimesFailed?.subcode ===
        UPDATE_COURSE_SUBCODE.CAN_NOT_ADD_SECTION_WHEN_PLANNED
      ) {
        setShowCreateSectionModal(false);
      }
      if (showCreateSectionModal && updateSectionsAndMeetingTimesSuccess) {
        setShowCreateSectionModal(false);
      }
      dispatch(
        allCoursesActions.allCoursesSetState({
          updateSectionsAndMeetingTimesSuccess: false,
          deleteSectionFailed: null,
          updateSectionsAndMeetingTimesFailed: null,
        })
      );
    }
  }, [
    dispatch,
    updateSectionsAndMeetingTimesSuccess,
    showCreateSectionModal,
    deleteSectionFailed,
    updateSectionsAndMeetingTimesFailed,
  ]);

  useEffect(() => {
    if (deleteSectionSuccess || !isNull(updateSectionsAndMeetingTimesFailed)) {
      dispatch(
        allCoursesActions.allCoursesSetState({
          deleteSectionSuccess: false,
          updateSectionsAndMeetingTimesFailed: null,
        })
      );
    }
  }, [deleteSectionSuccess, updateSectionsAndMeetingTimesFailed, dispatch]);

  useEffect(() => {
    if (
      updateSectionsAndMeetingTimesFailed?.subcode === 3 &&
      !isVisibleErrorModal
    ) {
      setIsVisibleErrorModal(true);
      if (!isEmpty(updatedData) || !isEmpty(createdData)) {
        setErrorMessage(
          <Box fontSize={15}>
            <Box>{t('error:message_failed_save')}</Box>
            <Box>
              {t(
                !isEmpty(createdData)
                  ? 'error:restriction_add_new_meeting_times'
                  : 'error:restriction_update_or_remove_meeting_times',
                {
                  dailyTemplateName: !isEmpty(createdData)
                    ? createdData?.templateName
                    : updatedData?.templateName,
                  timeSlotName: !isEmpty(createdData)
                    ? createdData?.periodName
                    : updatedData?.periodName,
                  objectName: t('common:meeting_time'),
                }
              )}
            </Box>
          </Box>
        );
        setUpdatedData({});
        setCreatedData({});
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [updateSectionsAndMeetingTimesFailed]);

  return (
    <div>
      {(updateSectionsAndMeetingTimesSuccess || deleteSectionSuccess) && (
        <TblUseSnackbar />
      )}
      {updateSectionsAndMeetingTimesFailed &&
        ![1, 2, 3, 5].includes(updateSectionsAndMeetingTimesFailed.subcode) && (
          <TblUseSnackbar
            message={
              updateSectionsAndMeetingTimesFailed
                ? updateSectionsAndMeetingTimesFailed.message
                : t('error:general_error')
            }
            options={{ variant: 'error' }}
          />
        )}
      {deleteSectionFailed && deleteSectionFailed.subcode === 1 && (
        <TblUseSnackbar
          message={
            deleteSectionFailed
              ? deleteSectionFailed.message
              : t('error:general_error')
          }
          options={{ variant: 'error' }}
        />
      )}
      {hasPermission && (
        <Box mb={1.5}>
          <TblIndicator
            content={t('unable_to_edit_section_and_meeting_times')}
          />
        </Box>
      )}
      {!isEmpty(formData) ? (
        <ModifySchoolYearAndTerms
          t={t}
          formData={formData}
          schoolYearList={schoolYearList}
          termsList={termsList}
          hasPermission={hasPermission}
          updateSectionsAndMeetingTimes={updateSectionsAndMeetingTimes}
          updateSectionsAndMeetingTimesFailed={
            updateSectionsAndMeetingTimesFailed
          }
          disabled={disableEditField}
        />
      ) : (
        <>
          <Skeleton variant='text' animation='wave' />
          <Skeleton variant='text' animation='wave' />
        </>
      )}
      <Box mt={1} mb={5}>
        {hasPermission && (
          <TblButton
            variant='contained'
            color='primary'
            onClick={() => setShowCreateSectionModal(true)}
            disabled={disableEditField}
          >
            {t('new_section')}
          </TblButton>
        )}
        {showCreateSectionModal && hasPermission && (
          <CreateSection
            t={t}
            visibleDialog={showCreateSectionModal}
            hasPermission={hasPermission}
            toggleDialog={setShowCreateSectionModal}
            saveData={(data) => updateSectionsAndMeetingTimes(data)}
            saveDataFailed={updateSectionsAndMeetingTimesFailed}
          />
        )}
      </Box>

      <TblConfirmDialog
        open={isVisibleErrorModal}
        title={t('common:error')}
        cancelText={t('common:close')}
        hiddenConfirmButton
        message={errorMessage}
        fullWidth
        onCancel={() => setIsVisibleErrorModal(false)}
      />

      {!isEmpty(sectionsAndMeetingTimes) &&
        sectionsAndMeetingTimes?.sections?.map((section) => (
          <Fade key={section.id}>
            <Section
              t={t}
              data={section}
              dailyTemplates={dailyTemplates}
              hasPermission={hasPermission}
              saveData={(data) => updateSectionsAndMeetingTimes(data)}
              deleteSection={(sectionId) => deleteSection(sectionId)}
              deleteSectionFailed={deleteSectionFailed}
              saveDataFailed={updateSectionsAndMeetingTimesFailed}
              setUpdatedData={setUpdatedData}
              setCreatedData={setCreatedData}
              isUpdatingSectionsAndMeetingTimes={
                isUpdatingSectionsAndMeetingTimes
              }
              disabled={disableEditField}
            />
          </Fade>
        ))}
    </div>
  );
}

SectionsAndMeetingTimes.propTypes = {
  t: PropTypes.func,
  match: PropTypes.object,
  authContext: PropTypes.object,
};

export default React.memo(SectionsAndMeetingTimes);
