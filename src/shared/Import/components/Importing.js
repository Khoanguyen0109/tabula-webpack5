import React from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

import ImportLog from './ImportLog';
const useStyles = makeStyles((theme) => ({
  root: {
    width: theme.spacing(56)
  },
}));

const Importing = () => {
  const { t } = useTranslation(['importFile']);
  const classes = useStyles();

  return (
    <Box className={classes.root }>
      <Box textAlign='center'>
        <Typography variant='labelLarge'>
          {t('we_are_importing_your_file')}
        </Typography>
        <Box mb={0.5} />
        <Typography variant='bodyMedium'>{t('importing_subtitle')}</Typography>
      </Box>
      <Box mt={3} />
      <ImportLog />
    </Box>
  );
};

Importing.propTypes = {};

export default Importing;
