import React, { useCallback, useEffect, useState } from 'react';

import Tooltip from '@mui/material/Tooltip';

import PropTypes from 'prop-types';

export default function TblTooltipDynamic(props) {
  const { children, ...rest } = props;
  // const classes = useStyles();
  const textElement = React.createRef();
  const [isOverflowed, setIsOverflowed] = useState(false);
  const scrollWidth = textElement?.current?.scrollWidth;

  const updateWidth = useCallback(() => {
    setIsOverflowed(
      textElement.current.scrollWidth > textElement.current.clientWidth
    );
  }, [textElement]);

  useEffect(() => {
    window.addEventListener('resize', updateWidth);
    updateWidth();
    return function cleanup() {
      window.removeEventListener('resize', updateWidth);
    };
  }, [updateWidth]);

  useEffect(() => {
    updateWidth();
  }, [scrollWidth, updateWidth]);

  return (
    <Tooltip className='dynamic-tooltip' title={children} disableHoverListener={!isOverflowed} {...rest}>
      <div
        ref={textElement}
        style={{
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {children}
      </div>
    </Tooltip>
  );
}

TblTooltipDynamic.propTypes = {
  children: PropTypes.node,
  placement: PropTypes.string,
};
