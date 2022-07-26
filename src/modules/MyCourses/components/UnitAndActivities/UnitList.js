import React from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList as List } from 'react-window';

import Typography from '@mui/material/Typography';
import withStyles from '@mui/styles/withStyles';

import TblAddCard from 'components/TblAddCard';
import TblCustomScrollbar from 'components/TblCustomScrollbar';

import clsx from 'clsx';
import PropTypes from 'prop-types';

import UnitColumn from './UnitColumn';

const styles = (theme) => ({
  root: {},
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

class UnitList extends React.PureComponent {
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
      onCreateUnit,
      formatDate,
      classes,
      orgId,
      courseId,
      Workers,
      termId,
      onViewDetail,
    } = this.props;
    const currentColumn = data[index] || {};
    // if (isScrolling) {
    //   return (
    //     <div style={style}>
    //       <div>
    //         <Box mb={2}>
    //           <Skeleton className={classes.skeleton} variant='rect' animation='pulse' width={270} height={40} />
    //         </Box>
    //         <Box>
    //           <Skeleton className={classes.skeleton} variant='rect' animation='wave' width={270} height={140} />
    //         </Box>
    //         <Box mt={2}>
    //           <Skeleton className={classes.skeleton} variant='rect' animation='pulse' width={270} height={50} />
    //         </Box>
    //       </div>
    //     </div>
    //   );
    // }

    if (currentColumn.isCreateUnit) {
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
          <TblAddCard
            className={`${
              currentColumn.isBreakGradingPeriod
                ? classes.addUnit
                : `${classes.marginTop} ${classes.addUnit}`
            }`}
            onClick={() => onCreateUnit(currentColumn)}
            addCardTitle={t('create_a_unit')}
          />
        </div>
      );
    }

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
          {/* Note: Bug 2430: Change <EmptyContent/> to 'Empty' Text */}
          <Typography className='emptyText' color='primary'>
            {t('common:empty')}
          </Typography>
        </div>
      );
    }

    return (
      <div style={style}>
        <UnitColumn
          Workers={Workers}
          onViewDetail={onViewDetail}
          orgId={orgId}
          courseId={courseId}
          formatDate={formatDate}
          key={`unit-${currentColumn.id}`}
          unitInfo={currentColumn}
          handleIconsOfUnitColumn={handleIconsOfUnitColumn}
          t={t}
          termId={termId}
        />
      </div>
    );
  });
  customScrollbarsVirtualList = React.forwardRef((props) => {
    const { defaultPeriodId, unitList } = this.props;
    // eslint-disable-next-line eqeqeq
    const index = unitList.findIndex(
      (i) => i.gradingPeriod?.id === defaultPeriodId
    );
    const width = (index !== -1 ? index : 0) * 296;
    return (
      <TblCustomScrollbar {...props} suppressScrollX={false} scrollTo={width} />
    );
  });

  render() {
    const { unitList, classes } = this.props;
    return (
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
            outerElementType={this.customScrollbarsVirtualList}
          >
            {this.renderColumn}
          </List>
        )}
      </AutoSizer>
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
};

UnitList.defaultProps = {
  unitList: [],
};

export default withStyles(styles)(UnitList);
