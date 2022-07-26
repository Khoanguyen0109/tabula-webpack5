import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { Grid } from '@mui/material';
import { Typography } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import makeStyles from '@mui/styles/makeStyles';

import TblIconButton from 'components/TblIconButton';
import TblTooltip from 'components/TblTooltip';

import useDownLoadGoogleFile from 'utils/customHook/useDownLoadGoogleFile';
import { getMaterialIconByExt } from 'utils/getMaterialIconByExt';

import commonActions from 'shared/Common/actions';
import { GOOGLE_FILES_SUPPORTED } from 'shared/Google/constants';

import PropTypes from 'prop-types';
import { getExt } from 'utils';
import { splitNameAndExtension } from 'utils';

import { MEDIA_TYPES } from '../../Media/constants';

const useStyles = makeStyles((theme) => ({
  fileRow: (props) => ({
    cursor: 'pointer',
    color: theme.mainColors.primary1[0],

    '&:hover': {
      background: theme.newColors.gray[500],
      color: `${theme.mainColors.primary2[0]} !important`,

      '& .icon': {
        '&.icon-icn_download': {
          visibility: 'visible',
        },
      },
    },
    borderRadius: 4,
    marginLeft: props?.noMarginLeft ? 0 : '8px',
    height: 32,

    '& .icon': {
      fontSize: theme.fontSizeIcon.medium,
      display: 'flex',
      justifyContent: 'center',
      '&.icon-icn_download': {
        visibility: 'hidden',
      },
    },
  }),
  fileIcon: (props) => ({
    fontSize: theme.fontSizeIcon.normal,
    display: 'flex',
    alignItems: 'center',
    marginLeft: props?.noMarginLeft ? 0 : '8px',
  }),
  fileName: {
    maxWidth: 'calc(100% - 130px)',
    fontSize: theme.fontSize.normal,
    marginLeft: theme.spacing(1),
  },

  actionIcon: {
    marginLeft: 'auto',
  },
}));
function AttachmentItem(props) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { t } = useTranslation(['myCourses', 'common']);
  const {
    index,
    item,
    viewOnly,
    previewFiles,
    isViewAndDownload,
    handleClickMore,
    handleCloseMoreMenu,
    anchorEl,
    menu,
    deleteFile,
    download,
    isDisableAction,
  } = props;
  const downloadGoogleFile = useDownLoadGoogleFile(item);
  const [disableDownload, setDisableDownload] = useState(false);
  useEffect(() => {
    const listGoogleSupport = Object.values(GOOGLE_FILES_SUPPORTED);
    if (
      item.mediaType === MEDIA_TYPES.GOOGLE_DRIVE_FILE &&
      item.mimetype.match(/google-apps/g) &&
      !listGoogleSupport.includes(item.mimetype)
    ) {
      setDisableDownload(true);
    } else {
      setDisableDownload(false);
    }
  }, [item]);
  const downloadFile = (e) => {
    handleCloseMoreMenu();
    const payload = {
      filename: item.filename,
      originalname: item.originalName,
      mimetype: item.mimetype,
    };
    e.stopPropagation();
    if (download) {
      download(item);
    } else {
      dispatch(
        commonActions.download({
          param: payload,
        })
      );
    }
  };

  const downloadFunction = (e) => {
    if (item.mediaType !== MEDIA_TYPES.GOOGLE_DRIVE_FILE) {
      downloadFile(e);
    } else {
      downloadGoogleFile(item);
    }
  };

  const renderContextMenu = (item) => {
    if (menu) {
      return menu;
    }
    return [
      <MenuItem onClick={() => previewFiles(item)}>
        {t('common:preview')}
      </MenuItem>,
      <Tooltip
        title={disableDownload ? t('common:can_not_download_gg_files') : ''}
      >
        <div>
          <MenuItem
            disabled={disableDownload}
            onClick={(e) => downloadFunction(e)}
          >
            {t('common:download')}
          </MenuItem>
        </div>
      </Tooltip>,
      !viewOnly && !isDisableAction && (
        <MenuItem
          onClick={() => deleteFile(item)}
          className={classes.removeText}
        >
          {t('common:delete')}
        </MenuItem>
      ),
    ];
  };

  const renderName = () => {
    if (item.mediaType === MEDIA_TYPES.GOOGLE_DRIVE_FILE) {
      return item.originalName;
    }
    return splitNameAndExtension(item.originalName, 'name');
  };

  const renderIcon = () => getMaterialIconByExt(
      splitNameAndExtension(item?.originalName ?? ''),
      item
    );

  return (
    <TblTooltip title={renderName()} placement='top-start'>
      <Grid
        container
        wrap='nowrap'
        direction='row'
        alignItems='center'
        key={`attach-${index}`}
        className={classes.fileRow}
      >
        <Grid className={classes.fileIcon}>{renderIcon()}</Grid>
        <Grid className={classes.fileName} onClick={() => previewFiles(item)}>
          <Typography noWrap>{renderName()}</Typography>
        </Grid>

        {item.mediaType !== MEDIA_TYPES.GOOGLE_DRIVE_FILE && (
          <Grid>{`.${getExt(item.originalName)}`}</Grid>
        )}
        {!isViewAndDownload ? (
          <Grid className={classes.actionIcon}>
            {/* {!viewOnly && ( */}
            <div>
              <TblIconButton
                onClick={(event) => handleClickMore(item.id, event)}
              >
                <span className='icon-icn_more' />
              </TblIconButton>
              <Paper>
                <Menu
                  id='more-menu'
                  anchorEl={anchorEl[item.id]}
                  keepMounted
                  open={Boolean(anchorEl[item.id])}
                  onClose={handleCloseMoreMenu}
                  classes={{ paper: classes.paper }}
                >
                  {renderContextMenu(item, handleCloseMoreMenu)}
                </Menu>
              </Paper>
            </div>
            {/* )} */}
          </Grid>
        ) : (
          <Grid className={classes.actionIcon} onClick={(e) => downloadFile(e)}>
            <span className='icon icon-icn_download' />
          </Grid>
        )}
      </Grid>
    </TblTooltip>
  );
}

AttachmentItem.propTypes = {
  anchorEl: PropTypes.any,
  deleteFile: PropTypes.func,
  download: PropTypes.func,
  handleClickMore: PropTypes.func,
  handleCloseMoreMenu: PropTypes.func,
  index: PropTypes.any,
  isViewAndDownload: PropTypes.any,
  item: PropTypes.shape({
    filename: PropTypes.any,
    id: PropTypes.any,
    mediaType: PropTypes.number,
    mimetype: PropTypes.string,
    originalName: PropTypes.string,
  }),
  menu: PropTypes.any,
  previewFiles: PropTypes.func,
  viewOnly: PropTypes.bool,
  isDisableAction: PropTypes.bool,
};
AttachmentItem.defaultProps = {
  isDisableAction: false,
};
export default AttachmentItem;
