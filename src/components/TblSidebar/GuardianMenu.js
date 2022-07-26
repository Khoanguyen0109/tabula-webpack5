import React, { useContext } from 'react';
import { useHistory } from 'react-router';

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import MenuItem from '@mui/material/MenuItem';
import Popover from '@mui/material/Popover';
import makeStyles from '@mui/styles/makeStyles';

import { AuthDataContext } from 'AppRoute/AuthProvider';
import { ROUTE_MY_COURSES } from 'modules/MyCourses/constantsRoute';
import PropTypes from 'prop-types';

import UserInfoCard from './UserInfoCard';

const useStyles = makeStyles((theme) => ({
  rootList: { minWidth: 280 },
  rootPopover: {
    boxShadow: '0 0 4px 0 rgba(0, 0, 0, 0.24)',
  },

  typography: {
    padding: theme.spacing(2),
  },
  menuItem: {
    padding: '4px 10px',
  },
}));

export default function SimplePopover(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const authContext = useContext(AuthDataContext);
  const history = useHistory();

  const { students } = authContext.currentUser;

  // const [selectedStudent, setSelectedStudent] = React.useState(
  //   students && students[0]
  // );
  const currentStudentSelected =
    students.find((i) => i.id === Number(authContext?.currentStudentId)) ||
    (students && students[0]);
  const [selectedStudent, setSelectedStudent] = React.useState(
    currentStudentSelected
  );

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event, item) => {
    setAnchorEl(null);
    props.handleCloseMenuList(event, item);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const handleToggle = (student) => () => {
    const { id } = student;
    setSelectedStudent(student);
    //NOTE: Hide popover when choosing any student
    setAnchorEl(null);
    authContext.setData({ currentStudentId: id }, 'user');
    history.push(ROUTE_MY_COURSES.MY_COURSES_GUARDIAN(id));
  };

  return (
    <div>
      <MenuItem
        onClick={handleClick}
        key='guardian'
        className={classes.menuItem}
      >
        <UserInfoCard itemInfo={selectedStudent} iconCollapse />
      </MenuItem>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        classes={{ paper: classes.rootPopover }}
      >
        <List className={classes.rootList}>
          {students?.map((student) => (
            <ListItem
              key={student.id}
              role={undefined}
              dense
              button
              onClick={handleToggle(student)}
            >
              <UserInfoCard itemInfo={student} />
            </ListItem>
          ))}
        </List>
      </Popover>
    </div>
  );
}

SimplePopover.propTypes = {
  handleCloseMenuList: PropTypes.func,
};
