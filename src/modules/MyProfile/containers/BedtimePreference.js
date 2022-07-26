import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import isEmpty from 'lodash/isEmpty';

import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';

import TblSelect from 'components/TblSelect';

import moment from 'moment';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';

import myProfileActions from '../actions';
import { bedtimeArray, wakeUpArray } from '../utils';

export default function BedtimePreference({ t }) {
  // const classes = useStyles();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const bedTimeInReducer = useSelector(
    (state) => state.Auth.currentUser.bedTime
  );
  const wakeupTimeInReducer = useSelector(
    (state) => state.Auth.currentUser.wakeupTime
  );
  const isChangeBedtimePreferenceSuccess = useSelector(
    (state) => state.MyProfile.isChangeBedtimePreferenceSuccess
  );
  const error = useSelector((state) => state.MyProfile.error);

  const [bedTime, setBedTime] = useState('2');
  const [wakeupTime, setWakeupTime] = useState('6');

  useEffect(() => {
    const bedTimeReducerIndex = bedtimeArray.findIndex((item) =>
      moment(item.text, 'hh:mm a').isSame(
        moment(bedTimeInReducer, 'HH:mm:ss'),
        'minute'
      )
    );
    const wakeupTimeReducerIndex = wakeUpArray.findIndex((item) =>
      moment(item.text, 'hh:mm a').isSame(
        moment(wakeupTimeInReducer, 'HH:mm:ss'),
        'minute'
      )
    );
    if (Number(bedTime) !== bedTimeReducerIndex && bedTimeReducerIndex !== -1) {
      setBedTime(bedTimeReducerIndex);
    }
    if (
      Number(wakeupTime) !== wakeupTimeReducerIndex &&
      wakeupTimeReducerIndex !== -1
    ) {
      setWakeupTime(wakeupTimeReducerIndex);
    }
  }, [bedTime, bedTimeInReducer, wakeupTime, wakeupTimeInReducer]);

  useEffect(() => {
    if (isChangeBedtimePreferenceSuccess) {
      enqueueSnackbar(t('common:change_saved'), { variant: 'success' });
    }
  }, [enqueueSnackbar, isChangeBedtimePreferenceSuccess, t]);

  useEffect(() => {
    if (error) {
      const errorMessage = error?.message ?? t('error:general_error');
      enqueueSnackbar(errorMessage, { variant: 'error' });
    }
  }, [enqueueSnackbar, error, t]);

  //NOTE: Component will unmount
  useEffect(() => () => {
      dispatch(
        myProfileActions.myProfileSetState({
          error: undefined,
          isChangeBedtimePreferenceSuccess: false,
        })
      );
    }, [dispatch]);

  const updateBedtimePreference = (value, isBedtime = true) => {
    if (isBedtime) {
      const bedtimeValue = bedtimeArray.find(
        (item) => item.id === Number(value)
      );
      if (!isEmpty(bedtimeValue)) {
        dispatch(
          myProfileActions.updateBedtimePreference({
            bedTime: bedtimeValue?.text,
            isChangeBedtimePreferenceSuccess: false,
          })
        );
      }
    } else {
      const wakeUpValue = wakeUpArray.find((item) => item.id === Number(value));
      if (!isEmpty(wakeUpValue)) {
        dispatch(
          myProfileActions.updateBedtimePreference({
            wakeupTime: wakeUpValue?.text,
            isChangeBedtimePreferenceSuccess: false,
          })
        );
      }
    }
  };
  
  return (
    <Box display='flex'>
      <Box width={288}>
        <TblSelect
          label={t('bedtime')}
          value={parseInt(bedTime)}
          onChange={(e) => updateBedtimePreference(e.target.value)}
        >
          {bedtimeArray.map((item, index) => (
            <MenuItem key={index} value={index}>
              {item?.text}
            </MenuItem>
          ))}
        </TblSelect>
      </Box>
      <Box width={288} ml={3}>
        <TblSelect
          label={t('wake_up')}
          value={parseInt(wakeupTime)}
          onChange={(e) => updateBedtimePreference(e.target.value, false)}
        >
          {wakeUpArray.map((item, index) => (
            <MenuItem key={index} value={index}>
              {item?.text}
            </MenuItem>
          ))}
        </TblSelect>
      </Box>
    </Box>
  );
}

BedtimePreference.propTypes = {
  t: PropTypes.func,
};
