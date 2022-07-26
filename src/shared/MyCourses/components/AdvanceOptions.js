import React from 'react';
import { useTranslation } from 'react-i18next';

import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';

import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
    advance: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: theme.spacing(3.5),
        paddingLeft: theme.spacing(1),
        '&:hover': {
            cursor: 'pointer'
        },
        '& .MuiTypography-root': {
          color: theme.customColors.primary1.main,
          fontSize: theme.fontSize.medium,
          fontWeight: theme.fontWeight.semi,
          marginRight: theme.spacing(1),
        },
        '& .MuiSvgIcon-root': {
          width: theme.spacing(3),
          height: theme.spacing(3),
          marginTop: theme.spacing(0.25),
          backgroundColor: theme.customColors.primary1.main,
          color: 'white',
          borderRadius: '12px',
        },
    }
}));
function AdvanceOptions(props) {
    const {open, onClose} = props;
    const { t} = useTranslation('myCourses');
    const classes = useStyles();
    return (
        <>
            <Box
              onClick={onClose}
              className={classes.advance}
            >
              <Typography>{t('advance_options')}</Typography>
              {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </Box>
            <Collapse in={open}>
                {props.children}
            </Collapse>
        </>
    );
}

AdvanceOptions.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func,
  open: PropTypes.bool
};

export default AdvanceOptions;
