import React from 'react';

import makeStyles from '@mui/styles/makeStyles';

import TblTable from 'components/TblTable';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTableCell-head': {
      borderRight: `1px solid ${theme.mainColors.gray[4]}`,
      '&:nth-last-child(2)': {
        borderRight: `1px solid ${theme.mainColors.gray[4]}`,
        borderTopRightRadius: theme.spacing(1)
      }
    },
    '& .MuiTableCell-body': {
      borderRight: `1px solid ${theme.mainColors.gray[4]}`,
      padding: theme.spacing(0, 1)
    },
    '& .MuiTableRow-root': {
      '&:last-child': {
        '& .MuiTableCell-body': {
          '&:nth-last-child(2)': {
            borderBottomRightRadius: theme.spacing(1),
          },
        }
      },
    },
    '& .MuiIconButton-root': {
      padding: 0
    },
    '& .MuiSvgIcon-fontSizeSmall': {
      fontSize: theme.fontSizeIcon.normal
    },
    '& .tbl-list-container': {
      '& .MuiSelect-root': {
        padding: theme.spacing(1.5, 3.5, 1.5, 0),
        width: '100%'
      },
      '& .MuiSelect-icon': {
        top: 'auto'
      }
    },
    '& .MuiOutlinedInput-notchedOutline, .MuiOutlinedInput-root:hover,.MuiOutlinedInput-root:focus, .Mui-focused .MuiOutlinedInput-notchedOutline ': {
      border: 'none !important'
    },
    '& .MuiFormControl-root': {
      width: '100%'
    },
    '& .MuiInput-underline:before, & .MuiInput-underline:hover:not(.Mui-disabled):before, & .MuiInput-underline:after': {
      border: 'none'
    },

    '& .TblInputs': {
      marginBottom: 0,
      marginLeft: theme.spacing(-1)
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none'
    },
    '& .Mui-disabled': {
      background: 'none'
    },
    '& .disabled': {
      '& .MuiTableCell-body:last-child': {
        display: 'none'
      }
    }
  }

}));
// NOTE: TableForm apply css for input and can apply action cell for each row
function TblTableForm(props) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <TblTable {...props} />
    </div>
  );
}

TblTableForm.propTypes = {

};

export default TblTableForm;
