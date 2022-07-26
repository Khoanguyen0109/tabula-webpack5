import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { Box, Divider, LinearProgress, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

import TblCustomScrollbar from 'components/TblCustomScrollbar';

import { isEmpty } from 'lodash';

import { IMPORT_STATUS } from '../utils';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    padding: theme.spacing(3),
    backgroundColor: theme.newColors.gray[50],
    '& .scrollbar-container': {
      paddingRight: theme.spacing(2),
      marginRight: theme.spacing(-3)
    }
  },
  progress: {
    height: theme.spacing(0.75),
    borderRadius: theme.borderRadius.default,
    '& .MuiLinearProgress-bar': {
      backgroundColor: theme.newColors.primary[500],
    },
  },
  logs: {},
}));

const ImportLog = () => {
  const { t } = useTranslation(['importFile', 'common']);
  const classes = useStyles();
  const importLogs = useSelector((state) => state.Import.importLogs);
  const importStatus = useSelector((state) => state.Import.importStatus);
  const importProgress = useSelector((state) => state.Import.importProgress) || {
    completed: 0,
    total: 0,
    skipped: 0,
    passed: 0,
  };
  const isProgress = importStatus === IMPORT_STATUS.PROCESSING;
  const importLogSuccess = importLogs?.filter((log) => !!log.master)?.[0] || {
    total: 0,
    skipped: 0,
    invited: 0,
  };
  const logs = importLogs?.filter((log) => !log.master);
  const invited =
    importStatus === IMPORT_STATUS.PROCESSING
      ? importProgress.completed
      : importLogSuccess.invited;

  const percent =
    importProgress.total === 0 || isEmpty(importProgress)
      ? 0
      : ((importProgress?.passed ?? 0) / importProgress.total) * 100;
  const status = Object.keys(IMPORT_STATUS)
    .find((key) => IMPORT_STATUS[key] === importStatus)
    .toLowerCase();
  return (
    <Box className={classes.root}>
      <Box>
        <Box display='flex' justifyContent='space-between' mb={3}>
          <Typography variant='bodyMedium'>{t(`common:${status}`)}</Typography>
          <Typography variant='bodyMedium'>
            {t('common:invited')}: {invited}
          </Typography>
        </Box>
      </Box>
      {isProgress && (
        <LinearProgress
          className={classes.progress}
          value={percent}
          variant='determinate'
        />
      )}
      <Box mt={2}>
        <Typography variant='labelLarge'>{t('common:logs')}</Typography>
        <Box mb={1} />
        <Divider width='100%' />
        <Box mb={1} />
        <TblCustomScrollbar maxHeightScroll={300}>
          {logs.map((log) => {
            const message = `Row [${log.row}]: ${log.reason}`;
            if (!log.master) {
              return (
                <Box mb={0.25}>
                  <Typography variant='bodyMedium'>{message}</Typography>
                </Box>
              );
            }
            return null;
          })}
        </TblCustomScrollbar>
      </Box>
    </Box>
  );
};

ImportLog.propTypes = {};

export default ImportLog;
