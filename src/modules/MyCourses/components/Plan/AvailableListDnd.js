import React from 'react';

import isEmpty from 'lodash/isEmpty';

import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';

import PropTypes from 'prop-types';
// import Box from '@mui/material/Box';

// import { makeStyles } from '@mui/material/styles';
import ActivitiesList from './ActivitiesList';

// const useStyles = makeStyles((theme) => ({
//   columnContainer: {
//   },
//   wrapper: {
//   },
// }));

const AvailableListDnd = function (props) {
  const {
    t,
    courseItemMap,
    handleIconsMore,
    columnKey,
    hasPermission,
    viewShadowDetail,
    viewMasterDetail,
    handleRelinkShadowItem,
    handleChangeMasterStatus,
  } = props;
  // const [dataMap, setDataMap] = useState(null);
  // const classes = useStyles();
  const dataMap = courseItemMap?.quoteMap
    ? courseItemMap.quoteMap[`${columnKey}`]
    : {};
  // console.log(dataMap);
  // useEffect(() => {
  //   if (courseItemMap?.quoteMap) {
  //     setDataMap(courseItemMap.quoteMap[`${columnKey}`]);
  //   }
  // }, [courseItemMap, columnKey]);
  // console.log(courseItemMap, columnKey);
  if (!!!dataMap) {
    return null;
  }
  // const lessons = dataMap['lessons'];
  const renderLabel = (label) => {
    if (label === 'noItems') {
      return (
        <Box pl={1}>
          <Typography variant='bodyMedium' component='p' color='primary'>
            No Activities
          </Typography>
        </Box>
      );
    }
    return (
      <Box pl={1}>
        <Typography variant='labelLarge' className={'text-ellipsis-2row'}>
          {label}
        </Typography>
      </Box>
    );
  };
  // console.log('DnD', courseItemMap);
  return (
    <React.Fragment key={props.key ?? 'available-list-dnd'}>
      {!isEmpty(dataMap?.lessons) && (
        <div key={`${columnKey}_lessons`}>
          {renderLabel('Lesson')}
          <ActivitiesList
            key={'lessons'}
            viewShadowDetail={viewShadowDetail}
            items={dataMap['lessons']}
            columnId={`${columnKey}_${courseItemMap.columnKeys.findIndex(
              (i) => i === 'lessons'
            )}`}
            t={t}
            handleIconsMore={handleIconsMore}
            hasPermission={hasPermission}
            viewMasterDetail={viewMasterDetail}
            handleRelinkShadowItem={handleRelinkShadowItem}
            handleChangeMasterStatus={handleChangeMasterStatus}
          />
        </div>
      )}
      {courseItemMap &&
        courseItemMap.columnKeys &&
        courseItemMap.columnKeys.map((key, index) => {
          if (key === 'lessons' || key === 'uncategorized') {
            return <></>;
          }
          const items = dataMap[key];

          return (
            <div key={`${columnKey}_${key}_${index}`}>
              {renderLabel(key)}
              <ActivitiesList
                viewShadowDetail={viewShadowDetail}
                key={key}
                items={items}
                columnId={`${columnKey}_${index}`}
                t={t}
                handleIconsMore={handleIconsMore}
                hasPermission={hasPermission}
                viewMasterDetail={viewMasterDetail}
                handleRelinkShadowItem={handleRelinkShadowItem}
                handleChangeMasterStatus={handleChangeMasterStatus}
              />
            </div>
          );
        })}
      {!isEmpty(dataMap?.uncategorized) && (
        <div key={`${columnKey}_uncategorized`}>
          {renderLabel('Uncategorized')}
          <ActivitiesList
            key={'uncategorized'}
            items={dataMap['uncategorized']}
            columnId={`${columnKey}_${courseItemMap.columnKeys.findIndex(
              (i) => i === 'uncategorized'
            )}`}
            t={t}
            handleIconsMore={handleIconsMore}
            viewShadowDetail={viewShadowDetail}
            hasPermission={hasPermission}
            viewMasterDetail={viewMasterDetail}
            handleRelinkShadowItem={handleRelinkShadowItem}
            handleChangeMasterStatus={handleChangeMasterStatus}
          />
        </div>
      )}
    </React.Fragment>
  );
};

AvailableListDnd.propTypes = {
  t: PropTypes.func,
  courseItemMap: PropTypes.object,
  handleIconsMore: PropTypes.func,
  viewShadowDetail: PropTypes.func,
  columnKey: PropTypes.any,
  key: PropTypes.string,
  hasPermission: PropTypes.bool,
  viewMasterDetail: PropTypes.func,
  handleRelinkShadowItem: PropTypes.func,
  handleChangeMasterStatus: PropTypes.func,
};

export default AvailableListDnd;
