import React, { memo } from 'react';

import makeStyles from '@mui/styles/makeStyles';

import TblButton from 'components/TblButton';
import TblDialog from 'components/TblDialog';

import GradeWeighting from 'modules/MyCourses/shared/GradeWeighting/container';

import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiPaper-root': {
      width: theme.spacing(125),
    },
    paddingRight: theme.spacing(2),
    paddingLeft: theme.spacing(2),

  },
}));
function AddGradeWeightingPopup(props) {
  const classes = useStyles();
  const { open, onClose } = props;
  // const { t } = useTranslation();
  return (
    <TblDialog
      className={classes.root}
      open={open}
      title={'Grade Weighting'}
      maxWidth='lg'
      footer={
        <div>
          <TblButton variant='contained' color='primary' onClick={onClose}>
            Done
          </TblButton>
        </div>
      }
    >
      <GradeWeighting />
    </TblDialog>
  );
}

AddGradeWeightingPopup.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool
};

export default memo(AddGradeWeightingPopup);
