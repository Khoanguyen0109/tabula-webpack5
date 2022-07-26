import makeStyles from '@mui/styles/makeStyles';
const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiFormControl-root': {
      display: 'inherit',
    },
    position: 'relative',
    '& .MuiIconButton-root': {
      // padding: theme.spacing(1.5, 0),
      width: theme.spacing(4),
      height: theme.spacing(4),
      '& .MuiSvgIcon-root': {
        color: `${theme.mainColors.primary1[0] }!important`,

      '&:hover, &:focus': {
        background: 'none',
      },
   
      }
    },
    '& .MuiOutlinedInput-root': {
      // borderRadius: theme.spacing(1),
      width: '100%',
      border: 'none',
      color: theme.mainColors.primary1[0],
      '& .MuiOutlinedInput-notchedOutline': {
        border: 'none',
        lineHeight: '20px'
      },
    },
    '& .MuiOutlinedInput-input': {
      padding: 0
    },
    '& .MuiInputAdornment-root': {
      fontSize: theme.fontSizeIcon.normal,
    },
  },
  viewOnly: {
    background: theme.newColors.gray[100],
    '& .MuiOutlinedInput-input': {
      color: `${theme.newColors.gray[700]} !important`,
    },
    '& .MuiIconButton-label': {
      color: `${theme.newColors.gray[700]} !important`,
    },
    '& input': {
      width: '100%',
      whiteSpace: 'nowrap',
      overflow: ' hidden !important',
      textOverflow: 'ellipsis',
    }
  },
  
}));

export default useStyles;
