import React from 'react';

import { Box, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

import { getMaterialIconByExt } from 'utils/getMaterialIconByExt';

import { ReactComponent as Hook } from 'assets/custom/hook.svg';
import PropTypes from 'prop-types';
import { splitNameAndExtension } from 'utils';

// material-ui
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    cursor: 'pointer',
  },
  content: {
    position: 'relative',
    display: 'flex',
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(7.5),
  },
  hook: {
    position: 'absolute',
    top: theme.spacing(-2),
    left: '-30px',
  },
  icon: {
    marginRight: theme.spacing(1),
  },
  navigation: {
    position: 'relative',
    // marginLeft: theme.spacing(0.5),
    height: (props) => (props.isLast ? theme.spacing(6) : theme.spacing(4)),
    width: '7px',
    borderLeft: `1px solid ${ theme.newColors.gray[400]}`,
  },
}));

const AttemptFile = (props) => {
  const { file, isLast, previewFiles } = props;
  const classes = useStyles({ isLast });

  return (
    <Box className={classes.root} onClick={() => previewFiles(file)}>
      <div className={classes.navigation} />

      <div className={classes.content}>
        <div className={classes.hook}>
          <Hook />
        </div>
        <Box className={classes.icon}>
          {file &&
            getMaterialIconByExt(
              splitNameAndExtension(file.originalName ?? ''),
              file
            )}
        </Box>
        <Typography
          component='div'
          sx={{ maxWidth: '550px' }}
          className='text-ellipsis'
          variant='bodyMedium'
        >
          {file.originalName}
        </Typography>
      </div>
    </Box>
  );
};

AttemptFile.propTypes = {
  file: PropTypes.shape({
    filename: PropTypes.string,
    originalName: PropTypes.string,
  }),
  isLast: PropTypes.bool,
  previewFiles: PropTypes.func,
};

export default AttemptFile;
