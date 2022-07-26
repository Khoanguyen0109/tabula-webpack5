import React from 'react';
import { useTranslation } from 'react-i18next';
import PerfectScrollbar from 'react-perfect-scrollbar';

import Grid from '@mui/material/Grid';
import Hidden from '@mui/material/Hidden';
import useMediaQuery from '@mui/material/useMediaQuery';
import withStyles from '@mui/styles/withStyles';

import bgPattern from 'assets/images/bg_pattern.svg';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import { Typography } from '@mui/material';

const styles = (theme) => ({
  root: {
    height: '100vh',
    overflow: 'hidden',
    '& .slogan': {
      textAlign: 'center',
      fontSize: theme.fontSize.small,
      color: theme.newColors.gray[800],
      margin: theme.spacing(1, 0, 2, 0),
    },
    '& .help-text': {
      marginBottom: theme.spacing(2),
      marginLeft: theme.spacing(1),
      '&.domain': {
        marginTop: theme.spacing(-1),
      },
    },
    '& .login-info, & .organization-title': {
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(1),
      marginLeft: theme.spacing(1),
    },
  },
  left: {
    background: `url(${bgPattern}) 50% 100% no-repeat #4b4a69`,
    backgroundSize: 'cover',
    height: '100%',
  },
  right: {
    height: '100%',
    position: 'relative',
  },
  layoutXS: {
    padding: theme.spacing(0, 1),
    width: '100%',
  },
  logo: {
    paddingTop: '8vh',
    margin: '0 0 10px 0',
    fontSize: '27px',
    fontWeight: 'bold',
    lineHeight: 0.59,
    letterSpacing: '5.4px',
    textAlign: 'center',
    color: theme.mainColors.tertiary[5],
  },
  slogan: {
    textAlign: 'center',
    color: theme.newColors.gray[800],
    lineHeight: 0.59,
    margin: theme.spacing(2.5, 0, 3, 0),
  },
  termAndPolicy: {
    textAlign: 'center',
    fontSize: theme.fontSize.small,
    paddingBottom: '10px',
    // position: 'absolute',
    // left: 0,
    right: 0,
    bottom: '10px',
    paddingTop: '8px',
    '& a': {
      color: theme.newColors.gray[800],
      textDecoration: 'underline',
    },
  },
  rightForm: {
    position: 'relative',
    maxWidth: '450px',
    // height: 'calc(100% - 240px)',
    // maxHeight: 'calc(100% - 240px)',
    margin: 'auto',
    marginBottom: '40px',
    '& .suspended-wrapper p': {
      color: theme.newColors.gray[800],
    },
    '& .box-fade': {
      opacity: 0,
    },
    '& .link': {
      '& a': {
        color: theme.mainColors.primary1[0],
      },
    },
    '&  form': {
      textAlign: 'left',
      '& > h4': {
        fontSize: theme.fontSize.medium,
        color: theme.palette.primary.main,
        fontWeight: 500,
      },
      '& .btn-group': {
        position: 'relative',
        '& .MuiCircularProgress-root': {
          position: 'absolute',
          top: '50%',
          left: '50%',
          marginTop: -12,
          marginLeft: -12,
        },
        '& .MuiButton-root': {
          minWidth: '120px',
        },
      },
    },
    '& > .suspended-wrapper': {
      margin: 'auto',
      textAlign: 'center',
    },
  },
  ps: {
    height: `calc(100% - ${theme.spacing(8)})`,
  },
});

const Layout = ({ children, classes }) => {
  const { t } = useTranslation('auth', 'common');
  const logoText = t('common:tabula_learning');
  const slogan = t('your_learning_guide');
  const privacyText = t('privacy_policy');
  const termsOfUseText = t('terms_of_use');
  const matches = useMediaQuery((theme) => theme.breakpoints.down('md'));
  return (
    <Grid container className={classes.root}>
      <Hidden smDown>
        <Grid item className={classes.left} md={6} />
      </Hidden>
      <Grid
        item
        className={clsx(classes.right, { [classes.layoutXS]: matches })}
        md={6}
      >
        <PerfectScrollbar className={classes.ps}>
          <div>
            <Typography component='div' variant='headingSmall' className={classes.logo}>{logoText}</Typography>
            <div className={classes.slogan}>{slogan}</div>
            <div className={classes.rightForm}>{children}</div>
          </div>
        </PerfectScrollbar>
        <div className={classes.termAndPolicy}>
          <a style={{ margin: 10 }} href='#'>
            {termsOfUseText}
          </a>
				  <div >Version 3.1.1.5</div>
				  <div >Version 3.1.1.5</div>
        </div>
      </Grid>
    </Grid>
  );
};
Layout.propTypes = {
  children: PropTypes.node,
  classes: PropTypes.object,
  t: PropTypes.func,
};
export default withStyles(styles)(Layout);
