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

import CheckCircleSharpIcon from '@mui/icons-material/CheckCircleSharp';
import InfoIcon from '@mui/icons-material/Info';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
import SettingsIcon from '@mui/icons-material/Settings';
import Box from '@mui/material/Box';
import Icon from '@mui/material/Icon';
import MenuItem from '@mui/material/MenuItem';
import Skeleton from '@mui/material/Skeleton';
import { useTheme } from '@mui/material/styles';

import { BreadcrumbContext } from 'components/TblBreadcrumb';
import BreadcrumbTitle from 'components/TblBreadcrumb/BreadcrumbTitle';
import Confirm from 'components/TblConfirmDialog';
import TblIconButton from 'components/TblIconButton';
import TblSelect from 'components/TblSelect';
import Tabs from 'components/TblTabs';

import loadable from '@loadable/component';
import { AuthDataContext } from 'AppRoute/AuthProvider';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';

import schoolYearActions from '../actions';
import { ROUTE_SCHOOL_YEAR } from '../constantsRoute';

const SchoolYearInformation = loadable(() => import('./SchoolYearInformation'));
const TermsAndGradingPeriods = loadable(() =>
  import('./TermsAndGradingPeriods')
);
const DailyTemplateAndTimeSlots = loadable(() =>
  import('./DailyTemplateAndTimeSlots')
);
const YearlySchedule = loadable(() => import('./YearlySchedule'));
const TermsAndGradingPeriodsSetting = loadable(() =>
  import('../components/TermsAndGradingPeriods/Setting')
);

const TabNameEnum = {
  SCHOOL_YEAR_INFORMATION: {
    key: 0,
    name: 'school_year_information',
    fieldValidate: 'basicInfo',
  },
  TERMS_AND_GRADING_PERIODS: {
    key: 1,
    name: 'terms_and_grading_periods',
    fieldValidate: 'termAndGradingPeriod',
  },
  DAILY_TEMPLATE_AND_TIME_SLOTS: {
    key: 2,
    name: 'daily_template_and_time_slots',
    fieldValidate: 'dailyTemplate',
  },
  YEARLY_SCHEDULE: {
    key: 3,
    name: 'yearly_schedule',
    fieldValidate: 'schedules',
  },
};

function SchoolYearDetail(props) {
  // NOTE: get contexts
  const context = useContext(BreadcrumbContext);
  const { t } = useTranslation(['schoolYear', 'common', 'error']);
  const { enqueueSnackbar } = useSnackbar();
  // NOTE: connect redux
  const authContext = useContext(AuthDataContext);
  const dispatch = useDispatch();
  const schoolYearValidation = useSelector(
    (state) => state.SchoolYear.schoolYearValidation
  );
  const schoolYearStatus = useSelector(
    (state) => state.SchoolYear.schoolYearStatus
  );
  const settingTerms = useSelector((state) => state.SchoolYear.settingTerms);
  const settingGradingPeriods = useSelector(
    (state) => state.SchoolYear.settingGradingPeriods
  );
  const getSettingTermsAndGradingPeriodsSuccess = useSelector(
    (state) => state.SchoolYear.getSettingTermsAndGradingPeriodsSuccess
  );
  const updateSettingTermsAndGradingPeriodsSuccess = useSelector(
    (state) => state.SchoolYear.updateSettingTermsAndGradingPeriodsSuccess
  );
  const updateSettingTermsAndGradingPeriodsFailed = useSelector(
    (state) => state.SchoolYear.updateSettingTermsAndGradingPeriodsFailed
  );
  const schoolYearDetail = useSelector(
    (state) => state.SchoolYear.schoolYearDetail
  );
  const updateSchoolYearStatusFailed = useSelector(
    (state) => state.SchoolYear.updateSchoolYearStatusFailed
  );
  const updateSchoolYearStatusSuccess = useSelector(
    (state) => state.SchoolYear.updateSchoolYearStatusSuccess
  );
  const updateTimeSlotSuccess = useSelector(
    (state) => state.SchoolYear.updateTimeSlotSuccess
  );
  const deleteSchoolYearPeriodSuccess = useSelector(
    (state) => state.SchoolYear.deleteSchoolYearPeriodSuccess
  );
  const createTimeSlotSuccess = useSelector(
    (state) => state.SchoolYear.createTimeSlotSuccess
  );

  // schoolYearValidation

  // NOTE: styles
  // const classes = useStyles();
  const theme = useTheme();

  // NOTE: initial states and props
  const [visibleSetting, setVisibleSetting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const match = useRouteMatch();
  const location = useLocation();
  const history = useHistory();
  const searchParams = new URLSearchParams(location.search);
  let activeTab = 0;
  if (searchParams.get('active')) {
    const activeQuery = searchParams.get('active');
    const activeKey = Object.keys(TabNameEnum).filter((k) => {
      const { fieldValidate } = TabNameEnum[k];
      if (fieldValidate === activeQuery) {
        return true;
      }
      return false;
    });
    if (activeKey.length) {
      activeTab = TabNameEnum[activeKey[0]].key;
    }
  }

  const getSettings = () => {
    dispatch(
      schoolYearActions.getSettingTermsAndGradingPeriods({
        orgId: authContext.currentUser.organizationId,
        schoolYearId: match.params.schoolYearId,
      })
    );
  };

  const updateSettings = (settingData) => {
    dispatch(
      schoolYearActions.updateSettingTermsAndGradingPeriods({
        orgId: authContext.currentUser.organizationId,
        schoolYearId: match.params.schoolYearId,
        updateSettingTermsAndGradingPeriodsFailed: null,
        settingData,
      })
    );
  };

  useEffect(
    (payload) => {
      dispatch(
        schoolYearActions.getSchoolYearValidation({
          orgId: authContext.currentUser.organizationId,
          schoolYearId: match.params.schoolYearId,
          settingData: payload,
        })
      );
    },
    [
      authContext.currentUser.organizationId,
      dispatch,
      match.params.schoolYearId,
      updateTimeSlotSuccess,
      createTimeSlotSuccess,
      deleteSchoolYearPeriodSuccess,
    ]
  );

  const getSchoolYearInformation = useCallback(() => {
    dispatch(
      schoolYearActions.getSchoolYearInformation({
        orgId: authContext.currentUser.organizationId,
        schoolYearId: match.params.schoolYearId,
        urlParams: {
          timezone: authContext.currentUser.timezone,
        },
      })
    );
  }, [
    dispatch,
    authContext.currentUser.organizationId,
    match.params.schoolYearId,
    authContext.currentUser.timezone,
  ]);

  useEffect(() => {
    getSchoolYearInformation();

    return () => {
      dispatch(
        schoolYearActions.resetSchoolYearReducer({
          schoolYearDetail: {},
          schoolYearValidation: {},
        })
      );
    };
  }, []);

  // NOTE: common functions
  const SchoolYearInformationContent = useMemo(
    () => (
      <SchoolYearInformation authContext={authContext} location={location} />
    ),
    [authContext, location]
  );
  const TermsAndGradingPeriodsContent = useMemo(
    () => <TermsAndGradingPeriods location={props.location} />,
    []
  );
  const DailyTemplateAndTimeSlotsContent = useMemo(
    () => <DailyTemplateAndTimeSlots authContext={authContext} match={match} />,
    []
  );
  const YearlyScheduleContent = useMemo(
    () => (
      <YearlySchedule
        authContext={authContext}
        schoolYearId={match.params.schoolYearId}
      />
    ),
    [authContext]
  );

  const renderTabContent = (tab) => {
    switch (tab) {
      case TabNameEnum.SCHOOL_YEAR_INFORMATION.key:
        return SchoolYearInformationContent;
      case TabNameEnum.TERMS_AND_GRADING_PERIODS.key:
        return TermsAndGradingPeriodsContent;
      case TabNameEnum.DAILY_TEMPLATE_AND_TIME_SLOTS.key:
        return DailyTemplateAndTimeSlotsContent;
      case TabNameEnum.YEARLY_SCHEDULE.key:
        return YearlyScheduleContent;

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

  const toggleDialogSetting = (value) => {
    dispatch(
      schoolYearActions.schoolYearSetState({
        getSettingTermsAndGradingPeriodsSuccess: null,
        updateSettingTermsAndGradingPeriodsSuccess: null,
        updateSettingTermsAndGradingPeriodsFailed: null,
      })
    );
    setVisibleSetting(value);
  };

  const renderTabs = () => Object.keys(TabNameEnum).map((k) => {
      const { key, name, fieldValidate } = TabNameEnum[k];
      return {
        name:
          key === 1 ? (
            <Box display='flex' alignItems='center'>
              {t(name)}{' '}
              <Box ml={1}>
                <TblIconButton
                  onClick={() => toggleDialogSetting(true)}
                >
                  <SettingsIcon fontSize='small' />
                </TblIconButton>{' '}
              </Box>
            </Box>
          ) : (
            t(name)
          ),
        label: t(name),
        children: renderTabContent(key),
        icon: renderIcon(schoolYearValidation[fieldValidate]),
      };
    });

  const updateSchoolYearStatus = (e) => {
    dispatch(
      schoolYearActions.updateSchoolYearStatus({
        orgId: authContext?.currentUser?.organizationId,
        schoolYearId: match.params.schoolYearId,
        schoolYear: { status: e?.target?.value },
        updateSchoolYearStatusFailed: null,
        urlParams: {
          timezone: authContext?.currentUser?.timezone,
        },
      })
    );
  };

  const breadcrumbBody = () => (
      <Box width='100%' display='flex' justifyContent='space-between' alignItems='center'>
        <BreadcrumbTitle title={schoolYearDetail?.name || t('school_years')} />
        <Box display='flex' alignItems='center'>
          <TblSelect
            hasBoxShadow={false}
            value={schoolYearStatus}
            mb={0}
            onChange={updateSchoolYearStatus}
            disabled={schoolYearStatus === 1}
          >
            {/* <MenuItem value={-1}>{t('common:archived')}</MenuItem> */}
            <MenuItem value={0}>{t('common:draft')}</MenuItem>
            <MenuItem value={1}>{t('common:published')}</MenuItem>
          </TblSelect>
          {/* <MoreVertIcon/> */}
        </Box>
      </Box>
    );

  // NOTE: handle react lifecycle
  useEffect(() => {
    context.setData({
      path: ROUTE_SCHOOL_YEAR.DEFAULT,
      headerContent: t('school_years'),
      bodyContent: breadcrumbBody(),
    });
  }, [schoolYearStatus, schoolYearDetail]);

  useEffect(() => {
    if (updateSchoolYearStatusSuccess) {
      enqueueSnackbar(t('common:change_saved'), { variant: 'success' });
      dispatch(
        schoolYearActions.resetSchoolYearReducer({
          updateSchoolYearStatusSuccess: false,
        })
      );
    }

    if (!!updateSchoolYearStatusFailed) {
      let errorMessage = t('error:general_error');
      if (updateSchoolYearStatusFailed.errors) {
        switch (updateSchoolYearStatusFailed?.errors?.subcode) {
          case 1:
            errorMessage = t('error:first_day_must_be_in_the_past');
            break;
          case 2:
            errorMessage = t('error:term_and_grading_period_not_complete');
            break;
          default:
            errorMessage = t('error:general_error');
            break;
        }
      }
      if (updateSchoolYearStatusFailed?.errors?.subcode === 7) {
        enqueueSnackbar(t('error:restriction_of_school_year_toast'), {
          variant: 'error',
        });
        dispatch(
          schoolYearActions.resetSchoolYearReducer({
            updateSchoolYearStatusFailed: null,
          })
        );
      } else {
        setErrorMessage(errorMessage);
      }
    }
  }, [updateSchoolYearStatusFailed, updateSchoolYearStatusSuccess]);

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
        search: `?active=${ TabNameEnum[activeKey[0]].fieldValidate}`,
      });
    }
  };

  const onCancel = () => {
    dispatch(
      schoolYearActions.resetSchoolYearReducer({
        updateSchoolYearStatusFailed: null,
      })
    );
    setErrorMessage('');
  };

  return (
    <>
      {visibleSetting && (
        <TermsAndGradingPeriodsSetting
          t={t}
          terms={settingTerms}
          gradingPeriods={settingGradingPeriods}
          visibleDialog={visibleSetting}
          toggleDialog={toggleDialogSetting}
          getSettings={getSettings}
          saveData={updateSettings}
          getSettingsSuccess={getSettingTermsAndGradingPeriodsSuccess}
          updateSettingSuccess={updateSettingTermsAndGradingPeriodsSuccess}
          updateSettingFailed={updateSettingTermsAndGradingPeriodsFailed}
        />
      )}
      <Confirm
        cancelText={t('common:ok')}
        hiddenConfirmButton
        open={!!errorMessage}
        title={t('common:error')}
        message={errorMessage}
        onCancel={onCancel}
      />
      <Tabs
        layout={2}
        selectedTab={activeTab}
        onChange={onChangeTab}
        selfHandleChange={true}
        tabs={renderTabs()}
        orientation='vertical'
      />
    </>
  );
}

SchoolYearDetail.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object,
  match: PropTypes.object,
};
// SchoolYearDetail.whyDidYouRender = true;
export default SchoolYearDetail;
