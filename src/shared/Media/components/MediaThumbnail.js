import React, { Suspense } from 'react';
import VisibilitySensor from 'react-visibility-sensor';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Fade from '@mui/material/Fade';
import Grid from '@mui/material/Grid';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import withStyles from '@mui/styles/withStyles';

import TabulaCheckbox from 'components/TblCheckBox';
import TblIconButton from 'components/TblIconButton';

import cutOffFileName from 'utils/cutOffFileName';
import { checkLoadImageSupport } from 'utils/file';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import { getIconByExt } from 'utils';

import Image from './Image';
import styles from './mediaStyled';
class MediaThumbnail extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    media: PropTypes.object,
    selected: PropTypes.bool,
    multiple: PropTypes.bool,
    selectedMode: PropTypes.bool,
    onClick: PropTypes.func,
    t: PropTypes.func,
    onDeleteMedia: PropTypes.func,
    isDeleting: PropTypes.bool,
    classes: PropTypes.object,
    checked: PropTypes.bool,
  };

  state = {
    isShowContextMenu: false,
  };

  getImage = (m) => {
    if (
      m.mimetype.indexOf('image') !== -1 &&
      m.filename &&
      checkLoadImageSupport(m.filename)
    ) {
      return (
        <Suspense fallback={<CircularProgress />}>
          <Image
            images={[
              `${process.env.REACT_APP_API_MEDIA}/thumbnail/${m.filename}`,
              `${m.url}`,
              '""',
            ]}
          />
        </Suspense>
      );
    }
    const { classes } = this.props;
    return (
      <Box
        display='flex'
        alignContent='center'
        justifyContent='center'
        alignItems='center'
        className={classes.noreview}
      >
        <p>Preview Not Available</p>
      </Box>
    );
  };

  toggleShowContextMenu = (e) => {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }
    this.setState({ isShowContextMenu: !this.state.isShowContextMenu });
  };

  onClickDeleteMedia = (e, media) => {
    if (e && e.domEvent && e.domEvent.stopPropagation) {
      e.domEvent.stopPropagation();
    }
    this.props.onDeleteMedia(media);
    this.toggleShowContextMenu();
  };

  render() {
    const { media, multiple, onClick, selectedMode, t, classes, checked } =
      this.props;
    const { isShowContextMenu } = this.state;
    // const { selected } = this.state;
    // const icon = getIcon(media.mimetype);
    // console.log(checked, multiple, selectedMode);
    const icon = getIconByExt(media.filename);
    return (
      <VisibilitySensor partialVisibility={true} scrollCheck={true}>
        {({ isVisible }) => (
          <Fade in={isVisible} timeout={1000}>
            <Grid item lg={4} md={4} xs={6} className={classes.root}>
              <Paper
                className={clsx(classes.paper, {
                  [classes.selected]: media.selected,
                  'multi-select': multiple,
                  single: !multiple,
                })}
                onClick={onClick}
              >
                <Box
                  display='flex'
                  className={`cover ${classes.cover}`}
                  justifyContent='center'
                >
                  {multiple && selectedMode && (
                    <TabulaCheckbox
                      // checked={!!media.selected}
                      checked={!!checked}
                      className={classes.checkbox}
                      value={media.name}
                    />
                  )}
                  {isVisible ? this.getImage(media) : null}
                </Box>
                <Box
                  className={classes.title}
                  display='flex'
                  alignItems='center'
                >
                  <span className={icon} />
                  <Tooltip placement='top-start' title={media.originalName}>
                    <span>{cutOffFileName(media.originalName, 15)}</span>
                  </Tooltip>
                </Box>
                <div className='image-header'>
                  {
                    // isVisible && !media.selected &&
                    <div className='context-menu-wrapper'>
                      <Menu
                        onVisibleChange={this.toggleShowContextMenu}
                        visible={isShowContextMenu}
                        trigger={['click']}
                        placement='bottomRight'
                        getPopupContainer={(triggerNode) =>
                          triggerNode.parentNode
                        }
                      >
                        <MenuItem
                          key='1'
                          onClick={(e) => this.onClickDeleteMedia(e, media)}
                        >
                          {t('remove')}
                        </MenuItem>
                        <TblIconButton
                          className='icon-icn_more_w_circle'
                          onClick={(e) => this.toggleShowContextMenu(e)}
                        />
                      </Menu>
                    </div>
                  }
                </div>
              </Paper>
            </Grid>
          </Fade>
        )}
      </VisibilitySensor>
    );
  }
}

export default withStyles(styles)(MediaThumbnail);
