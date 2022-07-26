export default (theme) => ({
  root: {
    zIndex: theme.zIndex.drawer + 999,
    '& .MuiPaper-root': {
      width: 1200,
      padding: 0,
      '& > .MuiGrid-root': {
        height: '100%',
      },
      '& .scrollbar-container': {
        width: `calc(100% + ${theme.spacing(3)})`,
        paddingRight: theme.spacing(3)
      },
    },
  },
  title: {
    padding: theme.spacing(3, 3, 1, 5),

  },
  error: {
    color: theme.palette.error.main,
  },
  note: {
    color: theme.newColors.gray[800],
    fontSize: theme.fontSize.normal,
  },
  left: {
    boxShadow: `${theme.spacing(0, 0, 0.25, 0)} rgba(0, 0, 0, 0.16)`,
    padding: theme.spacing(2, 3, 0, 5),
    '& .title': {
      marginBottom: theme.spacing(2)
    }
  },
  right: {
    boxShadow: `${theme.spacing(0.125, 0, 0.25, 0)} rgba(0, 0, 0, 0.16)`,
    padding: theme.spacing(2, 3, 3, 3),
    '& .title': {
      height: 49,
      display: 'flex',
      alignItems: 'center',
      marginBottom: theme.spacing(2)
    }
  },
  dropdownButton: {
    fontSize: theme.fontSize.medium,
    fontWeight: theme.fontWeight.semi,
    marginBottom: theme.spacing(2),
    marginRight: theme.spacing(-2),
    marginTop: -5,
    height: theme.spacing(4)
  },
  drawerAction: {
    boxShadow: `${theme.spacing(0, 0, 0.25, 0)} rgba(0, 0, 0, 0.16)`,
    width: `calc(100% + ${theme.spacing(8)})`,
    marginLeft: theme.spacing(-5),
    // marginTop: theme.spacing(2),
    padding: theme.spacing(3, 5),
    height: 88,
    '& .left-actions': {
      width: 210,
      display: 'flex',
      justifyContent: 'space-between'
    }
  },
  thumbnails: {
  },
  filterMenu: {
    zIndex: theme.zIndex.drawer + 9999,
    '& .MuiMenuItem-root': {
      paddingLeft: 0
    }
  },
  boxSearch: {
    justifyContent: 'space-between',

  }
});