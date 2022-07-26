import React, { useEffect, useState } from 'react';

import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';
import uniq from 'lodash/uniq';
import uniqueId from 'lodash/uniqueId';

import CancelIcon from '@mui/icons-material/Cancel';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';

import TblIconButton from 'components/TblIconButton';
import TblInputLabel from 'components/TblInputLabel';
import TblSelect from 'components/TblSelect';
import TblTableForm from 'components/TblTableForm';
import TblTooltipDynamic from 'components/TblTooltipDynamic';

import clsx from 'clsx';
import moment from 'moment';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  title: {
    fontSize: theme.fontSize.small,
    fontWeight: theme.fontWeight.semi,
    marginBottom: theme.spacing(0.5),
    maxWidth: 300,
  },
  templateItem: {
    whiteSpace: 'normal',
    wordBreak: 'break-all',
  },
  templateText: {
    width: 'calc(100% - 12px)',
  },
}));

const defaultData = (id) => ({
  id: id,
  dailyTemplateId: '',
  periodId: '',
  location: '',
});

export default function MeetingTimeTable(props) {
  const classes = useStyles();
  const theme = useTheme();

  // NOTE: initial props and states
  const {
    t,
    data,
    hasPermission,
    sectionId,
    saveDataFailed,
    isUpdatingSectionsAndMeetingTimes,
    disabled,
  } = props;
  const [dataTable, setDataTable] = useState([]);
  const [pairMeetingTimes, setPairMeetingTimes] = useState([]);
  const [pairMeetingTimesSelected, setPairMeetingTimesSelected] = useState([]);
  const [dailyTemplates, setDailyTemplates] = useState([]);

  //NOTE: common function
  const checkValidRow = (item) =>
    item.dailyTemplateId !== '' && item.periodId !== '';
  const handleChange = (data, record, fieldValue, isSave = false) => {
    const originDataTable = cloneDeep(dataTable);
    const newData = originDataTable.find((i) => i.id === record.id);
    newData[fieldValue] = data;
    if (fieldValue === 'dailyTemplateId') {
      newData.periodId = '';
    }
    if (isSave) {
      handleUpdateData(newData, originDataTable);
    }
    setDataTable(originDataTable);
  };

  const handleSaveData = (timeSlots) => {
    const validTimeSlots = timeSlots.filter((i) => checkValidRow(i));
    const timeSlot = validTimeSlots.map((i) => {
      const { dailyTemplateId, periodId, location } = i;
      return {
        dailyTemplateId,
        periodId,
        location,
      };
    });
    const { termId } = data;
    const payload = {
      meetingTimes: {
        sectionId,
        termId,
        data: timeSlot,
      },
    };
    props.saveData(payload);
  };

  const handleUpdateData = (record, timeSlots) => {
    if (checkValidRow(record)) {
      handleSaveData(timeSlots);
      if (!isNaN(record.id)) {
        props.setUpdatedData(record);
      } else {
        const availableDailyTemplate = getAvailableDailyTemplate(record);
        const availablePeriods = getAvailablePeriods(record);
        const templateObject = availableDailyTemplate.find(
          (item) => item.template.id === record.dailyTemplateId
        );
        const periodObject = availablePeriods.find(
          (item) => item.id === record.periodId
        );
        const newRecord = Object.assign(
          { ...record },
          {
            templateName: templateObject.template.templateName,
            periodName: periodObject.periodName,
          }
        );
        props.setCreatedData(newRecord);
      }
    }
  };

  const onDeleteRecord = (record) => () => {
    let timeSlots = dataTable.filter(
      (i) => i.id !== record.id && checkValidRow(i)
    );
    const copyDataTable = [...dataTable];
    const newDataTable = copyDataTable.filter((i) => i.id !== record.id);
    setDataTable(newDataTable);
    props.setUpdatedData(record);
    handleSaveData(timeSlots);
  };
  const addRecord = (e) => {
    // console.log(e);
    if (isUpdatingSectionsAndMeetingTimes) {
      e.preventDefault();
    } else {
      const copyDataTable = [...dataTable];
      const newDataTable = copyDataTable.filter((i) => checkValidRow(i));
      newDataTable.push(defaultData(uniqueId('row_')));
      setDataTable([...newDataTable]);
    }
  };

  const getAvailableMeetingTimes = () =>
    pairMeetingTimes.filter((i) => {
      const meetingTimesSelected = pairMeetingTimesSelected.find((item) =>
        isEqual(i, item)
      );
      return !isEqual(meetingTimesSelected, i);
    });

  const getAvailableDailyTemplate = (record) => {
    const availableMeetingTimes = getAvailableMeetingTimes();
    const availableDailyTemplateId = uniq(
      availableMeetingTimes.map((i) => i[0])
    );
    return (
      dailyTemplates?.filter(
        (i) =>
          (availableDailyTemplateId.includes(i.template?.id) ||
            i.template?.id === record.dailyTemplateId) &&
          !i?.template?.holiday
      ) ?? []
    );
  };

  const getAvailablePeriods = (record) => {
    const currentDailyTemplate = dailyTemplates.find(
      (i) => i.template?.id === record.dailyTemplateId
    );
    const availableMeetingTimes = getAvailableMeetingTimes();
    const filterMeetingTimeByDailyTemplate = availableMeetingTimes.filter(
      (i) => i[0] === record.dailyTemplateId
    );
    const availablePeriodsId = filterMeetingTimeByDailyTemplate.map(
      (i) => i[1]
    );
    return (
      currentDailyTemplate?.periods?.filter(
        (i) =>
          (availablePeriodsId.includes(i.id) || i.id === record.periodId) &&
          i.study
      ) ?? []
    );
  };

  const columns = [
    {
      title: t('daily_template'),
      dataIndex: 'dailyTemplateId',
      cursor: hasPermission,
      key: 'dailyTemplateId',
      width: '45%',
      render: (text, record) => {
        const availableDailyTemplate = getAvailableDailyTemplate(record);
        return (
          <TblSelect
            children={
              availableDailyTemplate.length !== 0
                ? availableDailyTemplate?.map((item) => (
                    <MenuItem
                      value={item?.template?.id}
                      key={item?.template?.id}
                    >
                      <span className={`text-ellipsis ${classes.templateText}`}>
                        {item?.template?.templateName}
                      </span>
                    </MenuItem>
                  ))
                : null
            }
            onChange={(e) =>
              handleChange(e.target.value, record, 'dailyTemplateId', false)
            }
            value={text}
            disabled={!hasPermission || disabled}
            placeholder={t('common:select')}
            hasBoxShadow={false}
          />
        );
      },
    },
    {
      title: t('time_slot'),
      dataIndex: 'periodId',
      cursor: true,
      key: 'periodId',
      width: '45%',
      render: (text, record) => {
        const availablePeriods = getAvailablePeriods(record);
        return (
          <TblSelect
            children={
              availablePeriods.length !== 0
                ? availablePeriods?.map((item) => (
                    <MenuItem
                      value={item?.id}
                      key={item?.id}
                      className={classes.templateItem}
                    >
                      <span className={classes.templateText}>
                        {item?.periodName} (
                        {moment(item?.timeFrom).format('hh:mma')} -{' '}
                        {moment(item?.timeTo).format('hh:mma')})
                      </span>
                    </MenuItem>
                  ))
                : null
            }
            onChange={(e) =>
              handleChange(e.target.value, record, 'periodId', true)
            }
            value={text}
            disabled={!hasPermission || disabled}
            placeholder={t('common:select')}
            hasBoxShadow={false}
          />
        );
      },
    },
    // {
    //   title: t('classroom_location'),
    //   dataIndex: 'location',
    //   cursor: hasPermission,
    //   key: 'location',
    //   width: '40%',
    //   render: (text, record) => (
    //     <TblInputs value={text}
    //       onChange={(e) => handleChange(e.target.value, record, 'location', false)}
    //       onBlur={() => handleUpdateData(record, dataTable)}
    //       inputProps={{maxLength: 254}}
    //       disabled={!hasPermission}
    //       placeholder={t('enter_room')}
    //     />
    //   )
    // },
    {
      title: t('action'),
      cursor: true,
      width: '50px',
      key: 'action',
      hide: true,
      render: (text, record) => {
        if (disabled) return;
        return (
          <TblIconButton onClick={onDeleteRecord(record)}>
            <CancelIcon
              fontSize='small'
              style={{ color: theme.mainColors.gray[6] }}
            />
          </TblIconButton>
        );
      },
    },
  ];

  // NOTE: handle React lifecycle

  useEffect(() => {
    const meetingTimes = [];
    const filterDailyTemplateByTermId = props.dailyTemplates.filter(
      (i) => i.template.termId === data.termId
    );
    if (filterDailyTemplateByTermId && filterDailyTemplateByTermId.length) {
      filterDailyTemplateByTermId.forEach((item) => {
        if (item.periods.length) {
          item.periods.forEach((p) => {
            if (p.study && !p.studyHall) {
              meetingTimes.push([item.template.id, p.id]);
            }
          });
        } else {
          meetingTimes.push([item.template.id, '']);
        }
      });
    }
    //NOTE: Fix bug TL-3412
    if (!isEqual(meetingTimes, pairMeetingTimes)) {
      setPairMeetingTimes(meetingTimes);
    }
    if (!isEqual(filterDailyTemplateByTermId, dailyTemplates)) {
      setDailyTemplates(filterDailyTemplateByTermId);
    }
    const timeSlots = data?.timeSlots;
    setDataTable(timeSlots);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.dailyTemplates, data]);

  useEffect(() => {
    const pairMeetingTimesSelected = [];
    dataTable.forEach((i) => {
      if (checkValidRow(i)) {
        pairMeetingTimesSelected.push([i.dailyTemplateId, i.periodId]);
      }
    });
    setPairMeetingTimesSelected(pairMeetingTimesSelected);
  }, [dataTable]);

  useEffect(() => {
    if (saveDataFailed?.subcode === 3) {
      const timeSlots = data?.timeSlots;
      setDataTable(timeSlots);
    }
  }, [saveDataFailed, data]);

  return (
    <Box mb={2}>
      <TblInputLabel>
        <TblTooltipDynamic
          placement='top'
          className={`${classes.title} text-ellipsis`}
        >
          {data?.schoolYearName} - {data?.termName}
        </TblTooltipDynamic>
      </TblInputLabel>
      {/* <Typography className={`${classes.title} text-ellipsis`}>{data?.schoolYearName} - {data?.termName}</Typography> */}
      <TblTableForm
        columns={columns}
        rows={dataTable}
        className={clsx({ disabled: !hasPermission })}
      />
      {hasPermission && !disabled && (
        <Box mt={2} ml={1}>
          <Typography
            component='a'
            href='#'
            color='secondary'
            onClick={addRecord}
            variant='bodyMedium'
          >
            {t('common:add_another_row')}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
MeetingTimeTable.propTypes = {
  t: PropTypes.func,
  data: PropTypes.object,
  periods: PropTypes.array,
  hasPermission: PropTypes.bool,
  isUpdatingSectionsAndMeetingTimes: PropTypes.bool,
  createTimeSlot: PropTypes.func,
  toggleDialogTimeSlot: PropTypes.func,
  onUpdatePeriod: PropTypes.func,
  dailyTemplates: PropTypes.array,
  saveData: PropTypes.func,
  setUpdatedData: PropTypes.func,
  setCreatedData: PropTypes.func,
  sectionId: PropTypes.number,
  saveDataFailed: PropTypes.object,
  disabled: PropTypes.bool,
};
MeetingTimeTable.defaultProps = {
  disabled: false,
};
