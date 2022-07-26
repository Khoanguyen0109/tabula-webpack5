import React from 'react';
import { withTranslation } from 'react-i18next';
import { Trans } from 'react-i18next';
import { connect } from 'react-redux';

import isEmpty from 'lodash/isEmpty';
import trim from 'lodash/trim';

import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { BreadcrumbContext } from 'components/TblBreadcrumb';
import BreadcrumbTitle from 'components/TblBreadcrumb/BreadcrumbTitle';
import TblButton from 'components/TblButton';
import TblConfirmDialog from 'components/TblConfirmDialog';
import TblInputs from 'components/TblInputs';
import TblTabs from 'components/TblTabs';
import ImportButton from 'shared/Import/components/ImportButton';
import ImportDialog from 'shared/Import/components/ImportDialog';

import importActions from 'shared/Import/actions';
import { IMPORT_STATUS } from 'shared/Import/utils';

import loadable from '@loadable/component';
import { Layout1 } from 'layout';
import { cloneDeep } from 'lodash-es';
import { withSnackbar } from 'notistack';
import PropTypes from 'prop-types';

import userActions from '../actions';
const UserList = loadable(() => import('../components/UserList'));
const ManagerUser = loadable(() => import('../components/ManageUser'));

const TabNameEnum = {
  STUDENTS: {
    key: 0,
    name: 'student',
  },
  GUARDIANS: {
    key: 1,
    name: 'guardian',
  },
};

class Users extends React.PureComponent {
  // static whyDidYouRender = true;
  static contextType = BreadcrumbContext;
  constructor(props, context) {
    super(props, context);
    this.state = {
      openDialog: false,
      selectedUser: {},
      userType: 'students',
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
      activeTab: 0,
      openImport: false,
    };
  }

  static getDerivedStateFromProps(props, state) {
    let newState = {};
    const searchParams = new URLSearchParams(props.location.search);
    const newActiveTab = searchParams.get('active') === 'guardians' ? 1 : 0;
    const newUserType =
      searchParams.get('active') === 'guardians' ? 'guardians' : 'students';
    if (newActiveTab !== state.activeTab) {
      Object.assign(newState, { activeTab: newActiveTab });
    }
    if (newUserType !== state.userType) {
      Object.assign(newState, { userType: newUserType });

      const { params } = state;
      const { currentUser } = props;
      if (newUserType === 'students') {
        props.getStudent({
          orgId: currentUser.organizationId,
          params,
          fetchingUser: true,
          users: [],
        });
      } else {
        props.getGuardian({
          orgId: currentUser.organizationId,
          params,
          fetchingUser: true,
          users: [],
        });
      }
    }
    return !isEmpty(newState) ? newState : null;
  }

  componentDidMount() {
    this.fetchUsers();
    const { setData } = this.context;
    const { activeTab } = this.state;
    setData({
      showBoxShadow: true,
      bodyContent: this.renderBreadcrumbBody(),
      footerContent: (
        <TblTabs
          tabs={this.renderTabs()}
          selectedTab={activeTab}
          onChange={this.onChangeTab}
        />
      ),
    });
  }

  renderTabs = () => {
    const { t } = this.props;
    return Object.keys(TabNameEnum).map((k) => {
      const { name } = TabNameEnum[k];
      return {
        name: t(name, { count: 2 }),
        label: t(name, { count: 2 }),
      };
    });
  };

  onChangeTab = (e, value) => {
    this.setState({ activeTab: value });
    const activeKey = Object.keys(TabNameEnum).filter((k) => {
      const { key } = TabNameEnum[k];
      if (key === value) {
        return true;
      }
      return false;
    });
    // this.onSort();
    this.setState(
      {
        params: {
          page: 1,
          limit: 50,
          sort: 'asc',
          sortField: 'firstName',
        },
      },
      () => this.fetchUsers()
    );
    if (activeKey.length) {
      this.props.history.push({
        pathname: this.props.location.pathname,
        search: `?active=${TabNameEnum[activeKey[0]].name}s`,
      });
      const { setData } = this.context;
      const { activeTab } = this.state;
      // NOTE: Fix bug TL-3072
      if (this.searchInput?.value !== '') {
        //Fix bug TL-3430
        const { params } = this.state;
        delete params.search;
        this.setState(params);
        this.searchInput.value = '';
      }
      setData({
        showBoxShadow: true,
        bodyContent: this.renderBreadcrumbBody(),
        footerContent: (
          <TblTabs
            tabs={this.renderTabs()}
            selectedTab={activeTab}
            onChange={this.onChangeTab}
          />
        ),
      });
    }
  };

  componentDidUpdate(prevProps, prevState) {
    const { t, error, isInviteUserSuccess, isEditUserSuccess, importStatus } =
      this.props;
    const { selectedUser, status } = this.state;
    if (
      prevProps.isInvitingUser ||
      prevProps.isEditingUser ||
      prevProps.deletingPendingGsUser
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
          this.setState({ status: '' });
        }
      } else {
        if (error.subcode !== 409) {
          this.props.enqueueSnackbar(error.message, { variant: 'error' });
        }
      }
    }
    if (
      isInviteUserSuccess ||
      isEditUserSuccess ||
      prevProps.deletingPendingGsUser ||
      (prevProps.importStatus !== importStatus &&
        importStatus === IMPORT_STATUS.DONE)
    ) {
      this.fetchUsers(false, false);
      const newState = isInviteUserSuccess
        ? { isInviteUserSuccess: false }
        : { isEditUserSuccess: false };
      this.props.setUserState(newState);
    }

    if (
      prevState.params.search !== this.state.params.search ||
      prevProps.importStatus !== this.props.importStatus
    ) {
      const { setData, breadcrumb } = this.context;
      setData({
        ...breadcrumb,
        bodyContent: this.renderBreadcrumbBody(),
      });
    }
  }

  componentWillUnmount() {
    this.props.setUserState({ users: [] });
  }

  renderBreadcrumbBody = () => {
    // eslint-disable-next-line no-unused-vars
    const { t } = this.props;
    return (
      <Grid spacing={0} container>
        <Grid item xs={5} sm={5}>
          <BreadcrumbTitle title={t('students_guardians')} />
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
            inputProps={{ ref: (input) => (this.searchInput = input) }}
            // inputSize='medium'
            placeholder={t('common:enter_name')}
            onChange={(e) => {
              e.persist();
              this.onSearch(e);
            }}
            hasSearchIcon={true}
            hasClearIcon={true}
          />
        </Grid>
        <Grid
          item
          xs={5}
          sm={5}
          display='flex'
          alignItems='center'
          justifyContent='flex-end'
        >
          <ImportButton onClick={() => this.setState({ openImport: true })} />
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

  fetchUsers = (fetchingUser = true, isResetUserList = true) => {
    const { params, userType } = this.state;
    const {
      currentUser: { organizationId },
    } = this.props;
    const payload = { orgId: organizationId, params, fetchingUser, users: [] };
    if (!isResetUserList) {
      delete payload.users;
    }
    if (userType === 'students') {
      this.props.getStudent(payload);
    } else {
      this.props.getGuardian(payload);
    }
  };

  getGuardianList = (value) => {
    const { currentUser } = this.props;
    this.props.getGuardianListForCreatingStudent({
      orgId: currentUser.organizationId,
      params: {
        search: value,
        all: true,
      },
    });
  };

  changUserPage = (e, page, limit) => {
    const { params } = this.state;
    params.page = page + 1;
    if (limit) {
      params.limit = limit;
      //NOTE: Reset page when change limit
      params.page = 1;
    }
    this.setState({ params }, () => {
      this.fetchUsers();
    });
  };

  handleManageUserSubmit = (values) => {
    const user = Object.assign(values, { email: trim(values.email) });
    const {
      currentUser: { organizationId },
    } = this.props;
    const { userType } = this.state;
    this.setState({ selectedUser: user });
    if (userType === 'students') {
      if (!user.id) {
        this.props.inviteStudent({
          user,
          orgId: organizationId,
          isInvitingUser: true,
          error: {},
        });
      } else {
        const newUser = {
          firstName: user?.firstName,
          lastName: user?.lastName,
          email: user?.email,
          guardians: user?.guardians,
        };
        this.props.editStudent({
          user: newUser,
          orgId: organizationId,
          studentId: user.id,
          isEditingUser: true,
          error: {},
        });
      }
    } else {
      if (!user.id) {
        this.props.inviteGuardian({
          user,
          orgId: organizationId,
          isInvitingUser: true,
          error: {},
        });
      } else {
        const newUser = {
          firstName: user?.firstName,
          lastName: user?.lastName,
          email: user?.email,
        };
        this.props.editGuardian({
          user: newUser,
          orgId: organizationId,
          guardianId: user.id,
          isEditingUser: true,
          error: {},
        });
      }
    }
  };

  editUser = (user) => {
    this.setState({ selectedUser: user, openDialog: true });
  };

  deletePendingGsUser = () => {
    const { currentUser } = this.props;
    const {
      selectedUser: { id },
    } = this.state;
    this.props.deletePendingGsUser({
      userId: id,
      orgId: currentUser.organizationId,
      deletingPendingGsUser: true,
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
        isEditingUser: true,
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
      default:
        break;
    }
  };

  handleChangeStatus = () => {
    const { status, selectedUser } = this.state;
    const { updateUserStatus } = this.props;
    updateUserStatus({
      isEditingUser: true,
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
    this.setState({ openDialog: false }, () => {
      if (!isEmpty(this.props.error)) {
        this.props.setUserState({ error: {} });
      }
    });
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
  onCloseImport = () => {
    this.setState({ openImport: false });
  };

  getImportQueue = () => {
    const { currentUser } = this.props;
    this.props.getImportQueueStudentAndGuardian({
      orgId: currentUser.organizationId,
    });
  };

  onImportStudentAndGuardian = (file) => {
    const { currentUser } = this.props;
    const formData = new FormData();
    formData.append('file', file);
    this.props.importStudentAndGuardian({
      orgId: currentUser.organizationId,
      data: formData,
    });
  };

  render() {
    const {
      t,
      users,
      totalUser,
      fetchingUser,
      isEditingUser,
      isInvitingUser,
      guardians,
      error,
      currentUser: { organizationId },
      importStatus,
    } = this.props;
    const {
      activeTab,
      openDialog,
      selectedUser,
      askConfirm,
      status,
      params,
      userType,
      confirmMessage,
      openImport,
    } = this.state;
    const importUrl = `${process.env.REACT_APP_API_URL}/organization/${organizationId}/import-students`;
    const importTemplate = `${process.env.REACT_APP_API_MEDIA}/excel/Tabula_Students%26Guardians_Template.xlsx`;
    return (
      <Layout1>
        {/* <TblConfirmDialog message={t('suspend_confirm')} progressing={isEditingUser} okText={status === 'SUSPEND' ? t('suspend') : t('restore')} open={askConfirm} onCancel={this.cancelConfirm} onConfirmed={this.handleChangeStatus} /> */}
        <TblConfirmDialog
          message={confirmMessage}
          progressing={isEditingUser}
          okText={status === 'SUSPEND' ? t('suspend') : t('common:delete')}
          open={askConfirm}
          onCancel={this.cancelConfirm}
          onConfirmed={
            status === 'DELETE'
              ? this.deletePendingGsUser
              : this.handleChangeStatus
          }
        />
        {openDialog && (
          <ManagerUser
            t={t}
            open={openDialog}
            isSubmitting={isInvitingUser || isEditingUser}
            user={selectedUser}
            onCancel={this.onCancel}
            onSubmit={this.handleManageUserSubmit}
            userType={userType}
            getGuardianList={this.getGuardianList}
            guardians={guardians}
            error={error}
          />
        )}
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
          activeTab={activeTab}
          rowActions={this.userActions}
          users={users}
          t={t}
          total={totalUser}
          onChangePage={this.changUserPage}
          fetchingUser={fetchingUser}
          params={params}
          onSort={this.onSort}
          userType={userType}
          inviteUser={this.inviteUser}
        />
        <ImportDialog
          open={openImport}
          onClose={this.onCloseImport}
          getImportQueue={this.getImportQueue}
          importUrl={importUrl}
          importTemplate={importTemplate}
          onImport={this.onImportStudentAndGuardian}
        />
        {importStatus === IMPORT_STATUS.PROCESSING && !openImport && (
          <Box sx={{ position: 'absolute', bottom: 100, right: 45 }}>
            <TblButton
              variant='outlined'
              color='primary'
              onClick={() =>
                this.setState({
                  openImport: true,
                })
              }
            >
              <OpenInFullIcon sx={{ fontSize: 12, marginRight: 1 }} />
              <Typography variant='bodyMedium'>
                {' '}
                {t('common:view_progress')}
              </Typography>
            </TblButton>
          </Box>
        )}
      </Layout1>
    );
  }
}

Users.propTypes = {
  currentUser: PropTypes.object,
  deletePendingGsUser: PropTypes.func,
  deletingPendingGsUser: PropTypes.bool,
  editGuardian: PropTypes.func,
  editStudent: PropTypes.func,
  editUser: PropTypes.func,
  editingUser: PropTypes.bool,
  enqueueSnackbar: PropTypes.func,
  error: PropTypes.object,
  fetchUsers: PropTypes.func,
  fetchingUser: PropTypes.bool,
  forceResetPassword: PropTypes.func,
  getGuardian: PropTypes.func,
  getGuardianListForCreatingStudent: PropTypes.func,
  getImportQueueStudentAndGuardian: PropTypes.func,
  getStudent: PropTypes.func,
  guardians: PropTypes.array,
  history: PropTypes.object,
  importStatus: PropTypes.number,
  importStudentAndGuardian: PropTypes.func,
  inviteGuardian: PropTypes.func,
  inviteStudent: PropTypes.func,
  isEditUserSuccess: PropTypes.bool,
  isEditingUser: PropTypes.bool,
  isInviteUserSuccess: PropTypes.bool,
  isInvitingUser: PropTypes.bool,
  location: PropTypes.object,
  name: PropTypes.func,
  resendResetPassword: PropTypes.func,
  setUserState: PropTypes.func,
  t: PropTypes.func,
  totalUser: PropTypes.number,
  updateUserStatus: PropTypes.func,
  users: PropTypes.array,
};
const mapStateToProps = (state) => ({
  users: state.GuardianStudent.users,
  totalUser: state.GuardianStudent.totalUser,
  fetchingUser: state.GuardianStudent.fetchingUser,
  editingUser: state.GuardianStudent.editingUser,
  deletingPendingGsUser: state.GuardianStudent.deletingPendingGsUser,
  isInvitingUser: state.GuardianStudent.isInvitingUser,
  currentUser: state.Auth.currentUser,
  error: state.GuardianStudent.error,
  guardians: state.GuardianStudent.guardians,
  isInviteUserSuccess: state.GuardianStudent.isInviteUserSuccess,
  isEditingUser: state.GuardianStudent.isEditingUser,
  isEditUserSuccess: state.GuardianStudent.isEditUserSuccess,
  importStatus: state.Import.importStatus,
});
const mapDispatchToProps = (dispatch) => ({
  setUserState: (payload) => dispatch(userActions.gsSetState(payload)),
  getStudent: (payload) => dispatch(userActions.getStudentList(payload)),
  getGuardian: (payload) => dispatch(userActions.getGuardianList(payload)),
  getGuardianListForCreatingStudent: (payload) =>
    dispatch(userActions.getGuardianListForCreatingStudent(payload)),
  editStudent: (payload) => dispatch(userActions.editStudent(payload)),
  deletePendingGsUser: (payload) =>
    dispatch(userActions.deletePendingGsUser(payload)),
  editGuardian: (payload) => dispatch(userActions.editGuardian(payload)),
  inviteStudent: (payload) => dispatch(userActions.inviteStudent(payload)),
  inviteGuardian: (payload) => dispatch(userActions.inviteGuardian(payload)),
  updateUserStatus: (payload) =>
    dispatch(userActions.sgUpdateDomainUserStatus(payload)),
  forceResetPassword: (payload) =>
    dispatch(userActions.sgForceResetPassword(payload)),
  resendInvitation: (payload) =>
    dispatch(userActions.sgResendInvitation(payload)),
  resendResetPassword: (payload) =>
    dispatch(userActions.sgResendResetPassword(payload)),
  getImportQueueStudentAndGuardian: (payload) =>
    dispatch(importActions.getImportQueueStudentAndGuardian(payload)),
  importStudentAndGuardian: (payload) =>
    dispatch(importActions.importStudentAndGuardian(payload)),
});
const UsersTranslated = withTranslation([
  'user',
  'students',
  'common',
  'dialog',
])(Users);
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withSnackbar(UsersTranslated));
