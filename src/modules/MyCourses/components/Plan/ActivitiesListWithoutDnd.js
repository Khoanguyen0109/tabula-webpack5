import React from 'react';
import { areEqual } from 'react-window';

import Box from '@mui/material/Box';
import makeStyles from '@mui/styles/makeStyles';

import PropTypes from 'prop-types';

import ActivityItem from './ActivityItem';

const useStyles = makeStyles((theme) => ({
  dropzone: {
    display: 'flex',
    flexDirection: 'column',
    // trick for case empty list
    minHeight: 1
  },
  isDraggingOver: {
    transition: 'min-height 0.25s ease-in',
    background: theme.newColors.gray[300],
    minHeight: 94,
    marginTop: -30
  }
}));

// const DraggableItem = React.memo((props) => {
//   const { data: { items, handleIconsMore, hasPermission}, index, style} = props;
//   const item = items?.[index];
//   if (!item) {
//     return null;
//   }

//   // Faking some nice spacing around the items
//   const patchedStyle = {
//     ...style,
//     // left: style.left + grid,
//     // top: style.top + grid,
//     // width: `calc(${style.width} - ${grid * 2}px)`,
//     // height: style.height - grid,
//   };

//   return (
//     <Draggable draggableId={item.id} index={index} key={item.id} isDragDisabled={!!item.data.planned || !hasPermission}>
//       {(provided, snapshot) => (
//         <ItemDnd
//           provided={provided}
//           item={item}
//           isDragging={snapshot.isDragging}
//           style={patchedStyle}
//           handleIconsMore={handleIconsMore}
//         />
//       )}
//     </Draggable>
//   );
// }, areEqual);

// DraggableItem.propTypes ={
//   data: PropTypes.object,
//   provided: PropTypes.any,
//   style: PropTypes.any,
//   index: PropTypes.any
// };

const RenderNormalList = React.memo(function(props) {
  const { items, hasPermission } = props;
  const classes = useStyles();
  return (
    <div 
        className={classes.dropzone}
    >
      {items?.map((i, index) => (
          <ActivityItem
            key={index}
            hasPermission={hasPermission}
            id={i.id}
dataItem={i}
isClone={true}
          />
      ))}
    </div>);
}, areEqual);
RenderNormalList.propTypes = {
  snapshot: PropTypes.any,
  className: PropTypes.string,
  items: PropTypes.array,
  DraggableItem: PropTypes.any,
  handleIconsMore: PropTypes.any,
  hasPermission: PropTypes.bool
};
const ActivitiesList = React.memo(function(props) {
  const { items, hasPermission } = props;
  return (
    <Box mt={1} mb={1} >
        <RenderNormalList items={items} hasPermission={hasPermission} />
    </Box>
  );
}, areEqual);

ActivitiesList.propTypes = {
  columnId: PropTypes.any,
  items: PropTypes.array,
  handleIconsMore: PropTypes.func,
  hasPermission: PropTypes.bool
};

export default ActivitiesList;
