import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';

import TblInputs from 'components/TblInputs';
import TblSelect from 'components/TblSelect';
import TblTableForm from 'components/TblTableForm';
import TblTooltip from 'components/TblTooltip';

import { GRADE_WEIGHT_TYPE } from 'modules/MyCourses/constants';
import PropTypes from 'prop-types';
// import withReducer from 'components/withReducer';

const useStyles = makeStyles((theme) => ({
  root: {
    minWidth: theme.spacing(70),
    '& .description-table': {
      paddingLeft: 8,
      fontWeight: theme.fontWeight.semi,
      color: theme.palette.primary.main,
      fontSize: theme.fontSize.small,
    },
    '& .help-text': {
      fontSize: 12,
      paddingLeft: 8,
      marginBottom: theme.spacing(2),
    },
    '& .MuiTableContainer-root': {
      overflowX: 'hidden',
    },
  },
}));

function GradeWeighting(props) {
  const { gradeWeight } = props;
  const classes = useStyles();

  const { t } = useTranslation([
    'myCourses',
    'assessmentMethod',
    'allCourses',
    'common',
    'dialog',
  ]);
  const total = useMemo(
    () =>
      gradeWeight
        ? Number(
            gradeWeight?.reduce(
              (total, grade) => total + Number(grade.weight || 0),
              0
            )
          ).toFixed(2)
        : 0,
    [gradeWeight]
  );
  const columns = useMemo(
    () => [
      {
        title: t('Category'),
        dataIndex: 'name',
        cursor: true,
        width: '30%',
        key: 'name',
        disabled: true,
        render: (text) => (
          <TblInputs
            value={text}
            disabled={true}
            inputProps={{ maxLength: 254 }}
            placeholder={t('myCourses:enter_category')}
            noneBorder={true}
          />
        ),
      },
      {
        title: t('Type'),
        dataIndex: 'type',
        cursor: true,
        width: '30%',
        key: 'type',
        disabled: true,
        render: (text) => (
            <TblSelect
              value={text}
              disabled={true}
              placeholder={t('common:select')}
              hasBoxShadow={false}
            >
              <MenuItem value={GRADE_WEIGHT_TYPE.ASSIGNMENT}>
                {t('myCourses:assignment')}
              </MenuItem>

              <MenuItem
                sx={{
                  '&.Mui-disabled': {
                    pointerEvents: 'auto',
                  },
                }}
                disabled={true}
                value={GRADE_WEIGHT_TYPE.PARTICIPATION}
              >
                <TblTooltip
                  disableHoverListener={true}
                  title={t('myCourses:max_number_of_participation')}
                  placement='top'
                  arrow
                >
                  <div>{t('myCourses:participation')}</div>
                </TblTooltip>
              </MenuItem>

              <MenuItem value={GRADE_WEIGHT_TYPE.TEST}>
                {t('myCourses:test')}
              </MenuItem>
            </TblSelect>
          ),
      },
      {
        title: `${t('Weight')} (%)`,
        dataIndex: 'weight',
        cursor: true,
        width: '30%',
        disabled: true,
        key: 'weight',
        render: (text) => (
          <TblInputs
            value={text}
            type='text'
            inputType='number'
            disabled={true}
            placeholder={t('myCourses:enter_weight')}
            decimalScale={2}
            noneBorder={true}
            isAllowed={(values) => {
              const { floatValue, formattedValue } = values;
              return (
                formattedValue === '' || (floatValue <= 100 && floatValue > 0)
              );
            }}
          />
        ),
      },
      {
        title: t('action'),
        cursor: true,
        // width: '50px',
        key: 'action',
        hide: true,
        render: () => null,
      },
    ],
    [t]
  );

  return (
    <Grid className={classes.root}>
      <Typography variant='bodyMedium' className='description-table'>
        {t('myCourses:grade_weight_details')}
      </Typography>
      <TblTableForm columns={columns} rows={gradeWeight} />
      <Box
        display='flex'
        width='100%'
        justifyContent='space-between'
        mt={2}
        ml={1}
      >
        {<Box width='60%' />}
        <Typography style={{ width: '40%' }} color={total > 100 ? 'error' : ''}>
          {t('myCourses:total')}: {total}%
        </Typography>
        <div/>
      </Box>
    </Grid>
  );
}
export default GradeWeighting;

GradeWeighting.propTypes = {
  gradeWeight: PropTypes.array,
};
