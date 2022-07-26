import React from 'react';
import { withRouter } from 'react-router';

import { Skeleton } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import withStyles from '@mui/styles/withStyles';

import { isString } from 'lodash';
import PropTypes from 'prop-types';

import BreadcrumbProvider, {
  BreadcrumbConsumer,
  BreadcrumbContext,
  useBreadcrumbContext,
} from './BreadcrumbContext';
import BreadcrumbTitle from './BreadcrumbTitle';

const styles = (theme) => ({
  root: {
    color: theme.palette.primary.main,
    overflow: 'hidden',
    // height: theme.navbar.default,
    // paddingBottom: theme.spacing(2.5),
    '& .MuiTab-root': {
      paddingLeft: '0 !important',
      paddingRight: '0 !important',
    },
    '& .MuiTabs-indicator': {
      bottom: theme.spacing(0.75),
    },
  },
  boxShadow: {
    boxShadow: `${theme.spacing(0, 0, 0.25, 0)} rgba(0, 0, 0, 0.16)`,
    // height: '100%'
  },
  iconBack: {
    paddingRight: theme.spacing(1.5),
    cursor: 'pointer',
  },
  header: {
    height: theme.spacing(2.5),
    alignItems: 'center',
    color: theme.palette.primary.main,
    fontSize: theme.fontSize.normal,
    '& .MuiTypography-root': {
      lineHeight: 'unset',
      fontSize: theme.fontSize.normal,
    },
  },
  headerTitle: {
    lineHeight: theme.spacing(2.5),
  },
  body: {
    display: 'flex',
    minHeight: theme.spacing(5.5),
    alignItems: 'center',
    '& .MuiTypography-h3 ': {
      width: '80%',
      height: '100%',
      // '& .TblSelect-root': {
      //   marginBottom: 0,
      //   '& .MuiFormLabel-root': {
      //     marginBottom: 0
      //   },
      //   '& .MuiSelect-root': {
      //     padding: theme.spacing(1,4,1,1)
      //   }
      // }
    },
    // '& .TblSelect-root': {
    //   marginRight: theme.spacing(2),
    //   '& .MuiOutlinedInput-root': {
    //     background: theme.mainColors.gray[2],
    //     color: theme.palette.primary.main,
    //     fontWeight: theme.fontWeight.semi
    //   },
    //   '& .MuiOutlinedInput-root:hover, & .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline, & .Mui-focused .MuiOutlinedInput-notchedOutline': {
    //     border: 'none !important'
    //   },
    // }
  },
  footer: {
    height: theme.spacing(5),
    marginTop: theme.spacing(-1.25),
    alignItems: 'center',
    fontWeight: theme.fontWeight.semi,
    '& .MuiTab-root': {
      fontWeight: `${theme.fontWeight.semi }!important`,
    },
  },
});

class Breadcrumb extends React.PureComponent {
  static contextType = BreadcrumbContext;

  componentDidMount() {
    const { history } = this.props;
    this.unlisten = history.listen((location) => {
      if (this.props.location.pathname !== location.pathname) {
        this.context.setData(null);
      }
    });
  }

  componentWillUnmount() {
    this.unlisten();
  }

  clickBreadcrumb = () => {
    const { history } = this.props;
    const { breadcrumb } = this.context;
    if (breadcrumb.handleBackFunc) {
      breadcrumb.handleBackFunc();
      return;
    }
    if (!breadcrumb.path) {
      return;
    }
    history.push(breadcrumb.path);
  };

  render() {
    if (!this.context?.breadcrumb) {
      return null;
    }
    const { breadcrumb } = this.context;
    const { classes } = this.props;
    return (
      <Box
        className={`${classes.root} ${
          breadcrumb.showBoxShadow ?? true ? classes.boxShadow : ''
        }`}
        pt={2}
        pb={!!!breadcrumb.footerContent ? 2 : 0.25}
        pl={5}
        pr={5}
      >
        {breadcrumb.headerContent && (
          <Grid container className={classes.header}>
            <>
              <span
                className={`icon-icn_back ${classes.iconBack}`}
                onClick={this.clickBreadcrumb}
               />
              <Typography
                className='text-ellipsis'
                variant='bodyMedium'
                component='span'
                color='primary'
              >
                {breadcrumb.headerContent}
              </Typography>
            </>
          </Grid>
        )}
        {breadcrumb.bodyContent ? (
          <Box container className={classes.body}>
            {isString(breadcrumb.bodyContent) ? (
              <BreadcrumbTitle title={breadcrumb.bodyContent} />
            ) : (
              // <Box display='flex' alignItems='center'>
              breadcrumb.bodyContent
              // </Box>
            )}
          </Box>
        ) : (
          <Skeleton height={50} width={240} />
        )}
        {breadcrumb.footerContent && (
          <Grid container className={classes.footer}>
            {breadcrumb.footerContent}
          </Grid>
        )}
      </Box>
    );
  }
}

Breadcrumb.propTypes = {
  history: PropTypes.object,
  location: PropTypes.object,
  classes: PropTypes.object,
};
export {
  BreadcrumbContext,
  BreadcrumbProvider,
  useBreadcrumbContext,
  BreadcrumbConsumer,
};
export default withStyles(styles)(withRouter(Breadcrumb));
