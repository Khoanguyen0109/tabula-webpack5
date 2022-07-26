// const VirtualList = React.memo(function(props) {
//   const { droppableProvided, snapshot, items, DraggableItem, handleIconsMore } = props;
//     let height = (items?.length > 5 ? 5 : items?.length ?? 1) * 94;
//     // console.log(snapshot);
//     return <List
//         height={height}
//         itemCount={items.length}
//         itemSize={94}
//         width={264}
//         outerRef={droppableProvided.innerRef}
//         className={clsx('', {[props.className]: snapshot.isDraggingOver})}
//         // style={draggingOverStyle(snapshot.isDraggingOver)}
//         // style={{
//         //   backgroundColor: getBackgroundColor(
//         //     snapshot.isDraggingOver,
//         //     Boolean(snapshot.draggingFromThisWith),
//         //     items.length * 94
//         //   ),
//         //   transition: 'background-color 0.2s ease',
//         //   maxWidth: '100%',
//         //   minWidth: '100%',
//         //   maxHeight: '100%',
//         //   minHeight: '100%',

//         //   // We add this spacing so that when we drop into an empty list we will animate to the correct visual position.
//         //   // padding: 8,
//         // }}
//         itemData={{items, handleIconsMore}}
//         outerElementType={CustomScrollbar}
//       >
//         {DraggableItem}
//       </List>;
// }, areEqual);

// VirtualList.propTypes = {
//   droppableProvided: PropTypes.any,
//   snapshot: PropTypes.any,
//   className: PropTypes.string,
//   items: PropTypes.array,
//   DraggableItem: PropTypes.any,
//   handleIconsMore: PropTypes.any
// };