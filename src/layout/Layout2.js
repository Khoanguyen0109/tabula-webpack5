import React from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/styles';
import makeStyles from '@mui/styles/makeStyles';

import useWindowSize from 'utils/windowSize';

import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  containerLeft: {
    height: '100vh',
    position: 'fixed',
    width: theme.spacing(37.5),
    '& .MuiTab-root': {
      width: '100%'
    }
  },
  containerRight: {
    width: 'calc(100% - 321px)',
    marginLeft: theme.spacing(39),
    // marginBottom: theme.spacing(4)
  },
  title: {
    display: 'unset'
  }
}));
function Layout2(props) {
  const theme = useTheme();
  const classes = useStyles();
  const size = useWindowSize();
  // 70 is height breadcrumb
  const height = size.height - 90;
  const { children, background, scrollable = true } = props;
  const { title: titleLeft, children: childrenLeft, style, styleContainerLeft } = children[0].props;
  const { title: titleRight, children: childrenRight } = children[1].props;

  const layoutContent = (
    <Grid container spacing={0}>
      <Grid item>
        <Box component='div' pt={2} pl={3} pr={3} className={classes.containerLeft} style={{ background: background ?? `${theme.newColors.gray[100]}`, ...styleContainerLeft }}>
        {!!titleLeft && (
            <Typography component='div' variant='labelLarge' className='title-container text-ellipsis'>
              {titleLeft}
            </Typography>
          )}
          <Typography style={style} component='div'>
            {childrenLeft}
          </Typography>
        </Box>
      </Grid>
      <Grid item className={classes.containerRight}>
        <Box component='div' pt={2} pl={5} pr={4} pb={5}>
          {!!titleRight && (
            <Box display='flex' className='text-ellipsis-2row' mb={2} >
              <Box justifySelf='center' display='flex' justifyItems='center'>
                {/* <Typography component='div' variant='labelLarge' noWrap className={classes.title}> */}
                <Typography component='div' variant='labelLarge' className='text-ellipsis-2row'>
                  {titleRight}
                </Typography>
              </Box>
            </Box>
          )}
          <Typography component='div'>
            {childrenRight}
          </Typography>
        </Box>
      </Grid>
    </Grid>
  );

  return (
    <Box height={height}> {/* fix bug scrollbar */}
      {scrollable
        ? <PerfectScrollbar>{layoutContent}</PerfectScrollbar>
        : layoutContent}
    </Box>
  );
}

Layout2.propTypes = {
  classes: PropTypes.object,
  children: PropTypes.node,
  background: PropTypes.string,
  scrollable: PropTypes.bool
};

export default Layout2;