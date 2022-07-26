import React from 'react';
import { connect } from 'react-redux';

import Preloader from 'components/TblPreloader';

import { AuthDataContext } from 'AppRoute/AuthProvider';
import PropTypes from 'prop-types';
import { removeSchoolYear } from 'utils';

import authActions from '../actions';

// import Suspended from './Suspended';

class DomainStatus extends React.PureComponent {
  static contextType = AuthDataContext;
  
  constructor(props) {
    super(props);

    this.state = {
      already: false,
    };
    // console.log(window.location.search);
    // console.log(searchParams.entries());
  }

  componentDidMount() {
    const domain = process.env.REACT_APP_BASE_URL;
    const subdomain = window.location.hostname.split('.');
    const searchParams = new URLSearchParams(window.location.search);
    const ignoreDomains = process.env.REACT_APP_IGNORE_DOMAIN?.split(',');
    const currentHostname = window.location.hostname;
    // console.log(searchParams.entries());
    // Handle Single Sign On
    if (searchParams.get('new_session') === 'true') {
      removeSchoolYear();
    }
    if (searchParams.has('access_token')) {
      localStorage.setItem('access_token', searchParams.get('access_token'));
      this.context.setData({ token: searchParams.get('access_token') });
      window.history.pushState('', '', window.location.pathname);
      this.setState({ already: true });
    } else {
      this.setState({ already: true });
    }
    // Check subdomain information
    // If not has let set to context
    if (
      domain !== window.location.hostname &&
      subdomain.length >= 2 &&
      this.context.subdomain !== subdomain[0] &&
      ignoreDomains.indexOf(currentHostname) === -1
    ) {
      this.context.setData({ subdomain: subdomain[0], fetchingDomain: true });
      this.props.authCheckDomainStatus({
        isBusy: true,
        subdomain: subdomain[0],
      });

    }
  }

  componentDidUpdate(prevProps) {
    
    const { subDomainStatus } = this.props;
    if (
      subDomainStatus !== this.context.domainStatus &&
      subDomainStatus !== prevProps.subDomainStatus
    ) {
      // Set timeout to force function setData working
      // https://stackoverflow.com/questions/779379/why-is-settimeoutfn-0-sometimes-useful
      this.context.setData({
        domainStatus: subDomainStatus,
        fetchingDomain: false,
      });
      if (!this.state.already) {
        this.setState({ already: true });
      } else {
        this.forceUpdate();
      }
    }
    if(this.context.currentUser){
      this.props.getSchoolGradeLevel({organizationId: this.context.currentUser.organizationId});
    }
  }
  render() {
    // console.log('Domain status');
    // console.log(this.context.fetchingDomain, this.context.fetchingUser, this.context.currentUser, this.state.already);
    if (
      this.context.fetchingDomain ||
      this.context.fetchingUser ||
      !this.state.already
    ) {
      return <Preloader />;
      // return <Grid container alignContent='center' alignItems='center' style={{height: '100vh', justifyContent: 'center'}}>
      //           <Skeleton animation='wave' width='90%' height='40px' variant='text' />
      //           <Skeleton width='45%' height='50%' variant='rect' />
      //           <Skeleton width='45%' height='50%' variant='rect' />
      //           <Skeleton animation='wave' width='90%' height='20px' variant='text' />
      //           <Skeleton animation='wave' width='90%' height='20px' variant='text' />
      //           <Skeleton animation='wave' width='90%' height='20px' variant='text' />
      //         </Grid>;
    }
    return this.props.children;
  }
}

DomainStatus.propTypes = {
  t: PropTypes.func,
  children: PropTypes.node,
  subDomainStatus: PropTypes.number,
  errorCode: PropTypes.number,
  location: PropTypes.object,
  authCheckDomainStatus: PropTypes.func,
  setState: PropTypes.func,
  isBusy: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  subDomainStatus: state.Auth.subDomainStatus,
  errorCode: state.Auth.errorCode,
  isBusy: state.Auth.isBusy,
});

const mapDispatchToProps = (dispatch) => ({
  authCheckDomainStatus: (payload) =>
    dispatch(authActions.authCheckDomainStatus(payload)),
  setState: (payload) => dispatch(authActions.authSetState(payload)),
  getSchoolGradeLevel: (payload) => dispatch(authActions.getSchoolGradeLevel(payload))

});

export default connect(mapStateToProps, mapDispatchToProps)(DomainStatus);
