import React from 'react';
import { useTranslation } from 'react-i18next';

import CancelIcon from '@mui/icons-material/Cancel';
import DownloadIcon from '@mui/icons-material/Download';
import { Box, Tooltip, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';

import TblIconButton from 'components/TblIconButton';

import { getMaterialIconByExt } from 'utils/getMaterialIconByExt';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import { splitNameAndExtension } from 'utils';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    minHeight: theme.spacing(6),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: theme.spacing(1),
    justifyContent: 'space-between',
    boxShadow: 'inset 0px -1px 0px rgba(0, 0, 0, 0.07)',
    '&:last-child': {
      boxShadow: 'none',
    },
  },
  nameGroup: {
    display: 'flex',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  name: {
    marginLeft: theme.spacing(1.25),
    color: theme.newColors.gray[900],
    width: theme.spacing(40),
  },
  icon: {
    width: theme.spacing(2.5),
    height: theme.spacing(2.5),
    marginRight: theme.spacing(1),
  },
  btnGroup: {
    display: 'flex',
  },
  fileIcon: (props) => ({
    fontSize: theme.fontSizeIcon.normal,
    display: 'flex',
    alignItems: 'center',
    marginLeft: props?.noMarginLeft ? 0 : '8px',
  }),

  removeBtn: {
    color: `${theme.newColors.gray[500] }!important`,
  },
}));

const useStylesBootstrap = makeStyles((theme) => ({
  arrow: {
    fontSize: 5,
    color: theme.palette.common.black,
  },
  tooltip: {
    padding: theme.spacing(1),
    fontSize: theme.fontSize.normal,
    borderRadius: theme.borderRadius.default,
    backgroundColor: theme.palette.common.black,
  },
}));

function BootstrapTooltip(props) {
  const classes = useStylesBootstrap();

  return <Tooltip arrow classes={classes} {...props} />;
}

function AttachmentFile(props) {
  const {
    item,
    openFile,
    onRemove,
    onPreviewFiles,
    onDownload,
    hasPermission,
    name,
  } = props;
  const classes = useStyles(props);
  const { t } = useTranslation();
  const renderIcon = () => getMaterialIconByExt(
      splitNameAndExtension(item?.originalName ?? ''),
      item
    );
  return (
    <Box className={classes.root} onClick={() => onPreviewFiles(item)}>
      <Box className={classes.nameGroup} onClick={openFile}>
        <Box className={classes.fileIcon}>{renderIcon()}</Box>
        <Typography
          variant='bodyMedium'
          className={clsx(classes.name, 'text-ellipsis')}
        >
          {name}
        </Typography>
      </Box>
      <Box className={classes.btnGroup}>
        {onDownload && (
          <TblIconButton
            className={classes.removeBtn}
            onClick={(e) => onDownload(e, item)}
          >
            <DownloadIcon />
          </TblIconButton>
        )}
        {onRemove && (
          <BootstrapTooltip title={t('common:remove')} placement='top'>
          <span>
            <TblIconButton
                className={classes.removeBtn}
                disabled={!hasPermission}
                onClick={(e) => onRemove(e, item)}
              >
                <CancelIcon />
              </TblIconButton>
          </span>
          </BootstrapTooltip>
        )}
      </Box>
    </Box>
  );
}

AttachmentFile.propTypes = {
  hasPermission: PropTypes.any,
  item: PropTypes.shape({
    id: PropTypes.string,
    mineType: PropTypes.string,
    originalName: PropTypes.string,
    url: PropTypes.string
  }),
  name: PropTypes.string,
  onDownload: PropTypes.func,
  onPreviewFiles: PropTypes.func,
  onRemove: PropTypes.func,
  openFile: PropTypes.bool,
};

export default AttachmentFile;
