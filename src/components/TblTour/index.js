import React from 'react';
import Tour from 'reactour';

import Dialog from '@mui/material/Dialog';
import makeStyles from '@mui/styles/makeStyles';

import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  hidden: {
    '& .MuiBackdrop-root': {
      background: 'transparent',
    },
  },
  helper: {
    '--reactour-accent': theme.customColors.primary1.main,
    width: theme.spacing(34),
    padding: `${theme.spacing(2) }px !important`,

    '& [data-tour-elem="controls"]': {
      marginTop: theme.spacing(1),
      justifyContent: (props) => props.steps.length >1? 'space-between' : 'flex-end',
      '& [data-tour-elem="left-arrow"]': {
          display: 'none'
      },
      '& button': {
        padding: 0,
        '& span': {

          fontSize: theme.fontSize.normal,
          fontWeight: theme.fontWeight.semi,
          color: theme.customColors.primary1.main, }
      }
    }
  },

}));

function TblTour(props) {
  const classes = useStyles(props);
  const { isOpen ,steps} = props;
  // const accentColor = "1A7AE5";
  return <>
    <Dialog className={classes.hidden} open={isOpen} disableEscapeKeyDown />
    <Tour
      className={classes.helper}
      showCloseButton={false}
      disableKeyboardNavigation={true}
      disableDotsNavigation={true}
      rounded={10}
      showNumber={false}
      showNavigation={steps.length> 1}
      nextButton={'Next'}
      maskSpace={5}
      {...props}
      // CustomHelper={MyCustomHelper}
    />
  </>;
}

TblTour.propTypes = {
  isOpen: PropTypes.bool,
  steps: PropTypes.array
};

export default TblTour;
