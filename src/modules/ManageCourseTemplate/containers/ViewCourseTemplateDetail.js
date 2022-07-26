import React, { useCallback, useContext, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation, useRouteMatch } from 'react-router';

import { BreadcrumbContext } from 'components/TblBreadcrumb';
import Loading from 'components/TblLoading';
import Tabs from 'components/TblTabs';

import loadable from '@loadable/component';
import { AuthDataContext } from 'AppRoute/AuthProvider';
import manageCourseTemplateActions from 'modules/ManageCourseTemplate/actions';
import { ROUTE_SCHOOL_LIBRARY } from 'modules/SchoolLibrary/constantsRoute';
import { useSnackbar } from 'notistack';
import { setUrlParam } from 'utils';

import { TAB_ENUM_COURSE_TEMPLATE_DETAIL } from '../constants';
import { ROUTE_MANAGE_COURSE_TEMPLATE } from '../constantsRoute';

const Information = loadable(
  () =>
    import(
      'modules/ManageCourseTemplate/containers/TemplateInformation/Information'
    ),
  {
    fallback: <Loading />,
  }
);
const Plan = loadable(
  () => import('modules/ManageCourseTemplate/containers/Plan/Plan'),
  {
    fallback: <Loading />,
  }
);
const TabNameEnum = TAB_ENUM_COURSE_TEMPLATE_DETAIL;
export default function ViewCourseTemplateDetail() {
  const context = useContext(BreadcrumbContext);
  const authContext = useContext(AuthDataContext);
  const { organizationId } = authContext.currentUser;
  const { t } = useTranslation(['ManageCourseTemplate', 'common', 'myCourses']);
  const match = useRouteMatch();
  const location = useLocation();
  const history = useHistory();
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const { templateId } = match.params;

  const templateDetail = useSelector(
    (state) => state.ManageCourseTemplate.templateDetail
  );
  const changeSaved = useSelector(
    (state) => state.ManageCourseTemplate?.changeSaved
  );

  const searchParams = new URLSearchParams(location.search);

  let activeTab = 1;
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
  const renderTabContent = useMemo(() => {
    if (!TabNameEnum) {
      return <></>;
    }
    switch (activeTab) {
      case TabNameEnum?.INFORMATION?.key:
        return <Information />;
      case TabNameEnum?.PLAN?.key:
        return (
          <Plan
            templateId={templateId}
            organizationId={organizationId}
            location={location}
            history={history}
            authContext={authContext}
           />
        );

      default:
        return <></>;
    }
  }, [activeTab, authContext, history, location, organizationId, templateId]);
  const getBasicInformation = useCallback(() => {
    dispatch(
      manageCourseTemplateActions.getCourseTemplateDetail({
        templateId,
        organizationId,
        isBusy: true,
        changeSaved: false,
      })
    );
  }, [dispatch, organizationId, templateId]);

  const onChangeTab = useCallback(
    (e, value, TabNameEnum) => {
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
    },
    [history, location]
  );

  useEffect(() => {
    let newTabs = [
      {
        label: t('Plan'),
      },
      { label: t('Course Template Info') },
    ];
    let newTabName = TAB_ENUM_COURSE_TEMPLATE_DETAIL;
    let path = ROUTE_MANAGE_COURSE_TEMPLATE.DEFAULT;
    let headerContent = t('common:manager_course_template');

    if (match.path.includes(ROUTE_SCHOOL_LIBRARY.DEFAULT)) {
      path = ROUTE_SCHOOL_LIBRARY.DEFAULT;
      headerContent = t('common:school_library');
    }

    context.setData({
      path: path,
      headerContent: headerContent,
      bodyContent: templateDetail?.templateName,
      footerContent: (
        <Tabs
          onChange={(e, value) => onChangeTab(e, value, newTabName)}
          selectedTab={activeTab}
          selfHandleChange={true}
          tabs={newTabs}
        />
      ),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onChangeTab , templateDetail]);
  useEffect(() => {
    getBasicInformation();
  }, [getBasicInformation]);

  useEffect(() => {
    if (changeSaved) {
      enqueueSnackbar(t('common:change_saved'), { variant: 'success' });
      dispatch(
        manageCourseTemplateActions.manageCourseTemplateSetState({
          changeSaved: false,
        })
      );
    }
  }, [changeSaved, dispatch, enqueueSnackbar, t]);
  return <>{renderTabContent}</>;
}
