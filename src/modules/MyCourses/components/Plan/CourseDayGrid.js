import React from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList as List } from 'react-window';

import makeStyles from '@mui/styles/makeStyles';

import PropTypes from 'prop-types';

import CourseDayColumn from '../../containers/Plan/CourseDayColumn';

const grid = 8;

const useStyles = makeStyles(() => ({
  columnContainer: {
    // borderRadius: '8px',
    // backgroundColor: 'green',
    // flexShrink: 0,
    // margin: '8px',
    // display: 'flex',
    // flexDirection: 'column'
  },
  wrapper: {
    backgroundColor: `${(props) =>
      getBackgroundColor(props.isDraggingOver, props.isDraggingFrom)}`,
    display: 'flex',
    flexDirection: 'flex',
    opacity: `${({ isDropDisabled }) => (isDropDisabled ? 0.5 : 'inherit')}`,
    padding: `${grid}px`,
    border: `${grid}px`,
    paddingBottom: 0,
    transition: 'background-color 0.2s ease, opacity 0.1s ease',
    userSelect: 'none',
    width: '250px',
  },
}));

const CustomScrollbar = React.forwardRef((props, ref) => (
  <PerfectScrollbar {...props} containerRef={ref} />
));

const getBackgroundColor = (isDraggingOver, isDraggingFrom) => {
  if (isDraggingOver) {
    return 'blue';
  }
  if (isDraggingFrom) {
    return 'red';
  }
  return 'white';
};

// function getStyle(provided, style) {
//   if (!style) {
//     return provided.draggableProps.style;
//   }

//   return {
//     ...provided.draggableProps.style,
//     ...style,
//   };
// }
const renderColumn = ({
  index,
  style,
  data: { list, handleIconsMore },
}) => (
  <div key={index} style={style}>
    <CourseDayColumn data={list[index]} handleIconsMore={handleIconsMore} />
  </div>
);
renderColumn.propTypes = {
  t: PropTypes.func,
  index: PropTypes.number,
  isScrolling: PropTypes.bool,
  style: PropTypes.object,
  data: PropTypes.object,
};
const CourseDayGrid = React.memo(function (props) {
  const { handleIconsMore } = props;
  const classes = useStyles();
  // console.log('Course Day');
  return (
    <AutoSizer>
      {({ height, width }) => (
        // console.log('Course Day');
        // console.log(height, width);
        <List
          className={classes.list}
          height={height - 50}
          itemCount={props.list.length}
          itemSize={296}
          // useIsScrolling
          width={width}
          layout='horizontal'
          itemData={{ list: props.list, handleIconsMore }}
          outerElementType={CustomScrollbar}
        >
          {renderColumn}
        </List>
      )}
    </AutoSizer>
  );
});

CourseDayGrid.propTypes = {
  t: PropTypes.func,
  data: PropTypes.object,
  columnId: PropTypes.number,
  quotes: PropTypes.array,
  handleIconsMore: PropTypes.func,
  list: PropTypes.array,
};

export default CourseDayGrid;
