import React from 'react';

import trim from 'lodash/trim';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CancelIcon from '@mui/icons-material/Cancel';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';

import TblCheckbox from 'components/TblCheckBox';
import TblIconButton from 'components/TblIconButton';
import TblInputLabel from 'components/TblInputLabel';
import TblTable from 'components/TblTable';

import moment from 'moment';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTableCell-head': {
      borderRight: `1px solid ${theme.mainColors.gray[4]}`,
      '&:nth-last-child(2)': {
        borderRight: `1px solid ${theme.mainColors.gray[4]}`,
        borderTopRightRadius: theme.spacing(0.5),
      },
    },
    '& .MuiTableCell-body': {
      borderRight: `1px solid ${theme.mainColors.gray[4]}`,
      padding: theme.spacing(1.5, 1),
    },
    '& .MuiTableRow-root': {
      '&:last-child': {
        '& .MuiTableCell-body': {
          '&:nth-last-child(2)': {
            borderBottomRightRadius: theme.spacing(0.5),
          },
        },
      },
    },
    '& .MuiIconButton-root': {
      padding: 0,
    },
    '& .MuiSvgIcon-fontSizeSmall': {
      fontSize: theme.fontSizeIcon.normal,
    },
  },
  cursor: {
    cursor: 'pointer',
  },
}));

export default function TimeSlotsTable({ t, template, onDelete, ...props }) {
  const classes = useStyles();
  const theme = useTheme();

  const onChecked = (checked, fieldName, record) => props.onUpdatePeriod({
      payload: { periodId: record.id, timeSlot: { [`${fieldName}`]: checked } },
      templateId: record.dailyTemplateId,
    });

  const columns = [
    {
      title: t('common:name'),
      dataIndex: 'periodName',
      cursor: true,
      key: 'periodName',
      render: (text, record) => (
        <div
          className='text-ellipsis'
          onClick={() => props.toggleDialogTimeSlot(record)}
        >
          {trim(text)}
        </div>
      ),
    },
    {
      title: t('from'),
      dataIndex: 'timeFrom',
      cursor: true,
      key: 'timeFrom',
      width: '250px',
      render: (text, record) => (
        <Box
          display='flex'
          justifyContent='space-between'
          alignContent='center'
          onClick={() => props.toggleDialogTimeSlot(record)}
          className={classes.cursor}
        >
          <span>{moment(text).format('hh:mm a')}</span>
          <AccessTimeIcon fontSize='small' />
        </Box>
      ),
    },
    {
      title: t('to'),
      dataIndex: 'timeTo',
      cursor: true,
      key: 'timeTo',
      width: '250px',
      render: (text, record) => (
        <Box
          display='flex'
          justifyContent='space-between'
          alignContent='center'
          className={classes.cursor}
          onClick={() => props.toggleDialogTimeSlot(record)}
        >
          <span>{moment(text).format('hh:mm a')}</span>{' '}
          <AccessTimeIcon fontSize='small' />
        </Box>
      ),
    },
    {
      title: t('break'),
      dataIndex: 'study',
      cursor: true,
      key: 'study',
      align: 'center',
      width: '100px',
      render: (text, record) => (
        <TblCheckbox
          checked={!text}
          onClick={(e) => onChecked(!e.target.checked, 'study', record)}
        />
      ),
    },
    {
      title: t('study_hall'),
      dataIndex: 'studyHall',
      cursor: true,
      key: 'studyHall',
      align: 'center',
      width: '100px',
      render: (text, record) => (
        <TblCheckbox
          checked={text}
          onClick={(e) => onChecked(e.target.checked, 'studyHall', record)}
        />
      ),
    },
    {
      title: t('action'),
      cursor: true,
      width: '50px',
      key: 'action',
      hide: true,
      render: (text, record) => (
        <TblIconButton onClick={onDeleteRecord(record)}>
          <CancelIcon
            fontSize='small'
            style={{ color: theme.mainColors.gray[6] }}
          />
        </TblIconButton>
      ),
    },
  ];
  const onDeleteRecord = (record) => () => {
    onDelete(record.id, template.template.id);
  };

  const periods = template.periods;
  return (
    <Box mb={2}>
      <TblInputLabel>{t('time_slots_details')}</TblInputLabel>
      <TblTable
        columns={columns}
        rows={periods}
        className={classes.root}
       />
    </Box>
  );
}
TimeSlotsTable.propTypes = {
  t: PropTypes.func,
  onDelete: PropTypes.func,
  template: PropTypes.object,
  periods: PropTypes.array,
  createTimeSlot: PropTypes.func,
  toggleDialogTimeSlot: PropTypes.func,
  onUpdatePeriod: PropTypes.func,
};
