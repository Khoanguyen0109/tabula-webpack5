import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { areEqual } from 'react-window';

import isEmpty from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';

import moment from 'moment';
import PropTypes from 'prop-types';

import AvailableListDnd from '../../components/Plan/AvailableListDnd';

import useAPIHook from './useAPIHook';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    paddingBottom: theme.spacing(4),
    '& .text-ellipsis.master': {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
  },
  masterItem: {
    border: `1px solid ${theme.newColors.gray[200]}`,
    borderRadius: theme.spacing(1),
    width: '280px',
    // background: theme.newColors.gray[300],
    '&.empty': {
      border: 'none',
    },
  },
  header: {
    // height: theme.spacing(8),
    borderRadius: theme.spacing(1),
    display: 'flex',
    justifySelf: 'center',
    paddingLeft: theme.spacing(1.75),
    paddingRight: theme.spacing(0.75),
    paddingTop: theme.spacing(0.75),
    margin: theme.spacing(0.25),
    // background: theme.newColors.gray[300],
    color: theme.palette.primary.main,
  },
  masterColor: {
    background: theme.newColors.gray[200],
  },
  shadowColor: {
    background: theme.newColors.gray[100],
  },
  shadowStyle: {
    border: `2px dashed ${theme.mainColors.gray[6]}`,
    // backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='8' ry='8' stroke='%23C3C3C3FF' stroke-width='2' stroke-dasharray='8' stroke-dashoffset='17' stroke-linecap='square'/%3e%3c/svg%3e");
    // border-radius: 8px`
  },
  shadowItem: {
    '& .shadow-name, & .time-active': {
      color: theme.newColors.gray[700],
    },
  },
  fontWeightSemi: {
    fontWeight: theme.fontWeight.semi,
  },
  fontSizeLarge: {
    fontSize: theme.fontSize.medium,
  },
  iconAdd: {
    background: theme.openColors.white,
    borderRadius: '50%',
    cursor: 'pointer',
  },
  link: {
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  listActivity: {
    margin: theme.spacing(1),
    '& .MuiInputLabel-root': {
      display: 'block',
      fontSize: theme.fontSize.normal,
    },
  },
  shadow: {
    marginTop: theme.spacing(5),
    '& .headers': {
      justifySelf: 'center',
      paddingRight: theme.spacing(2),
      maxWidth: '100%',
    },
  },
  // courseDayName: {
  //   fontWeight: theme.fontWeight.semi,
  //   fontSize: theme.fontSize.normal,
  //   color: theme.palette.primary.main,
  //   paddingLeft: theme.spacing(2),
  //   paddingBottom: theme.spacing(0.5)
  // },
  // courseDayInfo: {
  //   fontSize: theme.fontSize.small,
  //   color: theme.palette.primary.main,
  //   paddingLeft: theme.spacing(2),
  //   paddingBottom: theme.spacing(1)
  // }
}));

const CourseDayColumn = React.memo(function (props) {
  const {
    data,
    handleIconsMore,
    hasPermission,
    isScrolling,
    worker,
    viewShadowDetail,
    viewMasterDetail,
    handleRelinkShadowItem,
    handleChangeMasterStatus,
  } = props;
  const currentCourseDayId = useSelector(
    (state) => state.AllCourses.currentCourseDayId
  );
  const { id: courseDayId, courseId, gradingPeriodId } = data;
  const [fetchData] = useAPIHook({
    courseDayId,
    courseId,
    worker,
    isScrolling,
    gradingPeriodId,
  });
  const classes = useStyles();
  const { t } = useTranslation(['plan']);
  const masterHeight = useSelector(
    (state) => state.AllCourses.courseDaysHeight?.maxMaster
  );
  const shadowHeight = useSelector(
    (state) => state.AllCourses.courseDaysHeight?.maxShadow
  );
  // const gradingPeriodList = useSelector(state => state.AllCourses.gradingPeriodList);
  const courseDayDetail = useSelector(
    (state) => state.AllCourses.planningData[courseDayId]
  );
  // const [courseDayDetail, setCourseDay] = useState(planningData[courseDayId] ?? {});
  // const courseDayDetail = planningData[courseDayId];
  // console.log(courseDayId, courseDayDetail, courseDayDetail?.masterItem?.quoteMap);
  useEffect(() => {
    // Dont fetch data when data existing. Just update state to change courseDayDetail
    if (courseDayId && !isScrolling && isEmpty(courseDayDetail)) {
      // console.log('Fetching', isScrolling);
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseDayId, isScrolling]);
  // useEffect(() => {
  //   setCourseDay(planningData[courseDayId]);
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [planningData, planningData[courseDayId]]);
  // console.log('Scroll', isScrolling, courseDayDetail);
  // console.log('Coloumn', courseDayId, isScrolling);
  if (isEmpty(courseDayDetail) || isNil(masterHeight) || isNil(shadowHeight)) {
    return (
      <div className={classes.root}>
        {/* <div className={classes.courseDayName}>{data.courseDayName}</div> */}
        <Box mb={5}>
          <Skeleton
            variant='rectangular'
            animation='wave'
            width={280}
            height={64}
          />
        </Box>
        <Skeleton
          variant='rectangular'
          animation='wave'
          width={280}
          height={masterHeight - 64 ?? 250}
        />
      </div>
    );
  }

  // console.log('Coloumn', courseDayId);
  // const gradingPeriod = gradingPeriodList?.find(g => g.id === gradingPeriodId);
  // let sections = [];
  // if (gradingPeriod) {
  //   sections = gradingPeriod.sections;
  // }
  // sections.sort();

  const shadowItems = courseDayDetail?.shadowItem;

  return (
    <div className={classes.root} id={`course-day-${courseDayId}`}>
      {/* <div className={classes.courseDayName} >{data.courseDayName}</div>
      <div className={classes.courseDayInfo}>{data.range}</div> */}
      <div className={'display-flex'}>
        <div style={{ height: masterHeight || '100%' }}>
          <div className='text-ellipsis master' />
          <div
            className={`${classes.masterItem} ${classes.masterColor} masterHeight`}
            data-tut={
              data.id === currentCourseDayId ? 'reactour__masterItem' : ''
            }
          >
            <div>
              <div className={`${classes.header} ${classes.masterColor}`}>
                <Typography
                  component='div'
                  variant='labelLarge'
                  className={'display-flex'}
                >
                  {t('all_sections')}
                </Typography>
                {/* <Box display='flex' alignSelf='center' justifyContent='flex-end' p={1} className={classes.iconAdd}>
                  <AddIcon fontSize='small' />
                </Box> */}
              </div>
              <div className={classes.listActivity}>
                <AvailableListDnd
                  courseItemMap={courseDayDetail.masterItem}
                  columnKey={`masterItem-${courseDayId}`}
                  handleIconsMore={handleIconsMore}
                  hasPermission={hasPermission}
                  viewMasterDetail={viewMasterDetail}
                  handleChangeMasterStatus={handleChangeMasterStatus}
                />
              </div>
              {/* :
                <Box m={1}>
                  <AvailableList courseItemMap={courseDayDetail.masterItem} columnKey={`masterItem-${courseDayId}`} handleIconsMore={handleIconsMore} hasPermission={hasPermission}/>
                </Box>
              } */}
            </div>
          </div>
        </div>
      </div>

      {shadowItems?.map((item, index) => (
        <ShadowItem
          item={item}
          key={index}
          index={index}
          courseDayId={courseDayId}
          shadowHeight={shadowHeight[index]}
          classes={classes}
          hasPermission={hasPermission}
          viewShadowDetail={viewShadowDetail}
          handleIconsMore={handleIconsMore}
          handleRelinkShadowItem={handleRelinkShadowItem}
        />
      ))}
    </div>
  );
}, areEqual);
const ShadowItem = ({
  item,
  index,
  shadowHeight,
  classes,
  courseDayId,
  hasPermission,
  handleIconsMore,
  viewShadowDetail,
  handleRelinkShadowItem,
}) => {
  const currentCourseDayId = useSelector(
    (state) => state.AllCourses.currentCourseDayId
  );
  return (
    <div style={{ height: shadowHeight || '100%' }} key={index}>
      {item.data.isEmpty ? (
        <div className={`${classes.masterItem} ${classes.shadow} empty`} />
      ) : (
        <div
          className={`${classes.shadow} ${classes.masterItem} ${classes.shadowColor} ${classes.shadowStyle} shadow_${index}`}
          data-tut={
            courseDayId === currentCourseDayId ? 'reactour__shadowItem' : ''
          }
        >
          <div>
            <div className={`${classes.header} ${classes.shadowColor}`}>
              <div className='headers'>
                <Typography
                  variant='labelLarge'
                  component='p'
                  color='primary'
                  className={'text-ellipsis'}
                >
                  {item?.data?.sectionName}
                </Typography>
                <Typography
                  variant='bodyMedium'
                  component='p'
                  color='primary'
                  className='text-ellipsis'
                >
                  {moment(item.data.timeFrom).format('MMM DD, YYYY')} -{' '}
                  {moment(item.data.timeFrom).format('hh:mm a')} to{' '}
                  {moment(item.data.timeTo).format('hh:mm a')}
                </Typography>
              </div>
            </div>
          </div>
          {/* {!isScrolling ? */}
          <div className={`${classes.listActivity} ${classes.shadowItem}`}>
            <AvailableListDnd
              handleIconsMore={handleIconsMore}
              viewShadowDetail={viewShadowDetail}
              courseItemMap={item}
              columnKey={`shadowItem-${courseDayId}-${item?.data.id}`}
              hasPermission={hasPermission}
              handleRelinkShadowItem={handleRelinkShadowItem}
            />
          </div>
          {/* :
            <Box m={1}>
              <AvailableList handleIconsMore={handleIconsMore} courseItemMap={item} columnKey={`shadowItem-${courseDayId}-${item?.data.id}`} hasPermission={hasPermission}/>
            </Box>
          } */}
        </div>
      )}
    </div>
  );
};
ShadowItem.propTypes = {
  handleIconsMore: PropTypes.func,
  viewShadowDetail: PropTypes.func,
  classes: PropTypes.object,
  shadowHeight: PropTypes.number,
  item: PropTypes.object,
  courseDayId: PropTypes.string,
  index: PropTypes.number,
  hasPermission: PropTypes.bool,
  isScrolling: PropTypes.bool,
  handleRelinkShadowItem: PropTypes.func,
};
CourseDayColumn.propTypes = {
  t: PropTypes.func,
  data: PropTypes.object,
  handleIconsMore: PropTypes.func,
  viewShadowDetail: PropTypes.func,
  worker: PropTypes.object,
  hasPermission: PropTypes.bool,
  isScrolling: PropTypes.bool,
  viewMasterDetail: PropTypes.func,
  handleRelinkShadowItem: PropTypes.func,
  handleChangeMasterStatus: PropTypes.func,
};

export default CourseDayColumn;
