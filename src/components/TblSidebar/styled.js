export default (theme) => ({
  root: (props) => ({
      fontSize: theme.fontSize.normal,
      borderRadius: theme.spacing(1),
      padding: theme.spacing(0, 2),
      zIndex: theme.zIndex.drawer,
      position: 'relative',
      width: props.openSideBar ? theme.sideBar.openWidth : theme.sideBar.width,
      '& svg path': {
        fill: 'white'
      }
    }),
  drawerOpen: {
    transition: theme.transitionDefault,
    width: theme.sideBar.openWidth,
    border: 'none',
    overflowX: 'hidden'
  },
  drawerClose: {
    transition: theme.transitionDefault,
    border: 'none',
    overflowX: 'hidden',
    width: theme.sideBar.width,
    [theme.breakpoints.up('sm')]: {
      width: theme.sideBar.width,
    },
    '& .divider-text': {
      opacity: 0
    }
  },
  iconButton: {
    position: 'fixed',
    padding: 0,
    top: 30,
    left: theme.sideBar.width - 8,
    color: theme.openColors.white,
    border: `2px solid ${theme.openColors.white}`,
    backgroundColor: theme.palette.primary.main,
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitionDefault,
    '& .MuiIcon-root': {
      fontSize: theme.fontSize.normal,
    },
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
    }
  },
  iconButtonOpen: {
    transition: theme.transitionDefault,
    left: theme.sideBar.openWidth - 8
  },
  paper: {
    backgroundColor: theme.mainColors.primary1[2],
    color: theme.openColors.white,
    border: 'none'
  },
  backdrop: {
    zIndex: theme.zIndex.drawer - 1
  },
  contactUs: {
    '& .MuiIcon-root, & .MuiSvgIcon-root': {
      color: theme.mainColors.primary3[1],
      fontSize: 24,
    },
    '& .MuiTypography-root': {
      fontSize: theme.fontSize.normal
    },
    marginBottom: 24,
    marginTop: 8
  },
  list: (props) => ({
      height: 'calc(100vh - (72px + 70px))',
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
      width: props.openSideBar ? theme.sideBar.openWidth : theme.sideBar.width - 24,
      transition: theme.transitionDefault,
      maxWidth: '100%',
      paddingTop: 0,
      margin: props.openSideBar ? 0 : theme.spacing(0, 1.5),
      padding: props.openSideBar ? theme.spacing(0, 1.5) : 0,
      '& .MuiListItem-root': {
        margin: theme.spacing(0.5, 1.5),
        padding: theme.spacing(1.5),
        borderRadius: theme.spacing(1),
        height: 48,
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, .16)',
        }
      },
      '& .MuiListItemIcon-root': {
        minWidth: 'auto'
      },
      '& .MuiListItemText-root': {
        marginLeft: theme.spacing(2),
        whiteSpace: 'nowrap',
        overflow: ' hidden !important',
        textOverflow: 'ellipsis',
      },

      '& .MuiListItem-root.Mui-selected': {
        backgroundColor: theme.mainColors.primary1[1],
        '& .MuiIcon-root, & .MuiSvgIcon-root': {
          color: theme.mainColors.purple[0]
        },
        '&:hover': {
          backgroundColor: theme.mainColors.primary1[1]
        },
        '& .MuiTypography-root': {
          fontWeight: theme.fontWeight.semi
        }
      },
      '& .MuiTypography-root': {
        fontSize: theme.fontSize.normal
      },
      '& .MuiIcon-root, & .MuiSvgIcon-root': {
        color: theme.mainColors.primary3[1],
        fontSize: 24,
      },
      '& .divider-wrapper': {
        width: '100%',
        padding: theme.spacing(0, 1)
      },
      '& .divider': {
        backgroundColor: theme.mainColors.primary3[1],
        opacity: 0.2,
        width: '100%',
        height: 2,
        margin: theme.spacing(1, 0),
        borderRadius: 2
      },
      '& .divider-text': {
        color: theme.mainColors.primary3[0],
        paddingLeft: theme.spacing(2),
        fontSize: theme.fontSize.xSmall,
        paddingTop: theme.spacing(0.5)
      },
    })
});