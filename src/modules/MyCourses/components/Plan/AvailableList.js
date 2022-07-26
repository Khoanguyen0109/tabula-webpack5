import React from 'react';
import { areEqual } from 'react-window';

import isEmpty from 'lodash/isEmpty';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import TblInputLabel from 'components/TblInputLabel';

import PropTypes from 'prop-types';

// import { makeStyles } from '@mui/material/styles';
import ActivitiesList from './ActivitiesListWithoutDnd';

// The list showing when scrolling
const AvailableList = React.memo(function(props) {
  const { t, courseItemMap, handleIconsMore, columnKey, hasPermission, viewShadowDetail } = props;
  // const [dataMap, setDataMap] = useState(null);
  // const classes = useStyles();
  const dataMap = courseItemMap?.quoteMap ? courseItemMap.quoteMap[`${columnKey}`] : {};
  if (!!!dataMap) {
    return null;
  }
  // const lessons = dataMap['lessons'];
  const renderLabel = (label) => {
    if (label === 'noItems') {
      return (
        <Box ml={1}>
          <Typography variant='bodyMedium' component='p' color='primary' >No Activities</Typography>
        </Box>
      );
    }
    return (
      <TblInputLabel>{label}</TblInputLabel>
    );
  };
  // console.log('DnD', courseItemMap);
  return (
    <>
      {
        !isEmpty(dataMap?.lessons) && (
          <Box>
            {renderLabel('Lessons')}
            <ActivitiesList key={'lessons'}
viewShadowDetail={viewShadowDetail}
items={dataMap['lessons']}
columnId={`${columnKey}_${courseItemMap.columnKeys.findIndex((i) => i === 'lessons')}`}
t={t} 
              handleIconsMore={handleIconsMore}
hasPermission={hasPermission}
            />
          </Box>
        )
      }
      {courseItemMap && courseItemMap.columnKeys && courseItemMap.columnKeys.map((key, index) => {
        if (key === 'lessons' || key === 'uncategorized') {
          return <></>;
        }
        const items = dataMap[key];

        return <Box key={index}>
          {renderLabel(key)}
          <ActivitiesList key={key}
items={items}
viewShadowDetail={viewShadowDetail}
columnId={`${columnKey}_${index}`}
t={t} 
            handleIconsMore={handleIconsMore}
hasPermission={hasPermission}
          />
        </Box>;

      })}
      {
        !isEmpty(dataMap?.uncategorized) && (
          <Box>
            {renderLabel('Uncategorized')}
            <ActivitiesList key={'uncategorized'}
viewShadowDetail={viewShadowDetail}
items={dataMap['uncategorized']}
columnId={`${columnKey}_${courseItemMap.columnKeys.findIndex((i) => i === 'uncategorized')}`}
t={t} 
              handleIconsMore={handleIconsMore}
hasPermission={hasPermission}
            />
          </Box>
        )
      }
    </>
  );
}, areEqual);

AvailableList.propTypes = {
  t: PropTypes.func,
  courseItemMap: PropTypes.object,
  handleIconsMore: PropTypes.func,
  viewShadowDetail: PropTypes.func,
  columnKey: PropTypes.any,
  hasPermission: PropTypes.bool
};

export default AvailableList;
