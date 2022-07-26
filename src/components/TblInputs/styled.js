import makeStyles from '@mui/styles/makeStyles';
const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    marginBottom: theme.spacing(1),

    '& ::placeholder': {
      color: theme.globalColors.placeholderColor,
      opacity: 1,
    },
    '& .react-tel-input': {
      marginLeft: theme.spacing(6),
      '& .form-control': {
        padding: theme.spacing(1.5),
        borderRadius: theme.spacing(1),
        minHeight: '40px',
        color: theme.mainColors.primary1[0],
        fontWeight: theme.fontWeight.normal,
        background: theme.openColors.white,
        transition: theme.transitionDefault,
        '&:-webkit-autofill, :-webkit-autofill:focus, :-webkit-autofill:hover, :-webkit-autofill:active, :-internal-autofill-selected':
          {
            '-webkit-box-shadow': '0 0 0 30px white inset !important',
            '-webkit-text-fill-color': theme.mainColors.primary1[0],
          },
        '&:hover': {
          borderColor: theme.customColors.primary1.main,
          boxShadow: 'rgba(235,241,249,1) 0 0 0 3px',
        },
        '&:focus': {
          borderColor: theme.customColors.primary1.main,
          boxShadow: 'rgba(235,241,249,1) 0 0 0 3px',
        },
      },
      '& .flag-dropdown': {
        background: 'none',
        borderRadius: theme.spacing(1),
        left: theme.spacing(-6),
        '&:hover': {
          background: 'none',
          borderColor: theme.customColors.primary1.main,
          borderRadius: theme.spacing(1),
        },
        '& .selected-flag': {
          background: 'none',
          '&:hover': {
            background: 'none',
          },
          '&:focus': {
            background: 'none',
          },
        },
      },
      '& .selected-flag': {
        background: 'none',
        '&:hover': {
          background: 'none',
        },
        '&:focus': {
          background: 'none',
        },
      },
      '& .country-list': {
        color: theme.mainColors.primary1[0],
        borderRadius: theme.borderRadius.default,
        '& li': {
          whiteSpace: 'normal',
          paddingRight: theme.spacing(4),
          paddingTop: '10px',
          paddingBottom: '10px',
          fontSize: theme.fontSize.medium,

          '&:hover': {
            backgroundColor: theme.newColors.gray[100],
          },
        },
        '& .active': {
          color: theme.palette.secondary.main,
          backgroundColor: theme.customColors.primary1.light[3],
          '&:hover': {
            backgroundColor: theme.customColors.primary1.light[3],
          },
        }
      }
    },
    '& .MuiTextField-root': {
      '& .MuiInputLabel-outlined': {
        display: 'none',
      },
    },
    '&.multiline': {
      maxHeight: 'inherit',
      '& .MuiOutlinedInput-multiline': {
        padding: 0,
      },
    },
    '& .MuiOutlinedInput-root': {
      borderRadius: theme.spacing(1),
      minHeight: '40px',
      color: theme.mainColors.primary1[0],
      fontWeight: theme.fontWeight.normal,
      background: theme.openColors.white,
      transition: theme.transitionDefault,
      '&:-webkit-autofill, :-webkit-autofill:focus, :-webkit-autofill:hover, :-webkit-autofill:active, :-internal-autofill-selected':
        {
          '-webkit-box-shadow': '0 0 0 30px white inset !important',
          '-webkit-text-fill-color': theme.mainColors.primary1[0],
        },

      '& .MuiIconButton-root': {
        padding: theme.spacing(0),
        color: theme.mainColors.primary1[0],
        '&:hover, &:focus': {
          background: 'none',
        },
      },
      '&.MuiOutlinedInput-adornedEnd  ': {
        paddingRight: theme.spacing(1),
      },
      '&.MuiOutlinedInput-adornedStart  ': {
        paddingLeft: theme.spacing(1),
      },
      '&.Mui-focused': {
        color: theme.mainColors.primary1[0],
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderWidth: '1px',
        borderColor: theme.customColors.primary1.main,
      },
      '&.Mui-focused:hover .MuiOutlinedInput-notchedOutline': {
        borderWidth: '1px',
        borderColor: theme.customColors.primary1.main,
      },
      '&:hover .MuiOutlinedInput-notchedOutline': {
        // borderColor: `${theme.mainColors.gray[2]}`,
        borderColor: theme.customColors.primary1.main,
      },
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: `${theme.newColors.gray[300]}`,
      transition: theme.transitionDefault,

      '& legend': {
        maxWidth: 0,
      },
    },
    '& .MuiOutlinedInput-input': {
      fontSize: theme.fontSize.normal,
      boxShadow: 'none',
      height: '20px',
      WebkitBoxShadow: '0 0 0 1000px white inset',

      '&:hover, &:focus': {
        boxShadow: 'none',
        WebkitBoxShadow: '0 0 0 1000px white inset',
      },
    },

    '& .MuiFormHelperText-root': {
      margin: 0,
      display: 'none',
    },
    '& .MuiInputAdornment-root': {
      fontSize: theme.fontSize.normal,
      color: theme.mainColors.primary1[0],
      marginRight: '1.5px',
      '& .MuiSvgIcon-root': {
        fontSize: theme.fontSizeIcon.medium,
      },
    },
    '& .Mui-disabled': {
      backgroundColor: theme.newColors.gray[100],
      color: theme.newColors.gray[500],
      WebkitBoxShadow: 'none !important',
      cursor: 'not-allowed',
      '& .MuiIconButton-root.Mui-disabled': {
        display: 'none',
      },
      '& input': {
        width: '100%',
        whiteSpace: 'nowrap',
        overflow: ' hidden !important',
        textOverflow: 'ellipsis',
      }
    },
    '& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline': {
      borderStyle: 'none',
    },
    '& .MuiOutlinedInput-root:focus-within': {
      boxShadow: 'rgba(235,241,249,1) 0 0 0 3px',
      borderRadius: 8,
      borderColor: theme.customColors.primary1.main,
      transition: theme.transitionDefault,

      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.customColors.primary1.main,
        transition: theme.transitionDefault,
      },
    },
  },
  large: {
    '& .MuiOutlinedInput-input': {
      padding: theme.spacing(1.25, 1, 1.25, 1),
      borderRadius: 8,
    },
  },
  medium: {
    '& .MuiOutlinedInput-input': {
      padding: theme.spacing(1.25, 1),
    },
  },
  viewOnly: {
    background: theme.newColors.gray[100],
    borderRadius: 8,
    '& .MuiOutlinedInput-input': {
      color: `${theme.newColors.gray[500]} !important`,
    },
    '& .MuiIconButton-label': {
      color: `${theme.newColors.gray[500]} !important`,
    },
    
  },
  noneBorder: {
    '& .MuiOutlinedInput-root': {
      borderRadius: 0,
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: 'none',
    },
    '& .MuiOutlinedInput-root:focus-within': {
      boxShadow: 'none',
    },
  },
  spacing: {
    // marginBottom: theme.spacing(1),
  },
  hasError: {
    color: theme.palette.error.main,
    '&.MuiSvgIcon-root': {
      fontSize: theme.fontSizeIcon.small,
    },
    '& .MuiOutlinedInput-root': {
      color: theme.palette.error.main,
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.error.main,
      },
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.palette.error.main,
      },
      '&.Mui-focused:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: theme.customColors.primary1.main,
      },
    },
  },
  clearIcon: {
    fontSize: `${theme.fontSizeIcon.small } !important`,
    color: `${theme.newColors.gray[500] }!important`,
    '&:hover': {
      color: `${theme.newColors.gray[700] }!important`,
    },
  },
}));

export default useStyles;
