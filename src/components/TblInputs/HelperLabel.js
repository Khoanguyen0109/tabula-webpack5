import React from 'react';

import HelpOutlineRoundedIcon from '@mui/icons-material/HelpOutlineRounded';

import TblTooltip from 'components/TblTooltip';

import PropTypes from 'prop-types';

function HelperLabel( { helperLabel}) {
    return (
        <TblTooltip title={helperLabel} placement='top' arrow>
        <HelpOutlineRoundedIcon
          style={{ fontSize: 12, height: 16, verticalAlign: 'bottom' }}
        />
      </TblTooltip>
    );
}

HelperLabel.propTypes = {
  helperLabel: PropTypes.string
};

export default HelperLabel;
