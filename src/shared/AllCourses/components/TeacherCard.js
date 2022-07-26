/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';

import CreateIcon from '@mui/icons-material/Create';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';

import TblIconButton from 'components/TblIconButton';

import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    height: 80,
    borderColor: theme.newColors.gray[300],
    borderRadius: 8,
  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    padding: '19px 16px',
    color: theme.mainColors.primary1[0],
    minWidth: 0,
  },
  content: {
    padding: 0,
  },
  avatar: {
    minWidth: 80,
    background: theme.newColors.gray[100],
    color: theme.mainColors.gray[6],
    fontSize: theme.fontSize.normal,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  action: {
    '& .MuiButtonBase-root': {
      marginRight: theme.spacing(1)
    },
    '& .MuiIconButton-root': {
      color: theme.mainColors.gray[6],
    },
    display: 'flex',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  name: {
    fontSize: theme.fontSize.normal,
    fontWeight: theme.fontWeight.semi,
  },
  email: {
    fontSize: theme.fontSize.normal,
  },
}));

function TeacherCard(props) {
  // NOTE: get contexts
  const classes = useStyles();
  let avatar, name, email, firstName = '', lastName = ''; 
  if (props.item) {
    ({ avatar, name, email, firstName, lastName } = props.item);
  } 
  const { handleAction, iconAction } = props;
  // console.log(props.teacher);
  return (
    <Card className={classes.root} variant='outlined'>
      {avatar ? (
        <CardMedia
          className={classes.avatar}
          image=''
          title='Live from space album avatar'
        />
      ) : (
        <div className={classes.avatar}>{`${firstName?.charAt(
          0
        )}${lastName?.charAt(0)}`}</div>
      )}

      <div className={classes.details}>
        <CardContent className={classes.content}>
          <Typography className={classes.name} noWrap={true}>
            {name}
          </Typography>
          <Typography className={classes.email} noWrap={true}>
            {email}
          </Typography>
        </CardContent>
      </div>
      {!!iconAction &&
        <div className={classes.action}>
          <TblIconButton aria-label='action' onClick={handleAction}>
            {typeof iconAction === 'boolean' ? <CreateIcon/> : iconAction}
          </TblIconButton>
        </div>
      }
    </Card>
  );
}

TeacherCard.propTypes = {
  location: PropTypes.object,
  authContext: PropTypes.object,
  item: PropTypes.object,
  handleAction: PropTypes.func,
  iconAction: PropTypes.any,
};

TeacherCard.defaultProps = {
  iconAction: <CreateIcon />,
};

export default TeacherCard;
