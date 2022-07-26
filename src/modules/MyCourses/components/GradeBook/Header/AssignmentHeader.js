import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import LockIcon from '@mui/icons-material/Lock';
import LockClockIcon from '@mui/icons-material/LockClock';
import { Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import { Box } from '@mui/system';

import TblTooltip from 'components/TblTooltip';

import moment from 'moment';
import PropTypes from 'prop-types';

const useStyles = makeStyles(() => ({
  headerWithLock: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  maxWidthHidden: {
    // maxWidth: '80%',
    overflow: 'hidden',
  },
}));
function AssignmentHeader(props) {
  const {
    field,
    width,
    apiRef,
    activityName,
    totalPossiblePoint,
    canEditable,
    canEditableQuizColumn,
    quizExecuteTime,
  } = props;
  const theme = useTheme();
  const { t } = useTranslation('myCourses');
  const classes = useStyles();
  const [maxWidth, setMaxWidth] = useState(width);
  React.useEffect(() => apiRef.current.subscribeEvent('columnResize', (params) => {
      if (field === params.colDef.field) {
        setMaxWidth(params.width);
      }
    }), [apiRef, field]);
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        paddingLeft: theme.spacing(1),
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: `${maxWidth - 12}px`,
          height: theme.spacing(4),
          paddingTop: theme.spacing(0.5),
          lineHeight: theme.spacing(2.5),
          fontWeight: theme.fontWeight.semi,
          fontSize: theme.fontSize.small,
          marginRight: theme.spacing(2),
        }}
      >
        <TblTooltip title={activityName} placement='top'>
          <Box
            className={`text-ellipsis  ${
              (!canEditable || !canEditableQuizColumn) && classes.maxWidthHidden
            }`}
          >
            {activityName}
          </Box>
        </TblTooltip>
        <Box>
          {!canEditable && (
            <LockIcon
              style={{
                height: theme.spacing(2),
              }}
            />
          )}
          {!canEditableQuizColumn && (
            <TblTooltip
              title={t('unable_input_overall_grade_test_activity', {
                quizExecuteTime: moment(quizExecuteTime).format(
                  'MM/dd/yyyy - hh:mm A'
                ),
              })}
              placement='top'
            >
              <LockClockIcon
                style={{
                  height: theme.spacing(2),
                }}
              />
            </TblTooltip>
          )}
        </Box>
      </Box>

      <Divider
        sx={{
          width: '500px',
          marginLeft: theme.spacing(-3),
        }}
       />
      <Box
        sx={{
          width: '100%',
          height: theme.spacing(3.75),
          lineHeight: '20px',
        }}
      >
        {totalPossiblePoint
          ? t('total_point_grade_book', { point: totalPossiblePoint })
          : '%'}
      </Box>
    </Box>
  );
}

AssignmentHeader.propTypes = {
  activityName: PropTypes.string,
  apiRef: PropTypes.shape({
    current: PropTypes.shape({
      subscribeEvent: PropTypes.func,
    }),
  }),
  canEditable: PropTypes.bool,
  canEditableQuizColumn: PropTypes.bool,
  field: PropTypes.object,
  quizExecuteTime: PropTypes.string,
  totalPossiblePoint: PropTypes.number,
  width: PropTypes.number,
};

export default AssignmentHeader;
