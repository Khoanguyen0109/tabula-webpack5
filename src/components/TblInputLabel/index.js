import InputLabel from '@mui/material/InputLabel';
import { styled } from '@mui/material/styles';

const TblInputLabel = styled(InputLabel)(({ theme }) => ({
  fontSize: theme.fontSize.medium,
  fontWeight: theme.fontWeight.semi,
  lineHeight: '20px',
  color: theme.mainColors.primary1[0],
  letterSpacing: '0.1px',
  textAlign: 'left',
  '&.Mui-required': {
    '& .MuiInputLabel-asterisk': {
      color: theme.palette.error.main,
    },
  },
  textTransform: 'capitalize',
  overflow: 'hidden!important',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  width: 'auto',
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(1, 1, 0, 1),
  '&::first-letter': {
    textTransform: 'uppercase'
  }
}));

export default TblInputLabel;
