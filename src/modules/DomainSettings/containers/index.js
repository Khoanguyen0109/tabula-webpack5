import React, { useCallback, useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import makeStyles from '@mui/styles/makeStyles';

import { BreadcrumbContext } from 'components/TblBreadcrumb';
import Tabs from 'components/TblTabs';

import PropTypes from 'prop-types';

import domainSettingsActions from '../actions';
import { OrganizationInformationWrapper } from '../components/OrganizationInformation';
import { TermsAndGradingPeriodsWrapper } from '../components/TermsAndGradingPeriods';
import { TimeZoneSettingsWrapper } from '../components/TimeZoneSettings';
import { ROUTE_DOMAIN_SETTINGS } from '../constantsRoute';

const useStyles = makeStyles(() => ({
  tabs: {
    '& button': {
      display: 'flex',
      flexDirection: 'row !important',
    },
  },
}));
function DomainSettings() {
  const classes = useStyles();
  const context = useContext(BreadcrumbContext);
  const { t } = useTranslation(['domain', 'common']);

  //NOTE: Connect Redux
  const dispatch = useDispatch();
  const orgInfo = useSelector((state) => state.Auth.currentUser.organization);
  const orgId = useSelector((state) => state.Auth.currentUser.organizationId);
  const isUpdateDomainSettingSuccess = useSelector(
    (state) => state.DomainSettings.isUpdateDomainSettingSuccess
  );
  const isUpdateDomainSettingFailed = useSelector(
    (state) => state.DomainSettings.isUpdateDomainSettingFailed
  );
  const terms = useSelector((state) => state.DomainSettings.terms);
  const gradingPeriods = useSelector(
    (state) => state.DomainSettings.gradingPeriods
  );
  const isUpdateTermSuccess = useSelector(
    (state) => state.DomainSettings.isUpdateTermSuccess
  );
  const isUpdateTermFailed = useSelector(
    (state) => state.DomainSettings.isUpdateTermFailed
  );
  const isUpdateGradingPeriodSuccess = useSelector(
    (state) => state.DomainSettings.isUpdateGradingPeriodSuccess
  );
  const isUpdateGradingPeriodFailed = useSelector(
    (state) => state.DomainSettings.isUpdateGradingPeriodFailed
  );
  const isLoadingTerms = useSelector(
    (state) => state.DomainSettings.isLoadingTerms
  );
  const isShowNotificationForUpdatingGradingPeriod = useSelector(
    (state) => state.DomainSettings.isShowNotificationForUpdatingGradingPeriod
  );

  const updateDomainSetting = useCallback(
    (values) => {
      dispatch(
        domainSettingsActions.domainSettingsUpdateDomainSetting({
          domain: values,
          orgId,
        })
      );
    },
    [dispatch, orgId]
  );
  const getTermList = useCallback(() => {
    dispatch(
      domainSettingsActions.domainSettingsGetTerms({
        orgId,
        isLoadingTerms: true,
      })
    );
  }, [dispatch, orgId]);
  const getGradingPeriodList = useCallback(() => {
    dispatch(
      domainSettingsActions.domainSettingsGetGradingPeriods({
        orgId,
        isLoadingGradingPeriods: true,
      })
    );
  }, [dispatch, orgId]);
  const updateTermSetting = useCallback(
    (values) => {
      dispatch(
        domainSettingsActions.domainSettingsUpdateTerm({
          termData: { ...values },
          orgId,
        })
      );
    },
    [dispatch, orgId]
  );
  const updateGradingPeriodSetting = useCallback(
    (values) => {
      if (values.hasOwnProperty('isShowNotificationForUpdatingGradingPeriod')) {
        const isShowNotification =
          values.isShowNotificationForUpdatingGradingPeriod;
        delete values.isShowNotificationForUpdatingGradingPeriod;
        dispatch(
          domainSettingsActions.domainSettingsUpdateGradingPeriod({
            gradingPeriodData: { ...values },
            orgId,
            isShowNotificationForUpdatingGradingPeriod: isShowNotification,
          })
        );
      } else {
        dispatch(
          domainSettingsActions.domainSettingsUpdateGradingPeriod({
            gradingPeriodData: { ...values },
            orgId,
          })
        );
      }
    },
    [dispatch, orgId]
  );
  const setReducer = useCallback(
    (values) => {
      dispatch(domainSettingsActions.domainSettingsSetReducer(values));
    },
    [dispatch]
  );
  const resetReducer = useCallback(() => {
    dispatch(domainSettingsActions.domainSettingsReset());
  }, [dispatch]);

  useEffect(() => {
    const { setData } = context;
    setData({
      path: ROUTE_DOMAIN_SETTINGS.DEFAULT,
      bodyContent: t('domain_settings'),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const tabs = [
    {
      label: t('organization_information'),
      name: t('organization_information'),
      children: <OrganizationInformationWrapper orgInfo={orgInfo} />,
    },
    {
      label: t('time_zone_settings'),
      name: t('time_zone_settings'),
      children: (
        <TimeZoneSettingsWrapper
          orgInfo={orgInfo}
          updateData={updateDomainSetting}
          isUpdateDomainSettingSuccess={isUpdateDomainSettingSuccess}
          isUpdateDomainSettingFailed={isUpdateDomainSettingFailed}
          resetReducer={resetReducer}
        />
      ),
    },
    {
      label: t('terms_and_grading_periods'),
      name: t('terms_and_grading_periods'),
      children: (
        <TermsAndGradingPeriodsWrapper
          terms={terms}
          gradingPeriods={gradingPeriods}
          getTermList={getTermList}
          getGradingPeriodList={getGradingPeriodList}
          updateTermSetting={updateTermSetting}
          updateGradingPeriodSetting={updateGradingPeriodSetting}
          isUpdateTermSuccess={isUpdateTermSuccess}
          isUpdateTermFailed={isUpdateTermFailed}
          isUpdateGradingPeriodSuccess={isUpdateGradingPeriodSuccess}
          isUpdateGradingPeriodFailed={isUpdateGradingPeriodFailed}
          setReducer={setReducer}
          isLoadingTerms={isLoadingTerms}
          isShowNotificationForUpdatingGradingPeriod={
            isShowNotificationForUpdatingGradingPeriod
          }
        />
      ),
    },
  ];

  return (
    <Tabs
      className={classes.tabs}
      layout={2}
      tabs={tabs}
      orientation='vertical'
    />
  );
}

DomainSettings.propTypes = {
  t: PropTypes.func,
  currentUser: PropTypes.object,
  updateDomainSetting: PropTypes.func,
  isUpdateDomainSettingSuccess: PropTypes.bool,
  isUpdateDomainSettingFailed: PropTypes.bool,
  resetReducer: PropTypes.func,
  terms: PropTypes.array,
  gradingPeriods: PropTypes.array,
  getTerms: PropTypes.func,
  getGradingPeriods: PropTypes.func,
  updateTerm: PropTypes.func,
  updateGradingPeriod: PropTypes.func,
  isUpdateGradingPeriodSuccess: PropTypes.bool,
  isUpdateTermSuccess: PropTypes.bool,
  isUpdateTermFailed: PropTypes.bool,
  isUpdateGradingPeriodFailed: PropTypes.bool,
  setReducer: PropTypes.func,
  isLoadingTerms: PropTypes.bool,
  isShowNotificationForUpdatingGradingPeriod: PropTypes.bool,
};

export default DomainSettings;
