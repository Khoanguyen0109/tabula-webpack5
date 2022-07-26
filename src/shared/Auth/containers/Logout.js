import React from 'react';
import { connect } from 'react-redux';

import { AuthDataContext } from 'AppRoute/AuthProvider';
import PropTypes from 'prop-types';

import authAction from '../actions';
import { ROUTE_AUTH } from '../constantsRoute';

class Logout extends React.PureComponent {
  static contextType = AuthDataContext;
  state = {
    isBusy: true
  }
  
  componentDidMount() {
    this.props.logout({isBusy: true, currentUser: {}});
    this.context.resetData();
    // this.props.history.push(ROUTE_AUTH.LOGIN);
    //Safe way to cleanup system
    window.location = ROUTE_AUTH.LOGIN;
  }

  componentDidUpdate(prevProps) {
    // console.log('Logout update');
    if (prevProps.isBusy && !this.props.isBusy) {
      this.context.resetData();
      // this.props.history.push(ROUTE_AUTH.LOGIN);
      window.location = ROUTE_AUTH.LOGIN;
    }
  }

  render() {
    return null;
  }
}
Logout.propTypes = {
  logout: PropTypes.func,
  history: PropTypes.object,
  isBusy: PropTypes.bool
};
const mapStateToProps = (state) => ({
  isBusy: state.Auth.isBusy
});
const mapDispatchToProps = (dispatch) => ({
  logout: (payload) => dispatch(authAction.authLogout(payload))
});
export default connect(mapStateToProps, mapDispatchToProps)(Logout);