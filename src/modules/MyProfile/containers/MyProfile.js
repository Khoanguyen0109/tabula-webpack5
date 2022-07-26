import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import isEmpty from 'lodash/isEmpty';
import trim from 'lodash/trim';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import { BreadcrumbContext } from 'components/TblBreadcrumb';
import Tabs from 'components/TblTabs';

import { isStudent } from 'utils/roles';

import { ROUTE_AUTH } from 'shared/Auth/constantsRoute';

import loadable from '@loadable/component';
import { AuthDataContext } from 'AppRoute/AuthProvider';
import Layout1 from 'layout/Layout1';
import { withSnackbar } from 'notistack';
import PropTypes from 'prop-types';

import authActions from '../actions';

import SchoolYearFilter from './SchoolYearFilter';
const InformationForm = loadable(() => import('./InformationForm'));
const PasswordForm = loadable(() => import('./PasswordForm'));
const BedtimePreference = loadable(() => import('./BedtimePreference'));

const TabNameEnumProfile = {
  INFORMATION: {
    key: 0,
    name: 'information',
  },
  PASSWORD: {
    key: 1,
    name: 'password',
  },

  BEDTIME_PREFERENCE: {
    key: 2,
    name: 'bedtime_preference',
  },
  SCHOOL_YEAR_FILTER: {
    key: 3,
    name: 'school_year_filter',
  },
};

class MyProfile extends React.PureComponent {
  static contextType = BreadcrumbContext;

  state = { activeTab: 0 };

  static getDerivedStateFromProps(props, state) {
    const searchParams = new URLSearchParams(props.location.search);
    const newState = {};
    if (searchParams.get('active') && TabNameEnumProfile) {
      const activeQuery = searchParams.get('active');
      const activeKey = Object.keys(TabNameEnumProfile).filter((k) => {
        const { name } = TabNameEnumProfile[k];
        return name === activeQuery;
      });
      if (
        activeKey.length &&
        TabNameEnumProfile[activeKey[0]].key !== state.activeTab
      ) {
        newState.activeTab = TabNameEnumProfile[activeKey[0]].key;
      }
    }
    return !isEmpty(newState) ? newState : null;
  }

  componentDidMount() {
    const { setData } = this.context;
    setData({
      bodyContent: this.renderBreadcrumbBody(),
      footerContent: this.renderTab(),
    });
  }

  componentDidUpdate() {
    const {
      history,
      enqueueSnackbar,
      t,
      isChangeProfileSuccess,
      isChangePassWordSuccess,
    } = this.props;
    if (isChangePassWordSuccess) {
      enqueueSnackbar(t('common:change_saved'), { variant: 'success' });
      setTimeout(() => history.push(ROUTE_AUTH.LOGOUT), 1000);
    }
    if (isChangeProfileSuccess) {
      enqueueSnackbar(t('common:change_saved'), { variant: 'success' });
      this.props.resetMyProfileReducer({ isChangeProfileSuccess: false });
    }
  }

  componentWillUnmount() {
    this.props.resetMyProfileReducer({ isChangePassWordSuccess: false });
  }

  renderBreadcrumbBody = () => this.props.t('my_profile');

  updateMyProfile = (params) => {
    const payload = { ...params };
    delete payload.email;
    Object.assign(payload, {
      firstName: trim(payload.firstName),
      lastName: trim(payload.lastName),
      phone: trim(payload.phone),
    });
    this.props.updateMyProfile({ ...payload, isBusy: true });
  };

  changePassword = (payload) => {
    this.props.changePassword({ ...payload, isBusy: true });
  };

  handleChangeTabs = (e, value, TabNameEnum) => {
    const { history, location } = this.props;
    const activeKey = Object.keys(TabNameEnum).filter((k) => {
      const { key } = TabNameEnum[k];
      return key === value;
    });
    if (activeKey.length) {
      this.setState({ activeTab: TabNameEnum[activeKey[0]].key });
      history.push({
        pathname: location.pathname,
        search: `?active=${ TabNameEnum[activeKey[0]].name}`,
      });
    }
    this.props.resetMyProfileReducer({ error: null, isBusy: false });
  };

  renderTab = () => {
    const { t, currentUser } = this.props;
    const { activeTab } = this.state;
    const tabArray = [{ label: t('information') }, { label: t('password') }];
    if (isStudent(currentUser)) {
      tabArray.push(
        { label: t('bedtime_preference') },
        { label: t('schoolYear:school_years') }
      );
    }

    return (
      <Tabs
        onChange={(e, value) =>
          this.handleChangeTabs(e, value, TabNameEnumProfile)
        }
        tabs={tabArray}
        selectedTab={activeTab}
      />
    );
  };

  renderTabContent = (authValues) => {
    const { error, isBusy, t } = this.props;
    const { activeTab } = this.state;
    if (!TabNameEnumProfile) {
      return null;
    }
    switch (activeTab) {
      case TabNameEnumProfile?.INFORMATION?.key:
        return (
          <Grid item sm={6}>
            <InformationForm
              currentUser={authValues.currentUser}
              error={error}
              isBusy={isBusy}
              t={t}
              onSubmit={this.updateMyProfile}
            />
          </Grid>
        );
      case TabNameEnumProfile?.PASSWORD?.key:
        return (
          <Grid item sm={6}>
            <PasswordForm
              error={error}
              isBusy={isBusy}
              t={t}
              onSubmit={this.changePassword}
            />
          </Grid>
        );
      case TabNameEnumProfile?.BEDTIME_PREFERENCE?.key:
        return <BedtimePreference t={t} />;
      case TabNameEnumProfile?.SCHOOL_YEAR_FILTER?.key:
        return <SchoolYearFilter />;
      default:
        return <></>;
    }
  };

  render() {
    return (
      <Layout1>
        <Grid container spacing={0}>
          <Grid item xs={12} sm={8}>
            <Box mt={1.375}>
              <AuthDataContext.Consumer>
                {(authValues) => this.renderTabContent(authValues)}
              </AuthDataContext.Consumer>
            </Box>
          </Grid>
        </Grid>
      </Layout1>
    );
  }
}

MyProfile.propTypes = {
  isBusy: PropTypes.bool,
  t: PropTypes.func,
  error: PropTypes.array,
  updateMyProfile: PropTypes.func,
  resetMyProfileReducer: PropTypes.func,
  isChangePassWordSuccess: PropTypes.bool,
  history: PropTypes.object,
  location: PropTypes.object,
  enqueueSnackbar: PropTypes.func,
  changePassword: PropTypes.func,
  isChangeProfileSuccess: PropTypes.bool,
  currentUser: PropTypes.object,
};

const mapStateToProps = (state) => ({
  error: state.MyProfile.error,
  isBusy: state.MyProfile.isBusy,
  isChangePassWordSuccess: state.MyProfile.isChangePassWordSuccess,
  isChangeProfileSuccess: state.MyProfile.isChangeProfileSuccess,
  currentUser: state.Auth.currentUser,
});

const mapDispatchToProps = (dispatch) => ({
  updateMyProfile: (payload) => dispatch(authActions.updateMyProfile(payload)),
  changePassword: (payload) => dispatch(authActions.changePassword(payload)),
  resetMyProfileReducer: (payload) =>
    dispatch(authActions.resetMyProfileReducer(payload)),
});

export default withSnackbar(
  withTranslation(['myProfile', 'auth', 'common', 'error'])(
    connect(mapStateToProps, mapDispatchToProps)(MyProfile)
  )
);
