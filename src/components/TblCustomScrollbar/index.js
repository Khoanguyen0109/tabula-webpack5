import React, { useCallback, useEffect, useRef } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';

import PropTypes from 'prop-types';

const TblCustomScrollbar = ({
  onScroll,
  forwardedRef,
  style,
  maxHeightScroll,
  children,
  suppressScrollY,
  suppressScrollX,
  scrollTo,
}) => {
  const containerRef = useRef();

  const refSetter = useCallback(
    (scrollbarsRef) => {
      if (typeof forwardedRef === 'function') {
        if (scrollbarsRef) {
          forwardedRef(scrollbarsRef.view);
        } else {
          forwardedRef(null);
        }
      }
    },
    [forwardedRef]
  );

  useEffect(() => {
    const curr = containerRef.current;
    if (curr && scrollTo) {
      curr.scrollLeft = scrollTo;
    }
  }, [scrollTo]);

  return (
    <PerfectScrollbar
      containerRef={(el) => (containerRef.current = el)}
      ref={refSetter}
      style={{ ...style, maxHeight: maxHeightScroll, overflowY: 'hidden' }}
      onScroll={onScroll}
      options={{
        wheelPropagation: true,
        suppressScrollY: suppressScrollY,
        suppressScrollX: suppressScrollX,
      }}
    >
      {children}
    </PerfectScrollbar>
  );
};

TblCustomScrollbar.propTypes = {
  children: PropTypes.node,
  forwardedRef: PropTypes.any,
  maxHeightScroll: PropTypes.number,
  onScroll: PropTypes.func,
  scrollTo: PropTypes.number,
  style: PropTypes.object,
  suppressScrollX: PropTypes.bool,
  suppressScrollY: PropTypes.bool,
};

TblCustomScrollbar.defaultProps = {
  suppressScrollY: false,
  suppressScrollX: true,
  maxHeightScroll: 680,
};

export default TblCustomScrollbar;
