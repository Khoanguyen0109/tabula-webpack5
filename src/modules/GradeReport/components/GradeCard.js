import React from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

import clsx from 'clsx';
import PropTypes from 'prop-types';
// material-ui

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    gap: theme.spacing(2),
    width: theme.spacing(58),
    height: theme.spacing(16.5),
    padding: theme.spacing(2, 3),
    backgroundColor: theme.newColors.gray[50],
    borderRadius: theme.borderRadius.default,
  },
  card: {
    display: 'flex',
    padding: theme.spacing(1),
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: theme.spacing(25),
    height: theme.spacing(12.5),
    borderRadius: theme.borderRadius.default,
  },
  letterGrade: {
    color: 'white',
    backgroundColor: theme.newColors.primary[500],
  },
  percentOverallGrade: {
    color: theme.newColors.gray[800],

    backgroundColor: 'white',
  },
}));

const GradeCard = (props) => {
  const {overallGrade, letterGrade} = props;
  const {t} = useTranslation('myCourses');
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Box className={clsx(classes.letterGrade, classes.card)}>
        <Typography variant='headingLarge'>{letterGrade ?? '-'}</Typography>
        <Typography variant='labelLarge'>{t('letter_grade')}</Typography>
      </Box>
      <Box className={clsx(classes.percentOverallGrade, classes.card)}>
        <Typography variant='headingLarge'>
          { overallGrade || overallGrade === 0 ? parseFloat(overallGrade, 10) : '-'}
        {(overallGrade || overallGrade === 0) && <Typography component='span' variant='titleLarge'>
            %
          </Typography>} 
        </Typography>
        <Typography variant='labelLarge'>{t('overall_grade')}</Typography>
      </Box>
    </div>
  );
};

GradeCard.propTypes = {
  letterGrade: PropTypes.string,
  overallGrade: PropTypes.string
};

export default GradeCard;
