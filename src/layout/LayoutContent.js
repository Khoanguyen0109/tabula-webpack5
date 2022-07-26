import React from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import withStyles from '@mui/styles/withStyles';

import PropTypes from 'prop-types';

import styles from './styled';

class LayoutContent extends React.PureComponent {
  render() {
    return (
      <Grid container spacing={0}>
        {React.Children.map(this.props.children, (child) => {
          const { grid, boxStyles, background, title, children } = child.props;
          return (
            <Grid item {...grid ?? { xs: 12, sm: 12 }} style={{ background: background ?? 'white' }}>
              <Box component='div' {...boxStyles ?? { pt: 2, pl: 5, pr: 5 }}>
                {!!title && (
                  <Typography component='div' variant='labelLarge' className='title-container text-ellipsis'>
                    {title}
                  </Typography>
                )}
                <Typography component='div'>
                  {children}
                </Typography>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    );
  };
}

LayoutContent.propTypes = {
  classes: PropTypes.object,
  children: PropTypes.node
};

export default withStyles(styles)(LayoutContent);