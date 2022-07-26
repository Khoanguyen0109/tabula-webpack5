/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import BreadcrumbWithSettings from 'components/TblBreadcrumb/BreadcrumbWithSettings';
import TblButton from 'components/TblButton';
import TblInputLabel from 'components/TblInputLabel';
import TblTabs from 'components/TblTabs';
import TblTour from 'components/TblTour';
import TourContent from 'components/TblTour/TourContent';
import ToGradeList from 'modules/Grader/components/ToGrade/ToGradeList';

import useGetSchoolYear from 'utils/customHook/useGetSchoolYear';
import { isGuardian, isTeacher } from 'utils/roles';

import { COURSE_STATUS } from 'shared/MyCourses/constants';
import { USER_BEHAVIOR } from 'shared/User/constants';

import { AuthDataContext } from 'AppRoute/AuthProvider';
import { Layout1 } from 'layout';
import { delay } from 'lodash';
import GraderActions from 'modules/Grader/actions';
import myProfileActions from 'modules/MyProfile/actions';

import MyCoursesList from './MyCoursesList';

function MyCoursesContainer() {
  const authContext = useContext(AuthDataContext);
  const { currentUser } = authContext;
  const { settings } = currentUser;
  const haveAccessed = settings?.behavior?.includes(
    USER_BEHAVIOR.HAVE_ACCESSED_SET_UP_REQUIRED
  );
  const dispatch = useDispatch();
  const { t } = useTranslation('myCourses', 'common');
  const [openTour, setOpenTour] = useState(false);

  // Note: Fetch schoolyears
  // eslint-disable-next-line unused-imports/no-unused-vars, no-unused-vars
  const [schoolYearSelected, setSchoolYearSelected] = useGetSchoolYear();

  const history = useHistory();
  const [currentTab, setCurrentTab] = useState(0);
  const [status, setStatus] = useState(COURSE_STATUS.PUBLISHED);
  const totalSubmission =
    useSelector((state) => state.AllCourses.totalSubmission) || 0;
  const canViewGrader = totalSubmission > 0;
  // eslint-disable-next-line no-unused-vars

  const onChangeTab = (e, value) => {
    setCurrentTab(value);
    switch (value) {
      case 0:
        setStatus(COURSE_STATUS.PUBLISHED);
        break;
      case 1:
        setStatus(COURSE_STATUS.DRAFT);
        break;
      default:
        break;
    }
  };
  useEffect(() => {
    dispatch(
      GraderActions.getToGradeList({
        orgId: currentUser.organizationId,
      })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const updateBehavior = () => {
    settings.behavior.push(USER_BEHAVIOR.HAVE_ACCESSED_SET_UP_REQUIRED);
    const payload = { settings };
    setOpenTour(false);
    dispatch(myProfileActions.updateMyProfile(payload));
  };
  useEffect(() => {
    if (!haveAccessed && isTeacher(currentUser)) {
      delay(() => {
        setOpenTour(true);
      }, 500);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [haveAccessed]);

  const tourConfig = [
    {
      selector: '[data-tut="reactour__setUpRequired"]',
      content: () => (
        <TourContent
          label={t('tour:set_up_required')}
          content={t('tour:set_up_required_content')}
        />
      ),
      position: 'bottom',
    },
  ];

  const renderTab = () => (
      <TblTabs
        onChange={onChangeTab}
        selectedTab={currentTab}
        selfHandleChange={true}
        minWidthItem={60}
        tabs={[
          { label: t('common:published') },
          {
            label: t('common:set_up_required'),
            'data-tut': 'reactour__setUpRequired',
          },
        ]}
      />
    );
  return (
    <Layout1>
      <BreadcrumbWithSettings
        title={isGuardian(currentUser) ? t('courses') : t('my_courses')}
        footerContent={isTeacher(currentUser) && renderTab()}
      />
      <Grid container spacing={6}>
        <Grid item xs={canViewGrader ? 9 : 12}>
          <Box mb={3} />
          <MyCoursesList
            t={t}
            history={history}
            status={status}
          />
        </Grid>

        {canViewGrader && (
          <Grid item xs={3}>
            <Box mb={2} display='flex' justifyContent='space-between'>
              <TblInputLabel>{t('grader:to_grade')}</TblInputLabel>
              <TblInputLabel>
                {t('grader:total_to_grade', { count: totalSubmission })}
              </TblInputLabel>
            </Box>
            <Box>
              <ToGradeList />
            </Box>
          </Grid>
        )}
      </Grid>
      <TblTour
        steps={tourConfig}
        isOpen={openTour}
        lastStepNextButton={
          <TblButton onClick={updateBehavior}>
            {t('tour:ok_I_got_it')}
          </TblButton>
        }
      />
    </Layout1>
  );
}

export default MyCoursesContainer;
