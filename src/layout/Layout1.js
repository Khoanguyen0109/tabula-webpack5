import React from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import withStyles from '@mui/styles/withStyles';

import useWindowSize from 'utils/windowSize';

import PropTypes from 'prop-types';
const styles = () => ({
  wrapContent: {
    height: (props) => props.contentHeight
  }
});
function Layout1(props) {
  const { title, children, className, scrollable, bgcolor = 'transparent', padding = {}, margin = {}, classes, onScrollBottom } = props;
  const { pTop = 2, pRight = 5, pBottom = 0, pLeft = 5 } = padding;
  const { mTop = 0, mRight = 0, mBottom = 0, mLeft = 0 } = margin;
  const size = useWindowSize();
  // 90 is height breadcrumb
  const height = size.height - 90;
  const layoutContent = (
    <Box
      component='div'
      className={className}
      height={height}
      bgcolor={bgcolor}

      pt={pTop}
      pl={pLeft}
      pr={pRight}
      pb={pBottom}

      mt={mTop}
      ml={mLeft}
      mr={mRight}
      mb={mBottom}
    >
      {!!title && (
        <Typography component='div' variant='labelLarge' className='title-container text-ellipsis'>
          {title}
        </Typography>
      )}
      <Typography component='div' className={classes.wrapContent}>
        {children}
      </Typography>
    </Box>
  );

  return (
    <Grid container spacing={0}>
      <Grid item xs={12} sm={12}>
        {scrollable
          ? <PerfectScrollbar onScrollY={(e) => onScrollBottom(e)}>{layoutContent}</PerfectScrollbar>
          : layoutContent}
      </Grid>
    </Grid >
  );
};

Layout1.propTypes = {
  classes: PropTypes.object,
  className: PropTypes.string,
  title: PropTypes.string,
  children: PropTypes.node,
  scrollable: PropTypes.bool,
  bgcolor: PropTypes.string,
  padding: PropTypes.object,
  margin: PropTypes.object,
  onScrollBottom: PropTypes.func,
};

Layout1.defaultProps = {
  title: '',
  children: '',
  scrollable: true,
  onScrollBottom: () => { }
};

export default withStyles(styles)(Layout1);