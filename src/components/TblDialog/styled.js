const styled = (theme) => ({
  paper: {
    padding: theme.spacing(3, 3),
    minWidth: theme.spacing(50),
    color: theme.newColors.gray[800],
    borderRadius: theme.spacing(2),
    boxShadow: `${theme.spacing(0, 0, 2, 0)} rgba(0, 0, 0, 0.24)`,
     [theme.breakpoints.up('md')]: {
      maxHeight: 680,
    },
    [theme.breakpoints.up('lg')]: {
      maxHeight: 900,
    },
  
  },
  root: {
    zIndex: theme.zIndex.drawer,
    '& .MuiDialogTitle-root': {
      wordBreak: 'break-all',
      padding: theme.spacing(1,2,0,0),
      marginLeft: theme.spacing(1),
      maxWidth: theme.spacing(55),
      marginRight: theme.spacing(5),
    },
    '& .closeButton': {
      position: 'absolute',
      backgroundColor: 'white',
      width: theme.spacing(5),
      height: theme.spacing(5),
      right: theme.spacing(2.5),
      top: theme.spacing(2),
      zIndex: theme.zIndex.drawer,
      color: theme.newColors.gray[800],
      '& .MuiSvgIcon-root': {
        fontSize: theme.fontSizeIcon.medium
      }
    },
    '& .subtitle': {
      padding: theme.spacing(0, 0, 1, 0),
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(5),
      maxWidth: theme.spacing(55),
      fontSize: theme.fontSize.normal,
      fontWeight: theme.fontWeight.semi,
      color: theme.newColors.gray[800],
    },
    '& .subtitle2': {
      wordBreak: 'break-all',
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(5),
      maxWidth: theme.spacing(55),
      fontSize: theme.fontSize.xSmall,
      fontWeight: theme.fontWeight.semi,
      color: theme.newColors.gray[500],
      lineHeight: theme.spacing(2),
    },
    '& .header': {
      margin: theme.spacing(-2, -2, 4, -2),
    },
    '& .scroll-content': {
      width: '100%',
      // [theme.breakpoints.up('sm')]: {
      //   height: 580,
      // },
      // [theme.breakpoints.up('md')]: {
      //   height: 680,
      // },
      // [theme.breakpoints.up('lg')]: {
      //   height: 700,
      // },
      // NOTE: remove Perfect scrollbar
      // '& .scrollbar-container': {
      //   '& .scroll-div': {
      //     width: 'calc(100% - 12px)',
      //     padding: theme.spacing(1, 2, 4, 1),
      //     wordBreak: 'break-word'
      //   },
      // },
    },

    '& .MuiDialogContent-root': {
      // padding: 0,
      marginTop: theme.spacing(2),
      overflow: 'hidden',
      padding: '0px 8px 8px 8px',

      '& .MuiDialogContentText-root': {
        fontSize: theme.fontSize.small,
        fontWeight: theme.fontWeight.normal,
        color: theme.newColors.gray[800],
      },
    },

    '& .MuiDialogActions-root': {
      marginTop: theme.spacing(3),
      padding: theme.spacing(0, 1),
      '&>:not(:first-of-type)': {
        marginLeft: theme.spacing(2)
      },
    },
  },

  paperFullScreen: {
    padding: 0,
    borderRadius: 0,
    '& .MuiDialogTitle-root': {
      padding: theme.spacing(0),
    },
    '& .MuiDialogContent-root': {
      padding: theme.spacing(0),
    },
    '& .scroll-content': {
      // NOTE: remove Perfect scrollbar
      // '& .scrollbar-container': {
      //   width: '100%',
      //   '& .scroll-div': {
      //     width: '100%'
      //   },
      // },
    },
  },
});

export default styled;
