import React from 'react';

import Tooltip from '@mui/material/Tooltip';
import makeStyles from '@mui/styles/makeStyles';

const useStylesTooltip = makeStyles((theme) => ({
  arrow: {
    color: theme.palette.common.black,
  },
  tooltip: {
    color: 'white',
    backgroundColor: theme.palette.common.black,
    fontSize: theme.fontSize.normal,
    // borderRadius: theme.borderRadius.default
  },
}));

function TblTooltip(props) {
  const classes = useStylesTooltip();

  return <Tooltip arrow classes={classes} {...props} />;
}
TblTooltip.propTypes = {
};
TblTooltip.defaultProps = {
  title: ''
};
export default React.forwardRef((props, ref) => <TblTooltip ref={ref} {...props} />);