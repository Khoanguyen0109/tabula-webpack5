export default (theme) => ({
  root: {
    height: 'calc(100% - 65px)',
    textAlign: 'center',
    outline: 'none',
    '& p': {
      fontSize: theme.fontSize.small,
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1)
    }
  },
  box: {
    outline: 'none',
    // width: 288,
    height: 229,
    border: 'none',
    '& span': {
      display: 'flex',
      width: '100%',
      alignItems: 'center',
      alignContent: 'center',
      justifyContent: 'center',
      '& p': {
        marginLeft: 5
      }
    },
    '& > div': {
      border: 'dashed 1px #707070',
      borderRadius: theme.spacing(1),
      paddingTop: theme.spacing(3),
      width: '100%'
    },
    '&:hover svg': {
      
        '& #arrow_upward': {
            fill: theme.palette.secondary.main,
            animationDuration: '600ms',
            animationName: '$animationarrow',
            animationIterationCount: 'infinite',
            animationDirection: 'alternate'
        },
        '& #border': {
          fill: '#ffffff',
          stroke: theme.palette.secondary.main
        },
        '& #dash': {
          fill: theme.palette.secondary.main,
          animationDuration: '600ms',
          animationName: '$animationdash',
          animationIterationCount: 'infinite',
          animationDirection: 'alternate'
        }
      }
  },
  drag: {
    border: `dashed 1px ${theme.palette.secondary.main}`,
    borderRadius: theme.spacing(1),
    color: theme.palette.secondary.main,
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.mainColors.btn2[0]
  },
  svg: {
    '&.drag': {
      '& #arrow_upward': {
          fill: theme.palette.secondary.main,
          animationDuration: '600ms',
          animationName: '$animationarrow',
          animationIterationCount: 'infinite',
          animationDirection: 'alternate'
      },
      '& #border': {
        fill: '#ffffff',
        stroke: theme.palette.secondary.main
      },
      '& #dash': {
        fill: theme.palette.secondary.main,
        animationDuration: '600ms',
        animationName: '$animationdash',
        animationIterationCount: 'infinite',
        animationDirection: 'alternate'
      }
    }
  },
  '@keyframes animationarrow': {
      'from': {
        'transform': 'translateX(8px) translateY(16px)'
      },
      'to': {
        'transform': 'translateX(8px) translateY(8px)'
      }
  },
  '@keyframes animationdash': {
    'from': {
        'transform': 'translateX(16px) translateY(7px)',
        'width': '8px'
    },
    'to': {
        'transform': 'translateX(12px) translateY(7px)',
        'width': '16px'
    }
}
});