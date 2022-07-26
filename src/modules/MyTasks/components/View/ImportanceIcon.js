import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import SvgIcon from '@mui/material/SvgIcon';
import makeStyles from '@mui/styles/makeStyles';

import { ReactComponent as IconTimer } from 'assets/images/icn_timer.svg';
import { ReactComponent as IconUpcoming } from 'assets/images/icn_upcoming.svg';
import { ReactComponent as IconWarning } from 'assets/images/icn_warning.svg';
import {
  TASK_IMPORTANCE_LEVEL_COLOR,
  TASK_IMPORTANCE_LEVEL_STATUS,
} from 'modules/MyTasks/constants';
import { getImportanceLevelInfo } from 'modules/MyTasks/utils';
import moment from 'moment';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: 8,
    fontSize: theme.fontSize.normal,
    padding: theme.spacing(0.5, 1),
    '& .MuiSvgIcon-root': {
      fontSize: theme.fontSizeIcon.normal,
    },
  },
}));

const ImportanceIcon = ({ time, importanceLevel }) => {
  const classes = useStyles();
  const { t } = useTranslation('myTasks');
  const style = TASK_IMPORTANCE_LEVEL_COLOR[importanceLevel];

  const info = getImportanceLevelInfo(time, importanceLevel);
  const { status } = info;
  const renderIcon = useMemo(() => {
    const icn =
      status === TASK_IMPORTANCE_LEVEL_STATUS.URGENT
        ? IconWarning
        : status === TASK_IMPORTANCE_LEVEL_STATUS.PRESSING
        ? IconTimer
        : IconUpcoming;
    return (
      <React.Fragment>
        <Box display='flex' alignItems='center'>
          <SvgIcon component={icn} style={{ fill: 'none' }} />
        </Box>
        <Box ml={0.5} color={style.color}>
          {t(`task_${status?.toLowerCase()}`)}
        </Box>
      </React.Fragment>
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, style.color]);

  return (
    <Box
      component='div'
      display='flex'
      alignItems='center'
      className={classes.root}
      style={{ backgroundColor: style.bgColor }}
    >
      {renderIcon}
    </Box>
  );
};

ImportanceIcon.propTypes = {
  time: PropTypes.string,
  importanceLevel: PropTypes.number,
};

ImportanceIcon.defaultProps = {
  time: moment().format(),
};

export default ImportanceIcon;
