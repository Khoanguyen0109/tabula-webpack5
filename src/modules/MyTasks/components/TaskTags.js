import React from 'react';

import isEqual from 'lodash/isEqual';

import makeStyles from '@mui/styles/makeStyles';

import { OPPORTUNITY_TYPE } from 'shared/MyTasks/constants';

import PropTypes from 'prop-types';

const styled = makeStyles(({ openColors, newColors, spacing, fontWeight, fontSize, ...theme }) => ({
  wrapperTags: {
    display: 'flex',
    minWidth: 45,
    '& .tag-item': {
      padding: spacing(1),
      marginRight: spacing(1),
      borderRadius: 8,
      fontSize: fontSize.normal,
      fontWeight: fontWeight.normal,
      fontStretch: 'normal',
      fontStyle: 'normal',
      lineHeight: 1,
      letterSpacing: 'normal',
      textAlign: 'left',
      '&.late': {
        background: openColors.red[0],
        color: openColors.red[8]
      },
      '&.extra-credit': {
        background: theme.customColors.primary1.light[3],
        color: theme.customColors.primary1.main
      },
      '&.make-up': {
        background: newColors.gray[100],
        color: newColors.gray[700]
      },
      '&.retake': {
        background: newColors.gray[100],
        color: newColors.gray[700]
      },
      '&:last-child': {
        marginRight: 0
      }
    }
  }
}));

const TaskTags = ({ t, opportunities = [] }) => {
  const style = styled();
  if (opportunities?.length > 0 && !opportunities.includes(0)) {
    return (
      <div className={style.wrapperTags}>
        {opportunities.map((e, i) => {
          switch (Number(e)) {
            case OPPORTUNITY_TYPE.EXTRA_CREDIT:
              return <div key={i} className='tag-item extra-credit'>{t('myTasks:activity_stt_extraCredit')}</div>;
            case OPPORTUNITY_TYPE.LATE_ASSIGNMENT:
              return <div key={i} className='tag-item late'>{t('myTasks:activity_stt_late')}</div>;
            case OPPORTUNITY_TYPE.RETAKE_TEST:
              return <div key={i} className='tag-item retake'>{t('myTasks:activity_stt_retake')}</div>;
            case OPPORTUNITY_TYPE.MAKE_UP_TEST:
              return <div key={i} className='tag-item make-up'>{t('myTasks:activity_stt_makeup')}</div>;
            default:
              return null;
          }
        })}
      </div>
    );
  }
  return null;
};

TaskTags.propTypes = {
  t: PropTypes.func,
  opportunities: PropTypes.array
};

export default React.memo(TaskTags, isEqual);