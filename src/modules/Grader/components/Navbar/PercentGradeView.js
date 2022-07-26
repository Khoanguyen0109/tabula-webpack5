import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import {
  Box,
  CircularProgress,
  Fade,
  Paper,
  Popper,
  Typography,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

import PropTypes from 'prop-types';

import { STATUS_STUDENT_ASSIGNMENT_IN_SUBMISSION_LIST } from '../../../MyCourses/constants';

const useStyles = makeStyles((theme) => ({
  text: {
    color: 'black',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  container: {
    position: 'relative',
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  bottom: {
    color: theme.newColors.gray[200],
  },
  percent: {
    position: 'absolute',
    left: 0,
    color: theme.customColors.primary1.main,
  },
  dot: {
    height: theme.spacing(1),
    width: theme.spacing(1),
    borderRadius: '50%',
    marginRight: theme.spacing(1.25),
  },
  toolTip: {
    width: theme.spacing(22.5),
    padding: theme.spacing(2),
    paddingBottom: 1,
    borderRadius: theme.borderRadius.default,
  },
  itemToolTip: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
    '& span': {
      marginRight: theme.spacing(1.25),
    },
  },
}));
const PercentGradeView = React.memo(() => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { summary, total } = useSelector((state) => state.Grader);
  const graded = summary?.graded || 0;
  const percent = !isNaN((graded / total) * 100) ? (graded / total) * 100 : 0;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [open, setOpen] = React.useState(false);
  // const open = Boolean(anchorEl);

  const onHover = (e) => {
    setAnchorEl(e.currentTarget);
    setOpen((previousOpen) => !previousOpen);
  };
  const onLeave = () => {
    setOpen((previousOpen) => !previousOpen);
  };

  const id = open ? 'grader-popper' : undefined;

  return (
    <>
      <Box display='flex' alignItems='center'>
        <Box
          aria-describedby={id}
          ml={1}
          mr={1}
          onMouseOver={onHover}
          onMouseOut={onLeave}
        >
          <Typography className={classes.text}>
            {t('grader:graded_vs_total_graded', {
              graded: graded,
              total: total,
            })}
          </Typography>
        </Box>
        <Box
          className={classes.container}
          onMouseOver={onHover}
          onMouseOut={onLeave}
        >
          <CircularProgress
            variant='determinate'
            className={classes.bottom}
            size={40}
            thickness={4}
            value={100}
          />
          <CircularProgress
            className={classes.percent}
            variant='determinate'
            value={percent}
            size={40}
            thickness={4}
          />
        </Box>
        <Popper id={id} open={open} anchorEl={anchorEl} transition>
          {({ TransitionProps }) => (
            <Fade {...TransitionProps} timeout={350}>
              <Paper className={classes.toolTip}>
                {Object.values(STATUS_STUDENT_ASSIGNMENT_IN_SUBMISSION_LIST)
                  .filter((item) => item.sort)
                  .sort(function (a, b) {
                    return a.sort - b.sort;
                  })
                  .map((item) => (
                      <Box className={classes.itemToolTip}>
                        <span
                          className={classes.dot}
                          style={{ backgroundColor: item.color }}
                         />
                        <Typography variant='bodyMedium'>
                          {`${summary?.[item.name] ?? 0 
                            } ${ 
                            t(`myCourses:${item.name}`)}`}
                        </Typography>
                      </Box>
                    ))}
              </Paper>
            </Fade>
          )}
        </Popper>
      </Box>
    </>
  );
});

PercentGradeView.propTypes = {
  graded: PropTypes.number,
  total: PropTypes.number,
};

export default PercentGradeView;
