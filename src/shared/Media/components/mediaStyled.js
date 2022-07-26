export default (theme) => ({
  root: {
  },
  paper: {
    position: 'relative',
    backgroundColor: theme.openColors.white,
    cursor: 'pointer',
    height: 200,
    width: '100%',
    float: 'left',
    flex: '0 0 auto',
    borderRadius: 8,
    // '&:hover .cover': {
    //   // boxShadow: '0 2px 6px 0 rgba(0, 0, 0, 0.2)'
    //   border: `solid 2px ${theme.palette.secondary.main}`
    // }
  },
  cover: {
    height: 160,
    overflow: 'hidden',
    borderRadius: theme.spacing(1),
    backgroundPosition: 'center',
    border: 'solid 2px rgba(0,0,0,0)',
    transition: 'all .1s ease-in-out',
    '&:hover': {
        border: `solid 2px ${theme.palette.secondary.main}`,
        // boxShadow: '0px 0px 0px 2px rgba(46,171,255,1)'

    },
    '& img': {
      height: 160
      // maxWidth: '100%',
      // maxHeight: '100%',
      // minWidth: '100%',
      // minHeight: '100%',
      // borderTopLeftRadius: theme.spacing(0.5),
      // borderTopRightRadius: theme.spacing(0.5)
  }  
  },
  title: {
    color: theme.palette.primary.main,
    fontWeight: theme.fontWeight.semi,
    fontSize: theme.fontSize.small,
    textAlign: 'center',
    display: 'flex',
    padding: theme.spacing(1.5),
    lineHeight: 1.85,
    '& span[class*="icon-"]': {
      fontSize: theme.fontSize.large,
      display: 'inline-flex',
      textAlign: 'center',
      marginRight: theme.spacing(1)
  }
  },
  checkbox: {
    position: 'absolute',
    left: 0
  },
  noreview: {
    color: theme.newColors.gray[800],
    width: '100%',
    borderRadius: theme.spacing(1),
    backgroundColor: theme.mainColors.gray[2]
  },
  selected: {
    '& .cover': {
      // transform: 'scale(0.9)',
      border: `solid 2px ${theme.palette.secondary.main}`,
    }
  },
  multiple: {

  }
});