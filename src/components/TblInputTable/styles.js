import makeStyles from '@mui/styles/makeStyles';
const useStyles = makeStyles((theme) => ({
  root: {
    maxHeight: 60,
    // marginBottom: theme.spacing(2),
    '& .MuiTextField-root': {
      '& .MuiInputLabel-outlined': {
        display: 'none'
      },
    },
    '&.multiline': {
      maxHeight: 'inherit',
      '& .MuiOutlinedInput-multiline': {
        padding: 0
      }
    },
    '& .MuiOutlinedInput-root': {
      borderRadius: theme.spacing(1),
      color: theme.mainColors.primary1[0],
      fontWeight: theme.fontWeight.normal,
      background: theme.openColors.white,
      '& .MuiIconButton-root': {
        padding: theme.spacing(0),
        color: theme.mainColors.primary1[0],
        '&:hover, &:focus': {
          background: 'none'
        },
      },
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: `${theme.newColors.gray[300]}`,
      '& legend': {
        maxWidth: 0
      }
    },
    '& .MuiOutlinedInput-input': {
      fontSize: theme.fontSize.normal,
      boxShadow: 'none',
      '&:hover, &:focus': {
        boxShadow: 'none'
      }
    },

    '& .MuiFormHelperText-root': {
      margin: 0,
      display: 'none'
    },
    '& .MuiInputAdornment-root': {
      fontSize: theme.fontSizeIcon.normal
    },
    '& .Mui-disabled': {
      backgroundColor: theme.newColors.gray[100],
      color: theme.newColors.gray[700]
    },
    '& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.newColors.gray[300],
    }
  },
  large: {
    '& .MuiOutlinedInput-input': {
      padding: theme.spacing(1.5, 1, 1.5, 1)
    },
  },
  medium: {
    '& .MuiOutlinedInput-input': {
      padding: theme.spacing(1.25, 1)
    },
  },
  viewOnly: {
    background: theme.newColors.gray[100],
    '& .MuiOutlinedInput-input': {
      color: `${theme.newColors.gray[700]} !important`,

    },
    '& .MuiIconButton-label': {
      color: `${theme.newColors.gray[700]} !important`,
    }
  },
  noneBorder: {
    // marginBottom: theme.spacing(0),
    '& .MuiOutlinedInput-root': {
      borderRadius: 0
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none'
    }
  },
  noneMarginBottom: {
    marginBottom: theme.spacing(0),
  }
}));

export default useStyles;