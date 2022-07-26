import makeStyles from '@mui/styles/makeStyles';
const useStyles = makeStyles((theme) => ({
  root: {
    padding: '1px',
    '& .MuiOutlinedInput-root': {
      width: '100%',
      minHeight: theme.spacing(2.5),
      borderRadius: theme.borderRadius.default,
      color: theme.mainColors.primary1[0],
      lineHeight: 'normal',
      background: theme.openColors.white,
      transition: theme.transitionDefault,
    },
    '& .MuiSelect-input': {
      padding: theme.spacing(1.5, 1),
      fontSize: theme.fontSize.normal,
    },
    '& .MuiChip-root': {
      borderRadius: theme.spacing(0.5),
      height: '22px',
      marginRight: theme.spacing(0.5),
      background: theme.newColors.gray[300],
      color: theme.mainColors.primary1[0],
      fontSize: theme.fontSize.normal,
      paddingLeft: theme.spacing(0.5),
      paddingRight: theme.spacing(0.5),
    },

    '& .MuiOutlinedInput-notchedOutline legend': {
      display: 'none',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      top: 0,
      borderColor: theme.newColors.gray[300],
    },
    '& .MuiSelect-icon.Mui-disabled': {
      display: 'none',
    },
    '& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline': {
      borderStyle: 'none',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.customColors.primary1.main,
    },
    '& .Mui-focused': {
      '& .MuiOutlinedInput-notchedOutline': {
        backgroundColor: 'transparent',
        border: theme.borderInput.focus,
      },
    },

  },

  selectRoot: {
    borderRadius: theme.borderRadius.default,
    padding: theme.spacing(1.25, 0, 1.25, 1),
    paddingRight: '30px !important',
    fontSize: theme.fontSize.normal,
    lineHeight: '20px',
    minHeight: '20px !important'
  },
  select: {
    '&:focus': {
      backgroundColor: 'transparent',
    },
  },
  outlined: {
    borderColor: theme.newColors.gray[300],
  },
  icon: {
    color: theme.mainColors.primary1[0],
    right: theme.spacing(1),
    top: 'calc(50% - 10px) !important',
    fontSize: theme.fontSizeIcon.normal,
  },
  menuPaper: {
    maxWidth: 500,
    marginTop: theme.spacing(1),
    maxHeight: 200,
    '&::-webkit-scrollbar': {
      width: '6px',
    },
    overflowY: 'overlay',

    '&::-webkit-scrollbar-track': {
      boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
      webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#ced4da',
      borderRadius: '8px',
    },
  },

  menu: {
    color: theme.mainColors.primary1[0],
    borderRadius: theme.borderRadius.default,
    '& .MuiListSubheader-root': {
      width: '100%',
      whiteSpace: 'nowrap',
      overflow: ' hidden !important',
      textOverflow: 'ellipsis',
    },
    '& .MuiMenuItem-root': {
      lineHeight: '24px',
      whiteSpace: 'normal',
      paddingRight: theme.spacing(4),
      paddingTop: '10px',
      paddingBottom: '10px',
      fontSize: theme.fontSize.normal
    },
    '& li': {
      paddingLeft: '8px !important',

      '&:hover': {
        backgroundColor: theme.newColors.gray[100],
      },
    },

    '& .Mui-selected': {
      position: 'relative',
      color: theme.palette.secondary.main,
      backgroundColor: theme.customColors.primary1.light[3],
      '&:hover': {
        backgroundColor: theme.customColors.primary1.light[3],
      },

      '&::after': {
        fontFamily: 'icomoon',
        position: 'absolute',
        right: theme.spacing(1),
        color: theme.palette.secondary.main,
        content: '"\\e929"',
      },
    },
   
  },
  multiMenu: {
    color: theme.mainColors.primary1[0],
    borderRadius: theme.borderRadius.default,
    '& .MuiListSubheader-root': {
      width: '100%',
      whiteSpace: 'nowrap',
      overflow: ' hidden !important',
      textOverflow: 'ellipsis',
    },
    padding: '0 !important',
    '& .MuiMenuItem-root': {
      whiteSpace: 'normal',
      lineHeight: '24px',
      paddingRight: theme.spacing(1),
    },
    '& li': {
      paddingBottom: '2px',
      paddingTop: '2px',
      paddingLeft: '10px !important',
      marginLeft: theme.spacing(-1),

      '&:hover': {
        backgroundColor: theme.newColors.gray[100],
      },
    },
    '& .Mui-selected': {
      position: 'relative',
      color: theme.palette.secondary.main,
      backgroundColor: theme.customColors.primary1.light[3],
      '&:hover': {
        backgroundColor: theme.customColors.primary1.light[3],
      },
    },
  },
  emptyItem: {
    display: 'none',
  },
  placeholder: {
    fontSize: theme.fontSize.normal,
    fontWeight: theme.fontWeight.normal,
    color: theme.globalColors.placeholderColor,
    '& .MuiOutlinedInput-root': {
      '& .MuiInputBase-input': {
        color: theme.newColors.gray[700],
      },
    },
  },
  space: {
    marginBottom: theme.spacing(2),
  },

  hasBoxShadow: {
    '& .Mui-focused': {
      '& .MuiOutlinedInput-notchedOutline': {
        boxShadow: theme.boxShadowDefault,
      },
    },
  },

  error: {
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: `${theme.palette.error.main} !important`,
    },
    '& .MuiFormHelperText-root': {
      color: `${theme.palette.error.main} !important`,
    },
  },

  disabled: {
    backgroundColor: theme.newColors.gray[100],
    color: theme.newColors.gray[500],
    cursor: 'not-allowed',
  },

  small: {
    '& .MuiSelect-root': {
      padding: `${theme.spacing(1.25, 4, 1.25, 0) }!important`,
      fontSize: theme.fontSize.normal,
    },
    '& .MuiInputBase-root': {
      width: 'auto',
      minWidth: 120,
      maxWidth: 250,
      '& .MuiSelect-select': {
        '&:focus': {
          backgroundColor: 'transparent',
        },
      },
    },
    '& .Mui-disabled': {
      backgroundColor: 'inherit',
      color: theme.newColors.gray[700],
      cursor: 'not-allowed',
    },
  },
  add: {
    display: 'flex',
    width: '100%',
    justifyContent: 'flex-start',
    height: theme.spacing(5.5),
    flexDirection: 'row',
    fontSize: theme.fontSize.normal,
    color: theme.customColors.primary1.main,
    paddingTop: theme.spacing(1.25),
    paddingBottom: theme.spacing(1.25),
    '&:hover': {
      cursor: 'pointer',
      backgroundColor: theme.newColors.gray[100],
    }
  },
  addTitle: {
    marginTop: theme.spacing(0.25),
    marginLeft: theme.spacing(0.5)
  }
}));

export default useStyles;