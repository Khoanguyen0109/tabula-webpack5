import React from 'react';
import { withRouter } from 'react-router';

import AddIcon from '@mui/icons-material/Add';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import NotesIcon from '@mui/icons-material/Notes';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import Skeleton from '@mui/material/Skeleton';
import Tooltip from '@mui/material/Tooltip';
import withStyles from '@mui/styles/withStyles';

import TblIconButton from 'components/TblIconButton';

import clsx from 'clsx';
import PropTypes from 'prop-types';

import TblCustomRef from '../../../../components/TblCustomRef';
import Worker from '../../../../workers/unitActivities.worker';

import Activities from './ActivitiesList';

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
    // padding: theme.spacing(1),
    borderRadius: theme.spacing(1),
    marginBottom: theme.spacing(1),

    '& .unit-name': {
      minHeight: theme.spacing(5.12),
      marginTop: theme.spacing(1.3),
      fontSize: theme.fontSize.normal,
      fontWeight: theme.fontWeight.semi,
    },
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
  unitFooter: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  defaultIcon: {
    // color: theme.palette.primary.main,
    // fontSize: theme.fontSizeIcon.medium,
    cursor: 'pointer',
  },
  addIcon: {
    backgroundColor: 'white',
  
  },
  planIcon: {
    backgroundColor: theme.newColors.gray[300],
    '&:hover': {
      backgroundColor: theme.newColors.gray[400],
      borderRadius: theme.spacing(8),
      padding: theme.spacing(0.5),
    },
  },

  category: {
    marginBottom: theme.spacing(2),
  },
  categoryName: {
    fontWeight: theme.fontWeight.semi,
    fontSize: theme.fontSize.small,
    marginBottom: theme.spacing(0.5),
  },
  activityName: {
    fontSize: theme.fontSize.normal,
  },
  dragIndicatorIcon: {
    color: theme.mainColors.gray[6],
    fontSize: theme.fontSizeIcon.small,
  },
  marginTop: {
    marginTop: theme.spacing(7),
  },
  skeleton: {
    borderRadius: theme.spacing(1),
  },
});

const headers = {
  Authorization: `Bearer ${localStorage.getItem('access_token')}`,
};
const getUnitActivitiesUrl = (orgId, courseId, unitId) =>
  `${process.env.REACT_APP_API_URL}/organizations/${orgId}/courses/${courseId}/units/${unitId}`;
class UnitColum extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      unitsActivities: {},
    };
    props.Workers[`unit-${props?.unitInfo?.id}`] = new Worker();
    props.Workers[`unit-${props?.unitInfo?.id}`].onmessage = (e) => {
      const payload = e.data;

      if (payload.uid === props?.unitInfo?.id) {
        if (payload.event === 'progress') {
          // console.log('progress', payload);
        } else if (payload.event === 'success') {
          this.setState({ unitsActivities: payload?.data, isLoading: false });
        } else if (payload.event === 'error') {
          // Need handle error code
          this.setState({ isLoading: false });
        }
      }
    };
  }

  componentDidMount() {
    const { unitInfo, courseId, orgId, Workers } = this.props;
    Workers[`unit-${unitInfo?.id}`].postMessage({
      uid: unitInfo.id,
      unitInfo,
      headers,
      action: getUnitActivitiesUrl(orgId, courseId, unitInfo.id),
    });
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
      formatDate,
      handleIconsOfUnitColumn,
      onViewDetail,
    } = this.props;
    const { unitsActivities, isLoading } = this.state;

    return (
      <div className={classes.root}>
        {unitInfo.isBreakGradingPeriod && (
          <div
            className={classes.gradingInfo}
            style={{ width: Number(Number(unitInfo.unitLength + 1) * 286) }}
          >
            <div className={`${classes.gradingPeriodName} text-ellipsis`}>
              {unitInfo?.gradingPeriod?.gradingPeriodName}
            </div>

            <div className={classes.gradingPeriodDate}>
              {formatDate(unitInfo?.gradingPeriod?.firstDay)} -{' '}
              {formatDate(unitInfo?.gradingPeriod?.lastDay)}
            </div>
          </div>
        )}
        <div
          className={clsx(classes.unitBlock, {
            [classes.marginTop]: !unitInfo.isBreakGradingPeriod,
          })}
        >
          <Box className={classes.unitContent} pt={1} pb={1} pl={1}>
            <div className={classes.rowIcon}>
              <div>
                <NotesIcon className={classes.defaultIcon} />
              </div>
              <div className='text'>
                {unitsActivities &&
                  `${unitsActivities?.numberOfCourseDay} ${t('common:day', {
                    count: unitsActivities?.numberOfCourseDay,
                  })} ${
                    unitsActivities?.numberOfCourseDay !== 0
                      ? `(${unitsActivities?.range})`
                      : ''
                  }`}
              </div>
              <div>
                <TblIconButton onClick={this.onClickUnitMoreIcon}>
                  <MoreVertIcon
                    className={classes.defaultIcon}
                  />
                </TblIconButton>
              </div>
            </div>
            <Box className={clsx('text-ellipsis-2row', 'unit-name')}>
              <div>{unitInfo.unitName}</div>
            </Box>
          </Box>
          <div className={classes.rowIcon}>
            <TblIconButton onClick={this.onClickCreateActivity} className={classes.addIcon}> 
              <AddIcon />
            </TblIconButton>
            <div className='text create-activity'>
              {t('create_an_activity')}
            </div>
            <div >
              <TblIconButton onClick={this.onClickPlanThisUnit}>
                <Tooltip title={t('plan_this_unit')} arrow placement='top'>
                  <ExitToAppIcon className={classes.defaultIcon} />
                </Tooltip>
              </TblIconButton>
            </div>
          </div>
        </div>
        {isLoading ? (
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
        ) : (
          <Fade in={!isLoading} timeout={500}>
            <TblCustomRef>
              <Activities
                onViewDetail={onViewDetail}
                unitInfo={unitInfo}
                handleIconsOfUnitColumn={handleIconsOfUnitColumn}
                activityList={unitsActivities?.items}
                t={t}
              />
            </TblCustomRef>
          </Fade>
        )}
      </div>
    );
  }
}

UnitColum.propTypes = {
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
};

export default withRouter(withStyles(styles)(UnitColum));
