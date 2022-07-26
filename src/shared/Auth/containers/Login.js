import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import filter from 'lodash/filter';
import isEmpty from 'lodash/isEmpty';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import Skeleton from '@mui/material/Skeleton';
import Slide from '@mui/material/Slide';

import {
  COURSE_MANAGER,
  DOMAIN_OWNER,
  GUARDIAN,
  SCHOOL_MANAGER,
  STUDENT,
  TEACHER,
  USER_MANAGER,
} from 'utils/roles';

import { ROUTE_ALL_COURSES } from 'shared/AllCourses/constantsRoute';

import { AuthDataContext } from 'AppRoute/AuthProvider';
import { ROUTE_DOMAIN_SETTINGS } from 'modules/DomainSettings/constantsRoute';
import { ROUTE_MY_COURSES } from 'modules/MyCourses/constantsRoute';
import { ROUTE_SCHOOL_YEAR } from 'modules/SchoolYear/constantsRoute';
import { ROUTE_USERS } from 'modules/Users/constantsRoute';
import PropTypes from 'prop-types';
import { objectToParams, removeToken } from 'utils';

import { ROUTE_TASKS } from '../../../modules/MyTasks/constantsRoute';
import authActions from '../actions';
import Layout from '../components/Layout';
import LoginForm from '../components/LoginForm';
import SubDomainFrom from '../components/SubDomainForm';

class Login extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      courseFetching: false,
      errorMessage: null,
      identity: null,
      hasSubdomain: false,
      subdomain: '',
      subdomainValid: null,
      subdomainFormSubmitted: false,
      checkingSubdomain: true,
      showPassword: false,
      domain: '',
      isBusy: false,
    };
    // this.layoutRef = React.createRef(null);
  }

  static contextType = AuthDataContext;

  componentDidMount() {
    const domain = process.env.REACT_APP_BASE_URL;
    const ignoreDomains = process.env.REACT_APP_IGNORE_DOMAIN.split(',');
    const currentHostname = window.location.hostname;
    const subdomain = window.location.hostname.split('.');
    if (
      currentHostname === domain ||
      ignoreDomains.indexOf(currentHostname) !== -1
    ) {
      this.setState({ hasSubdomain: false, domain, checkingSubdomain: false });
    } else {
      this.setState({
        subdomain: subdomain[0],
        hasSubdomain: true,
        domain,
        checkingSubdomain: true,
      });
    }

    const foreLogout = new URLSearchParams(this.props.location.search).get(
      'foreLogout'
    );
    if (foreLogout) {
      this.context.resetData();
    }
  }

  componentDidUpdate() {
    if (!this.props.isBusy && this.state.checkingSubdomain) {
      this.setState({ checkingSubdomain: false });
    }
  }

  checkDomain = (values) => {
    this.setState({ ...values });
    this.props.authCheckDomainStatus({ ...values, isBusy: true });
  };

  login = (values) => {
    this.setState({ isBusy: true }, () => {
      this.props.login({
        ...values,
        subdomain: this.state.subdomain,
        isBusy: true,
      });
    });
  };
  // Fix The scrollbar appear when slide animation running
  // onExited = () => {
  //   if (this.layoutRef.current) {
  //     this.layoutRef.current.updateScroll();
  //   }
  // }

  checkRole = (rolesNeeded = []) => {
    const {
      currentUser: { roles },
    } = this.props;
    if (roles) {
      for (let i = 0; i < rolesNeeded.length; i++) {
        const isIncludes = filter(
          roles,
          (item) => item.roleName === rolesNeeded[i]
        );
        if (!isEmpty(isIncludes)) {
          return true;
        }
      }
      return false;
    }
    return false;
  };

  // checkRouteMyTasks = () => {
  //   const studentId = this.context.currentUser?.students?.[0]?.id;
  //   if (studentId) {
  //     return ROUTE_MY_COURSES.MY_COURSES_GUARDIAN(studentId);
  //   }
  //   return ROUTE_MY_COURSES.MY_COURSES_GUARDIAN_NO_STUDENT();
  // }
  checkRouteMyTasks = () => {
    const studentId = this.context.currentUser?.students?.[0]?.id;
    if (studentId) {
      return ROUTE_TASKS.GUARDIAN_VIEW_MY_TASKS(studentId);
    }
    return ROUTE_TASKS.GUARDIAN_VIEW_MY_TASKS_NO_STUDENT();
  };

  render() {
    const { t, subDomainStatus, isBusy, error, location, isNewSession } =
      this.props;
    const { domain, hasSubdomain, subdomain, checkingSubdomain } = this.state;
    const accessToken = localStorage.getItem('access_token');
    let fullUrl = '';
    if (
      domain &&
      subdomain &&
      domain.indexOf(subdomain) === -1 &&
      subDomainStatus
    ) {
      fullUrl = `${window.location.protocol}//${subdomain}.${domain}:${window.location.port}`;
    }

    const fromPreDomain = `?${objectToParams({
      access_token: accessToken,
      new_session: isNewSession || 'false',
    })}`;
    // console.log(this.checkRole(['User Manager']), 'this.checkRole');
    // console.log('this.checkRole');

    // Copy from old source - Not sure about logic
    if (accessToken && !isEmpty(this.context.currentUser)) {
      // if (fullUrl) {
      if (fullUrl) {
        if (this.checkRole([TEACHER])) {
          fullUrl += ROUTE_MY_COURSES.DEFAULT + fromPreDomain;
        }
        if (this.checkRole([STUDENT])) {
          fullUrl += ROUTE_TASKS.DEFAULT + fromPreDomain;
        } else if (this.checkRole([GUARDIAN])) {
          fullUrl += this.checkRouteMyTasks() + fromPreDomain;
        } else if (this.checkRole([COURSE_MANAGER])) {
          fullUrl += ROUTE_ALL_COURSES.DEFAULT + fromPreDomain;
        } else if (this.checkRole([USER_MANAGER])) {
          fullUrl += ROUTE_USERS.DEFAULT + fromPreDomain;
        } else if (this.checkRole([SCHOOL_MANAGER])) {
          fullUrl += ROUTE_SCHOOL_YEAR.DEFAULT + fromPreDomain;
        } else if (this.checkRole([DOMAIN_OWNER])) {
          fullUrl += ROUTE_DOMAIN_SETTINGS.DEFAULT + fromPreDomain;
        } else {
          fullUrl += ROUTE_ALL_COURSES.DEFAULT + fromPreDomain;
        }
        removeToken();
        // https://stackoverflow.com/questions/4505798/difference-between-window-location-assign-and-window-location-replace
        window.location.replace(fullUrl);
        // window.location = fullUrl;
        return null;
      }
      if (this.checkRole([STUDENT, TEACHER])) {
        // return <Redirect to={{ pathname: ROUTE_MY_COURSES.DEFAULT }} />;
        return <Redirect to={{ pathname: ROUTE_MY_COURSES.DEFAULT }} />;
      }
      if (this.checkRole([GUARDIAN])) {
        return <Redirect to={{ pathname: this.checkRouteMyTasks() }} />;
        // return <Redirect to={{ pathname: this.checkRouteMyTasks() + fromPreDomain }} />;
      }
      // if(this.checkRole([TEACHER, STUDENT])) {
      //   return <Redirect to={{ pathname: '/my-courses' }} />;
      // }

      // else {
      //   fullUrl += ROUTE_ALL_COURSES.DEFAULT + fromPreDomain;
      // }
      // localStorage.removeItem('access_token');
      // https://stackoverflow.com/questions/4505798/difference-between-window-location-assign-and-window-location-replace
      // window.location.replace(fullUrl);
      // window.location = fullUrl;
      // return null;
      // }
      if (location && location.state && location.state.from) {
        return <Redirect to={{ pathname: location.state.from.pathname }} />;
      }

      // if(this.checkRole([GUARDIAN])) {
      //   return <Redirect to={{ pathname: ROUTE_MY_COURSES.MY_COURSES_GUARDIAN(this.context.currentUser?.students?.[0]?.id) }} />;
      // }
      // if(this.checkRole([STUDENT, TEACHER])) {
      //   return <Redirect to={{ pathname: ROUTE_MY_COURSES.DEFAULT}} />;
      // }
      return <Redirect to={{ pathname: ROUTE_ALL_COURSES.DEFAULT }} />;
    }

    // Show loader instead of login form
    if ((this.context.fetching || checkingSubdomain) && isBusy) {
      // return <CircularProgress color='primary' />;
      return (
        <Layout t={t}>
          <Skeleton animation='wave' variant='text' height={40} />
          <Skeleton animation='wave' variant='text' height={40} />
          <Skeleton animation='wave' variant='text' height={40} />
        </Layout>
      );
    }

    return (
      <Layout>
        {!hasSubdomain && !subDomainStatus && (
          <SubDomainFrom
            t={t}
            domain={domain}
            onSubmit={this.checkDomain}
            subDomainStatus={subDomainStatus}
            isBusy={isBusy}
            subdomain={subdomain}
          />
        )}
        {/* Implement later case user input invalid domain in the url */}
        {hasSubdomain && !subDomainStatus && !isBusy && (
          <div className='suspended-wrapper'>
            <Alert severity='error'>{t('invalid_domain')}</Alert>
          </div>
        )}
        {!!subDomainStatus && (
          <Slide in={!!subDomainStatus} direction='up'>
            <Box>
              <Fade in={!!subDomainStatus} timeout={1000}>
                <Box className='box-fade'>
                  <LoginForm
                    t={t}
                    domain={domain}
                    onSubmit={this.login}
                    isBusy={isBusy}
                    error={error}
                  />
                </Box>
              </Fade>
            </Box>
          </Slide>
        )}
      </Layout>
    );
  }
}
Login.propTypes = {
  t: PropTypes.func,
  history: PropTypes.object,
  currentUser: PropTypes.object,
  error: PropTypes.object,
  location: PropTypes.object,
  authCheckDomainStatus: PropTypes.func,
  fetchUser: PropTypes.func,
  login: PropTypes.func,
  subDomainStatus: PropTypes.number,
  isBusy: PropTypes.bool,
  isNewSession: PropTypes.bool,
};
const mapStateToProps = (state) => ({
  error: state.Auth.error,
  isBusy: state.Auth.isBusy,
  isNewSession: state.Auth.isNewSession,
  // token: state.AuthReducer.token,
  gettingUser: state.Auth.gettingUser,
  currentUser: state.Auth.currentUser,
  subDomainStatus: state.Auth.subDomainStatus,
});

const mapDispatchToProps = (dispatch) => ({
  authCheckDomainStatus: (payload) =>
    dispatch(authActions.authCheckDomainStatus(payload)),
  login: (payload) => dispatch(authActions.authLogin(payload)),
});

export default withTranslation(['auth', 'common'])(
  connect(mapStateToProps, mapDispatchToProps)(Login)
);
