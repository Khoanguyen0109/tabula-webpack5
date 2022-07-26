import React from 'react';

import trim from 'lodash/trim';

import { Box, Typography } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import withStyles from '@mui/styles/withStyles';

import EmptyContent from 'components/EmptyContent';
import TblTable from 'components/TblTable';
import TblTooltipDynamic from 'components/TblTooltipDynamic';

import { renderUserStatus } from 'modules/Users/utils';
import PropTypes from 'prop-types';

const styles = (theme) => ({
  root: {},
  menuItem: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  link: {
    color: theme.newColors.primary[500],
    cursor: 'pointer',
    fontWeight: theme.fontWeight.semi,
  },
});
class UserList extends React.PureComponent {
  // anchorRef = React.createRef(null);
  rowActions = (record, action, callback) => () => {
    this.props.rowActions(record, action);
    // Close menu when open modal or something like that
    if (callback) {
      callback();
    }
  };

  handleClickMore = (event) => {
    this.setState({ anchorRef: event.currentTarget });
  };

  handleClose = () => {
    this.setState({ anchorRef: null });
  };

  render() {
    const {
      users,
      classes,
      total,
      onChangePage,
      fetchingUser,
      t,
      userType,
      params,
      activeTab,
    } = this.props;
    const columns = [
      {
        title: t('first_name'),
        titleIcon:
          params.sortField === 'firstName'
            ? params.sort === 'asc'
              ? 'icon-icn_sort_arrow_up'
              : 'icon-icn_sort_arrow_down'
            : 'icon-icn_sort_arrow_off',
        titleIconAction: () => this.props.onSort('firstName'),
        dataIndex: 'firstName',
        cursor: true,
        key: 'firstName',
        render: (text) => (
          <TblTooltipDynamic>{trim(text)}</TblTooltipDynamic>
        ),
      },
      {
        title: t('last_name'),
        dataIndex: 'lastName',
        titleIcon:
          params.sortField === 'lastName'
            ? params.sort === 'asc'
              ? 'icon-icn_sort_arrow_up'
              : 'icon-icn_sort_arrow_down'
            : 'icon-icn_sort_arrow_off',
        titleIconAction: () => this.props.onSort('lastName'),
        cursor: true,
        key: 'lastName',
        render: (text) => <TblTooltipDynamic>{trim(text)}</TblTooltipDynamic>,
      },
      {
        title: t('email_address'),
        dataIndex: 'email',
        titleIcon:
          userType === 'guardians'
            ? params.sortField === 'email'
              ? params.sort === 'asc'
                ? 'icon-icn_sort_arrow_up'
                : 'icon-icn_sort_arrow_down'
              : 'icon-icn_sort_arrow_off'
            : '',
        titleIconAction: () => this.props.onSort('email'),
        key: 'email',
        cursor: true,
        render: (text) => <TblTooltipDynamic>{trim(text)}</TblTooltipDynamic>,
        // <div className='text-ellipsis'></div>,
      },
      {
        title: t('status'),
        dataIndex: 'status',
        align: 'center',
        width: '10%',
        key: 'status',
        render: (s, record) => renderUserStatus(record),
      },
      {
        key: 'action',
        align: 'right',
        width: '5%',
        contextMenu: (record, callback) => {
          switch (record.status[0]) {
            case -4:
              return [
                <MenuItem
                  key='1'
                  className={classes.menuItem}
                  onClick={this.rowActions(
                    record,
                    'resend_invitation',
                    callback
                  )}
                >
                  <Typography variant='bodySmall' component='p'>
                    {t('user_expired')}
                  </Typography>
                  <div>{t('resend_invitation')}</div>
                </MenuItem>,
                <MenuItem
                  key='3'
                  onClick={this.rowActions(record, 'suspend', callback)}
                >
                  {t('suspend_user')}
                </MenuItem>,
              ];
            case -3:
              return [
                // <MenuItem key='1' className={classes.menuItem} onClick={this.rowActions(record, 'resend_confirmation', callback)}>
                //   <Typography variant='bodySmall' component='p'>{t('user_has_not_confirmed_new_email_address')}</Typography>
                //   <div>
                //     {t('resend_confirmation_email')}
                //   </div>
                // </MenuItem>,
                <MenuItem
                  key='3'
                  onClick={this.rowActions(record, 'suspend', callback)}
                >
                  {t('suspend_user', callback)}
                </MenuItem>,
              ];
            case -1:
              return [
                <MenuItem
                  key='3'
                  onClick={this.rowActions(record, 'suspend', callback)}
                >
                  {t('suspend_user')}
                </MenuItem>,
                <MenuItem
                  key='1'
                  className={classes.menuItem}
                  onClick={this.rowActions(record, 'resend', callback)}
                >
                  <Typography variant='bodySmall' component='p'>
                    {t('user_has_not_reset_password')}
                  </Typography>
                  <div>{t('resend_request')}</div>
                </MenuItem>,
              ];
            case -2:
              return [
                <MenuItem
                  key='1'
                  className={classes.menuItem}
                  onClick={this.rowActions(record, 'restore', callback)}
                >
                  <Typography variant='bodySmall' component='p'>
                    {t('user_suspended')}
                  </Typography>
                  <div>{t('restore_user')}</div>
                </MenuItem>,
              ];
            case 0:
              return [
                <MenuItem
                  key='1'
                  className={classes.menuItem}
                  onClick={this.rowActions(
                    record,
                    'resend_invitation',
                    callback
                  )}
                >
                  <Typography variant='bodySmall' component='p'>
                    {t('user_not_accept_invitation')}
                  </Typography>
                  <div>{t('resend_invitation')}</div>
                </MenuItem>,
                <MenuItem
                  key='2'
                  onClick={this.rowActions(record, 'edit', callback)}
                >
                  {t('edit_user')}
                </MenuItem>,

                <MenuItem
                  key='2'
                  onClick={this.rowActions(
                    record,
                    'delete_pending_user',
                    callback
                  )}
                >
                  {t('delete_user')}
                </MenuItem>,
              ];
            case 1:
              return [
                <MenuItem
                  key='1'
                  onClick={this.rowActions(record, 'reset', callback)}
                >
                  {t('reset_password')}
                </MenuItem>,
                <MenuItem
                  key='2'
                  onClick={this.rowActions(record, 'edit', callback)}
                >
                  {t('edit_user')}
                </MenuItem>,
                <MenuItem
                  key='3'
                  onClick={this.rowActions(record, 'suspend', callback)}
                >
                  {t('suspend_user')}
                </MenuItem>,
              ];

            default:
              break;
          }
        },
      },
    ];
    if (userType === 'students') {
      columns.splice(3, 0, {
        title: t('students:guardians_name'),
        dataIndex: 'guardian1',
        key: 'guardian1',
        render: (text, record) => {
          const guardianName1 =
            record.guardians[0] &&
            `${record.guardians[0].firstName} ${record.guardians[0].lastName}`;
          const guardianName2 =
            record.guardians[1] &&
            `${record.guardians[1].firstName} ${record.guardians[1].lastName}`;
          return (
            <Box>
              <TblTooltipDynamic>{guardianName1}</TblTooltipDynamic>
              <TblTooltipDynamic>{guardianName2}</TblTooltipDynamic>
            </Box>
          );
        },
      });
    }
    const emptyData = !params.search && users.length === 0;
    const emptySearch = !!params.search;
    return (
      <TblTable
        delta={240}
        className={classes.root}
        scrollInline={true}
        onChangePage={onChangePage}
        isBusy={fetchingUser}
        rows={users}
        columns={columns}
        pagination
        total={total}
        viewDetail={(row) => {
          if (row.status[0] === 1 || row.status[0] === 0) {
            this.props.rowActions(row, 'edit');
          }
        }}
        emptySearch={emptySearch}
        emptyContent={
          emptyData && (
            <EmptyContent
              subTitle={
                activeTab === 0
                  ? t('student_have_been_added_yet')
                  : t('guardian_have_been_added_yet')
              }
            />
          )
        }
      />
    );
  }
}
UserList.propTypes = {
  activeTab: PropTypes.number,
  classes: PropTypes.object,
  fetchingUser: PropTypes.bool,
  inviteUser: PropTypes.func,
  onChangePage: PropTypes.func,
  onSort: PropTypes.func,
  params: PropTypes.object,
  rowActions: PropTypes.func,
  t: PropTypes.func,
  total: PropTypes.number,
  userType: PropTypes.string,
  users: PropTypes.array,
};
export default withStyles(styles)(UserList);
