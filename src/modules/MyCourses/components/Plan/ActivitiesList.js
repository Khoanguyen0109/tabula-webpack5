import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { areEqual } from 'react-window';

import makeStyles from '@mui/styles/makeStyles';

import PropTypes from 'prop-types';

import ItemDnd from './ItemDnd';

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  dropzone: {
    display: 'flex',
    flexDirection: 'column',
    // trick for case empty list
    minHeight: 1,
  },
  isDraggingOver: {
    transition: 'min-height 0.25s ease-in',
    background: theme.newColors.gray[300],
    minHeight: 94,
    marginTop: -30,
  },
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

const RenderNormalList = React.memo(function (props) {
  const {
    droppableProvided,
    items,
    handleIconsMore,
    hasPermission,
    viewShadowDetail,
    viewMasterDetail,
    handleRelinkShadowItem,
    handleChangeMasterStatus,
  } = props;
  const classes = useStyles();
  return (
    <div
      ref={droppableProvided.innerRef}
      {...droppableProvided.droppableProps}
      className={classes.dropzone}
    >
      {items?.map((i, index) => (
        <Draggable
          draggableId={i.id}
          index={index}
          key={i.id}
          isDragDisabled={!!i.data.planned || !hasPermission}
        >
          {(draggableProvided, snapshot) => (
            <ItemDnd
              provided={draggableProvided}
              item={i}
              isDragging={snapshot.isDragging}
              handleIconsMore={handleIconsMore}
              viewShadowDetail={viewShadowDetail}
              handleRelinkShadowItem={handleRelinkShadowItem}
              hasPermission={hasPermission}
              viewMasterDetail={viewMasterDetail}
              handleChangeMasterStatus={handleChangeMasterStatus}
              // style={}
            />
          )}
        </Draggable>
      ))}
      {droppableProvided.placeholder}
    </div>
  );
}, areEqual);
RenderNormalList.propTypes = {
  droppableProvided: PropTypes.object,
  snapshot: PropTypes.object,
  className: PropTypes.string,
  items: PropTypes.array,
  handleIconsMore: PropTypes.func,
  viewShadowDetail: PropTypes.func,
  hasPermission: PropTypes.bool,
  viewMasterDetail: PropTypes.func,
  handleRelinkShadowItem: PropTypes.func,
  handleChangeMasterStatus: PropTypes.func,
};
const ActivitiesList = function (props) {
  const {
    columnId,
    items,
    handleIconsMore,
    hasPermission,
    viewShadowDetail,
    viewMasterDetail,
    handleRelinkShadowItem,
    handleChangeMasterStatus,
  } = props;
  const classes = useStyles();
  // console.log('Activity list');
  // console.log(items);
  return (
    <div className={classes.root}>
      <Droppable
        droppableId={columnId}
        // mode='virtual'
        renderClone={(provided, snapshot, rubric) => (
          <ItemDnd
            provided={provided}
            isDragging={snapshot.isDragging}
            item={items[rubric.source.index]}
            style={{ margin: 0 }}
            key={columnId}
            isClone={true}
            handleIconsMore={handleIconsMore}
          />
        )}
      >
        {(droppableProvided, snapshot) => (
          // return <VirtualList
          //             droppableProvided={droppableProvided}
          //             snapshot={snapshot}
          //             className={classes.isDraggingOver}
          //             items={items}
          //             DraggableItem={DraggableItem}
          //             handleIconsMore={handleIconsMore} />;
          <RenderNormalList
            droppableProvided={droppableProvided}
            snapshot={snapshot}
            // className={classes.isDraggingOver}
            items={items}
            handleIconsMore={handleIconsMore}
            viewShadowDetail={viewShadowDetail}
            viewMasterDetail={viewMasterDetail}
            handleRelinkShadowItem={handleRelinkShadowItem}
            handleChangeMasterStatus={handleChangeMasterStatus}
            hasPermission={hasPermission}
          />
        )}
      </Droppable>
    </div>
  );
};

ActivitiesList.propTypes = {
  columnId: PropTypes.number,
  items: PropTypes.array,
  handleIconsMore: PropTypes.func,
  viewShadowDetail: PropTypes.func,
  hasPermission: PropTypes.bool,
  viewMasterDetail: PropTypes.func,
  handleRelinkShadowItem: PropTypes.func,
  handleChangeMasterStatus: PropTypes.func,
};

export default ActivitiesList;
