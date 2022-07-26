const styles = (theme) => ({
  '@global': {
    'body': {
      color: theme.mainColors.primary1[0]
    },
    'video:focus': {
      outline: 'none'
    },
    '.word-wrap': {
      wordWrap: 'break-all'
    },
    '.text-ellipsis': {
      whiteSpace: 'nowrap',
      overflow: ' hidden !important',
      textOverflow: 'ellipsis',
    },
    '.text-ellipsis-2row': {
      overflow: 'hidden',
      wordBreak: 'break-word',
      textOverflow: 'ellipsis',
      display: '-webkit-box',
      '-webkit-line-clamp': 2,
      '-webkit-box-orient': 'vertical',
    },
    '.text-ellipsis-3row': {
      overflow: 'hidden',
      wordBreak: 'break-word',
      textOverflow: 'ellipsis',
      display: '-webkit-box',
      '-webkit-line-clamp': 3,
      '-webkit-box-orient': 'vertical',
    },
    '.title-container': {
      // height: theme.spacing(5.5),
      lineHeight: theme.spacing(5.5),
      color: theme.palette.primary.main,
      paddingLeft: theme.spacing(1),
      alignItems: 'center',
    },
    '.tbl-circular-progress__container': {
      position: 'relative',
    },
    '.display-flex': {
      display: 'flex',
    },
    '.tbl-circular-progress__item': {
      position: 'absolute',
      top: '50%',
      left: '50%',
      marginTop: theme.spacing(-1.5),
      marginLeft: theme.spacing(-1.5),
    },
    '.cursor-pointer': {
      cursor: 'pointer',
    },
    '.tbl-link': {
      color: theme.mainColors.primary2[0]
    },
    // '.ps.scroll-hidden': {
    //   '-ms-overflow-style': 'none',  /* IE and Edge */
    //   overflow: 'auto!important',
    //   scrollbarWidth: 'none',
    //   '&::-webkit-scrollbar': {
    //     display: 'none'
    //   }
    // },
    '.tbl-scroll': {
      '&::-webkit-scrollbar': {
        width: '6px',
        height: '6px',
      },
      '&::-webkit-scrollbar-track': {
        // background: '#f1f1f1'
      },
      '&::-webkit-scrollbar-thumb': {
        background: '#999',
        borderRadius: '6px',
        transition: 'background-color .2s linear, width .2s ease-in-out',
      },
      '&:hover::-webkit-scrollbar': {
        width: '10px',
        height: '12px',
        cursor: 'pointer',
        // background: '#555'
      },
    },
    '.MuiMenuItem-root': {
      '& .hidden': {
        display: 'none',
      },
      minWidth: '120px',
    },
    '.emptyText': {
      color: theme.newColors.gray[700],
    },
    '.errorText': {
      fontSize: theme.fontSize.small,
      color: theme.palette.error.main,
      marginLeft: theme.spacing(1),
    },
    '.tbl-view-editor': {
      padding: 0
    },
    '.MuiPickersCalendar-transitionContainer': {
      marginBottom: '12px'
    },
    '.MuiTab-root': {
      fontWeight: theme.fontWeight.semi
    },
    'span[class^="icon-"], span[class*=" icon-"]': {
      '&.icon-xs': {
        fontSize: '20px'
      },
      '&.icon-sm': {
        fontSize: '20px'
      },
      '&.icon-md': {
        fontSize: '20px'
      },
      '&.icon-lg': {
        fontSize: '20px'
      }
    },
    '.picker-dialog-bg': {
      zIndex: '20000 !important'
    },
    '.picker-dialog': {
        zIndex: '20001 !important'
    }
  },
});

export default styles;
