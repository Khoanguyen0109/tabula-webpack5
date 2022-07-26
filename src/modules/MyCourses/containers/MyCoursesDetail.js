import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation, useRouteMatch } from 'react-router';

import isEmpty from 'lodash/isEmpty';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';

import { BreadcrumbContext } from 'components/TblBreadcrumb';
import BreadcrumbTitle from 'components/TblBreadcrumb/BreadcrumbTitle';
import TblButton from 'components/TblButton';
import TblDialog from 'components/TblDialog';
import Loading from 'components/TblLoading';
import TblSelect from 'components/TblSelect';
import Tabs from 'components/TblTabs';
import TblTour from 'components/TblTour';
import TourContent from 'components/TblTour/TourContent';

import { COURSE_ROLE, GUARDIAN, STUDENT, TEACHER } from 'utils/roles';
import { isGuardian, isTeacher } from 'utils/roles';

import { COURSE_STATUS } from 'shared/MyCourses/constants';

import loadable from '@loadable/component';
import { AuthDataContext } from 'AppRoute/AuthProvider';
import { delay, intersection, size } from 'lodash-es';
import myProfileActions from 'modules/MyProfile/actions';
import { useSnackbar } from 'notistack';
import { checkPermission } from 'utils';
import { setUrlParam } from 'utils';

import { USER_BEHAVIOR } from '../../../shared/User/constants';
import myCourseActions from '../actions';
import {
  TabNameEnumAssisTantTeacher,
  TabNameEnumStudent,
  TabNameEnumTeacher,
} from '../constants';
import { ROUTE_MY_COURSES } from '../constantsRoute';

import GradeBook from './GradeBook';

// const Plan = loadable(() => import('../containers/Plan'));
const CourseContent = loadable(() => import('../containers/CourseContent'), {
  fallback: <Loading />,
});
const Plan = loadable(() => import('../containers/Plan'), {
  fallback: <Loading />,
});
const UnitsAndCoursesActivities = loadable(
  () => import('./UnitsAndCourseActivities'),
  { fallback: <Loading /> }
);
const Information = loadable(() => import('./Information'), {
  fallback: <Loading />,
});
const StudentSubmissions = loadable(() => import('./StudentSubmissions'), {
  fallback: <Loading />,
});

// const ROLES_UPDATE = ['Course Manager', TEACHER];
//NOTE: Fix bug TL-3312
const ROLES_UPDATE = [TEACHER];

export default function MyCourseDetail() {
  // NOTE: initial states and props
  const context = useContext(BreadcrumbContext);
  const authContext = useContext(AuthDataContext);
  const { organizationId, organization, settings } = authContext.currentUser;
  const haveAccessed = settings?.behavior?.includes(
    USER_BEHAVIOR.HAVE_ACCESSED_COURSE
  );
  const haveAccessedPublish = settings?.behavior?.includes(
    USER_BEHAVIOR.HAVE_FINISHED_SET_UP_COURSE
  );
  const match = useRouteMatch();
  const location = useLocation();
  const history = useHistory();
  const { t } = useTranslation(['myCourses', 'common', 'tour']);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const searchParams = new URLSearchParams(location.search);
  const courseId = match.params.courseId;
  const studentId = match.params.studentId;
  const basicInfo = useSelector((state) => state.AllCourses?.basicInfo);
  const permission = useSelector((state) => state?.AllCourses?.permission);
  const errGetCourseContent = useSelector(
    (state) => state.AllCourses?.errGetCourseContent
  );
  const updateBasicInfoFailed = useSelector(
    (state) => state.AllCourses?.updateBasicInfoFailed
  );
  const updateBasicInfoSuccess = useSelector(
    (state) => state.AllCourses?.updateBasicInfoSuccess
  );
  const [TabNameEnum, setTabEnum] = useState(null);
  const [openTour, setOpenTour] = useState(false);
  const [openTourPublish, setOpenTourPublish] = useState(false);
  const updateStatus = useSelector((state) => state.AllCourses?.updateStatus);
  const courseValidation = useSelector(
    (state) => state.AllCourses.courseValidation
  );
  const [openDialogWarning, setOpenDialogWarning] = useState(false);
  // const theme = useTheme();
  let activeTab = 0;
  if (searchParams.get('active') && TabNameEnum) {
    const activeQuery = searchParams.get('active');
    const activeKey = Object.keys(TabNameEnum).filter((k) => {
      const { name } = TabNameEnum[k];
      if (name === activeQuery) {
        return true;
      }
      return false;
    });
    if (activeKey.length) {
      activeTab = TabNameEnum[activeKey[0]].key;
    }
  }

  const getBasicInformation = useCallback(() => {
    dispatch(
      myCourseActions.getBasicInfo({
        orgId: organizationId,
        courseId,
      })
    );
  }, [dispatch, organizationId, courseId]);

  const updateBasicInformation = (e) => {
    if (e.target.value === COURSE_STATUS.PUBLISHED) {
      return setOpenDialogWarning(true);
    }
  };
  const handleSubmitPublishCourse = () => {
    setOpenDialogWarning(false);
    dispatch(
      myCourseActions.updateBasicInfo({
        orgId: organizationId,
        courseId,
        updateStatus: true,
        updateBasicInfoSuccess: false,
        data: {
          status: COURSE_STATUS.PUBLISHED,
        },
      })
    );
  };

  const getCourseValidation = useCallback(() => {
    dispatch(
      myCourseActions.getCourseValidation({
        orgId: organizationId,
        courseId,
      })
    );
  }, [dispatch, organizationId, courseId]);

  const getCoursePermission = useCallback(() => {
    dispatch(
      myCourseActions.mcGetPermissionCourse({
        orgId: organizationId,
        courseId,
      })
    );
  }, [dispatch, organizationId, courseId]);

  const renderTabContent = useMemo(() => {
    if (!TabNameEnum) {
      return <></>;
    }
    switch (activeTab) {
      case TabNameEnum?.INFORMATION?.key:
        return <Information permission={permission} />;
      case TabNameEnum?.UNIT_COURSE_ACTIVITIES?.key:
        return <UnitsAndCoursesActivities courseId={courseId} />;
      case TabNameEnum?.PLAN?.key:
        return (
          <Plan
            courseId={courseId}
            orgId={organizationId}
            timezone={organization.timezone}
            location={location}
            history={history}
            permission={permission}
            authContext={authContext}
          />
        );
      case TabNameEnum?.GRADEBOOK?.key:
        return <GradeBook />;
      case TabNameEnum?.COURSE_CONTENT?.key:
        return (
          <CourseContent
            courseId={courseId}
            studentId={studentId}
            orgId={organizationId}
            match={match}
            timezone={organization.timezone}
            location={location}
            history={history}
          />
        );
      case TabNameEnum?.STUDENT_SUBMISSIONS?.key:
        return (
          <StudentSubmissions
            courseId={courseId}
            orgId={organizationId}
            timezone={organization.timezone}
            location={location}
            history={history}
          />
        );

      default:
        return <></>;
    }
  }, [
    TabNameEnum,
    activeTab,
    authContext,
    courseId,
    history,
    location,
    match,
    organization.timezone,
    organizationId,
    permission,
    studentId,
  ]);

  const breadcrumbBody = () => {
    const hasPermission = permission
      ? checkPermission(permission || authContext.currentUser, ROLES_UPDATE)
      : false;
    return (
      <Box
        width='100%'
        display='flex'
        alignItems='center'
        justifyContent='space-between'
      >
        <BreadcrumbTitle title={basicInfo?.courseName} />
        {basicInfo.courseName &&
        hasPermission &&
        basicInfo?.status !== COURSE_STATUS.DRAFT ? (
          <TblButton variant='contained' disabled>
            {t('common:published')}
          </TblButton>
        ) : (
          hasPermission && (
            <Box
              display='flex'
              alignItems='center'
              alignContent='flex-end'
              data-tut='reactour__publish'
            >
              <TblSelect
                hasBoxShadow={false}
                value={basicInfo.status ?? -1}
                onChange={updateBasicInformation}
                disabled={basicInfo?.status !== COURSE_STATUS.DRAFT}
              >
                <MenuItem value={-1}>{t('common:draft')}</MenuItem>
                <MenuItem value={1}>{t('common:published')}</MenuItem>
              </TblSelect>
              {/* <Typography variant='bodyMedium' component='span' color='primary' style={{
          background: theme.mainColors.gray[2], padding: theme.spacing(1, 2), borderRadius: theme.spacing(1),
          lineHeight: '1.47',
          fontWeight: theme.fontWeight.semi
        }}>{t('common:draft')}</Typography> */}
            </Box>
          )
        )}
      </Box>
    );
  };

  const onChangeTab = (e, value, TabNameEnum) => {
    const activeKey = Object.keys(TabNameEnum).filter((k) => {
      const { key } = TabNameEnum[k];
      if (key === value) {
        return true;
      }
      return false;
    });
    if (activeKey.length) {
      // The component will render more 2 times but use it to make use comfortable
      setUrlParam(location, history, {
        active: TabNameEnum[activeKey[0]].name,
      });
    }
  };

  const updateBehavior = (behavior) => {
    settings.behavior.push(behavior);
    const payload = { settings };
    setOpenTour(false);
    setOpenTourPublish(false);
    dispatch(myProfileActions.updateMyProfile(payload));
  };

  const tourConfig = [
    {
      selector: '[data-tut="reactour__unitAndCoursesActivities"]',
      content: () => (
        <TourContent
          label={t('tour:curriculum_management')}
          content={t('tour:curriculum_management_content')
            .split('\n')
            .map((line) => (
              <div>{line}</div>
            ))}
        />
      ),
      position: 'bottom',
    },
    {
      selector: '[data-tut="reactour__plan"]',
      content: () => (
        <TourContent
          label={t('tour:curriculum_schedule')}
          content={t('tour:curriculum_schedule_content')}
        />
      ),
      position: 'bottom',
    },
    {
      selector: '[data-tut="reactour__info"]',
      content: () => (
        <TourContent
          label={t('tour:set_up_course')}
          content={t('tour:set_up_course_content')}
        />
      ),
      position: 'bottom',
    },
    {
      selector: '[data-tut="reactour__gradeWeighting"]',
      content: () => (
        <TourContent
          label={t('tour:set_up_grade_weighting')}
          content={t('tour:set_up_grade_weighting_content')}
        />
      ),
      position: 'right',
    },
    {
      selector: '[data-tut="reactour__syllabus"]',
      content: () => (
        <TourContent
          label={t('tour:set_up_syllabus')}
          content={t('tour:set_up_syllabus_content')}
        />
      ),
      position: 'right',
    },
  ];

  const tourConfigPublish = [
    {
      selector: '[data-tut="reactour__publish"]',
      content: () => (
        <TourContent
          label={t('tour:publish_course')}
          content={t('tour:publish_course_content')}
        />
      ),
      position: 'right',
    },
  ];

  useEffect(() => {
    if (
      courseValidation &&
      TabNameEnum &&
      !Object.values(courseValidation).every((val) => val === true) &&
      !!location.state?.fromCourseList
    ) {
      setUrlParam(location, history, {
        active: TabNameEnum?.INFORMATION?.name,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseValidation, TabNameEnum]);

  useEffect(() => {
    if (updateBasicInfoFailed) {
      enqueueSnackbar(t('cannot_publish'), { variant: 'error' });
      dispatch(
        myCourseActions.myCoursesSetState({ updateBasicInfoFailed: false })
      );
    }
  }, [dispatch, enqueueSnackbar, t, updateBasicInfoFailed]);

  useEffect(() => {
    if (updateBasicInfoSuccess) {
      if (updateStatus) {
        enqueueSnackbar(t('common:change_saved'), { variant: 'success' });
      }
      dispatch(
        myCourseActions.myCoursesSetState({
          updateBasicInfoSuccess: false,
          updateStatus: false,
        })
      );
    }
  }, [dispatch, enqueueSnackbar, t, updateBasicInfoSuccess, updateStatus]);

  useEffect(() => {
    if (
      !haveAccessed &&
      !!TabNameEnum &&
      isTeacher(authContext?.currentUser) &&
      basicInfo?.status === COURSE_STATUS.DRAFT
    ) {
      delay(() => {
        setOpenTour(true);
      }, 700);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [haveAccessed, basicInfo, TabNameEnum]);
  useEffect(() => {
    if (
      !haveAccessedPublish &&
      !isEmpty(courseValidation) &&
      isTeacher(authContext?.currentUser) &&
      Object.values(courseValidation).every((validate) => !!validate) &&
      basicInfo.status === COURSE_STATUS.DRAFT
    ) {
      delay(() => {
        setOpenTourPublish(true);
      }, 800);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseValidation, basicInfo]);

  useEffect(() => {
    getBasicInformation();
    getCoursePermission();
    getCourseValidation();
    return () => {
      dispatch(
        myCourseActions.myCoursesSetState({
          courseValidation: null,
          // basicInfo: {},
        })
      );
    };
  }, [dispatch, getBasicInformation, getCoursePermission, getCourseValidation]);

  useEffect(() => {
    const roles = (permission?.roles ?? []).map(({ roleName }) => roleName);
    if (!size(roles)) return;
    let newTabs = [
      {
        label: t('plan'),
        'data-tut': 'reactour__unitAndCoursesActivities',
      },
      { label: t('schedule'), 'data-tut': 'reactour__plan' },
      // { label: t('student_submissions'), hidden: basicInfo?.status === -1 },
      { label: t('grade') },
      { label: t('common:course_info'), 'data-tut': 'reactour__info' },
    ];

    let newTabName = TabNameEnumTeacher;
    if (
      permission?.courseRoles?.[0]?.roleName === COURSE_ROLE.TEACHING_ASSISTANT
    ) {
      newTabs = [
        {
          label: t('plan'),
          'data-tut': 'reactour__unitAndCoursesActivities',
        },
        { label: t('schedule'), 'data-tut': 'reactour__plan' },
        { label: t('common:course_info'), 'data-tut': 'reactour__info' },
      ];
      newTabName = TabNameEnumAssisTantTeacher;
    }
    let path = ROUTE_MY_COURSES.DEFAULT;
    if (size(intersection(roles, [STUDENT, GUARDIAN]))) {
      newTabs = [
        { label: t('course_contents'), divide: true },
        { label: t('common:course_info') },
      ];
      newTabName = TabNameEnumStudent;
    }
    if (roles.includes(GUARDIAN) && match?.params?.studentId) {
      path = ROUTE_MY_COURSES.MY_COURSES_GUARDIAN(match.params.studentId);
    }
    // setTabs(newTabs);
    setTabEnum(newTabName);
    context.setData({
      path: path,
      headerContent: isGuardian(authContext?.currentUser)
        ? t('courses')
        : t('my_courses'),
      bodyContent: breadcrumbBody(),
      footerContent: isEmpty(errGetCourseContent) ? (
        <Tabs
          onChange={(e, value) => onChangeTab(e, value, newTabName)}
          selectedTab={activeTab}
          selfHandleChange={true}
          tabs={newTabs}
        />
      ) : (
        <Alert severity='error'>{t('myCourses:course_unavailable')}</Alert>
      ),
    });
  }, [activeTab, basicInfo, permission, errGetCourseContent]); //eslint-disable-line

  useEffect(
    () => () => {
      dispatch(myCourseActions.myCoursesSetState({ basicInfo: {} }));
    },
    [dispatch]
  );
  return (
    <>
      {renderTabContent}

      <TblTour
        steps={tourConfig}
        isOpen={openTour}
        lastStepNextButton={
          <TblButton
            onClick={() => updateBehavior(USER_BEHAVIOR.HAVE_ACCESSED_COURSE)}
          >
            {t('tour:ok_I_got_it')}
          </TblButton>
        }
      />
      <TblTour
        steps={tourConfigPublish}
        isOpen={openTourPublish}
        lastStepNextButton={
          <TblButton
            onClick={() =>
              updateBehavior(USER_BEHAVIOR.HAVE_FINISHED_SET_UP_COURSE)
            }
          >
            {t('tour:ok_I_got_it')}
          </TblButton>
        }
      />
      <TblDialog
        title={t('myCourses:publish_this_course')}
        open={openDialogWarning}
        footer={
          <Box display={'flex'} width={'100%'} flexDirection={'row-reverse'}>
            <TblButton
              size='medium'
              variant='contained'
              color='primary'
              onClick={handleSubmitPublishCourse}
            >
              {t('common:publish')}
            </TblButton>
            <Box marginRight={2}>
              <TblButton
                variant='outlined'
                size='medium'
                color='primary'
                onClick={() => setOpenDialogWarning(false)}
              >
                {t('common:cancel')}
              </TblButton>
            </Box>
          </Box>
        }
      >
        <Box mt={2} mb={2}>
          {t('myCourses:publish_course_warning')}
        </Box>
      </TblDialog>
    </>
  );
}
