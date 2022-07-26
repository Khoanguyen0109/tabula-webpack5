import React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import WarningIcon from '@mui/icons-material/Warning';
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';

import clsx from 'clsx';
import { camelCase, isNumber, snakeCase } from 'lodash';
import PropTypes from 'prop-types';

import TblTooltip from '../../../../../components/TblTooltip';
import { STUDENT_PROGRESS_STATUS } from '../../../constants';

import CellTool from './CellTool';

const useStyles = makeStyles((theme) => ({
  text: {
    width: '80%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    fontSize: theme.fontSize.small,
    fontWeight: theme.fontWeight.normal,
    padding: `${theme.spacing(1.25)} ${theme.spacing(2)}`,
    overflow: 'hidden',
  },
  turnIn: {
    backgroundColor: theme.openColors.teal[0],
    color: `${theme.openColors.teal[8]}!important`,
  },
  lateTurnIn: {
    backgroundColor: theme.openColors.yellow[0],
    color: `${theme.openColors.yellow[8]}!important`,
  },
  missing: {
    backgroundColor: theme.openColors.red[0],
    color: `${theme.openColors.red[8]}!important`,
  },
  missed: {
    backgroundColor: theme.newColors.gray[50],
    color: `${theme.newColors.gray[800]}!important`,
  },
}));

function GradeCell(params) {
  const classes = useStyles();
  const theme = useTheme();
  const { id, value, formattedValue, onOpenCelDetail } = params;

  const { t } = useTranslation('myCourses');
  const [show, setShow] = useState(false);

  const statusKey = Object.keys(STUDENT_PROGRESS_STATUS).find(
    (key) => STUDENT_PROGRESS_STATUS[key] === value?.status
  );
  const renderValue = () => {
    if (value) {
      if (
        value.gradeWeightCriteriaId &&
        !value.overallGrade &&
        value.overallGrade !== 0
      ) {
        return '';
      } else if (
        value.gradeWeightCriteriaId &&
        (value.overallGrade || value.overallGrade === 0)
      ) {
        return `${value.overallGrade}%`;
      }
      if (isNumber(value.overallGrade)) {
        return value.overallGrade;
      }

      if (value.status === STUDENT_PROGRESS_STATUS.NOT_TURN_IN) {
        return '';
      }
      return t(`${snakeCase(statusKey)}`);
    }
    return t(`${snakeCase(statusKey)}`);
  };

  const style = value && !!value.overallGrade ? '' : camelCase(statusKey);
  const onHover = () => {
    setShow(true);
  };
  const onLeave = () => {
    setShow(false);
  };

  if (!formattedValue) {
    return (
      <Box
        id={id}
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: theme.newColors.gray[100],
        }}
      >
        <Typography
          id={value?.id || undefined}
          className={clsx(classes.text, classes[style])}
        >
          --
        </Typography>
        <TblTooltip
          title={t('unable_to_grade_student_added_after_activity')}
          placement='top'
          arrow
        >
          <WarningIcon
            sx={{ marginRight: theme.spacing(2), fontSize: theme.spacing(3) }}
          />
        </TblTooltip>
      </Box>
    );
  }
  return (
    <Box
      id={id}
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'space-between',
      }}
      onMouseOver={onHover}
      onMouseOut={onLeave}
      className={classes[style]}
    >
      <Typography
        id={value?.id || undefined}
        className={clsx(classes.text, classes[style])}
      >
        {renderValue()}
      </Typography>
      {value && !value.gradeWeightCriteriaId && (
        <CellTool
          show={show}
          params={params}
          onOpenCelDetail={onOpenCelDetail}
        />
      )}
    </Box>
  );
}

GradeCell.propTypes = {
  formattedValue: PropTypes.string,
  id: PropTypes.number,
  onOpenCelDetail: PropTypes.func,
  value: PropTypes.shape({
    id: PropTypes.number,
    overallGrade: PropTypes.number,
    status: PropTypes.number,
  }),
};
export default GradeCell;
