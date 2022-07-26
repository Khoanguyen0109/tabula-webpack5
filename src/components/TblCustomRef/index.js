import React from 'react';

import PropTypes from 'prop-types';

const TblCustomRef = React.forwardRef(function CustomComponent(props, ref) {
    const {children} = props;
    return (
      <div ref={ref}>
        {children}
      </div>
    );
  });

TblCustomRef.propTypes = {
  children: PropTypes.node
};
export default TblCustomRef;
