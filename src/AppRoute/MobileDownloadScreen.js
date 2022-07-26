import React from 'react';
import { useTranslation } from 'react-i18next';

import { Box } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

import Layout from 'shared/Auth/components/Layout';

import AppIcon from 'assets/images/app-icon.png';
import IOSDownload from 'assets/images/app_store.svg';
import AndroidDownload from 'assets/images/google_play.svg';

import {
  detectMobAndroid,
  detectMobIOS,
} from '../utils/detectMobileBrowsing';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(6),
    textAlign: 'center',
    color: theme.newColors.gray[800],
  },
  logo: {
    width: theme.spacing(16),
    height: theme.spacing(16),
  },
  download: {},
}));
function MobileDownloadScreen() {
  const classes = useStyles();
  const { t } = useTranslation('auth');
  return (
    <Layout>
      <Box className={classes.container}>
        {t('mobile_browser_supported')}

        <Box mt={3}>
          <img src={AppIcon} alt='' className={classes.logo} />
        </Box>
        <Box>
          {detectMobIOS() && (
            <a href={process.env.REACT_APP_IOS_DOWNLOAD_URL}>
              <img src={IOSDownload} alt='' className={classes.logo} />
            </a>
          )}
          {detectMobAndroid() && (
            <a href={process.env.REACT_APP_ANDROID_DOWNLOAD_URL}>
              <img src={AndroidDownload} alt='' className={classes.logo} />
            </a>
          )}
        </Box>
      </Box>
    </Layout>
  );
}

export default MobileDownloadScreen;
