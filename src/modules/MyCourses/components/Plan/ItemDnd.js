import React from 'react';

// import clsx from 'clsx';
import PropTypes from 'prop-types';

import ActivityItem from './ActivityItem';

const ItemDnd = React.memo(function (props) {
  const {
    item,
    provided,
    // isDragging,
    isClone,
    // style,
    index,
    handleIconsMore,
    viewShadowDetail,
    hasPermission,
    viewMasterDetail,
    handleRelinkShadowItem,
    handleChangeMasterStatus
  } = props;

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      // style={getStyle(provided, style)}
      data-index={index}
    >
      <ActivityItem id={item.id}
dataItem={item}
viewShadowDetail={viewShadowDetail}
handleIconsMore={handleIconsMore}
isClone={isClone}
hasPermission={hasPermission}
        viewMasterDetail={viewMasterDetail}
handleRelinkShadowItem={handleRelinkShadowItem}
handleChangeMasterStatus={handleChangeMasterStatus}
      />
    </div>
  );
});
ItemDnd.propTypes ={
  item: PropTypes.object,
  provided: PropTypes.object,
  isDragging: PropTypes.bool,
  isClone: PropTypes.bool,
  style: PropTypes.object,
  index: PropTypes.number,
  handleIconsMore: PropTypes.func,
  hasPermission: PropTypes.bool,
  viewShadowDetail: PropTypes.func,
  viewMasterDetail: PropTypes.func,
  handleRelinkShadowItem: PropTypes.func,
  handleChangeMasterStatus: PropTypes.func
};
export default ItemDnd;