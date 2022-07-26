import React from 'react';

import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';

import clsx from 'clsx';
import { PropTypes } from 'prop-types';

const useStyles = makeStyles((theme) => ({
  itemCard: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    '&:hover': {
      cursor: 'pointer',
    },
    height: '100%'
  },
  content: {
    width: '80%',
    color: theme.mainColors.primary1[0],
    minWidth: 0,
    paddingLeft: theme.spacing(2),
  },
  name: {
    width: '100%',
  },
  email: {
    fontSize: theme.fontSize.normal,
  },
  status: {
    color: theme.newColors.gray[600],
    fontSize: theme.fontSize.small,
  },

  rootAvatar: {
    width: theme.spacing(6),
    minWidth: theme.spacing(6),
    height: theme.spacing(6),
    background: theme.newColors.gray[100],
    color: theme.mainColors.gray[6],
    fontSize: theme.fontSize.normal,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));

function UserInfoCard(props) {
  const classes = useStyles();
  const { status } = props;
  const { name, email, avatar, lastName } = props?.itemInfo;
  const { iconCollapse } = props;
  return (
    <div className={classes.itemCard}>
      {avatar ? (
        <Avatar
          src={'/static/images/avatar.jpg'}
          className={classes.rootAvatar}
        />
      ) : (
        <div className={clsx(classes.rootAvatar, 'avatar')}>{`${
          name?.charAt(0) || ''
        }${lastName?.charAt(0) || ''}`}</div>
      )}
      <div className={clsx(classes.content, 'content')}>
        <Typography
          component='div'
          variant='labelLarge'
          className={clsx(classes.name, 'text-ellipsis')}
          noWrap={true}
        >
          {name}
        </Typography>
        {email && (
          <Typography component='div' variant='bodyMedium' noWrap={true}>
            {email}
          </Typography>
        )}
        {status && (
          <Typography className={classes.status} noWrap={true}>
            {status}
          </Typography>
        )}
      </div>
      {iconCollapse && <ArrowRightIcon style={{ marginLeft: 'auto' }} />}
    </div>
  );
}

UserInfoCard.propTypes = {
  email: PropTypes.string,
  firstName: PropTypes.string,
  iconCollapse: PropTypes.bool,
  itemInfo: PropTypes.object,
  lastName: PropTypes.string,
  name: PropTypes.string,
  status: PropTypes.any,
};

UserInfoCard.defaultProps = {
  itemInfo: {
    name: '',
    email: 'No Students',
    firstName: 'First Name',
    lastName: 'Last Name',
  },
  iconCollapse: false,
};

export default UserInfoCard;
