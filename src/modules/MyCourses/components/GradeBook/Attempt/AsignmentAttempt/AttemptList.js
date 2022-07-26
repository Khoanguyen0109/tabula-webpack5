import React, { useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';

import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, Collapse, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

import TblIconButton from 'components/TblIconButton';

import PropTypes from 'prop-types';

import AttemptItem from './AttemptItem';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(2),
  },
  title: {
    fontSize: theme.fontSize.small,
    fontWeight: theme.fontWeight.semi,
    color: theme.newColors.gray[800],
  },
  wrapperLabel: {
    display: 'flex',
    alignItems: 'center',
    fontSize: theme.fontSize.small,
    fontWeight: theme.fontWeight.semi,
    color: theme.newColors.gray[800],
  },
  wrapperList: {
    marginLeft: theme.spacing(-2),
    marginRight: theme.spacing(-2),
    paddingLeft: theme.spacing(0.25),
    // overflowX: 'auto',
    maxHeight: (props) =>
      props.attemptList.length === 3 ? theme.spacing(29.5) : theme.spacing(24),
  },
}));
function AttemptList(props) {
  const {
    viewShowMore,
    defaultShow,
    label,
    attemptList,
    attemptSelected,
    onOpenAttempt,
    onOpenGrader,
  } = props;

  const classes = useStyles({ attemptList });
  const [show, setShow] = useState(true);
  const [showMore, setShowMore] = useState(defaultShow);

  const onShowMore = () => {
    setShowMore(!showMore);
  };

  const numberOfItems = viewShowMore? (showMore ? attemptList.length : 1 ) :attemptList.length ;

  return (
    <Box className={classes.root}>
      <Box className={classes.wrapperLabel}>
        <Box mr={1}>
        <Typography className={classes.title} > {label}</Typography>
        </Box>
        <TblIconButton onClick={() => setShow(!show)}>
          {show ? <ExpandMoreIcon /> : <ExpandLessIcon />}
        </TblIconButton>
      </Box>
      <Collapse in={show}>
        <PerfectScrollbar
          className={classes.wrapperList}
          suppressScrollX={true}
        >
          {attemptList.slice(0, numberOfItems).map((item, index) => (
            <AttemptItem
              index={index}
              key={item.id}
              isAttempt={!!item.name}
              selected={item.id === attemptSelected.id}
              item={item}
              onOpenAttempt={onOpenAttempt}
              onOpenGrader={onOpenGrader}
            />
          ))}
          { viewShowMore && attemptList.length > 1 && (
            <AttemptItem
              item={{}}
              showMore={showMore}
              onShowMore={onShowMore}
            />
          )}
        </PerfectScrollbar>
      </Collapse>
    </Box>
  );
}

AttemptList.propTypes = {
  attemptList: PropTypes.array,
  attemptSelected: PropTypes.shape({
    id: PropTypes.number
  }),
  defaultShow: PropTypes.bool,
  label: PropTypes.string,
  onOpenAttempt: PropTypes.func,
  onOpenGrader: PropTypes.string,
  viewShowMore: PropTypes.bool
};

AttemptList.defaultProps = {
  viewShowMore: true,
  defaultShow: false,
};

export default AttemptList;
