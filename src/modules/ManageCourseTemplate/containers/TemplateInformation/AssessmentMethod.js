import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import isNull from 'lodash/isNull';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';

import TblSelect from 'components/TblSelect';
import TblTable from 'components/TblTable';

import PropTypes from 'prop-types';

function AssessmentMethod(props) {
  const { assessmentMethod, assessmentMethodList, updateBasicInfo, isDisable } = props;
  const { t } = useTranslation([
    'assessmentMethod',
    'allCourses',
    'myCourses',
    'common',
    'dialog',
  ]);
  const selectObject = document.getElementById('select-field');
  const selectWidth = !isNull(selectObject) ? selectObject.offsetWidth : 0;
  const columns = useMemo(
    () => [
      {
        title: t('common:name'),
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: t('first_range'),
        dataIndex: 'rangeFrom',
        key: 'rangeFrom',
      },
      {
        title: t('second_range'),
        dataIndex: 'rangeTo',
        key: 'rangeTo',
      },
    ],
    [t]
  );
  const [rows, setRows] = useState([]);
  useEffect(() => {
    setRows(assessmentMethod?.ranges?.map((range,index) => {
      if (index > 0) {
        range.rangeTo = `< ${range.rangeTo}`;
      }
      return range;
    }));
  }, [assessmentMethod.ranges]);
  const onChangeAssessmentMethod = (e) => {
    const assessmentMethodId = e.target.value;
    setRows(
      assessmentMethodList.find(
        (assessmentMethod) => assessmentMethod.id === assessmentMethodId
      ).ranges
    );
    updateBasicInfo({ assessmentMethodId });
  };
  return (
    <Grid containers>
      <Grid item xs={8}>
        <TblSelect
          required
          disabled={isDisable}
          label={t('common:name')}
          onChange={onChangeAssessmentMethod}
          value={assessmentMethod?.id ?? ''}
          id='select-field'
        >
          {assessmentMethodList?.map((item) => (
            <MenuItem key={item.id} value={item.id}>
              <Box width={selectWidth - 45} className='text-ellipsis'>
                {item.methodName}
              </Box>
            </MenuItem>
          ))}
        </TblSelect>
      </Grid>
      <Grid item xs={12}>
        <Box mt={2}>
          <TblTable
            tableLabel={t('grade_scale_details')}
            columns={columns}
            rows={rows}
            noSideBorder={false}
          />
        </Box>
      </Grid>
    </Grid>
  );
}

export default AssessmentMethod;

AssessmentMethod.propTypes = {
  assessmentMethod: PropTypes.object,
  assessmentMethodList: PropTypes.object,
  updateBasicInfo: PropTypes.func,
  isDisable: PropTypes.bool
};

AssessmentMethod.defaultProps = {
  assessmentMethod: {},
  isDisable: false
};
