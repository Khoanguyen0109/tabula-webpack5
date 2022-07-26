/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useContext, useEffect, useMemo } from 'react';
// import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation, useRouteMatch } from 'react-router';

import CheckCircleSharpIcon from '@mui/icons-material/CheckCircleSharp';
import InfoIcon from '@mui/icons-material/Info';
import { Divider, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Icon from '@mui/material/Icon';
import Skeleton from '@mui/material/Skeleton';
import { useTheme } from '@mui/styles';

import { BreadcrumbContext } from 'components/TblBreadcrumb';
import BreadcrumbTitle from 'components/TblBreadcrumb/BreadcrumbTitle';
import Loading from 'components/TblLoading';
import Tabs from 'components/TblTabs';

import { COURSE_STATUS } from 'shared/MyCourses/constants';

import loadable from '@loadable/component';
import { AuthDataContext } from 'AppRoute/AuthProvider';
import { Layout2 } from 'layout';
import { isEmpty } from 'lodash-es';
import myCourseActions from 'modules/MyCourses/actions';

import allCoursesActions from '../actions';
import { ROUTE_ALL_COURSES } from '../constantsRoute';

const BasicInformation = loadable(() => import('./BasicInformation'), {
  fallback: <Loading />,
});
const Teachers = loadable(() => import('./Teachers'), {
  fallback: <Loading />,
});
const Students = loadable(() => import('./Students'), {
  fallback: <Loading />,
});
// const TermsAndGradingPeriods = loadable(() => import('./TermsAndGradingPeriods'));
// const DailyTemplateAndTimeSlots = loadable(() => import('./DailyTemplateAndTimeSlots'));
// const YearlySchedule = loadable(() => import('./YearlySchedule'));
const SectionsAndMeetingTimes = loadable(
  () => import('./SectionsAndMeetingTimes'),
  { fallback: <Loading /> }
);
const AssessmentMethod = loadable(() => import('./AssessmentMethod'), {
  fallback: <Loading />,
});
const Syllabus = loadable(() =>
  import('shared/AllCourses/containers/Syllabus')
);
const GradeWeighting = loadable(() =>
  import('modules/MyCourses/shared/GradeWeighting/container/index')
);
const TabNameEnum = {
  BASIC_INFORMATION: {
    key: 0,
    name: 'basic_information',
    fieldValidate: 'basicInfo',
  },
  SECTIONS_MEETING_TIMES: {
    key: 1,
    name: 'sections_meeting_times',
    fieldValidate: 'section',
  },
  ASSESSMENT_METHOD: {
    key: 2,
    name: 'assessment_method',
    fieldValidate: 'assessmentMethod',
  },
  STUDENTS: {
    key: 3,
    name: 'students',
    fieldValidate: 'student',
  },
  TEACHERS: {
    key: 4,
    name: 'teachers',
    fieldValidate: 'teacher',
  },
  GRADE_WEIGHTING: {
    key: 5,
    name: 'grade_weighting',
    fieldValidate: 'gradeWeight',
    hidden: true,
  },
  SYLLABUS: {
    key: 6,
    name: 'syllabus',
    fieldValidate: 'syllabus',
    hidden: true,
  },
};
// NOTE: this sub tab just for render
const subTabs = {
  GRADE_WEIGHTING: {
    key: 5,
    name: 'grade_weighting',
    fieldValidate: 'gradeWeight',
  },
  SYLLABUS: {
    key: 6,
    name: 'syllabus',
    fieldValidate: 'syllabus',
  },
};

const STATUS = {
  '-1': 'common:draft',
  1: 'common:published',
  2: 'common:archive',
};

function AllCourseDetail() {
  // NOTE: get contexts
  const context = useContext(BreadcrumbContext);
  const { t } = useTranslation(['allCourses', 'common', 'dialog']);
  const theme = useTheme();
  const permission = useSelector((state) => state.MyCourses?.permission);
  // NOTE: connect redux
  const authContext = useContext(AuthDataContext);
  const dispatch = useDispatch();
  const courseValidation = useSelector(
    (state) => state.AllCourses.courseValidation
  );
  const basicInfo = useSelector((state) => state.AllCourses?.basicInfo);
  const isPublished = basicInfo.status === COURSE_STATUS.PUBLISHED;
  // NOTE: styles
  // const classes = useStyles();
  // const theme = useTheme();

  // NOTE: initial states and props
  const match = useRouteMatch();
  const location = useLocation();
  const history = useHistory();
  const searchParams = new URLSearchParams(location.search);
  let activeTab = 0;
  if (searchParams.get('active')) {
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

  const { organizationId } = authContext.currentUser;
  const courseId = location.pathname.split('/')[2];

  // NOTE: common functions
  const getBasicInformation = useCallback(() => {
    dispatch(
      allCoursesActions.getBasicInfo({
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
  const getCourseValidation = useCallback(() => {
    dispatch(
      allCoursesActions.getCourseValidation({
        orgId: organizationId,
        courseId,
      })
    );
  }, [dispatch, organizationId, courseId]);

  const BasicInformationContent = useMemo(
    () => (
      <BasicInformation
        authContext={authContext}
        match={match}
        location={location}
        getBasicInformation={getBasicInformation}
      />
    ),
    [authContext, location]
  );
  const TeachersContent = useMemo(
    () => <Teachers location={location} match={match} />,
    []
  );
  const SectionsAndMeetingTimesContent = useMemo(
    () => (
      <SectionsAndMeetingTimes
        t={t}
        match={match}
        location={location}
        authContext={authContext}
      />
    ),
    []
  );
  const StudentsContent = useMemo(
    () => <Students location={location} match={match} />,
    [authContext]
  );

  const AssessmentMethodContent = (
    <AssessmentMethod location={location} match={match} />
  );
  const SyllabusContent = useMemo(() => (
    <Syllabus
      t={t}
      match={match}
      authContext={authContext}
      permission={permission}
      location={location}
    />
  ));

  const GradeWeightingContent = useMemo(() => <GradeWeighting />);

  const renderTabContent = (tab) => {
    switch (tab) {
      case TabNameEnum.BASIC_INFORMATION.key:
        return BasicInformationContent;
      case TabNameEnum.TEACHERS.key:
        return TeachersContent;
      case TabNameEnum.SECTIONS_MEETING_TIMES.key:
        return SectionsAndMeetingTimesContent;
      case TabNameEnum.STUDENTS.key:
        return StudentsContent;
      case TabNameEnum.ASSESSMENT_METHOD.key:
        return AssessmentMethodContent;
      case TabNameEnum.GRADE_WEIGHTING?.key:
        return GradeWeightingContent;
      case TabNameEnum.SYLLABUS?.key:
        return SyllabusContent;
      default:
        return <></>;
    }
  };
  const renderIcon = (show) => {
    switch (show) {
      case undefined:
        return (
          <Icon>
            <Skeleton variant='circular' />
          </Icon>
        );
      case true:
        return (
          <CheckCircleSharpIcon style={{ color: theme.mainColors.green[0] }} />
        );
      default:
        return <InfoIcon style={{ color: theme.palette.error.main }} />;
    }
  };

  const renderTabs = () => Object.keys(TabNameEnum).map((k) => {
      const { key, name, hidden, fieldValidate } = TabNameEnum[k];
      return {
        value: key,
        name: t(name),
        label: t(name),
        //Note: If publish show all field
        hidden: isPublished ? false : !!hidden,
        children: renderTabContent(key),
        icon: renderIcon(courseValidation[fieldValidate]),
      };
    });
  const renderSbuTab = () => Object.keys(subTabs).map((k) => {
      const { key, name } = subTabs[k];
      return {
        value: key,
        name: t(name),
        label: t(name),
        children: renderTabContent(key),
        style: { justifyContent: 'flex-end' },
      };
    });

  const titleSubTabs = () => (
      <Box>
        <Box mt={2} />
        <Divider width='100%' />
        <Box mt={2} />
        <Typography variant='titleSmall'>
          {t('waiting_for_teacher')} ({Object.keys(subTabs).length})
        </Typography>
        <Box mt={1} />
      </Box>
    );

  const breadcrumbBody = () => (
      <Box width='100%' display='flex' justifyContent='space-between' alignItems='center'>
        <BreadcrumbTitle title={basicInfo?.courseName} />
        {basicInfo && <Box display='flex' alignItems='center'>
          <Typography
            variant='bodyMedium'
            component='span'
            color='primary'
            style={{
              background: theme.mainColors.gray[2],
              padding: theme.spacing(1.5, 2),
              borderRadius: theme.spacing(1),
              lineHeight: '1.47',
              fontWeight: theme.fontWeight.semi,
            }}
          >
            {t(STATUS[basicInfo.status])}
          </Typography>
        </Box>}
      </Box>
    );

  // NOTE: handle react lifecycle

  useEffect(() => {
    getBasicInformation();
    getCourseValidation();
    getCoursePermission();
    return () => {
      dispatch(
        allCoursesActions.resetAllCourseReducer({
          courseValidation: {},
          basicInfo: {},
        })
      );
    };
  }, []);

  useEffect(() => {
    context.setData({
      path: ROUTE_ALL_COURSES.DEFAULT,
      headerContent: t('course_administration'),
      bodyContent: breadcrumbBody(),
      footerContent: <Tabs tabs={[{ label: 'Course Info' }]} />,
    });
  }, [basicInfo]);

  const onChangeTab = (e, value) => {
    activeTab = value;
    const activeKey = Object.keys(TabNameEnum).filter((k) => {
      const { key } = TabNameEnum[k];
      if (key === value) {
        return true;
      }
      return false;
    });
    if (activeKey.length) {
      // console.log('replace history');
      // The component will render more 2 times but use it to make use comfortable
      history.push({
        pathname: location.pathname,
        search: `?active=${ TabNameEnum[activeKey[0]].name}`,
      });
    }
  };
  if (isEmpty(courseValidation)) {
    return (
      <Layout2>
        <div>
          <Skeleton />
        </div>
        <div>
          <Skeleton />
        </div>
      </Layout2>
    );
  }
  return (
    <Tabs
      layout={2}
      selectedTab={activeTab}
      onChange={onChangeTab}
      selfHandleChange={true}
      tabs={renderTabs()}
      orientation='vertical'
      subTabs={!isPublished && renderSbuTab()}
      titleSubTabs={!isPublished && titleSubTabs()}
    />
  );
}

AllCourseDetail.propTypes = {};
// AllCourseDetail.whyDidYouRender = true;
export default AllCourseDetail;
