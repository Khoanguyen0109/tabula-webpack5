import { alpha } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  root: {
    height: '100%',
    position: 'relative',
    color: theme.openColors.white,
    backgroundColor: theme.newColors.gray[900],
    '& .image-area': {
      maxHeight: '100%',
      '& img': {
        maxWidth: '100%',
        maxHeight: '100%',
        position: 'absolute',
        margin: 'auto',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }
    }
  },
  previewHeader: {
    color: theme.openColors.white,
    height: theme.spacing(6),
    padding: theme.spacing(1.5, 3),
    display: 'flex',
    zIndex: theme.zIndex.drawer +1,
    position: 'absolute',
    width: '100%',
    justifyContent: 'space-between',
    backgroundColor: `${alpha(theme.newColors.gray[900], 0.6)}`,
    '& .file-name': {
      display: 'flex',
      '& .icon': {
        fontSize: theme.fontSizeIcon.medium,
        display: 'flex',
        justifyContent: 'center'
      },
      '& .data': {
        marginLeft: theme.spacing(1)
      }
    },
    '& .icon-close': {
      fontSize: theme.fontSizeIcon.medium,
      cursor: 'pointer'
    }
  },
  fullScreen: {
    position: 'fixed',
    width: '100vw',
    height: '100vh',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: theme.zIndex.drawer +1,
    '& .image-area img': {
      maxWidth: '100%',
      maxHeight: '90%',
      position: 'absolute',
      margin: 'auto',
      top: theme.spacing(6),
      left: 0,
      right: 0,
      bottom: 0,
    }
  },
  controlIcon: {
    position: 'absolute',
    top: '50%',
    backgroundColor: `${alpha(theme.newColors.gray[100], 0.8)}`,
    borderRadius: '50%',
    fontSize: theme.fontSizeIcon.medium,
    width: theme.spacing(4),
    height: theme.spacing(4),
    cursor: 'pointer',
    textAlign: 'center',
    padding: theme.spacing(0.5),
    display: 'flex',
    justifyContent: 'center',
    color: theme.newColors.gray[900],
    zIndex: theme.zIndex.drawer +1,
    '&.left': {
      left: theme.spacing(3)
    },
    '&.right': {
      right: theme.spacing(3)
    }
  },
  centerHorizontalVertical: {
    width: '100%',
    height: '95%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '& video': {
      maxHeight: '100%',
      maxWidth: '100%'
    },
    '& a': {
      color: 'white',
      fontWeight: theme.fontWeight.semi 
    }
  },
  googleView: {
    width: '100%',
    marginTop: (props) => props.isFullScreen ? theme.spacing(7): 0,
    height: (props) => props.isFullScreen ? `calc(100% -  ${theme.spacing(7)})` : '100%'
  },
  pdfArea: {
    width: '100%',
    marginTop: (props) => props.isFullScreen ? theme.spacing(11): 0,
    height: '100%'
  }
}));

export default useStyles;