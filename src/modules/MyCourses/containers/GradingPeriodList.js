import React from 'react';
import { connect } from 'react-redux';

import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import withStyles from '@mui/styles/withStyles';

import EmptyContent from 'components/EmptyContent';
import TblActivityIcon from 'components/TblActivityIcon/icon';
import TblContextMenu from 'components/TblContextMenu';

import { COURSE_ITEM_TYPE } from 'utils/constants';
import { TEACHER } from 'utils/roles';

import CreateAssignmentDrawer from 'shared/MyCourses/containers/CreateAssignmentDrawer';

import PropTypes from 'prop-types';
import { checkPermission } from 'utils';

import UnitList from '../components/UnitAndActivities/UnitList';
import { GRADE_WEIGHT_TYPE, QUIZ_TYPE } from '../constants';

const styles = (theme) => ({
  root: {
    display: 'flex',
    width: '100%',
    height: '100%',
  },
  displayFlex: {
    display: 'flex',
  },
  contextMenuItem: {
    display: 'flex',
    alignItems: 'center',
    fontSize: theme.fontSize.normal,
    '& span': {
      marginRight: theme.spacing(1),
      fontSize: theme.fontSizeIcon.medium,
    },
  },
  removeItem: {
    fontSize: theme.fontSize.normal,
    fontWeight: theme.fontWeight.normal,
    color: theme.mainColors.red[0],
  },
});

const ROLES_CREATE_UPDATE = [TEACHER];

class GradingPeriodList extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      contextMenu: {},
      visibleCreateAssignmentDialog: false,
    };
  }
  onOpenAssignmentDialog = () => {
    this.setState({ visibleCreateAssignmentDialog: true });
  };

  onViewAndEditAssignment = () => {
    this.setState({ visibleCreateAssignmentDialog: true });
  };

  onCloseAssignmentDialog = () => {
    this.setState({ visibleCreateAssignmentDialog: false });
  };
  createQuiz = (type) => (value) => {
    const { onCreateQuiz } = this.props;
    onCreateQuiz(value.id, type, null);
  };

  onViewActivityDetail = (item) => {
    switch (item?.type) {
      case 1:
        this.setState({ visibleCreateAssignmentDialog: true });
        break;
      case 3:
        const { onCreateQuiz } = this.props;
        onCreateQuiz(item.unitInfo.id, null, item.id);
        break;

      default:
        break;
    }
  };
  onRemoveActivity = (item) => {
    switch (item?.type) {
      case 1:
        const { onRemoveAssignment } = this.props;
        onRemoveAssignment(item.unitInfo.id, item);
        break;
      case 3:
        const { onRemoveQuiz } = this.props;
        onRemoveQuiz(item.unitInfo.id, item);
        break;
      default:
        break;
    }
  };
  onRemoveUnit = (item) => {
    const { onRemoveUnit } = this.props;
    onRemoveUnit(item.id, item.unitName);
  };

  generateContextMenu = (hasPermission = false) => {
    const { classes, t, onCreateLesson, onEditUnit } = this.props;
    const {
      contextMenu: { type, unit, lesson },
    } = this.state;
    let content = [];
    switch (type) {
      case 'createActivity':
        content = [
          {
            content: (
              <Box className={classes.contextMenuItem}>
                {/* <span className='icon-icn_assignment' /> */}
                <TblActivityIcon type={COURSE_ITEM_TYPE.ASSIGNMENT} />
                {t('create_an_assignment')}
              </Box>
            ),
            onClick: this.onOpenAssignmentDialog,
            value: unit,
          },
          {
            content: (
              <Box className={classes.contextMenuItem}>
                {/* <span className='icon-icn_test' /> */}
                <TblActivityIcon type={COURSE_ITEM_TYPE.QUIZ} />
                {t('create_a_pop_quiz')}
              </Box>
            ),
            onClick: this.createQuiz(QUIZ_TYPE.POP),
            value: unit,
          },
          {
            content: (
              <Box className={classes.contextMenuItem}>
                {/* <span className='icon-icn_test1' /> */}
                <TblActivityIcon type={COURSE_ITEM_TYPE.QUIZ} />
                {t('create_an_announced_quiz')}
              </Box>
            ),
            onClick: this.createQuiz(QUIZ_TYPE.ANNOUNCED),
            value: unit,
          },
        ];
        if (hasPermission) {
          content.unshift({
            content: (
              <Box className={classes.contextMenuItem}>
                {/* <span className='icon-icn_lesson' /> */}
                <TblActivityIcon type={COURSE_ITEM_TYPE.LESSON} />
                {t('create_a_lesson')}
              </Box>
            ),
            onClick: onCreateLesson,
            value: unit,
          });
        }
        break;
      case 'lesson':
        content = [
          {
            content: (
              <Box className={classes.contextMenuItem}>
                {t('common:view_details')}
              </Box>
            ),
            onClick: this.props.onEditLesson,
            value: lesson,
          },
        ];
        if (hasPermission) {
          content.push({
            content: (
              <Box className={classes.removeItem}>{t('common:delete')}</Box>
            ),
            divider: true,
            onClick: this.props.onDeleteLesson,
            value: lesson,
          });
        }
        break;
      case 1:
      case 2:
      case 3:
        content = [
          {
            content: (
              <Box className={classes.contextMenuItem}>
                {t('common:view_details')}
              </Box>
            ),
            onClick: this.onViewActivityDetail,
            value: {
              ...this.state?.contextMenu[GRADE_WEIGHT_TYPE[type]],
              activityType: GRADE_WEIGHT_TYPE[type],
            },
          },
          {
            content: (
              <Box className={classes.removeItem}>{`${t(
                'common:delete'
              )}`}</Box>
            ),
            divider: true,
            value: {
              ...this.state?.contextMenu[GRADE_WEIGHT_TYPE[type]],
              activityType: GRADE_WEIGHT_TYPE[type],
            },
            onClick: this.onRemoveActivity,
          },
        ];
        break;
      default:
        if (hasPermission) {
          content = [
            {
              content: (
                <Box className={classes.contextMenuItem}>
                  {t('common:rename')}
                </Box>
              ),
              onClick: onEditUnit,
              value: unit,
            },
            {
              content: (
                <Box className={classes.removeItem}>{t('common:delete')}</Box>
              ),
              divider: true,
              value: unit,
              onClick: this.onRemoveUnit,
            },
          ];
        }
    }

    return content;
  };

  handleIconsOfUnitColumn = (event, item, type) => {
    switch (type) {
      case 'lesson':
        this.setState({
          contextMenu: {
            event: {
              currentTarget: event?.currentTarget,
              times: new Date().getTime(),
            },
            type,
            lesson: item,
          },
        });
        break;
      case 1:
      case 2:
      case 3:
        this.setState({
          contextMenu: {
            event: {
              currentTarget: event?.currentTarget,
              times: new Date().getTime(),
            },
            type,
            [GRADE_WEIGHT_TYPE[type]]: item,
          },
        });
        break;
      default:
        this.setState({
          contextMenu: {
            event: {
              currentTarget: event?.currentTarget,
              times: new Date().getTime(),
            },
            type,
            unit: item,
          },
        });
    }
  };

  onCreateUnit = (period) => () => {
    this.props.onCreateUnit(period);
  };
  onClickActivityTitle = (item) => {
    switch (item?.type) {
      case 'lesson':
        this.props.onEditLesson(item);
        break;
      case 1:
      case 2:
      case 3:
        this.setState({
          contextMenu: {
            type: item?.type,
            [GRADE_WEIGHT_TYPE[item.type]]: item,
          },
        });
        this.onViewActivityDetail(item);
        break;
      default:
        break;
    }
  };
  processGradingPeriodList = (
    gradingPeriodList = [],
    orgId,
    courseId,
    hasPermission = false
  ) => {
    const gradingPeriodsLength = gradingPeriodList.length;
    let result = [];
    for (let i = 0; i < gradingPeriodsLength; i++) {
      const copyListItem = [...gradingPeriodList[i].units].map(
        (item, index) => ({
          ...item,
          gradingPeriod: {
            gradingPeriodName: gradingPeriodList[i].gradingPeriodName,
            id: gradingPeriodList[i].id,
            firstDay: gradingPeriodList[i].firstDay,
            lastDay: gradingPeriodList[i].lastDay,
          },
          isBreakGradingPeriod: index === 0,
          unitLength: gradingPeriodList[i].units.length,
          orgId,
          courseId,
        })
      );
      //NOTE: Condition to just allow primary teacher add unit
      if (hasPermission) {
        copyListItem.push({
          isCreateUnit: true,
          gradingPeriod: {
            gradingPeriodName: gradingPeriodList[i].gradingPeriodName,
            id: gradingPeriodList[i].id,
            firstDay: gradingPeriodList[i].firstDay,
            lastDay: gradingPeriodList[i].lastDay,
          },
          isBreakGradingPeriod: !gradingPeriodList[i]?.units?.length,
        });
      } else {
        if (copyListItem.length < 1) {
          copyListItem.push({
            isEmptyUnit: true,
            gradingPeriod: {
              gradingPeriodName: gradingPeriodList[i].gradingPeriodName,
              id: gradingPeriodList[i].id,
              firstDay: gradingPeriodList[i].firstDay,
              lastDay: gradingPeriodList[i].lastDay,
            },
            isBreakGradingPeriod: true,
          });
        }
      }
      result = [...result, ...copyListItem];
    }
    return result;
  };

  Row1 = ({ index, isScrolling, style }) => (
    <div className={index % 2 ? 'ListItemOdd' : 'ListItemEven'} style={style}>
      {isScrolling ? 'Scrolling' : `Row ${index}`}
    </div>
  );

  render() {
    const {
      classes,
      t,
      gradingPeriodList,
      formatDate,
      isFetchingUnitsList,
      onCreateUnit,
      orgId,
      courseId,
      Workers,
      updateUnit,
      permission,
      termId,
      ...rest
    } = this.props;
    if (isFetchingUnitsList) {
      return (
        <>
          <Skeleton variant='text' />
          <Skeleton variant='text' />
          <Skeleton variant='text' />
        </>
      );
    }
    if (gradingPeriodList.length < 1) {
      return <EmptyContent title={t('common:no_data')} />;
    }
    const hasPermission = checkPermission(permission, ROLES_CREATE_UPDATE);
    const { contextMenu, visibleCreateAssignmentDialog } = this.state;
    const gradingPeriodProcessed = this.processGradingPeriodList(
      gradingPeriodList,
      orgId,
      courseId,
      hasPermission
    );
    return (
      <Box className={classes.root}>
        <CreateAssignmentDrawer
          visible={visibleCreateAssignmentDialog}
          onClose={() => this.onCloseAssignmentDialog()}
          unit={contextMenu?.assignment?.unitInfo || contextMenu?.unit}
          assignmentId={contextMenu?.assignment?.id}
          updateUnit={updateUnit}
        />
        <TblContextMenu
          placement={['bottom', 'right']}
          element={contextMenu.event}
          menus={this.generateContextMenu(hasPermission)}
        />
        <UnitList
          orgId={orgId}
          courseId={courseId}
          formatDate={formatDate}
          onCreateUnit={onCreateUnit}
          unitList={gradingPeriodProcessed}
          onViewDetail={this.onClickActivityTitle}
          handleIconsOfUnitColumn={this.handleIconsOfUnitColumn}
          t={t}
          Workers={Workers}
          termId={termId}
          {...rest}
        />
      </Box>
    );
  }
}

GradingPeriodList.propTypes = {
  classes: PropTypes.object,
  t: PropTypes.func,
  gradingPeriodList: PropTypes.array,
  formatDate: PropTypes.func,
  onCreateUnit: PropTypes.func,
  isFetchingUnitsList: PropTypes.bool,
  courseId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  orgId: PropTypes.number,
  onCreateLesson: PropTypes.func,
  onEditUnit: PropTypes.func,
  onCreateQuiz: PropTypes.func,
  onDeleteLesson: PropTypes.func,
  Workers: PropTypes.object,
  onRemoveQuiz: PropTypes.func,
  onEditLesson: PropTypes.func,
  onRemoveAssignment: PropTypes.func,
  updateUnit: PropTypes.func,
  onRemoveUnit: PropTypes.func,
  permission: PropTypes.object,
  termId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

GradingPeriodList.defaultProps = {
  gradingPeriodList: [],
};

const mapStateToProps = (state) => ({
  currentUser: state.Auth.currentUser,
  gradingPeriodList: state.AllCourses.gradingPeriodList,
  isFetchingUnitsList: state.AllCourses.isFetchingUnitsList,
  permission: state.AllCourses.permission,
});

const mapDispatchToProps = () => ({});

export default withStyles(styles)(
  connect(mapStateToProps, mapDispatchToProps)(GradingPeriodList)
);
