import React from 'react';
import { connect } from 'react-redux';

import compose from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';
import union from 'lodash/union';

import CheckCircleSharpIcon from '@mui/icons-material/CheckCircleSharp';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import withStyles from '@mui/styles/withStyles';

import TblActivityIcon from 'components/TblActivityIcon/icon';
import TblButton from 'components/TblButton';
import TblDialog from 'components/TblDialog';

import { COURSE_ITEM_TYPE } from 'utils/constants';

import { withSnackbar } from 'notistack';
import PropTypes from 'prop-types';

import myCoursesActions from '../../actions';

const styles = (theme) => ({
  icon: {
    fontSize: theme.fontSizeIcon.medium,
  },
  borderLeft: {
    width: theme.spacing(0.5),
    height: theme.spacing(4),
    backgroundColor: theme.newColors.gray[300],
  },
  iconWrapper: {
    height: theme.spacing(4),
    width: theme.spacing(4),
    borderRadius: theme.spacing(1),
  },
  publishedIcon: {
    color: theme.mainColors.green[0],
  },
  publishedBackground: {
    backgroundColor: theme.openColors.green[0],
  },
  noneColorBackground: {
    color: theme.openColors.white,
  },
  unPublishedIcon: {
    color: theme.mainColors.gray[6],
  },
  unPublishedBackground: {
    backgroundColor: theme.newColors.gray[300],
  },
});
class PublishShadowItemDialog extends React.PureComponent {
  componentDidUpdate(prevProps) {
    const {
      courseItemType,
      mcChangeShadowItemsStatusAtMasterLevelSuccess,
      t,
      shadowItemValidations,
      isInPlanningPage,
    } = this.props;
    if (this.props.open && this.props.open !== prevProps.open) {
      switch (courseItemType) {
        case COURSE_ITEM_TYPE.LESSON:
          this.getShadowItemValidations('lessons');
          break;
        case COURSE_ITEM_TYPE.ASSIGNMENT:
          this.getShadowItemValidations('assignments');
          break;
        case COURSE_ITEM_TYPE.QUIZ:
          this.getShadowItemValidations('quizzes');
          break;
        default:
          break;
      }
    }
    if (
      mcChangeShadowItemsStatusAtMasterLevelSuccess &&
      !prevProps.mcChangeShadowItemsStatusAtMasterLevelSuccess &&
      !!!isInPlanningPage
    ) {
      switch (courseItemType) {
        case COURSE_ITEM_TYPE.LESSON:
          this.getShadowItemValidations('lessons');
          break;
        case COURSE_ITEM_TYPE.ASSIGNMENT:
          this.getShadowItemValidations('assignments');
          break;
        case COURSE_ITEM_TYPE.QUIZ:
          this.getShadowItemValidations('quizzes');
          break;
        default:
          break;
      }
      let queueUpdate = {};
      const courseDayIds = union(
        shadowItemValidations.map((item) => item.courseDayId)
      );
      if (courseDayIds?.length > 0) {
        courseDayIds.forEach((id) => (queueUpdate[id] = true));
      }
      this.props.setState({ queueUpdate: { ...queueUpdate } });
      this.props.enqueueSnackbar(t('common:change_saved'), {
        variant: 'success',
      });
    }
  }

  getShadowItemValidations = (courseItemType = 'lessons') => {
    const {
      currentUser: { organizationId },
      courseId,
      unitId,
      dataItem,
    } = this.props;
    if (!!organizationId && !!courseId && !!unitId && !!dataItem?.id) {
      this.props.mcGetShadowItemValidations({
        orgId: organizationId,
        courseId,
        unitId,
        masterId: dataItem?.id,
        courseItemType,
        isFetchingShadowItemValidations: true,
      });
    }
  };

  publishShadowItemAtMasterLevel = () => {
    const {
      currentUser: { organizationId },
      courseId,
      unitId,
      dataItem,
      courseItemType,
    } = this.props;
    if (!!organizationId && !!courseId && !!unitId && !!dataItem?.id) {
      const payload = {
        orgId: organizationId,
        courseId,
        unitId,
        data: { status: 1 },
        masterId: dataItem?.id,
        isChangingShadowItemsStatusAtMasterLevel: true,
        mcChangeShadowItemsStatusAtMasterLevelSuccess: false,
      };
      switch (courseItemType) {
        case COURSE_ITEM_TYPE.LESSON:
          Object.assign(payload, { courseItemType: 'lessons' });
          break;
        case COURSE_ITEM_TYPE.ASSIGNMENT:
          Object.assign(payload, { courseItemType: 'assignments' });
          break;
        case COURSE_ITEM_TYPE.QUIZ:
          Object.assign(payload, { courseItemType: 'quizzes' });
          break;
        default:
          break;
      }
      this.props.mcChangeShadowItemsStatusAtMasterLevel(payload);
    }
  };

  renderActivityIcon = (courseItemType = -1) => {
    const { classes } = this.props;
    return <TblActivityIcon type={courseItemType} className={classes.icon} />;
  };

  renderSectionItem = (item = {}) => {
    const { classes } = this.props;
    if (!isEmpty(item)) {
      return (
        <Box
          display='flex'
          alignItems='center'
          mt={2}
          justifyContent='space-between'
          key={item?.id}
        >
          <Box display='flex' alignItems='center'>
            <div className={classes.borderLeft} />
            <Typography component='div' variant='bodyMedium'>
              <Box ml={2} fontSize='subtitle1.fontSize'>
                {item?.sectionName}
              </Box>
            </Typography>
          </Box>
          <Box
            className={`${classes.iconWrapper} ${
              item?.published
                ? classes.noneColorBackground
                : item?.publishable
                ? classes.publishedBackground
                : classes.unPublishedBackground
            }`}
            display='flex'
            alignItems='center'
            justifyContent='center'
          >
            {this.renderPublishedStatusIcon(item?.publishable, item?.published)}
          </Box>
        </Box>
      );
    }
  };

  renderPublishedStatusIcon = (publishable = false, published = false) => {
    const { classes } = this.props;
    if (published) {
      return (
        <CheckCircleSharpIcon
          className={`${classes.publishedIcon} ${classes.icon}`}
        />
      );
    } else if (publishable) {
      return (
        <LockOpenOutlinedIcon
          className={`${classes.publishedIcon} ${classes.icon}`}
        />
      );
    }
    return (
      <LockIcon className={`${classes.unPublishedIcon} ${classes.icon}`} />
    );
  };

  onClose = () => {
    const { onClose } = this.props;
    this.props.setState({ shadowItemValidations: [], error: {} });
    if (onClose) {
      onClose();
    }
  };

  render() {
    const {
      t,
      open,
      courseItemType,
      dataItem,
      shadowItemValidations,
      isFetchingShadowItemValidations,
      isChangingShadowItemsStatusAtMasterLevel,
    } = this.props;
    return (
      <TblDialog
        title={t('publish_shadow_items_in_bulk')}
        open={open}
        fullWidth={true}
        onClose={this.onClose}
        footer={
          <>
            <TblButton
              variant='outlined'
              color='primary'
              onClick={this.onClose}
            >
              {t('common:close')}
            </TblButton>
            <TblButton
              size='medium'
              variant='contained'
              color='primary'
              onClick={this.publishShadowItemAtMasterLevel}
              type='submit'
              disabled={isChangingShadowItemsStatusAtMasterLevel}
              isShowCircularProgress={isChangingShadowItemsStatusAtMasterLevel}
            >
              {t('publish_all')}
            </TblButton>
          </>
        }
      >
        <>
          <Box display='flex' alignItems='center'>
            <Box ml={0.5} display='flex' alignItems='center'>
              {this.renderActivityIcon(courseItemType)}
            </Box>
            <Typography component='div' variant='labelLarge'>
              <Box fontSize='subtitle1.fontSize' ml={1}>
                {dataItem?.name}
              </Box>
            </Typography>
          </Box>
          {isFetchingShadowItemValidations ? (
            <Box mt={2}>
              <Skeleton
                variant='rectangular'
                animation='wave'
                width={'100%'}
                height={'32px'}
              />
            </Box>
          ) : (
            shadowItemValidations &&
            shadowItemValidations.length > 0 &&
            shadowItemValidations.map((item) => this.renderSectionItem(item))
          )}
        </>
      </TblDialog>
    );
  }
}

PublishShadowItemDialog.propTypes = {
  t: PropTypes.func,
  open: PropTypes.bool,
  classes: PropTypes.object,
  dataItem: PropTypes.object,
  courseItemType: PropTypes.number,
  shadowItemValidations: PropTypes.array,
  onClose: PropTypes.func,
  enqueueSnackbar: PropTypes.func,
  mcChangeShadowItemsStatusAtMasterLevel: PropTypes.func,
  currentUser: PropTypes.func,
  mcGetShadowItemValidations: PropTypes.func,
  courseId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  unitId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  mcChangeShadowItemsStatusAtMasterLevelSuccess: PropTypes.bool,
  isFetchingShadowItemValidations: PropTypes.bool,
  isChangingShadowItemsStatusAtMasterLevel: PropTypes.bool,
  setState: PropTypes.func,
  courseDayId: PropTypes.string,
  isInPlanningPage: PropTypes.bool,
};

PublishShadowItemDialog.defaultProps = {
  shadowItemValidations: [],
};

const mapStateToProps = (state) => ({
  currentUser: state.Auth.currentUser,
  shadowItemValidations: state.AllCourses.shadowItemValidations,
  mcChangeShadowItemsStatusAtMasterLevelSuccess:
    state.AllCourses.mcChangeShadowItemsStatusAtMasterLevelSuccess,
  isFetchingShadowItemValidations:
    state.AllCourses.isFetchingShadowItemValidations,
  isChangingShadowItemsStatusAtMasterLevel:
    state.AllCourses.isChangingShadowItemsStatusAtMasterLevel,
  isInPlanningPage: state.AllCourses.isInPlanningPage,
});
const mapDispatchToProps = (dispatch) => ({
  mcGetShadowItemValidations: (payload) =>
    dispatch(myCoursesActions.mcGetShadowItemValidations(payload)),
  mcChangeShadowItemsStatusAtMasterLevel: (payload) =>
    dispatch(myCoursesActions.mcChangeShadowItemsStatusAtMasterLevel(payload)),
  setState: (payload) => dispatch(myCoursesActions.myCoursesSetState(payload)),
});

export default compose(
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps)
)(withSnackbar(PublishShadowItemDialog));
