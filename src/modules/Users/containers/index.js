import React from 'react';
import { withTranslation } from 'react-i18next';
import { Trans } from 'react-i18next';
import { connect } from 'react-redux';

import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';
import trim from 'lodash/trim';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import { BreadcrumbContext } from 'components/TblBreadcrumb';
import BreadcrumbTitle from 'components/TblBreadcrumb/BreadcrumbTitle';
import TblButton from 'components/TblButton';
import TblConfirmDialog from 'components/TblConfirmDialog';
import TblInputs from 'components/TblInputs';

import loadable from '@loadable/component';
import { Layout1 } from 'layout';
import { cloneDeep } from 'lodash-es';
import { withSnackbar } from 'notistack';
import PropTypes from 'prop-types';

import userActions from '../actions';
import { ROUTE_USERS } from '../constantsRoute';

const UserList = loadable(() => import('../components/UserList'));
const ManagerUser = loadable(() => import('../components/ManageUser'));

class Users extends React.PureComponent {
  // static whyDidYouRender = true;
  static contextType = BreadcrumbContext;
  constructor(props, context) {
    super(props, context);
    this.state = {
      openDialog: false,
      selectedUser: {},
      confirmMessage: '',
      askConfirm: false,
      status: '',
      // usersAlready: false,
      // rolesAlready: false,
      params: {
        page: 1,
        limit: 50,
        sort: 'asc',
        sortField: 'firstName',
      },
    };
  }

  componentDidMount() {
    this.fetchUsers();
    this.props.getRoles();
    const { setData } = this.context;
    setData({
      showBoxShadow: false,
      path: ROUTE_USERS.DEFAULT,
      bodyContent: this.renderBreadcrumbBody(),
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const { t, error } = this.props;
    const { selectedUser, status } = this.state;
    if (
      prevProps.invitingUser ||
      prevProps.editingUser ||
      prevProps.deletingPendingUser
    ) {
      if (isEmpty(error)) {
        this.setState({ openDialog: false, askConfirm: false });
        if (!selectedUser.id) {
          this.props.enqueueSnackbar(
            status === 'DELETE'
              ? t('common:deleted')
              : t('invitation_sent', { email: selectedUser.email }),
            { variant: 'success' }
          );
          this.setState({ status: '' });
        } else {
          this.props.enqueueSnackbar(t('common:change_saved'), {
            variant: 'success',
          });
        }
      } else {
        //when inviting an existing active email not toast => inline instead (fix bug 2530)
        this.props.setUserState({ error: {} });
        if (error?.subcode !== 409 && error?.subcode !== 3)
          this.props.enqueueSnackbar(error.message, { variant: 'error' });
      }
    }
    if (prevState.params.search !== this.state.params.search) {
      const { setData, breadcrumb } = this.context;
      setData({
        ...breadcrumb,
        bodyContent: this.renderBreadcrumbBody(),
      });
    }
    // if (isEmpty(prevProps.roles) && this.props.roles?.length) {
    //   this.setState({rolesAlready: true});
    // }
    // if (isEmpty(prevProps.users) && this.props.users?.length) {
    //   this.setState({userAlready: true});
    // }
  }

  componentWillUnmount() {
    this.props.setUserState({ users: [], roles: [] });
  }

  renderBreadcrumbBody = () => {
    const { t } = this.props;
    return (
      <Grid spacing={0} container>
        <Grid item xs={5} sm={5}>
          <BreadcrumbTitle title={t('users')} />
        </Grid>
        <Grid
          item
          xs={2}
          sm={2}
          sx={{
            '& .TblInput': {
              marginBottom: `${0 }!important`,
            },
          }}
        >
          <TblInputs
            value={this.state.params.search}
            inputSize='medium'
            placeholder={t('common:enter_name')}
            onChange={(e) => {
              e.persist();
              this.onSearch(e);
            }}
            hasSearchIcon={true}
            hasClearIcon={true}
          />
        </Grid>
      </Grid>
    );
  };

  onSearch = (e) => {
    const cloneState = cloneDeep(this.state);
    const { params } = cloneState;
    params.page = 1; // fix bug 2611
    params.search = e.target.value;
    this.setState({ params }, () => {
      this.fetchUsers();
    });
  };

  fetchUsers = () => {
    const { params } = this.state;
    const { currentUser } = this.props;
    this.props.fetchUsers({
      orgId: currentUser.organizationId,
      params,
      fetchingUser: true,
      users: [],
    });
  };

  changUserPage = (e, page, limit) => {
    const { params } = this.state;
    params.page = page + 1;
    if (limit) {
      params.limit = limit;
      //NOTE: Fix bug TL-2877
      params.page = 1;
    }
    this.setState({ params }, () => {
      this.fetchUsers();
    });
  };

  handleManageUserSubmit = (values) => {
    const user = Object.assign(values, { email: trim(values.email) });
    // user.roleName = values.roles;
    user.roleName = user.roles.map((role) => role.roleName);
    const { id, firstName, lastName, email, roleName } = user;
    // delete user.roles;
    // user.email = user.email.toLowerCase();
    const payload = { id, firstName, lastName, email, roleName };
    const { currentUser } = this.props;
    this.setState({ selectedUser: user });
    if (!user.id) {
      this.props.inviteUser({
        user: { ...payload },
        orgId: currentUser.organizationId,
        invitingUser: true,
        error: {},
      });
    } else {
      this.props.editUser({
        user: { ...payload },
        orgId: currentUser.organizationId,
        editingUser: true,
        error: {},
      });
    }
  };

  editUser = (user) => {
    this.setState({ selectedUser: user, openDialog: true });
  };

  deletePendingUser = () => {
    const { currentUser } = this.props;
    const {
      selectedUser: { id },
    } = this.state;
    this.props.deletePendingUser({
      userId: id,
      orgId: currentUser.organizationId,
      deletingPendingUser: true,
      error: {},
    });
  };

  changeUserStatus = (user, status, message) => {
    this.setState({
      selectedUser: user,
      askConfirm: true,
      status,
      confirmMessage: message,
    });
  };

  handleOtherAction = (user, name) => {
    this.setState({ selectedUser: user }, () => {
      const { [name]: func } = this.props;
      func({
        editingUser: true,
        orgId: user.organizationId,
        id: user.id,
        error: {},
      });
    });
  };

  userActions = (user, action) => {
    const { t } = this.props;
    switch (action) {
      case 'edit':
        this.editUser(user);
        break;
      case 'delete_pending_user':
        this.changeUserStatus(
          user,
          'DELETE',
          <Trans
            i18nKey='dialog:delete_object'
            values={{ name: `${user.firstName} ${user.lastName}` }}
            components={[<strong />]}
           />
        );
        break;
      case 'suspend':
        this.changeUserStatus(user, 'SUSPEND', t('suspend_confirm'));
        break;
      case 'restore':
        this.setState({ selectedUser: user, status: 'ACTIVE' }, () => {
          this.handleChangeStatus();
        });
        break;
      case 'reset':
        this.handleOtherAction(user, 'forceResetPassword');
        break;
      case 'resend':
        this.handleOtherAction(user, 'resendResetPassword');
        break;
      case 'resend_invitation':
        this.handleOtherAction(user, 'resendInvitation');
        break;
      case 'resend_confirmation':
        this.handleOtherAction(user, 'resendConfirmationEmail');
        break;
      default:
        break;
    }
  };

  handleChangeStatus = () => {
    const { status, selectedUser } = this.state;
    const { updateUserStatus } = this.props;
    updateUserStatus({
      editingUser: true,
      userId: selectedUser.id,
      organizationId: selectedUser.organizationId,
      requestParams: { status },
      error: {},
    });
  };

  cancelConfirm = () => {
    this.setState({ askConfirm: false, status: '' });
  };

  onCancel = () => {
    this.setState({ openDialog: false });
  };

  inviteUser = () => {
    this.setState({ openDialog: true, selectedUser: {} });
  };

  onSort = (sortField = 'firstName') => {
    const {
      params,
      params: { sort },
    } = this.state;
    this.setState(
      Object.assign(params, {
        sort: sort === 'asc' ? 'desc' : 'asc',
        sortField,
      }),
      () => this.fetchUsers()
    );
  };

  render() {
    const {
      t,
      users,
      totalUser,
      fetchingUser,
      editingUser,
      invitingUser,
      roles,
      getRoles,
      error,
    } = this.props;
    const {
      openDialog,
      selectedUser,
      askConfirm,
      status,
      params,
      confirmMessage,
    } = this.state;
    // if (!usersAlready && !rolesAlready) {
    //   return <Box component='div' m={4}>
    //             <Skeleton variant='rect' height='50px' animation='wave'/>
    //             <Skeleton variant='text' animation='wave'/>
    //             <Skeleton variant='text' animation='wave'/>
    //             <Skeleton variant='text' animation='wave'/>
    //             <Skeleton variant='text' animation='wave'/>
    //   </Box>;
    // }
    return (
      <Layout1>
        <TblConfirmDialog
          message={confirmMessage}
          progressing={editingUser}
          okText={status === 'SUSPEND' ? t('suspend') : t('common:delete')}
          open={askConfirm}
          onCancel={this.cancelConfirm}
          onConfirmed={
            status === 'DELETE'
              ? this.deletePendingUser
              : this.handleChangeStatus
          }
        />
        <ManagerUser
          t={t}
          open={openDialog}
          isSubmitting={invitingUser || editingUser}
          roles={roles}
          user={selectedUser}
          onCancel={this.onCancel}
          onSubmit={this.handleManageUserSubmit}
          getUserRolesList={getRoles}
          error={error}
        />
        <Box marginBottom={2}>
          <TblButton
            color='primary'
            variant='contained'
            onClick={this.inviteUser}
          >
            {t('new')}
          </TblButton>
        </Box>
        <UserList
          rowActions={this.userActions}
          users={users}
          t={t}
          params={params}
          total={totalUser}
          onChangePage={this.changUserPage}
          fetchingUser={fetchingUser}
          onSort={this.onSort}
        />
      </Layout1>
    );
  }
}

Users.propTypes = {
  history: PropTypes.object,
  users: PropTypes.array,
  totalUser: PropTypes.number,
  currentUser: PropTypes.object,
  error: PropTypes.object,
  fetchingUser: PropTypes.bool,
  editingUser: PropTypes.bool,
  deletingPendingUser: PropTypes.bool,
  invitingUser: PropTypes.bool,
  fetchUsers: PropTypes.func,
  setUserState: PropTypes.func,
  t: PropTypes.func,
  roles: PropTypes.array,
  getRoles: PropTypes.func,
  editUser: PropTypes.func,
  inviteUser: PropTypes.func,
  updateUserStatus: PropTypes.func,
  forceResetPassword: PropTypes.func,
  enqueueSnackbar: PropTypes.func,
  resendResetPassword: PropTypes.func,
  resendConfirmEmail: PropTypes.func,
  deletePendingUser: PropTypes.func,
};
const mapStateToProps = (state) => ({
  users: state.Users.users,
  totalUser: state.Users.totalUser,
  fetchingUser: state.Users.fetchingUser,
  editingUser: state.Users.editingUser,
  deletingPendingUser: state.Users.deletingPendingUser,
  error: state.Users.error,
  invitingUser: state.Users.invitingUser,
  currentUser: state.Auth.currentUser,
  roles: state.Users.roles,
});
const mapDispatchToProps = (dispatch) => ({
  setUserState: (payload) => dispatch(userActions.userSetState(payload)),
  fetchUsers: (payload) => dispatch(userActions.fetchUsers(payload)),
  getRoles: (payload) => dispatch(userActions.fetchUserRoles(payload)),
  editUser: (payload) => dispatch(userActions.editUser(payload)),
  deletePendingUser: (payload) =>
    dispatch(userActions.deletePendingUser(payload)),
  inviteUser: (payload) => dispatch(userActions.inviteUser(payload)),
  updateUserStatus: (payload) =>
    dispatch(userActions.updateDomainUserStatus(payload)),
  forceResetPassword: (payload) =>
    dispatch(userActions.forceResetPassword(payload)),
  resendInvitation: (payload) =>
    dispatch(userActions.resendInvitation(payload)),
  resendResetPassword: (payload) =>
    dispatch(userActions.resendResetPassword(payload)),
  resendConfirmEmail: (payload) =>
    dispatch(userActions.resendConfirmEmail(payload)),
});
// const UsersTranslated = withTranslation(['user', 'common'])(Users);
// export default connect(mapStateToProps, mapDispatchToProps)(withSnackbar(UsersTranslated));
export default flowRight(
  withSnackbar,
  withTranslation(['user', 'common']),
  connect(mapStateToProps, mapDispatchToProps)
)(Users);
