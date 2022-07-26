import React, { useCallback, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation, useRouteMatch } from 'react-router';

import CheckCircleSharpIcon from '@mui/icons-material/CheckCircleSharp';
import InfoIcon from '@mui/icons-material/Info';
import Icon from '@mui/material/Icon';
import Skeleton from '@mui/material/Skeleton';
import { useTheme } from '@mui/styles';

import Tabs from 'components/TblTabs';

import loadable from '@loadable/component';
import { AuthDataContext } from 'AppRoute/AuthProvider';
import manageCourseTemplateActions from 'modules/ManageCourseTemplate/actions';

const BasicInformation = loadable(() =>
  import(
    'modules/ManageCourseTemplate/containers/TemplateInformation/BasicInformation'
  )
);
const AssessmentMethod = loadable(() =>
  import(
    'modules/ManageCourseTemplate/containers/TemplateInformation/AssessmentMethod'
  )
);
const GradeWeighting = loadable(() =>
  import(
    'modules/ManageCourseTemplate/containers/TemplateInformation/GradeWeighting'
  )
);
const Syllabus = loadable(() =>
  import('shared/AllCourses/containers/Syllabus')
);

const TabNameEnum = {
  BASIC_INFORMATION: {
    key: 0,
    name: 'basic_information',
    fieldValidate: 'basicInfo',
  },

  ASSESSMENT_METHOD: {
    key: 1,
    name: 'allCourses:assessment_method',
    fieldValidate: 'assessmentMethod',
  },
  GRADE_WEIGHTING: {
    key: 2,
    name: 'grade_weighting',
    fieldValidate: 'gradeWeight',
    'data-tut': 'reactour__gradeWeighting',
  },
  SYLLABUS: {
    key: 3,
    name: 'syllabus',
    fieldValidate: 'syllabus',
    'data-tut': 'reactour__syllabus',
  },
};

function CourseTemplateDetailInfo() {
  const { t } = useTranslation(['allCourses', 'myCourses', 'common', 'dialog']);
  const authContext = useContext(AuthDataContext);
  const dispatch = useDispatch();
  const theme = useTheme();

  // NOTE: initial states and props
  const match = useRouteMatch();
  const location = useLocation();
  const history = useHistory();
  const searchParams = new URLSearchParams(location.search);
  let activeTab = 0;
  const templateDetail = useSelector(
    (state) => state.ManageCourseTemplate?.templateDetail
  );
  const availableGradeLevel = useSelector(
    (state) => state.ManageCourseTemplate?.availableGradeLevel
  );
  const isBusy = useSelector((state) => state.ManageCourseTemplate?.isBusy);
  const isCurrentTemplatePublished = useSelector(
    (state) => state.ManageCourseTemplate?.isCurrentTemplatePublished
  );

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
  const templateId = match.params.templateId;
  const updateBasicInfo = useCallback(
    (data) => {
      dispatch(
        manageCourseTemplateActions.updateCourseTemplate({
          templateId: templateId,
          organizationId: organizationId,
          data: data,
          changeSaved: false,
        })
      );
    },
    [dispatch, organizationId, templateId]
  );
  const BasicInformationContent = useMemo(
    () => (
      <BasicInformation
        authContext={authContext}
        location={location}
        templateDetail={templateDetail}
        availableGradeLevel={availableGradeLevel}
        isBusy={isBusy}
        updateBasicInfo={updateBasicInfo}
        isDisable={isCurrentTemplatePublished}
      />
    ),
    [
      authContext,
      availableGradeLevel,
      isBusy,
      isCurrentTemplatePublished,
      location,
      templateDetail,
      updateBasicInfo,
    ]
  );
  const AssessmentMethodContent = useMemo(
    () => (
      <AssessmentMethod
        location={location}
        match={match}
        assessmentMethod={templateDetail?.assessmentMethod}
        assessmentMethodList={templateDetail.assessmentMethodList}
        updateBasicInfo={updateBasicInfo}
        isDisable={isCurrentTemplatePublished}
      />
    ),
    [
      isCurrentTemplatePublished,
      location,
      match,
      templateDetail.assessmentMethod,
      templateDetail.assessmentMethodList,
      updateBasicInfo,
    ]
  );
  const GradeWeightingContent = useMemo(
    () => (
      <GradeWeighting gradeWeight={templateDetail.gradeWeight?.criterias} />
    ),
    [templateDetail.gradeWeight]
  );
  const SyllabusContent = useMemo(
    () => (
      <Syllabus
        t={t}
        match={match}
        authContext={authContext}
        location={location}
        permission={false}
        syllabusProps={templateDetail.syllabus}
      />
    ),
    [authContext, location, match, t, templateDetail.syllabus]
  );

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

  const renderTabContent = (tab) => {
    switch (tab) {
      case TabNameEnum.BASIC_INFORMATION.key:
        return BasicInformationContent;

      case TabNameEnum.ASSESSMENT_METHOD.key:
        return AssessmentMethodContent;
      case TabNameEnum.GRADE_WEIGHTING.key:
        return GradeWeightingContent;
      case TabNameEnum.SYLLABUS.key:
        return SyllabusContent;
      default:
        return <></>;
    }
  };
  const renderTabs = () =>
    Object.keys(TabNameEnum).map((k) => {
      const { key, name } = TabNameEnum[k];
      return {
        name: t(name),
        label: t(name),
        children: renderTabContent(key),
        icon: renderIcon(true),
        'data-tut': TabNameEnum[k]['data-tut'],
      };
    });
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
        search: searchParams.toString(),
      });
    }
  };
  return (
    <Tabs
      layout={2}
      selectedTab={activeTab}
      onChange={onChangeTab}
      selfHandleChange={true}
      tabs={renderTabs()}
      orientation='vertical'
    />
  );
}

export default CourseTemplateDetailInfo;
