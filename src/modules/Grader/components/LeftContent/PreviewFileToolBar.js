import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import FullscreenIcon from '@mui/icons-material/Fullscreen';
import GetAppIcon from '@mui/icons-material/GetApp';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Box, Divider, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

import TblIconButton from 'components/TblIconButton';
import TblTooltip from 'components/TblTooltip';

import { getMaterialIconByExt } from 'utils/getMaterialIconByExt';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import { splitNameAndExtension } from 'utils';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: theme.spacing(7),
    padding: theme.spacing(2),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',

    '& .MuiIconButton-root.Mui-disabled': {
      backgroundColor: theme.newColors.gray[50],
    },
  },
  iconBtn: {
    backgroundColor: theme.newColors.gray[50],
    color: theme.newColors.gray[900],
  },
  fileName: {
    marginLeft: theme.spacing(2),
    color: theme.newColors.gray[900],
    fontSize: theme.fontSize.normal,
    fontWeight: theme.fontWeight.normal,
    maxWidth: theme.spacing(40),
  },
  fileCount: {
    color: theme.newColors.gray[900],
    fontSize: theme.fontSize.normal,
    fontWeight: theme.fontWeight.normal,
    marginRight: theme.spacing(2),
  },
}));
function PreviewFileToolBar(props) {
  const classes = useStyles();
  const { t } = useTranslation('grader');
  const {
    file,
    indexOfFileSelected,
    downloadFile,
    onNext,
    onPrevious,
    onFullScreen,
  } = props;
  const attemptSelected = useSelector((state) => state.Grader.attemptSelected);
  const isDisable = !attemptSelected || !file;
  const totalFile = attemptSelected?.studentSubmittedFiles?.length || 0;
  return (
    <Box className={classes.root}>
      <Box display='flex' alignItems='center'>
        <Box className={classes.iconBtn}>
          {file &&
            getMaterialIconByExt(
              splitNameAndExtension(file.originalName ?? ''),
              file
            )}
        </Box>
        <Typography className={clsx(classes.fileName, 'text-ellipsis')}>
          {file?.originalName || ''}
        </Typography>
      </Box>
      <Box display='flex' alignItems='center'>
        <Box mr={2}>
          <TblIconButton
            className={classes.iconBtn}
            onClick={onFullScreen}
            disabled={isDisable}
          >
            <FullscreenIcon />
          </TblIconButton>
        </Box>
        <Box mr={2}>
          <TblIconButton
            disabled={isDisable}
            className={classes.iconBtn}
            onClick={() => downloadFile()}
          >
            <GetAppIcon />
          </TblIconButton>
        </Box>

        <Box display='flex' marginRight={2} height={24}>
          <Divider orientation='vertical' flexItem />
        </Box>
        <Typography className={classes.fileCount}>
          {t('file_index_on_total', {
            index: indexOfFileSelected,
            total: totalFile,
          })}
        </Typography>
        <Box mr={1}>
          <TblIconButton
            disabled={isDisable || indexOfFileSelected === 1}
            className={classes.iconBtn}
            onClick={() => onPrevious()}
          >
            <TblTooltip
              title={t('previous_file')}
              placement='top'
              arrow
            >
              <NavigateBeforeIcon />
            </TblTooltip>
          </TblIconButton>
        </Box>
        <Box>
          <TblIconButton
            disabled={isDisable || indexOfFileSelected === totalFile}
            className={classes.iconBtn}
            onClick={() => onNext()}
          >
            <TblTooltip title={t('next_file')} placement='top' arrow>
              <NavigateNextIcon />
            </TblTooltip>
          </TblIconButton>
        </Box>
      </Box>
    </Box>
  );
}

PreviewFileToolBar.propTypes = {
  downloadFile: PropTypes.func,
  file: PropTypes.shape({
    originalName: PropTypes.string,
  }),
  indexOfFileSelected: PropTypes.number,
  onFullScreen: PropTypes.func,
  onNext: PropTypes.func,
  onPrevious: PropTypes.func,
};

export default PreviewFileToolBar;
