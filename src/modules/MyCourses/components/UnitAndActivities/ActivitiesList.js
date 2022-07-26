import React from 'react';
import { VariableSizeList as List } from 'react-window';

import isEmpty from 'lodash/isEmpty';
import omitBy from 'lodash/omitBy';
import values from 'lodash/values';

import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import withStyles from '@mui/styles/withStyles';

import TblCustomScrollbar from 'components/TblCustomScrollbar';

import clsx from 'clsx';
import PropTypes from 'prop-types';

import ActivityItem from './ActivityItem';

const styles = (theme) => ({
  root: {
    marginRight: theme.spacing(2),
  },
  unitBlock: {
    backgroundColor: theme.newColors.gray[100],
    borderRadius: theme.spacing(1),
    padding: theme.spacing(1),
    width: theme.spacing(35),
    marginBottom: theme.spacing(3),
    minHeight: theme.spacing(6.4),
  },
  unitContent: {
    backgroundColor: 'white',
    padding: theme.spacing(1),
    borderRadius: theme.spacing(1),
    marginBottom: theme.spacing(1),

    '& .unit-name': {
      minHeight: theme.spacing(5.12),
      marginTop: theme.spacing(1.3),
      fontSize: theme.fontSize.normal,
      fontWeight: theme.fontWeight.semi,
    },
  },
  ellipsis2Row: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    '-webkit-line-clamp': 2,
    '-webkit-box-orient': 'vertical',
  },
  rowIcon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '& .text': {
      flex: 1,
      marginLeft: theme.spacing(0.65),
      fontSize: theme.fontSize.small,
    },
    '& .create-activity': {
      color: theme.palette.primary.main,
      fontSize: theme.fontSize.normal,
    },
  },
  defaultIcon: {
    color: theme.palette.primary.main,
    fontSize: theme.fontSizeIcon.medium,
    cursor: 'pointer',
  },
  category: {
    marginBottom: theme.spacing(2),
  },
  categoryName: {
    fontWeight: theme.fontWeight.semi,
    fontSize: theme.fontSize.small,
    marginBottom: theme.spacing(0.5),
    textTransform: 'capitalize',
  },
  activityName: {
    fontSize: theme.fontSize.normal,
  },
  dragIndicatorIcon: {
    color: theme.mainColors.gray[6],
    fontSize: theme.fontSizeIcon.small,
  },
  emptyMessage: {
    fontSize: theme.fontSize.normal,
    alignItems: 'center',
    display: 'flex',
    paddingLeft: theme.spacing(2),
  },
});

// https://github.com/bvaughn/react-window/issues/110
const CustomScrollbarsVirtualList = React.forwardRef((props) => (
  <TblCustomScrollbar suppressScrollX={false} {...props} />
));

class Activities extends React.PureComponent {
  onClickMoreIcon = (item, type) => (e) => {
    const { unitInfo } = this.props;
    this.props.handleIconsOfUnitColumn(
      e,
      { ...item, unitInfo },
      type || item?.type
    );
  };

  renderColumn = ({ index, style, data, onViewDetail }) => (
    <div style={style}>
      <ActivityItem
        onViewDetail={onViewDetail}
        activity={data[index]}
        type={data[index]?.type || 'lesson'}
        onClickMoreIcon={this.onClickMoreIcon}
      />
    </div>
  );

  getItemSize = (list = [], index) => {
    if (list[index]?.name?.length < 45) {
      return 94;
    }
    return 115;
  };

  renderVirtualList = (list) => {
    const { classes } = this.props;
    return (
      <List
        className={classes.list}
        height={385}
        itemCount={list.length}
        itemSize={(index) => this.getItemSize(list, index)}
        // useIsScrolling
        width={264}
        itemData={list}
        outerElementType={CustomScrollbarsVirtualList}
      >
        {this.renderColumn}
      </List>
    );
  };

  renderActivitiesWithoutLessonAndUncategorized = (list) => {
    const { classes, onViewDetail, unitInfo } = this.props;
    const results = [];
    for (let key in list) {
      results.push(
        <div key={key} className={classes.category}>
          <Box className={`${classes.categoryName} text-ellipsis`} p={1}>
            {key}
          </Box>
          <div className={classes.activityList}>
            {/* NOTE: Only show normal list now */}
            {/* {
              list[key].length <= 5
                ? list[key]?.map((item, index) => <ActivityItem activity={item} onClickMoreIcon={this.onClickMoreIcon} type={item?.type || 'lesson'} />)
                : this.renderVirtualList(list[key])
            } */}
            {list[key]?.map((item, index) => (
              <ActivityItem
                activity={item}
                unitInfo={unitInfo}
                onViewDetail={onViewDetail}
                onClickMoreIcon={this.onClickMoreIcon}
                type={item?.type || 'lesson'}
                key={index}
              />
            ))}
          </div>
        </div>
      );
    }
    return results;
  };

  render() {
    const { classes, t, activityList, onViewDetail, unitInfo } = this.props;

    if (values(activityList).every(isEmpty)) {
      return (
        <div className={clsx(classes.unitBlock, classes.emptyMessage)}>
          {t('no_activities')}
        </div>
      );
    }

    const activityWithoutLessonAndUncategorized = omitBy(
      activityList,
      (value, key) => ['lessons', 'uncategorized'].includes(key)
    );
    return (
      <Fade in={true} timeout={400}>
        <div className={classes.unitBlock}>
          {!isEmpty(activityList?.lessons) && (
            <div className={classes.category}>
              <Box className={classes.categoryName} p={1}>
                {t('common:lesson', { count: 2 })}
              </Box>

              <div className={classes.activityList}>
                {/* NOTE: Only show normal list now */}
                {/* {
                    activityList?.lessons?.length <= 5
                      ? activityList?.lessons?.map((lesson, index) => <ActivityItem activity={lesson} onClickMoreIcon={this.onClickMoreIcon} type='lesson' />)
                      : this.renderVirtualList(activityList?.lessons.map(item => Object.assign(item, { type: 'lesson' })))
                  } */}
                {activityList?.lessons?.map((lesson, index) => (
                  <ActivityItem
                    unitInfo={unitInfo}
                    onViewDetail={onViewDetail}
                    activity={lesson}
                    onClickMoreIcon={this.onClickMoreIcon}
                    type={lesson?.type ?? 'lesson'}
                    key={index}
                  />
                ))}
              </div>
            </div>
          )}
          {this.renderActivitiesWithoutLessonAndUncategorized(
            activityWithoutLessonAndUncategorized
          )}
          {!isEmpty(activityList?.uncategorized) && (
            <div className={classes.category}>
              <Box className={classes.categoryName} p={1}>
                {t('uncategorized')}
              </Box>

              <div className={classes.activityList}>
                {/* NOTE: Only show normal list now */}
                {/* {
                    activityList?.uncategorized?.length <= 5
                      ? activityList?.uncategorized?.map((item, index) => <ActivityItem type={item?.type || 'lesson'} activity={item} onClickMoreIcon={this.onClickMoreIcon} />)
                      : this.renderVirtualList(activityList?.uncategorized)
                  } */}
                {activityList?.uncategorized?.map((item, index) => (
                  <ActivityItem
                    unitInfo={unitInfo}
                    onViewDetail={onViewDetail}
                    type={item?.type || 'lesson'}
                    activity={item}
                    onClickMoreIcon={this.onClickMoreIcon}
                    key={index}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </Fade>
    );
  }
}

Activities.propTypes = {
  classes: PropTypes.object,
  t: PropTypes.func,
  onViewDetail: PropTypes.func,
  activityList: PropTypes.object,
  handleIconsOfUnitColumn: PropTypes.func,
  unitInfo: PropTypes.object,
};

Activities.defaultProps = {
  activityList: {},
};
export default withStyles(styles)(Activities);
