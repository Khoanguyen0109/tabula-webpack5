import createStyles from '@mui/styles/createStyles';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) => createStyles({
  root: {
    '& + & .MuiBackdrop-root': {
      // opacity: '0!important'
    },
    '&.overlayed': {
      '& .MuiPaper-root': {
        transform: 'translateX(-40px) scaleY(0.9)!important',
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8
      }
    },
    '& .MuiDialogTitle-root': {
      padding: theme.spacing(5, 5, 2, 6),
        fontSize: theme.fontSize.large,
        color: theme.mainColors.primary1[0],
        fontWeight: theme.fontWeight.semi,
        textOverflow: 'ellipsis',
        overflow: 'hidden',
    },
    '& .MuiDialogContent-root': {
      padding: theme.spacing(2, 5, 0, 5)
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(3, 5),
      boxShadow: '0 0 2px 0 rgba(0, 0, 0, 0.16)',
      justifyContent: 'space-between',
      zIndex: 1
    }
  },
  paper: {
    width: theme.drawer.width,
    // padding: theme.spacing(5),
    // paddingBottom: theme.spacing(3)
  }
}));

export default useStyles;