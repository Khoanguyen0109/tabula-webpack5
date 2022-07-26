const styles = (theme) => ({
  root: {
    padding: theme.spacing(1.25),
    backgroundColor: 'transparent',
    '& .MuiSvgIcon-root,span': {
      fontSize: theme.fontSizeIcon.normal,
      color: theme.newColors.gray[800],
    },
    '&:hover': {
      backgroundColor: theme.newColors.gray[200],
    },
    '&:active': {
      backgroundColor: theme.newColors.gray[300],
    },
  },

  sizeSmall: {
    padding: theme.spacing(0.75),
    '& .MuiSvgIcon-root, span': {
      fontSize: theme.fontSizeIcon.normal,
      color: theme.newColors.gray[800],
    },
  },
  
  colorPrimary: {
    backgroundColor: theme.newColors.primary[50],

    '& .MuiSvgIcon-root, span': {
      color: theme.newColors.primary[500],
    },
    '&:hover': {
      backgroundColor: theme.newColors.primary[50],
      '& .MuiSvgIcon-root, span': {
        color: theme.newColors.primary[800],
      },
    },
    '&:active': {
      backgroundColor: theme.newColors.primary[50],
      '& .MuiSvgIcon-root, span': {
        color: theme.newColors.primary[900],
      },
    },
  },

  disabled: {
    backgroundColor: 'white',
    '& .MuiSvgIcon-root, span': {
      color: theme.newColors.gray[400],
    },
  },
});

export default styles;
