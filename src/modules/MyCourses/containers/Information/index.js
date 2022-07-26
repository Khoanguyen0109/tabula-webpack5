/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation, useRouteMatch } from 'react-router';

import CheckCircleSharpIcon from '@mui/icons-material/CheckCircleSharp';
import InfoIcon from '@mui/icons-material/Info';
import Icon from '@mui/material/Icon';
import Skeleton from '@mui/material/Skeleton';
import { useTheme } from '@mui/styles';

// import { useTheme } from '@mui/material/styles';

import Tabs from 'components/TblTabs';

import loadable from '@loadable/component';
import { AuthDataContext } from 'AppRoute/AuthProvider';
import PropTypes from 'prop-types';

import allCoursesActions from '../../actions';

import useStyles from './styled';

const BasicInformation = loadable(() => import('shared/AllCourses/containers/BasicInformation'));
const Teachers = loadable(() => import('shared/AllCourses/containers/Teachers'));
const Students = loadable(() => import('shared/AllCourses/containers/Students'));
const SectionsAndMeetingTimes = loadable(() => import('shared/AllCourses/containers/SectionsAndMeetingTimes'));
const AssessmentMethod = loadable(() => import('shared/AllCourses/containers/AssessmentMethod'));
const Syllabus = loadable(() => import('../../../../shared/AllCourses/containers/Syllabus'));
const GradeWeighting = loadable(() => import('../../shared/GradeWeighting/container'));

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
    'data-tut': 'reactour__gradeWeighting'
  },
  SYLLABUS: {
    key: 6,
    name: 'syllabus',
    fieldValidate: 'syllabus',
    'data-tut': 'reactour__syllabus'

  },
};

function AllCourseDetail(props) {
  // NOTE: get contexts
  // const context = useContext(BreadcrumbContext);
  const { t } = useTranslation(['allCourses', 'myCourses', 'common', 'dialog']);
  const theme = useTheme();
  const { permission } = props;

  // NOTE: connect redux
  const authContext = useContext(AuthDataContext);
  const dispatch = useDispatch();
  // const courseValidation = useSelector(state => state.SchoolYear.courseValidation);

  // NOTE: styles
  const classes = useStyles();
  // const theme = useTheme();

  // NOTE: initial states and props
  const match = useRouteMatch();
  const location = useLocation();
  const history = useHistory();
  const searchParams = new URLSearchParams(location.search);
  let activeTab = 0;
  if (searchParams.get('info-active')) {
    const activeQuery = searchParams.get('info-active');
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
  const courseId = match.params.courseId;
  const courseValidation = useSelector((state) => state.AllCourses.courseValidation) ?? {};
  // NOTE: common functions
  const getBasicInformation = useCallback(() => {
    dispatch(allCoursesActions.getBasicInfo({
      orgId: organizationId,
      courseId
    }));
  }, [dispatch, organizationId, courseId]);

  const BasicInformationContent = useMemo(() => (
    <BasicInformation
      authContext={authContext}
      location={location}
      permission={permission}
      getBasicInformation={getBasicInformation}
    />
  ), [authContext, location, permission]);
  const TeachersContent = useMemo(() => (
    <Teachers location={location} match={match} />
  ), []);
  const SectionsAndMeetingTimesContent = useMemo(() => (
    <SectionsAndMeetingTimes
      t={t}
      match={match}
      permission={permission}
      location={location}
      authContext={authContext}
    />
  ), []);
  const StudentsContent = useMemo(() => (
    <Students location={location} match={match} />
  ), [authContext]);

  const AssessmentMethodContent = (
    <AssessmentMethod location={location} match={match} />
  );

  const SyllabusContent = useMemo(() => (
    <Syllabus t={t}
      match={match}
      className={classes.syllabus}
      authContext={authContext}
      permission={permission}
      location={location}
    />
  ));

  const GradeWeightingContent = useMemo(() => (
    <GradeWeighting />
  ));

  const renderIcon = (show) => {
    switch (show) {
      case undefined:
        return <Icon><Skeleton variant='circular' /></Icon>;
      case true:
        return <CheckCircleSharpIcon style={{ color: theme.mainColors.green[0] }} />;
      default:
        return <InfoIcon style={{ color: theme.palette.error.main }} />;
    };
  };

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
      case TabNameEnum.GRADE_WEIGHTING.key:
        return GradeWeightingContent;
      case TabNameEnum.SYLLABUS.key:
        return SyllabusContent;
      default:
        return <></>;
    };
  };

  const renderTabs = () => Object.keys(TabNameEnum).map((k) => {
      const { key, name, fieldValidate } = TabNameEnum[k];
      return {
        name: t(name),
        label: t(name),
        children: renderTabContent(key),
        icon: renderIcon(courseValidation[fieldValidate]),
        'data-tut': TabNameEnum[k]['data-tut']
      };
    });

  // NOTE: handle react lifecycle
  const getCourseValidation = useCallback(() => {
    dispatch(allCoursesActions.getCourseValidation({
      orgId: organizationId,
      courseId
    }));
  }, [dispatch, organizationId, courseId]);

  useEffect(() => {
    getBasicInformation();
    getCourseValidation();
    return (() => {
      dispatch(allCoursesActions.myCoursesSetState({ gradeWeight: [] }));
    });
  }, []);

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
      searchParams.set('info-active', TabNameEnum[activeKey[0]].name);
      history.push({
        pathname: location.pathname,
        search: searchParams.toString()
      });
    }
  };
  return (
    <Tabs layout={2} selectedTab={activeTab} onChange={onChangeTab} selfHandleChange={true} tabs={renderTabs()} orientation='vertical' />
  );
}

AllCourseDetail.propTypes = {
  permission: PropTypes.object
};
// AllCourseDetail.whyDidYouRender = true;
export default AllCourseDetail;