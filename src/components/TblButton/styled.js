const styles = (theme) => ({
  root: {
    fontSize: theme.fontSize.button,
    fontWeight: theme.fontWeight.medium,
    lineHeight: theme.spacing(3),
    textTransform: 'inherit',
    borderRadius: theme.borderRadius.default,
    minWidth: theme.spacing(8),
    boxShadow: 'none',
    padding: theme.spacing(1, 2),
    backgroundColor: theme.newColors.primary[500],
    '&:hover': {
      backgroundColor: theme.newColors.primary[800],
    },
    '&:active': {
      backgroundColor: theme.newColors.primary[900],
      boxShadow: 'none',
    },
    color: 'white',
    '& .MuiCircularProgress-root': {
      position: 'absolute',
      margin: 'auto',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    },
  },

  sizeSmall: {
    padding: theme.spacing(0.5, 2),
  },

  outlinedSizeSmall: {
    padding: `${theme.spacing(0.375, 2) } !important`, // Minus 1px border
  },

  containedPrimary: {
    backgroundColor: theme.newColors.primary[500],
    color: 'white',
    '&:hover': {
      backgroundColor: theme.newColors.primary[800],
    },
    '&:active': {
      backgroundColor: theme.newColors.primary[900],
      boxShadow: 'none',
    },
  },
  containedWarning: {
    backgroundColor: theme.newColors.yellow[400],
    color: theme.newColors.gray[800],
    '&:hover': {
      backgroundColor: theme.newColors.yellow[500],
    },
    '&:active': {
      backgroundColor: theme.newColors.yellow[600],
      boxShadow: 'none',
    },
  },
  containedError: {
    backgroundColor: theme.newColors.red[500],
    color: 'white',
    '&:hover': {
      backgroundColor: theme.newColors.red[600],
    },
    '&:active': {
      backgroundColor: theme.newColors.red[700],
      boxShadow: 'none',
    },
  },

  outlinedPrimary: {
    borderColor: theme.newColors.gray[200],
    color: theme.newColors.gray[800],
    padding: theme.spacing(0.875, 2), // Minus 1px border
    backgroundColor: 'white',
    '&:hover': {
      borderColor: theme.newColors.gray[600],
      backgroundColor: 'white',
    },
    '&:active': {
      borderColor: theme.newColors.gray[600],
      backgroundColor: theme.newColors.gray[200],
    },
  },

  textPrimary: {
    color: theme.newColors.gray[800],
    backgroundColor: 'white',
    '&:hover': {
      backgroundColor: theme.newColors.gray[200],
    },
    '&:active': {
      backgroundColor: theme.newColors.gray[300],
      boxShadow: 'none',
    },
  },

  disabled: {
    borderColor: (props) =>
      props.variant === 'outlined' ? theme.newColors.gray[200] : 'none',
    color: `${theme.newColors.gray[500] } !important`,

    backgroundColor: (props) => {
      switch (props.variant) {
        case 'outlined':
          return 'white';
        case 'text': {
          return `${theme.newColors.gray[50] } !important`;
        }
        default:
          return `${theme.newColors.gray[200] } !important`;
      }
    },
  },

  startIcon: {
    marginRight: theme.spacing(0.5),
    '& .MuiSvgIcon-root': {
      fontSize: theme.fontSizeIcon.normal,
    },
  },
  endIcon: {
    marginLeft: theme.spacing(0.5),
    '& .MuiSvgIcon-root': {
      fontSize: theme.fontSizeIcon.normal,
    },
  },
});

export default styles;
