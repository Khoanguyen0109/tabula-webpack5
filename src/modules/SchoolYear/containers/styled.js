import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: 224
  },
  tabs: {
    '& .MuiTab-root': {
      textTransform: 'capitalize',
      borderRadius: theme.spacing(1),
      border: `1px solid ${theme.newColors.gray[300]}`,
      height: theme.spacing(5.5),
      padding: 0,
      lineHeight: theme.spacing(5.5),
    },
    '& .PrivateTabIndicator-vertical': {
      background: 'none'
    }
  },
}));

export default useStyles;