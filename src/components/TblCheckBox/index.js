import React from 'react';

import Checkbox from '@mui/material/Checkbox';
import SvgIcon from '@mui/material/SvgIcon';
import withStyles from '@mui/styles/withStyles';

import { ReactComponent as CheckboxIndeterminate } from 'assets/images/icn_checkbox_indeterminate.svg';
import { ReactComponent as CheckboxSelected } from 'assets/images/icn_checkbox_selected.svg';
import { ReactComponent as CheckboxUnselected } from 'assets/images/icn_checkbox_unselected.svg';

import styles from './styles';

const TabulaCheckbox = (props) => <Checkbox
    {...props}
    disableRipple
    checkedIcon={<SvgIcon component={CheckboxSelected} />}
    indeterminateIcon={<SvgIcon component={CheckboxIndeterminate} />}
    icon={<SvgIcon component={CheckboxUnselected} />}
  />;

export default withStyles(styles)(TabulaCheckbox);
