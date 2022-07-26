import React, { useEffect, useState } from 'react';
// material-ui
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import { Box, LinearProgress, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

import TblButton from 'components/TblButton';
import withReducer from 'components/TblWithReducer';

import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';

import reducers from '../reducers';
import { IMPORT_STATUS } from '../utils';

const useStyles = makeStyles((theme) => ({
  root: {},
  importingBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: theme.spacing(15.25),
    height: theme.spacing(4.75),
    color: 'white',
    backgroundColor: theme.newColors.primary[50],
    borderRadius: theme.borderRadius.default,
  },
  progress: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: theme.borderRadius.default,
    backgroundColor: theme.newColors.primary[50],

    '& .MuiLinearProgress-bar': {
      backgroundColor: theme.newColors.primary[500],
    },
  },
}));

const ImportButton = (props) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const { onClick } = props;
  const importStatus = useSelector((state) => state.Import.importStatus);
  const importProgress = useSelector((state) => state.Import.importProgress) || {
    completed: 0,
    total: 0,
  };
  const percent =
    importProgress.total === 0 || isEmpty(importProgress)
      ? 0
      : (importProgress.completed / importProgress.total) * 100;
  const [buttonText, setButtonText] = useState(t('importFile:import'));
  useEffect(() => {
    setButtonText(
      importStatus === IMPORT_STATUS.PROCESSING
        ? 'Importing'
        : t('importFile:import')
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [importStatus]);

  return importStatus === IMPORT_STATUS.PROCESSING ? (
    <Box className={classes.importingBtn}>
      <LinearProgress
        className={classes.progress}
        variant='determinate'
        value={percent}
      />
      <Box
        display='flex'
        flexDirection='row'
        alignItems='center'
        sx={{ zIndex: 99 }}
      >
        <FileUploadOutlinedIcon sx={{ marginRight: '8px', fontSize: '18px' }} />{' '}
        <Typography component='div' variant='labelLarge'>
          {' '}
          {buttonText}
        </Typography>
      </Box>
    </Box>
  ) : (
    <TblButton color='primary' variant='contained' onClick={onClick}>
      <FileUploadOutlinedIcon sx={{ marginRight: '8px', fontSize: '18px' }} />{' '}
      <span> {buttonText}</span>
    </TblButton>
  );
};

ImportButton.propTypes = {
  onClick: PropTypes.func,
};
const ImportButtonWithReducer = withReducer('Import', reducers)(ImportButton);

export default ImportButtonWithReducer;
