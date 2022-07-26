import React from 'react';
import { withRouter } from 'react-router';

import isEmpty from 'lodash/isEmpty';
import values from 'lodash/values';

import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import withStyles from '@mui/styles/withStyles';

import ActivityItem from 'modules/MyCourses/components/UnitAndActivities/ActivityItem';

import clsx from 'clsx';
import PropTypes from 'prop-types';
import Worker from 'workers/unitActivities.worker';

const styles = (theme) => ({
  root: {
    marginRight: theme.spacing(2),
  },
  unitList: {
    display: 'flex',
    color: theme.palette.primary.main,
    marginTop: theme.spacing(2),
  },
  gradingInfo: {
    marginBottom: theme.spacing(1.25),
  },
  gradingPeriodName: {
    fontSize: theme.fontSize.normal,
    fontWeight: theme.fontWeight.semi,
  },
  gradingPeriodDate: {
    fontSize: theme.fontSize.small,
    color: theme.newColors.gray[700],
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
  rowIcon: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'inherit',
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

  skeleton: {
    borderRadius: theme.spacing(1),
  },
  emptyMessage: {
    fontSize: theme.fontSize.normal,
    alignItems: 'center',
    display: 'flex',
    paddingLeft: theme.spacing(2),
    lineHeight: 2.5
  }
});

// const headers = {
//   Authorization: `Bearer ${localStorage.getItem('access_token')}`,
// };
// const getUnitActivitiesUrl = (orgId, courseId, unitId) =>
//   `${process.env.REACT_APP_API_URL}/organizations/${orgId}/courses/${courseId}/units/${unitId}`;

class UnitColum extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      unitsActivities: {},
    };
    props.Workers[`unit-${props?.unitInfo?.id}`] = new Worker();
    props.Workers[`unit-${props?.unitInfo?.id}`].onmessage = (e) => {
      const payload = e.data;

      if (payload.uid === props?.unitInfo?.id) {
        if (payload.event === 'progress') {
          // console.log('progress', payload);
        } else if (payload.event === 'success') {
          this.setState({ unitsActivities: payload?.data });
        } else if (payload.event === 'error') {
          // Need handle error code
          // this.setState({ isBusy: false });
        }
      }
    };
  }

  componentDidMount() {
    // const { unitInfo, courseId, orgId, Workers, isBusy } = this.props;
    // Workers[`unit-${unitInfo?.id}`].postMessage({
    //   uid: unitInfo.id,
    //   unitInfo,
    //   headers,
    //   action: getUnitActivitiesUrl(orgId, courseId, unitInfo.id),
    // });
  }

  onClickCreateActivity = (e) => {
    e.persist();
    const { handleIconsOfUnitColumn, unitInfo } = this.props;
    handleIconsOfUnitColumn(e, unitInfo, 'createActivity');
  };

  onClickUnitMoreIcon = (e) => {
    e.persist();
    const { handleIconsOfUnitColumn, unitInfo } = this.props;
    handleIconsOfUnitColumn(e, unitInfo, 'unitMoreIcon');
  };

  onClickPlanThisUnit = () => {
    const { history, location, unitInfo, termId } = this.props;
    const urlSearchParams = new URLSearchParams(location.search);
    urlSearchParams.set('active', 'plan');
    urlSearchParams.set('unitId', unitInfo?.id);
    urlSearchParams.set('termId', termId);
    urlSearchParams.set('gradingPeriodId', unitInfo?.gradingPeriod?.id);
    history.push(`${location.pathname}?${urlSearchParams.toString()}`);
  };

  render() {
    const {
      classes,
      t,
      unitInfo,
      onViewDetail,
      isBusy,
    } = this.props;
    return (
      <div className={classes.root}>
        <div className={clsx(classes.unitBlock)}>
          <Box className={classes.unitContent}>
            <Box className={clsx('text-ellipsis-2row', 'unit-name')}>
              <Typography variant='titleSmall'>{unitInfo.unitName}</Typography>
            </Box>
          </Box>
        </div>
        <Box className={clsx(classes.unitBlock)}>
          {values(unitInfo.activities).every(isEmpty) && 
           <div className={classes.emptyMessage}>{t('myCourses:no_activities')}</div>}
        
         {unitInfo?.activities &&
            Object.keys(unitInfo.activities).map((key) => (
                <Box className={classes.category}>
                  <Box
                    className={`${classes.categoryName} text-ellipsis`}
                    p={1}
                  >
                    {key}
                  </Box>
                  <div className={classes.activityList}>
                    {unitInfo.activities[key].map((activity) => (
                        <ActivityItem
                          unitInfo={unitInfo}
                          type={activity.type}
                          activity={activity}
                          onViewDetail={onViewDetail}
                        />
                      ))}
                  </div>
                </Box>
              ))}
        </Box>
        {isBusy && (
          <Box className={classes.unitBlock}>
            <Skeleton variant='text' width={'50%'} />
            <Box mt={1}>
              <Skeleton
                className={classes.skeleton}
                variant='rectangular'
                animation='wave'
                width={'100%'}
                height={100}
              />
            </Box>
          </Box>
        )}
      </div>
    );
  }
}

UnitColum.propTypes = {
  isBusy: PropTypes.bool,
  classes: PropTypes.object,
  unitInfo: PropTypes.object,
  handleIconsOfUnitColumn: PropTypes.func,
  courseId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  orgId: PropTypes.number,
  formatDate: PropTypes.func,
  onViewDetail: PropTypes.func,
  t: PropTypes.func,
  history: PropTypes.object,
  location: PropTypes.object,
  Workers: PropTypes.object,
  termId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

UnitColum.defaultProps = {
  unitInfo: {},
  isBusy: true,
};

export default withRouter(withStyles(styles)(UnitColum));
