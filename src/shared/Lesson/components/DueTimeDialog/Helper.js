import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import PerfectScrollbar from 'react-perfect-scrollbar';

import HelpOutlineOutlined from '@mui/icons-material/HelpOutlineOutlined';
import { Box, Popover, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

import TblButton from 'components/TblButton';

import CourseDAySelectDemo from 'assets/images/courseDaySelect_demo.png';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
  root: {
    marginBottom: theme.spacing(1),
    // '&::after': {
    //     content: '""', 
    //      display: 'block',
    //     width: 0,
    //     height: 0,
    //     position: 'absolute',
    //     borderTop: '8px solid transparent',
    //     borderBottom: '8px solid transparent',
    //     borderLeft: '8px solid white',
    //     top: window.innerHeight /2.3 +'px',
    //     left: window.innerWidth <=1400 ? window.innerWidth /3.76 +'px' : window.innerWidth/3.6 +'px',
    //   }
  },
  paper: {
    borderRadius: theme.spacing(1),
    maxWidth: theme.spacing(35),

  },
  instruction: {
    maxHeight: theme.spacing(28.5),

    // whiteSpace: 'nowrap'
  },
  wrapImg: {
    background: theme.newColors.gray[50],

  },
  scrollBar: {
    width: '100%'
  },
  paragraph: {
    // whiteSpace: 'nowrap',
    lineHeight: theme.spacing(2.5),
    color: theme.newColors.gray[800],
    fontSize: theme.fontSize.small,
    width: theme.spacing(30),
    height: theme.spacing(20),
    // overflow: 'hidden',
    // lineClamp: 8,
    // textOverflow: 'ellipsis',

    // display: '-webkit-box',
    // boxOrient: 'vertical',
  },
  icon: {
    width: theme.spacing(2.2),
    height: theme.spacing(2.2),
    color: theme.newColors.gray[800],
    marginTop: theme.spacing(0.25),
  },
  helperText: {
    fontSize: theme.fontSize.small,
    marginLeft: theme.spacing(1),
    color: theme.newColors.gray[800],
  },
  seeMore: {
    height: `${theme.spacing(25) }px !important`,
    overflowY: 'auto !important',
    lineClamp: 'initial !important',
    textOverflow: 'initial !important',
  },
  btnSeeMore: {
    color: theme.customColors.primary1.main,
    fontSize: theme.fontSize.small,
    fontWeight: theme.fontWeight.normal,
  },
}));

function Helper() {
  const classes = useStyles();
  const { t } = useTranslation('myCourses', 'common');
  const [anchorEl, setAnchorEl] = React.useState(null);

  const scrollBarRef = useRef();
  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const [seeMore, setSeeMore] = useState(false);
  const [key, setKey] = useState(0);

  const handelSeeMore = () => {
    setSeeMore(!seeMore);
    setKey(key + 1);

  };

  const handlePopoverClose = () => {
    setSeeMore(false);
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  return (
    <>
      <Box
        aria-describedby={id}
        className={classes.root}
        onMouseEnter={handlePopoverOpen}
        // onMouseLeave={handlePopoverClose}
        display='flex'
      >
        <HelpOutlineOutlined className={classes.icon} fontSize='small' />
        <Typography className={classes.helperText}>
          {t('create_and_publish_instruction')}
        </Typography>
      </Box>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        // anchorReference='anchorPosition'
        // anchorPosition={{ top: 150, left: 120 }}
        classes={{
            root: classes.root,
          paper: classes.paper,
        }}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 324,
        }}
      
        disableRestoreFocus
        onClose={handlePopoverClose}
      >
        <Box className={classes.wrapImg} paddingX={3} paddingY={2}>
          <img src={CourseDAySelectDemo} alt='course_day_select_demo' />
        </Box>
        <Box p={2} className={classes.instruction}>
          <PerfectScrollbar 
            ref = {scrollBarRef}      
            key={key}     
            options={{
              suppressScrollX: true,
              suppressScrollY: !seeMore
            }
          } 
          className={classes.scrollBar}>
          <Typography
            className={clsx(classes.paragraph )}
          >
            {t('myCourses:helper_text').split('\n').map((line) => <div>{line}</div>)
}
          </Typography>
          </PerfectScrollbar>
     
        </Box>
        {!seeMore && (
          <Box>
            <TblButton className={classes.btnSeeMore} onClick={handelSeeMore}>
              {' '}
              {t('common:see_more')}
            </TblButton>
          </Box>
        )}
      </Popover>

    </>
  );
}

export default Helper;
