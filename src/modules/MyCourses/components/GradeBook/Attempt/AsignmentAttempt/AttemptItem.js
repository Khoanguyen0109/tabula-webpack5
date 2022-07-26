import React from 'react';
import { useTranslation } from 'react-i18next';

import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Box, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

import TblButton from 'components/TblButton';
import TblIconButton from 'components/TblIconButton';

import { convertTimezone } from 'utils/time.js';

import { format } from 'date-fns';
import { isInteger } from 'lodash-es';
import PropTypes from 'prop-types';
import { getNumberWithOrdinal } from 'utils';
const useStyles = makeStyles((theme) => ({
  itemCard: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    transition: 'all 500ms ease-in-out',
    '&:hover': {
      cursor: 'pointer',
      backgroundColor: theme.customColors.primary1.light[3],
    },
  },
  content: {
    color: theme.mainColors.primary1[0],
    minWidth: 0,
    marginLeft: theme.spacing(2),
  },
  navigation: {
    position: 'relative',
    marginLeft: theme.spacing(2.25),
    // marginLeft: theme.spacing(0.5),
    height: (props) =>
      props.isAttempt ? theme.spacing(8) : theme.spacing(5.5),
    width: '7px',
    borderLeft: `1px solid ${ theme.newColors.gray[400]}`,
    '&::before': {
      position: 'absolute',
      display: 'block',
      top: '45%',
      right: '3px',
      content: '""',
      width: '7px',
      height: '7px',
      border: '1px solid',
      backgroundColor: (props) => (props.selected ? '#1A7AE6' : '#868E96'),
      borderColor: (props) => (props.selected ? '#1A7AE6' : '#868E96'),
      borderRadius: '50%',
    },
  },
  gradeBox: {
    minWidth: theme.spacing(4.5),
    height: theme.spacing(4.5),
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(0.5),
    lineHeight: '20px',
    textAlign: 'center',
    padding: theme.spacing(1),
    color: theme.newColors.gray[500],
    backgroundColor: theme.newColors.gray[50],
    fontSize: theme.fontSize.small,
    fontWeight: theme.fontWeight.semi,
    borderRadius: theme.borderRadius.default,
  },
  name: {
    color: theme.newColors.gray[800],
    fontWeight: theme.fontWeight.semi,
    fontSize: theme.fontSize.small,
  },
  time: {
    color: theme.newColors.gray[600],
    fontWeight: theme.fontWeight.normal,
    fontSize: theme.fontSize.small,
  },
  showBtn: {
    fontWeight: theme.fontWeight.normal,
    color: theme.openColors.blue[6],
    marginTop: theme.spacing(0.5),
  },

}));
function AttemptItem(props) {
  const FORMAT_DATE_ATTEMPT = 'MMM dd, yyyy - hh:mm:ss aa';

  const classes = useStyles(props);
  const { t } = useTranslation('grader');
  const {
    // index,
    item,
    showMore,
    onShowMore,
    isAttempt,
    onOpenAttempt,
    onOpenGrader,
  } = props;

  const { attemptIndex, finalGrade, attemptedAt } = item;
  const handleClick = () => {
    switch (true) {
      case !!onOpenAttempt:
       return onOpenAttempt(item);
    case !!onOpenGrader:
      return onOpenGrader(item);
    default:
        return;
    }
  };
  return (
    <div className={classes.itemCard}>
      <div className={classes.navigation} />
      {isAttempt ? (
        <Box display='flex' onClick={() => handleClick()}>
          <Box className={classes.gradeBox}>
            {(isInteger(finalGrade) ? finalGrade : finalGrade?.toFixed(2)) ??
              '--'}
          </Box>

          <div className={classes.content}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography className={classes.name} noWrap={true}>
                {getNumberWithOrdinal(attemptIndex)}
              </Typography>
              {onOpenGrader && (
                <Box ml={1}> 
                  <TblIconButton
                      onClick={() => {
                        handleClick();
                      }}
                      size='small'
                  >
                      <OpenInNewIcon className={classes.openIcon} />
                  </TblIconButton>
                </Box>
                
              )}
            </Box>

            <Typography variant='bodyMedium' className={classes.time} noWrap={true}>
              {format(
                new Date(convertTimezone(attemptedAt)),
                FORMAT_DATE_ATTEMPT
              )}
            </Typography>
          </div>
        </Box>
      ) : (
        <TblButton
          variant='text'
          className={classes.showBtn}
          noWrap={true}
          onClick={onShowMore}
        >
          {showMore ? t('show_less_attempt') : t('show_more_attempt')}{' '}
        </TblButton>
      )}
    </div>
  );
}

AttemptItem.propTypes = {
  attemptName: PropTypes.string,
  finalGrade: PropTypes.string,
  index: PropTypes.number,
  isAttempt: PropTypes.bool,
  item: PropTypes.shape({
    attemptIndex: PropTypes.number,
    attemptName: PropTypes.string,
    attemptedAt: PropTypes.string,
    createdAt: PropTypes.string,
    finalGrade: PropTypes.string,
    id: PropTypes.number,
    showMore: PropTypes.bool,
  }),
  onOpenAttempt: PropTypes.func,
  onOpenGrader: PropTypes.func,
  onShowMore: PropTypes.func,
  selected: PropTypes.bool,
  showMore: PropTypes.bool,
};

export default AttemptItem;
