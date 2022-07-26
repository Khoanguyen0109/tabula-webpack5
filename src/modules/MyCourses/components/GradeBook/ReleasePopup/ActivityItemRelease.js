import React, { useEffect, useState } from 'react';

// material-ui
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import {
  Box,
  Collapse,
  List,
  ListItem,

  Typography,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

import TblCheckBox from 'components/TblCheckBox';
import TblIconButton from 'components/TblIconButton';
import UserInfoCard from 'components/TblSidebar/UserInfoCard';

import { GRADE_WEIGHT_TYPE } from 'modules/MyCourses/constants';
import PropTypes from 'prop-types';
const useStyles = makeStyles((theme) => ({
  root: {
    padding: 0,
    marginLeft: theme.spacing(-1),
    marginBottom: theme.spacing(2),
  },
  listItem: {
    padding: 0,
    display: 'flex',
    justifyContent: 'space-between',
  },
  subItem: {
    padding: theme.spacing(0, 1, 0, 3),
  },
  avatar: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    marginRight: theme.spacing(0.75),
  },
  submission: {
    '& .avatar': {
      width: theme.spacing(3),
      height: theme.spacing(3),
      marginRight: theme.spacing(0.75),
      minWidth: theme.spacing(3),
      fontSizeL: theme.fontSize.xSmall,
    },
    '& .content': {
      padding: 0,
      '& .MuiTypography-root': {
        minWidth: theme.spacing(24),
        fontSize: theme.fontSize.small,
        fontWeight: theme.fontWeight.normal,
      },
    },
  },
}));

const ActivityItemRelease = (props) => {
  const {
    gradeWeightType,
    activity,
    studentSubmissions,
    onSelectActivity,
    onSelectSubmission,
  } = props;
  const [checked, setChecked] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);

  useEffect(() => {
    setChecked(activity.checked);
    if (
      studentSubmissions &&
      studentSubmissions.some((item) => item.checked === true) &&
      !studentSubmissions.every((item) => item.checked === true)
    ) {
      setIndeterminate(true);
    } else {
      setIndeterminate(false);
    }
  }, [activity, studentSubmissions]);

  const totalPossiblePoint =
    activity?.masterAssignment?.totalPossiblePoints ??
    activity?.masterQuiz?.totalPossiblePoints ??
    '';

  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const openActivity = () => {
    setOpen(!open);
  };

  return (
    <Box className={classes.root}>
      <ListItem className={classes.listItem}>
        <Box display='flex' width={'80%'} alignItems='center'>
          <TblCheckBox
            checked={checked}
            indeterminate={indeterminate}
            defaultChecked={false}
            onChange={(e) => {
              e.stopPropagation();

              onSelectActivity(gradeWeightType, activity.id, !activity.checked);
            }}
          />
          <Typography className={'text-ellipsis'} variant='bodyMedium'>{activity.name}</Typography>
        </Box>
        <TblIconButton onClick={() => openActivity()}>
          {open ? <ExpandLess /> : <ExpandMore />}
        </TblIconButton>
      </ListItem>
      <Collapse in={open} timeout='auto' unmountOnExit>
        <List component='div' disablePadding>
          {studentSubmissions.map((submission) => {
            const { overallGrade, students } = submission;
            return (
              <ListItem className={classes.subItem}>
                <TblCheckBox
                  defaultChecked={false}
                  checked={submission.checked}
                  onChange={(e) => {
                    e.stopPropagation();

                    onSelectSubmission(
                      gradeWeightType,
                      activity.id,
                      submission.submissionId,
                      !submission.checked
                    );
                  }}
                />
                <Box
                  width={'92%'}
                  display='flex'
                  justifyContent='space-between'
                  alignItems='center'
                >
                  <Box className={classes.submission} width={'80%'} display='flex'>
                    <UserInfoCard
                      itemInfo={{
                        lastName: students?.lastName,
                        name: `${students?.firstName} ${students?.lastName}`,
                      }}
                    />
                  </Box>
                  <Box>
                  <Typography variant='bodyMedium'>
                  <span>{overallGrade}</span>{' '}
                    {gradeWeightType !== GRADE_WEIGHT_TYPE.PARTICIPATION
                      ? `/${totalPossiblePoint}`
                      : '%'}
                  </Typography>
                  </Box>
                </Box>
              </ListItem>
            );
          })}
        </List>
      </Collapse>
    </Box>
  );
};

ActivityItemRelease.propTypes = {
  activity: PropTypes.shape({
    checked: PropTypes.bool,
    id: PropTypes.number,
    masterAssignment: PropTypes.shape({
      totalPossiblePoints: PropTypes.number
    }),
    masterQuiz: PropTypes.shape({
      totalPossiblePoints: PropTypes.number
    }),
    name: PropTypes.string
  }),
  gradeWeightType: PropTypes.number,
  onSelectActivity: PropTypes.func,
  onSelectSubmission: PropTypes.func,
  studentSubmissions: PropTypes.shape({
    every: PropTypes.func,
    map: PropTypes.func,
    some: PropTypes.func
  })
};

export default ActivityItemRelease;
