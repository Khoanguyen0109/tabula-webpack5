import makeStyles from '@mui/styles/makeStyles';
const useStyles = makeStyles((theme) => ({
  syllabus: {
    marginBottom: theme.spacing(5)
  },
  gradeWeight: {
    '& .description-table': {
      paddingLeft: 8,
      fontWeight: theme.fontWeight.semi,
      color: theme.palette.primary.main,
      fontSize: theme.fontSize.small
    },
    '& .help-text': {
      fontSize: 12,
      paddingLeft: 8,
      marginBottom: theme.spacing(2)
    }
  }
}));

export default useStyles;