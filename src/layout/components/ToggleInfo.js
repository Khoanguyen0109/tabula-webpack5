import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Box } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import makeStyles from '@mui/styles/makeStyles';

import { AuthDataContext } from 'AppRoute/AuthProvider';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  root: {
    width: theme.spacing(35),
    height: theme.spacing(5),
    position: 'absolute',
    backgroundColor: theme.newColors.gray[900],
    color: 'white',
    display: 'flex',
    top: 10,
    right: 40,
    justifyContent: 'space-between',
    borderRadius: '56px',
    padding: '4px 16px 4px 4px',
    alignItems: 'center',
    transition: '0.5s',
    fontSize: theme.fontSize.small,
    fontWeight: theme.fontWeight.normal,
  },
  unShow: {
    right: `${theme.spacing(-30)}!important`,
  },
  avatar: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
  info: {
    width: theme.spacing(22),
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  hideBtn: {
    textDecoration: 'underline',
  },
}));
function ToggleInfo() {
  const classes = useStyles();
  const { t } = useTranslation('user');
  const [show, setShow] = useState(true);
  const authContext = useContext(AuthDataContext);
  const { students } = authContext.currentUser;
  const currentStudentSelected =
    students?.find((i) => i.id === Number(authContext?.currentStudentId)) ||
    (students.length > 0 ? students[0] : null);
  return (
    currentStudentSelected && (
      <Box
        className={clsx(classes.root, !show && classes.unShow)}
        onClick={() => setShow(!show)}
      >
        <Box display='flex' alignItems='center'>
          <Avatar className={classes.avatar}>{`${
            currentStudentSelected?.firstName
              ? currentStudentSelected.firstName[0]
              : ''
          }${
            currentStudentSelected?.lastName
              ? currentStudentSelected.lastName[0]
              : ''
          }`}</Avatar>
          <Box ml={1} className={classes.info}>
            {' '}
            {t('you_are_viewing', { name: currentStudentSelected.name })}
          </Box>
        </Box>
        <Box className={classes.hideBtn} onClick={() => setShow(false)}>
          Hide
        </Box>
      </Box>
    )
  );
}

export default ToggleInfo;
