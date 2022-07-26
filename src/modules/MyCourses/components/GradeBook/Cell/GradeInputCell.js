import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { Box, InputBase } from '@mui/material';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { useTheme } from '@mui/material/styles';

import { isNaN } from 'lodash';
import { cloneDeep } from 'lodash';
import { GRADE_WEIGHT_TYPE } from 'modules/MyCourses/constants';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';

import FormatNumberInput from '../../../../../components/TblInputs/NumberInput';
import { SUBMISSION_METHOD } from '../../../../../shared/MyCourses/constants';
import { float2Decimal } from '../../../../../utils';

import CellTool from './CellTool';
import { renderStatusOptions } from './utils';

function GradeInputCell(props) {
  const { id, value, api, field, formattedValue, colDef, onOpenCelDetail } =
    props;
  const theme = useTheme();
  const { t } = useTranslation('myCourses');
  const { enqueueSnackbar } = useSnackbar();
  const submissionMethod =
    colDef.masterAssignment?.submissionMethod ||
    (colDef.masterQuiz && SUBMISSION_METHOD.QUIZ);
  const totalPossiblePoints =
    colDef.masterAssignment?.totalPossiblePoints ||
    colDef.masterQuiz?.totalPossiblePoints;

  const handleChange = useCallback(
    async (event) => {
      if (
        colDef.gradeWeightId &&
        colDef.type === GRADE_WEIGHT_TYPE.PARTICIPATION
      ) {
        return api.setEditCellValue(
          {
            id,
            field,
            value: {
              ...formattedValue,
              tempValue:
                isNaN(event.target.value) || event.target.value === ''
                  ? ''
                  : Number(event.target.value),
            },
          },
          event
        );
      }
      if (
        submissionMethod === SUBMISSION_METHOD.ONLINE ||
        submissionMethod === SUBMISSION_METHOD.QUIZ
      ) {
        // fix: allow delete to empty 
        // if (event.target.value === '' || isNaN(Number(event.target.value))) {
        //   return api.setCellMode(id, field, 'view');
        // }
        api.setEditCellValue(
          {
            id,
            field,
            value: {
              ...formattedValue,
              tempValue: Number(event.target.value),
            },
          },
          event
        );
      } else if (submissionMethod === SUBMISSION_METHOD.OFFLINE) {
        if (
          !isNaN(Number(event.target.value)) &&
          (Number(event.target.value) > totalPossiblePoints ||
            (event.target.value !== '' &&
              !event.target.value.match(float2Decimal)))
        ) {
          return;
        } 
          //check unchanged value
          const formatClone = cloneDeep(formattedValue);
          const listOption = renderStatusOptions(
            t,
            formattedValue,
            value,
            colDef
          );
          let isDuplicateValue = false;
          let inDisableComingStatus = false;
          listOption.forEach((option) => {
            if (
              option.value === formatClone.status &&
              option.hotKey === event.target.value
            ) {
              isDuplicateValue = true;
            }
            if (option.hotKey === event.target.value && option.disabled) {
              inDisableComingStatus = option;
            }
          });

          if (isDuplicateValue) {
            api.setCellMode(id, field, 'view');
            return;
          }
          if (inDisableComingStatus) {
            api.setCellMode(id, field, 'view');
            return enqueueSnackbar(inDisableComingStatus.disabledMessage, {
              variant: 'error',
            });
          }

          await api.setEditCellValue(
            {
              id,
              field,
              value: { ...formattedValue, tempValue: event.target.value },
            },
            event
          );
          if (
            event.target.value !== '' &&
            !event.target.value.match(float2Decimal)
          ) {
            api.commitCellChange({ id, field });
            api.setCellMode(id, field, 'view');
          }
        
      }
    },
    [
      api,
      colDef,
      enqueueSnackbar,
      field,
      formattedValue,
      id,
      submissionMethod,
      t,
      totalPossiblePoints,
      value,
    ]
  );

  const handleClickAway = async () => {
    const isValid = await api.commitCellChange({ id, field });
    if (isValid) {
      api.setCellMode(id, field, 'view');
    }
  };
  const renderInput = useCallback(() => {
    if (
      submissionMethod === SUBMISSION_METHOD.ONLINE ||
      submissionMethod === SUBMISSION_METHOD.QUIZ
    ) {
      if (value?.tempValue && isNaN(value.tempValue)) {
        value.tempValue = '';
      }
      return (
        <InputBase
          autoFocus
          value={value?.tempValue}
          disabled={!!!formattedValue}
          onChange={handleChange}
          inputComponent={FormatNumberInput}
          inputProps={{
            isAllowed: (values) => {
              const { floatValue, formattedValue } = values;
              return (
                formattedValue === '' ||
                (floatValue <= totalPossiblePoints && floatValue >= 0)
              );
            },
            decimalScale: 2,
          }}
        />
      );
    }

    if (
      colDef.gradeWeightId &&
      colDef.type === GRADE_WEIGHT_TYPE.PARTICIPATION
    ) {
      if (value?.tempValue && isNaN(value.tempValue)) {
        value.tempValue = '';
      }
      return (
        <InputBase
          autoFocus
          value={value?.tempValue}
          disabled={!!!formattedValue}
          onChange={handleChange}
          inputComponent={FormatNumberInput}
          inputProps={{
            isAllowed: (values) => {
              const { floatValue, formattedValue } = values;
              return (
                formattedValue === '' || (floatValue <= 100 && floatValue >= 0)
              );
            },
            decimalScale: 0,
            suffix: '%',
          }}
        />
      );
    }

    return (
      <InputBase
        autoFocus
        value={value?.tempValue}
        disabled={!!!formattedValue}
        onChange={handleChange}
      />
    );
  }, [
    colDef.gradeWeightId,
    colDef.type,
    formattedValue,
    handleChange,
    submissionMethod,
    totalPossiblePoints,
    value.tempValue,
  ]);

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box
        id={id}
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          paddingLeft: theme.spacing(1),
        }}
      >
        {renderInput()}

        {value && !value.gradeWeightCriteriaId && <CellTool params={props} onOpenCelDetail={onOpenCelDetail} /> }
       
      </Box>
    </ClickAwayListener>
  );
}

GradeInputCell.propTypes = {
  api: PropTypes.shape({
    commitCellChange: PropTypes.func,
    setCellMode: PropTypes.func,
    setEditCellValue: PropTypes.func
  }),
  colDef: PropTypes.shape({
    finalDueTime: PropTypes.string,
    gradeWeightId: PropTypes.number,
    masterAssignment: PropTypes.object,
    masterQuiz: PropTypes.object,
    originalDueTime: PropTypes.string,
    totalPossiblePoints: PropTypes.object,
    type: PropTypes.number
  }),
  field: PropTypes.object,
  formattedValue: PropTypes.object,
  id: PropTypes.number,
  onOpenCelDetail: PropTypes.func,
  value: PropTypes.shape({
    gradeWeightCriteriaId: PropTypes.number,
    overallGrade: PropTypes.number,
    status: PropTypes.number,
    tempValue: PropTypes.func
  })
};

export default GradeInputCell;
