import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import isEqual from 'lodash/isEqual';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import TblAutocomplete from 'components/TblAutocomplete';

import { getFormatTimezone, timezoneList } from 'utils/timezone-utils';

import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';

function TimeZoneSettings(props) {
  const { t } = useTranslation(['domain', 'common', 'error']);
  const { enqueueSnackbar } = useSnackbar();
  const { orgInfo, updateData, isUpdateDomainSettingSuccess, isUpdateDomainSettingFailed, resetReducer } = props;

  const timezoneName = getFormatTimezone(orgInfo.timezone);

  const [timeZone, setTimeZone] = useState(timezoneName);

  const onChangeTimeZone = (event, value) => {
    if (!!value) {
      setTimeZone(value);
      updateData({ timezone: value.split(' ')[1] });
    }
  };

  useEffect(() => {
    if (isUpdateDomainSettingSuccess) {
      let message = t('common:change_saved');
      let variant = 'success';
      enqueueSnackbar(message, { variant });
      resetReducer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isUpdateDomainSettingSuccess]);

  return (
    <Grid container>
      <Grid item xs={8}>
        {isUpdateDomainSettingFailed &&
          <Box mb={2}>
            <Alert severity='error'>
              {t('error:general_error')}
            </Alert>
          </Box>}
        <TblAutocomplete
          value={timeZone}
          options={timezoneList}
          getOptionLabel={(option) => option}
          onChange={onChangeTimeZone}
          label={t('common:time_zone')}
          disabled
        />
      </Grid>
    </Grid>
  );
}

TimeZoneSettings.propTypes = {
  t: PropTypes.func,
  orgInfo: PropTypes.object,
  updateData: PropTypes.func,
  isUpdateDomainSettingSuccess: PropTypes.bool,
  isUpdateDomainSettingFailed: PropTypes.bool,
  enqueueSnackbar: PropTypes.func,
  resetReducer: PropTypes.func
};

export const TimeZoneSettingsWrapper = React.memo(TimeZoneSettings, isEqual);