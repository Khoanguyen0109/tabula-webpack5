import React from 'react';
import { withTranslation } from 'react-i18next';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { connect } from 'react-redux';

import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import unionBy from 'lodash/unionBy';

import FilterListIcon from '@mui/icons-material/FilterList';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import withStyles from '@mui/styles/withStyles';

import TblButton from 'components/TblButton';
import TblCheckbox from 'components/TblCheckBox';
import Drawer from 'components/TblDrawer';
import TblIconButton from 'components/TblIconButton';
import TblInputs from 'components/TblInputs';
import withReducer from 'components/TblWithReducer';

import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { getExt } from 'utils';

import mediaActions from '../actions';
import MediaThumbnail from '../components/MediaThumbnail';
import Upload from '../components/Upload';
import { EXT } from '../constants';
import reducer from '../reducers';

import styles from './styled';

const applyFilter = (media, filters) => {
  if (filters.all) {
    return media;
  }
  return media.filter((m) => {
    const ext = `.${getExt(m.filename)}`;
    return (
      (filters.image && EXT.IMAGES.indexOf(ext) !== -1) ||
      (filters.video && EXT.VIDEO.indexOf(ext) !== -1) ||
      (filters.audio && EXT.AUDIO.indexOf(ext) !== -1)
    );
  });
};

const applySearch = (media, search) => media.filter(
    (m) => m.originalName.toLowerCase().indexOf(search.toLowerCase()) !== -1
  );

class Media extends React.PureComponent {
  constructor(props) {
    super(props);
    this.menuRef = React.createRef();
    this.state = {
      percent: 0,
      fileProgress: {},
      mediaType: props.mediaType || 'image',
      media: [],
      fileList: [],
      countSelected: 0,
      visibleFilter: false,
      errorMsg: '',
      callback: {},
      search: '',
      openMenu: false,
      menuSelected: props.titleListFile,
      filters: {
        all: true,
        image: true,
        video: true,
        audio: true,
      },
      checked: [],
    };
  }

  static getDerivedStateFromProps(nextProps, state) {
    if (
      nextProps.media &&
      !state.ownUpdate &&
      !isEqual(nextProps.media, state.media)
    ) {
      const selectedList = state.media
        .filter((m) => m.selected)
        .map((m) => m.id);
      let newMedia =
        nextProps?.media &&
        nextProps?.media?.map((m) => {
          if (selectedList.indexOf(m.id) !== -1) {
            return { ...m, selected: true };
          }
          return m;
        });

      //Apply filter
      newMedia = applyFilter(newMedia, state.filters);
      //Apply search
      newMedia = applySearch(newMedia, state.search);
      return { media: newMedia, ownUpdate: false };
    }
    return null;
  }

  componentDidMount() {
    const { mediaType } = this.state;
    // const { visible } = this.props;
    // if(visible) {
    // console.log(';mount');
    if (mediaType === 'image') {
      this.props.mediaActions.mediaFetchImages({ fetching: true });
    } else {
      this.props.mediaActions.mediaFetch({ fetching: true });
    }
    // }
  }

  changeFilter = (key) => {
    const { filters } = this.state;
    filters[key] = !filters[key];
    if (key !== 'all') {
      filters.all = filters.image && filters.video && filters.audio;
    } else {
      filters.image = filters.video = filters.audio = filters.all;
    }
    this.setState({ filters, visibleFilter: true, ownUpdate: true }, () => {
      this.appFilter();
    });
  };

  fetchMedia = () => {
    const { mediaType } = this.state;
    if (mediaType === 'image') {
      this.props.mediaActions.mediaFetchImages({ fetching: true });
    } else {
      this.props.mediaActions.mediaFetch({ fetching: true });
    }
  };

  onSelectItem = (selectMedia) => {
    const { validateFunc, multiple } = this.props;
    const { checked } = this.state;
    // let count = 0;
    // const media = this.state.media.map((m) => {
    //   if (m.id === selectMedia.id) {
    //     if (!selectMedia.selected) {
    //       count++;
    //     }
    //     return { ...m, selected: !selectMedia.selected };
    //   } else if (!multiple) {
    //     return { ...m, selected: false };
    //   }
    //   if (m.selected) {
    //     count++;
    //   }
    //   return m;
    // });

    // Fixed: TL-1933: update error message when selected item.
    // const selectedList = media.filter((m) => m.selected);

    // console.log(e);

    const currentIndex = checked?.findIndex((t) => t.id === selectMedia.id);
    const newChecked = [...checked];
    if (currentIndex === -1) {
      newChecked.push(selectMedia);
    } else if (currentIndex !== -1) {
      newChecked.splice(currentIndex, 1);
    }
    // console.log(newChecked);
    // this.setState({ media, ownUpdate: true, countSelected: count }, () => {
    this.setState(
      {
        checked: newChecked,
        ownUpdate: true,
        countSelected: newChecked.length,
      },
      () => {
        if (!multiple) {
          this.onSelect();
        }
      }
    );
    if (validateFunc) {
      const errorMsg = validateFunc(newChecked);
      this.setState({ errorMsg: typeof errorMsg === 'string' ? errorMsg : '' });
    }
  };

  onSelect = () => {
    const { validateFunc, onSelect, multiple } = this.props;
    const { checked } = this.state;
    // const selectedList = media.filter(m => m.selected);
    if (validateFunc) {
      const errorMsg = validateFunc(checked);
      if (typeof errorMsg === 'string') {
        this.setState({ errorMsg });
        return;
      }
    }
    //Fallback for previous components
    if (onSelect) {
      onSelect(multiple ? checked : checked[0]);
    }
    this.onClose();
  };

  onClose = () => {
    this.setState(
      {
        ownUpdate: false,
        media: [],
        checked: [],
        search: '',
        countSelected: 0,
        errorMsg: null,
        openMenu: false,
        anchorEl: null,
      },
      () => {
        this.props.onClose();
      }
    );
  };

  renderMedia = () => {
    const { multiple, t, deletingFiles, visible } = this.props;
    if (!visible) {
      return null;
    }
    const { media, countSelected } = this.state;
    return media?.map((item) => (
      <MediaThumbnail
        key={item.id}
        checked={
          !!this.state.checked?.find(
            (checkedItem) => checkedItem.id === item.id
          )
        }
        isDeleting={deletingFiles[item.id] || false}
        onDeleteMedia={this.showWarningModal}
        t={t}
        media={item}
        selectedMode={!!countSelected}
        multiple={multiple}
        onClick={(e) => this.onSelectItem(item, e)}
      />
    ));
    // const results = [];
    // let item = null;
    // for (let i = 0; i < media.length; i++) {
    //   item = media[i];
    //   results.push(<MediaThumbnail key={item.id}
    //     checked={
    //       !!this.state.checked?.find(
    //         (checkedItem) => checkedItem.id === item.id
    //       )
    //     }
    //     isDeleting={deletingFiles[item.id] || false} onDeleteMedia={this.showWarningModal} t={t} media={item} selectedMode={!!countSelected} multiple={multiple}
    //     onClick={(e) => this.onSelectItem(item, e)} />);
    // }
    // return results;
  };

  unSelectAll = () => 
    // const media = this.state.media.map((m) => ({ ...m, selected: false }));
    // NOTE: Fix bug 1652 when unSelectAll do not reset error message
     this.setState({ checked: [], countSelected: 0, errorMsg: '' })
  ;

  drawerTitle = () => {
    const { title, classes } = this.props;
    return (
      <Typography variant='headingSmall' className={classes.title}>
        {title}
      </Typography>
    );
  };

  // onSelectMenu = (value) => {
  //   const { filters } = this.state;
  //   filters[value] = !filters[value];
  //   this.setState({filters});
  // }

  // appFilterSearch = () => {
  //   const { search, filters } = this.state;
  //   const { media } = this.props;
  //   // Not implete filter yet
  //   let mediaList = applyFilter(media, filters);
  //   if (search) {
  //     mediaList = applySearch(mediaList, search);
  //   }

  //   this.setState({ media: mediaList });
  // }

  onSearch = (e) => {
    this.setState({ search: e.target.value }, () => {
      this.appFilterSearch();
    });
  };

  appFilterSearch = () => {
    const { search, filters, media } = this.state;
    // const { media } = this.props;
    // let mediaList = applyFilter(media, filters);
    // if (search) {
    //   mediaList = applySearch(mediaList, search);
    //   this.setState({ media: mediaList, ownUpdate: true });
    // } else {
    //   this.setState({
    //     media: unionBy(media, this.props.media, 'id'),
    //     ownUpdate: true,
    //   });
    // }
    const mediaFilter = search ? media : unionBy(media, this.props.media, 'id');
    let mediaList = applyFilter(mediaFilter, filters);
    if (search) {
      mediaList = applySearch(mediaList, search);
    }
    this.setState({ media: mediaList, ownUpdate: true });
  };
  appFilter = () => {
    const { search, filters } = this.state;
    const { media } = this.props;
    let mediaList = applyFilter(media, filters);
    mediaList = applySearch(mediaList, search);

    this.setState({ media: mediaList, ownUpdate: true });
  };

  render() {
    const { visible, classes, multiple, t, accept, max } = this.props;
    const {
      countSelected,
      errorMsg,
      search,
      openMenu,
      anchorEl,
      filters,
      media,
    } = this.state;
    const delta = 242;
    const windowHeight = window.innerHeight;

    return (
      <Drawer
        open={visible}
        anchor='right'
        variant='temporary'
        className={classes.root}
        id='media-lib'
      >
        {this.drawerTitle()}
        <Grid container>
          <Grid item lg={8} md={8} xs={8} className={classes.left}>
            <Grid container direction='row' alignItems='center'>
              <Grid lg={4} md={2} item className='title'>
                <Typography variant='labelLarge'>{t('All Files')}</Typography>
              </Grid>
              <Grid item lg={3} md={4} />
              <Grid item lg={5} md={6}>
                <Box display='flex' className={classes.boxSearch}>
                  <TblInputs
                    value={search}
                    placeholder={t('Search')}
                    onChange={(e) => {
                      e.persist();
                      this.onSearch(e);
                    }}
                    hasSearchIcon={true}
                    hasClearIcon={true}
                  />
                  <TblIconButton
                    className={classes.dropdownButton}
                    aria-controls='simple-menu'
                    aria-haspopup='true'
                    onClick={(e) =>
                      this.setState({
                        openMenu: true,
                        anchorEl: e.currentTarget,
                      })
                    }
                  >
                    <FilterListIcon />
                  </TblIconButton>
                  <Menu
                    keepMounted
                    anchorEl={anchorEl}
                    open={openMenu}
                    onClose={() => this.setState({ openMenu: false })}
                    className={classes.filterMenu}
                  >
                    <MenuItem onClick={() => this.changeFilter('all')}>
                      <TblCheckbox checked={filters.all} />
                      {t('All Files')}
                    </MenuItem>
                    <MenuItem onClick={() => this.changeFilter('image')}>
                      <TblCheckbox checked={filters.image} />
                      {t('Image')}
                    </MenuItem>
                    <MenuItem onClick={() => this.changeFilter('video')}>
                      <TblCheckbox checked={filters.video} />
                      {t('Video')}
                    </MenuItem>
                    <MenuItem onClick={() => this.changeFilter('audio')}>
                      <TblCheckbox checked={filters.audio} />
                      {t('Audio')}
                    </MenuItem>
                  </Menu>
                </Box>
              </Grid>
            </Grid>
            {max && (
              <Box mb={2} className={!!errorMsg ? classes.error : classes.note}>
                {t('common:additional_information', { max: max })}
              </Box>
            )}

            <PerfectScrollbar style={{ height: windowHeight - delta }}>
              {isEmpty(media) ? (
                <Typography className='emptyText' color='primary'>
                  {t('common:empty')}
                </Typography>
              ) : (
                <Grid
                  container
                  className={`${classes.thumbnails} ${
                    search ? 'searching' : ''
                  }`}
                  spacing={3}
                >
                  {this.renderMedia()}
                </Grid>
              )}
            </PerfectScrollbar>
            <Grid
              container
              alignContent='center'
              direction='row'
              justifyContent='space-between'
              className={classes.drawerAction}
            >
              <div className='left-actions'>
                <TblButton
                  variant='outlined'
                  color='primary'
                  onClick={this.onClose}
                >
                  {t('common:cancel')}
                </TblButton>
                {multiple && !!countSelected && (
                  <TblButton
                    variant='outlined'
                    color='primary'
                    onClick={this.unSelectAll}
                  >
                    {t('Uncheck all')}
                  </TblButton>
                )}
              </div>
              {multiple && !!countSelected && (
                <div className='right-actions'>
                  <TblButton
                    variant='contained'
                    color='primary'
                    disabled={!!errorMsg}
                    onClick={this.onSelect}
                  >
                    {t('Select')}
                  </TblButton>
                </div>
              )}
            </Grid>
          </Grid>
          <Grid item lg={4} md={4} xs={4} className={classes.right}>
            <Grid lg={4} md={2} item className='title'>
              <Typography variant='labelLarge'>{t('file_upload')}</Typography>
            </Grid>
            <Upload accept={accept} t={t} fetchMedia={this.fetchMedia} />
          </Grid>
        </Grid>
      </Drawer>
    );
  }
}
Media.propTypes = {
  classes: PropTypes.object,
  mediaActions: PropTypes.object,
  history: PropTypes.object,
  onSave: PropTypes.func,
  onClose: PropTypes.func,
  visible: PropTypes.bool,
  showThumbnail: PropTypes.bool,
  title: PropTypes.string,
  titleListFile: PropTypes.string,
  accept: PropTypes.string.isRequired,
  listFileDescription: PropTypes.string,
  className: PropTypes.string,
  mediaType: PropTypes.string,
  onSelect: PropTypes.func,
  media: PropTypes.array,
  max: PropTypes.number,
  isShouldUpdateData: PropTypes.bool,
  multiple: PropTypes.bool,
  t: PropTypes.func,
  validateFunc: PropTypes.func,
  deletingFiles: PropTypes.object,
};
Media.defaultProps = {
  title: 'Attachment Library',
  titleListFile: 'All Files',
  accept: '',
};
const mapStateToProps = (state) => ({
  media: state.Media.media,
  fetching: state.Media.fetching,
  errors: state.Media.errors,
  deletingFiles: state.Media.deletingFiles,
});

const mapDispatchToProps = (dispatch) => ({
  mediaActions: bindActionCreators(mediaActions, dispatch),
});
const MediaStyled = withStyles(styles)(Media);
export default flowRight(
  withReducer('Media', reducer),
  withTranslation(['media', 'common']),
  connect(mapStateToProps, mapDispatchToProps)
)(MediaStyled);
