import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import { Box, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

import { IMPORT_STATUS } from '../utils';

import ImportLog from './ImportLog';
const useStyles = makeStyles((theme) => ({
  root: {
    width: theme.spacing(56),
  },
}));

const Imported = () => {
  const classes = useStyles();
  const { t } = useTranslation('importFile');
  const importStatus = useSelector((state) => state.Import.importStatus);
  return (
    <Box className={classes.root}>
      {importStatus === IMPORT_STATUS.DONE ? (
        <>
          {' '}
          <Box textAlign='center'>
            <CheckCircleOutlineOutlinedIcon
              sx={{ fontSize: '50px', color: '#40C057' }}
            />
            <Box mb={1} />
            <Typography variant='titleSmall'>
              {t('imported_successfully')}
            </Typography>
            <Box mb={1} />
            <Typography variant='bodyMedium'>
              {t('common:everything_look_great')}
            </Typography>
            <Box mt={3} />
          </Box>
          <ImportLog />
        </>
      ) : (
        <>
          <Box textAlign='center'>
            <WarningAmberOutlinedIcon
              sx={{ fontSize: '50px', color: '#E03131' }}
            />
            <Box mb={1} />
            <Typography variant='titleSmall'>{t('imported_failed')}</Typography>
            <Box mb={1} />
            <Typography variant='bodyMedium'>
              {t('imported_failed_subtitle')}
            </Typography>
            <Box mt={3} />
          </Box>
        </>
      )}
    </Box>
  );
};

Imported.propTypes = {};

export default Imported;
