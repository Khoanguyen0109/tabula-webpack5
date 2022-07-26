import React from 'react';
import { connect } from 'react-redux';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList as List } from 'react-window';

import compose from 'lodash/flowRight';

import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import withStyles from '@mui/styles/withStyles';

import UnitColumn from 'modules/ManageCourseTemplate/components/UnitColumn';

import clsx from 'clsx';
import PropTypes from 'prop-types';

const styles = (theme) => ({
  root: {
    display: 'flex',
    flexGrow: 1,
    height: '100%',
  },
  unitList: {
    // display: 'flex',
    color: theme.palette.primary.main,
    margin: theme.spacing(2, 2, 0, 0),
    width: '100%',
    height: '100%',
  },
  unitColumns: {
    marginRight: theme.spacing(2),
    display: 'flex',
  },
  list: {
    // overflowX: 'visible !important',
    overflowX: 'visible !important',
  },
  marginTop: {
    marginTop: theme.spacing(7.25),
  },
  skeleton: {
    borderRadius: theme.spacing(1),
  },
  gradingInfo: {
    marginBottom: theme.spacing(1.25),
    width: 280,
  },
  gradingPeriodName: {
    fontSize: theme.fontSize.normal,
    fontWeight: theme.fontWeight.semi,
  },
  gradingPeriodDate: {
    fontSize: theme.fontSize.small,
    color: theme.newColors.gray[700],
  },
  addUnit: {
    width: theme.spacing(35),
  },
  emptyContent: {
    textAlign: 'left',
  },
});

// const CustomScrollbarsVirtualList = React.forwardRef((props, ref) => (
//   <CustomScrollbars {...props} forwardedRef={ref} />
// ));
class UnitList extends React.PureComponent {
  constructor(props) {
    super(props);

    this.workers = {};
  }
  unitListRef = React.createRef();

  renderActivityIcon = () => {
    const { classes } = this.props;

    return <span className={clsx(classes.defaultIcon, 'icon-icn_lesson')} />;
  };

  // eslint-disable-next-line react/prop-types
  renderColumn = React.memo(({ index, /*isScrolling ,*/ style, data }) => {
    const {
      handleIconsOfUnitColumn,
      t,
      classes,
      formatDate,
      orgId,
      courseId,
      termId,
      onViewDetail,
      isBusy,
    } = this.props;
    const currentColumn = data[index] || {};

    if (currentColumn.isEmptyUnit) {
      return (
        <div style={style}>
          {currentColumn.isBreakGradingPeriod && (
            <div className={classes.gradingInfo}>
              <div className={`${classes.gradingPeriodName} text-ellipsis`}>
                {currentColumn?.gradingPeriod?.gradingPeriodName}
              </div>

              <div className={classes.gradingPeriodDate}>
                {formatDate(currentColumn?.gradingPeriod?.firstDay)} -{' '}
                {formatDate(currentColumn?.gradingPeriod?.lastDay)}
              </div>
            </div>
          )}
          <Typography className='emptyText' color='primary'>
            {t('common:empty')}
          </Typography>
        </div>
      );
    }

    return (
      <div style={style}>
        <UnitColumn
          Workers={this.workers}
          onViewDetail={onViewDetail}
          orgId={orgId}
          courseId={courseId}
          formatDate={formatDate}
          key={`unit-${currentColumn.id}`}
          unitInfo={currentColumn}
          handleIconsOfUnitColumn={handleIconsOfUnitColumn}
          t={t}
          termId={termId}
          isBusy={isBusy}
        />
      </div>
    );
  });

  render() {
    const { unitList, classes } = this.props;
    return (
      <Box className={classes.root}>
        <AutoSizer>
          {({ height, width }) => (
            <List
              className={`${classes.list} list1`}
              height={height - 30}
              itemCount={unitList.length}
              itemSize={296}
              useIsScrolling
              width={width}
              layout='horizontal'
              itemData={unitList}
              ref={this.unitListRef}
              overscanCougetInitialScrollOffset
              nt={7}
            >
              {this.renderColumn}
            </List>
          )}
        </AutoSizer>
      </Box>
    );
  }
}

UnitList.propTypes = {
  classes: PropTypes.object,
  t: PropTypes.func,
  handleIconsOfUnitColumn: PropTypes.func,
  unitList: PropTypes.array,
  onCreateUnit: PropTypes.func,
  formatDate: PropTypes.func,
  onViewDetail: PropTypes.func,
  orgId: PropTypes.number,
  courseId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  Workers: PropTypes.object,
  termId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  defaultPeriodId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isBusy: PropTypes.bool,
};

UnitList.defaultProps = {
  unitList: [],
};

const mapStateToProps = (state) => ({
  unitList: state.ManageCourseTemplate.unitAndTemplateActivities,
});
const mapDispatchToProps = () => ({});
export default compose(connect(mapStateToProps, mapDispatchToProps))(
  withStyles(styles)(UnitList)
);
