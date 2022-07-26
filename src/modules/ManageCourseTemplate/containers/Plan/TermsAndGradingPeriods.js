import React, { useEffect, useState } from 'react';

import isEmpty from 'lodash/isEmpty';

import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import makeStyles from '@mui/styles/makeStyles';

import TblSelect from 'components/TblSelect';

import moment from 'moment';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  root: {
    color: theme.palette.primary.main,
  },
  wrapper: {
    '& .MuiTypography-root': {
      height: `calc(100% - ${100}px)`,
    },
  },
  semesterInfo: {
    fontSize: `${theme.fontSize.xMedium} !important`,
    display: 'flex',
    flexDirection: 'row',
    marginBottom: theme.spacing(3),
    '& .MuiInput-input': {
      fontWeight: theme.fontWeight.semi,
      paddingLeft: 0,
    },
    '& .MuiInput-underline': {
      borderBottom: 'none',
      '&:before': {
        borderBottom: 'none',
      },
      '&:hover:not(.Mui-disabled):before': {
        borderBottom: 'none',
      },

      '& .MuiSelect-icon': {
        paddingLeft: theme.spacing(0.5),
      },
    },
  },
  termInfo: {
    fontSize: theme.fontSize.normal,
    marginBottom: theme.spacing(1),
  },
  divider: {
    width: theme.spacing(10),
    backgroundColor: theme.palette.primary.main,
    height: 2,
  },
}));

export default function TermsAndGradingPeriods(props) {
  const { viewDetailTermsAndGradingPeriod, onChangeTermsAndGradingPeriod } =
    props;
  const [termSelected, setTermSelected] = useState({});
  const [gradingPeriodSelected, setGradingPeriodSelected] = useState({});
  const classes = useStyles();
  useEffect(() => {
    if (
      viewDetailTermsAndGradingPeriod &&
      viewDetailTermsAndGradingPeriod.length
    ) {
      setTermSelected(viewDetailTermsAndGradingPeriod[0]);
    }
  }, [viewDetailTermsAndGradingPeriod]);

  useEffect(() => {
    if (termSelected?.gradingPeriods?.[0]) {
      setGradingPeriodSelected(termSelected.gradingPeriods[0]);
    }
  }, [termSelected.gradingPeriods]);

  useEffect(() => {
    if (gradingPeriodSelected?.id) {
      onChangeTermsAndGradingPeriod(gradingPeriodSelected.id);
    }
  }, [gradingPeriodSelected.id, onChangeTermsAndGradingPeriod]);

  const handleOnChangeSelectTerm = (e, child) => {
    setTermSelected(child?.props?.originValue);
  };

  const handleChangeSelectGradingPeriod = (e, child) => {
    setGradingPeriodSelected(child?.props?.originValue);
  };
  const formatDate = (day) => moment(day).format('MMM DD, YYYY');
  return (
    <Box>
      {gradingPeriodSelected?.id && (
        <Box className={classes.semesterInfo}>
          <Box mr={5}>
            <TblSelect
              small
              value={Number(termSelected?.id) || 0}
              onChange={handleOnChangeSelectTerm}
            >
              {viewDetailTermsAndGradingPeriod?.map((term, index) => (
                <MenuItem
                  key={`menu-item-${index}`}
                  originValue={term}
                  value={Number(term.id)}
                >
                  {term.termName}
                </MenuItem>
              ))}
            </TblSelect>
            <Box className={classes.termInfo}>
              {!isEmpty(termSelected) ? (
                <span>
                  {formatDate(termSelected?.firstDay)} -{' '}
                  {formatDate(termSelected?.lastDay)}
                </span>
              ) : (
                <span>
                  {formatDate(viewDetailTermsAndGradingPeriod[0]?.firstDay)} -{' '}
                  {formatDate(viewDetailTermsAndGradingPeriod[0]?.lastDay)}
                </span>
              )}
            </Box>
          </Box>

          <Box>
            <TblSelect
              small
              value={Number(gradingPeriodSelected?.id) || 0}
              onChange={handleChangeSelectGradingPeriod}
            >
              {termSelected?.gradingPeriods?.map((gradingPeriod, index) => (
                <MenuItem
                  key={`menu-item-${index}`}
                  originValue={gradingPeriod}
                  value={Number(gradingPeriod.id)}
                >
                  {gradingPeriod.gradingPeriodName}
                </MenuItem>
              ))}
            </TblSelect>
            <Box className={classes.termInfo}>
              {!isEmpty(termSelected) ? (
                <span>
                  {formatDate(gradingPeriodSelected?.firstDay)} -{' '}
                  {formatDate(gradingPeriodSelected?.lastDay)}
                </span>
              ) : (
                <span>
                  {formatDate(termSelected?.gradingPeriods?.[0]?.firstDay)} -{' '}
                  {formatDate(termSelected?.gradingPeriods?.[0]?.lastDay)}
                </span>
              )}
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}
TermsAndGradingPeriods.propTypes = {
  viewDetailTermsAndGradingPeriod: PropTypes.array,
  onChangeTermsAndGradingPeriod: PropTypes.array,
};
