import React from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';

import TblIconButton from 'components/TblIconButton';

import PropTypes from 'prop-types';
const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    right: '34px',
    top: '-4px',
    '& .MuiBox-root': {
      padding: theme.spacing(0),
    },
  },
  errorMessage: {
    color: theme.palette.error.main,
    paddingLeft: theme.spacing(1),
    '&: first-letter': {
      textTransform: 'capitalize',
    },
  },
}));
function TblFormHelperTextInTable(props) {
  const { errorMessage, onAbort, onSave } = props;
  const classes = useStyles();

  const handleCancel = () => {
    if (onAbort) {
      onAbort();
    }
  };

  const handleSubmit = () => {
    if (onSave) {
      onSave();
    }
  };

  return (
    <div className={classes.root}>
      <Box display='flex' p={1} alignItems='center'>
        <Box p={1} flexGrow={1}>
          <Typography variant='bodySmall' className={classes.errorMessage}>
            {errorMessage}
          </Typography>
        </Box>
          <Box
            display='flex'
            flexGrow={1}
            // justifyContent='flex-end'
            className='actionBox'
          >
            <Box mr={0.5}>
              <TblIconButton
                aria-label='cancel'
                variant='outlined'
                onClick={handleCancel}
              >
                <span className='icon-icn_close' />
              </TblIconButton>
            </Box>
            <Box>
              <TblIconButton
                color='primary'
                aria-label='submit'
                onClick={handleSubmit}
              >
                <span className='icon-icn_check' />
              </TblIconButton>
            </Box>
          </Box>
      </Box>
    </div>
  );
}

TblFormHelperTextInTable.propTypes = {
  showActions: PropTypes.bool,
  onAbort: PropTypes.func,
  onSave: PropTypes.func,
  errorMessage: PropTypes.string,
};

TblFormHelperTextInTable.defaultProps = {
  showActions: false,
  onAbort: null,
  onSave: null,
  errorMessage: '',
};
export default TblFormHelperTextInTable;
