import React from 'react';

import trim from 'lodash/trim';

import { Typography } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import withStyles from '@mui/styles/withStyles';

import TblTable from 'components/TblTable';
import TblTooltipDynamic from 'components/TblTooltipDynamic';

import { renderUserStatus } from 'modules/Users/utils';
import PropTypes from 'prop-types';

const styles = () => ({
  root: {},
  menuItem: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
});

class UserList extends React.PureComponent {
  // anchorRef = React.createRef(null);
  // constructor(props) {
  // super(props);
  // const { t, classes } = props;
  // }

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
    const { users, classes, total, onChangePage, fetchingUser, params, onSort, t } = this.props;
    const columns = [
      {
        title: t('first_name'),
        // titleIcon: 'icon-icn_sort_arrow_off',
        titleIcon:
          params.sortField === 'firstName'
            ? params.sort === 'asc'
              ? 'icon-icn_sort_arrow_up'
              : 'icon-icn_sort_arrow_down'
            : 'icon-icn_sort_arrow_off',
        titleIconAction: () => onSort('firstName'),
        dataIndex: 'firstName',
        cursor: true,
        key: 'firstName',
        render: (text) => (
          <div className='text-ellipsis'>{trim(text)}</div>
        ),
      },
      {
        title: t('last_name'),
        dataIndex: 'lastName',
        // titleIcon: 'icon-icn_sort_arrow_off',
        cursor: true,
        key: 'lastName',
        render: (text) => <div className='text-ellipsis'>{trim(text)}</div>,
      },
      {
        title: t('email_address'),
        dataIndex: 'email',
        // titleIcon: 'icon-icn_sort_arrow_off',
        key: 'email',
        cursor: true,
        render: (text) => <div className='text-ellipsis'>{trim(text)}</div>,
      },
      {
        title: t('roles'),
        dataIndex: 'roles',
        key: 'roles',
        id: 'colRoles',
        render: (roles) => {
          const sortedRoles = roles.sort(function (a, b) {
            return a.id - b.id;
          });
          return (
            <TblTooltipDynamic>
              {sortedRoles.map((role) => role.roleName).join(', ')}
            </TblTooltipDynamic>
          );
        },
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
                    'resend_confirmation',
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
                <MenuItem key='3' onClick={this.rowActions(record, 'suspend', callback)}>
                  {t('suspend_user')}
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
                  key='1'
                  onClick={this.rowActions(record, 'delete_pending_user', callback)}
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
    const emptySearch = !!params.search;

    return (
      <TblTable
        delta={220}
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
      />
    );
  }
}
UserList.propTypes = {
  t: PropTypes.func,
  users: PropTypes.array,
  total: PropTypes.number,
  onChangePage: PropTypes.func,
  rowActions: PropTypes.func,
  onSort: PropTypes.func,
  fetchingUser: PropTypes.bool,
  classes: PropTypes.object,
  params: PropTypes.object,
};
export default withStyles(styles)(UserList);
