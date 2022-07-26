import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import map from 'lodash/map';

import { Box } from '@mui/material';
import Typography from '@mui/material/Typography';
import withStyles from '@mui/styles/withStyles';

import TblButton from 'components/TblButton';
import TblDialog from 'components/TblDialog';
import TblIconButton from 'components/TblIconButton';
import TblRadio from 'components/TblRadio';

import useGetSchoolYear from 'utils/customHook/useGetSchoolYear';

import PropTypes from 'prop-types';

const styled = ({ spacing, palette }) => ({
  root: {
    minWidth: '120px',
    minHeight: '48px',
  },
  dialog: {
    '& .MuiFormControlLabel-root': {
      marginTop: '3px',
      marginBottom: '3px',
      marginLeft: '-15px',
    },
  },
  closeButton: {
    position: 'absolute',
    right: spacing(2),
    top: spacing(2),
    color: palette.grey[500],
  },
});

function FilterSchoolYearSetting({ classes, isOpenDialog, setOpenDialog }) {
  const { t } = useTranslation(['myTasks', 'common']);

  const schoolYears = useSelector((state) => state.Auth.schoolYears) ?? [];
  const [schoolYearSelected, setSchoolYearSelected] = useGetSchoolYear();

  const [schoolYearTmp, setSchoolYearTmp] = useState(null);
  const onChangeSchoolYear = (event) =>
    setSchoolYearTmp(Number(event.target.value));
  const schoolYearList = useCallback(
    map(schoolYears, (item) => ({ ...item, value: item.id, label: item.name })),
    [schoolYears]
  );

  const onApply = () => {
    setOpenDialog(false);
    if (schoolYears.length) {
      setSchoolYearSelected(Number(schoolYearTmp || schoolYearSelected));
    }
  };

  const onClose = () => {
    setOpenDialog(false);
    setTimeout(() => {
      setSchoolYearTmp(schoolYearSelected);
    }, 1000);
  };

  const renderTitleDialog = useMemo(
    () => (
      <React.Fragment>
        <Typography variant='titleSmall' component='p'>
          {t('dialog-title')}
        </Typography>
        <TblIconButton
          className={classes.closeButton}
          onClick={onClose}
          aria-label='icon-icn_close'
        >
          <span className='icon-icn_close' />
        </TblIconButton>
      </React.Fragment>
      // eslint-disable-next-line react-hooks/exhaustive-deps
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const renderFooterDialog = useMemo(
    () => (
      <React.Fragment>
        <TblButton
          variant='outlined'
          color='primary'
          onClick={onClose}
          className={classes.root}
        >
          {t('common:cancel')}
        </TblButton>
          <TblButton
            variant='contained'
            color='primary'
            type='submit'
            onClick={onApply}
            className={classes.root}
          >
            {t('common:apply')}
          </TblButton>
      </React.Fragment>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t, onClose, onApply]
  );

  return (
    <TblDialog
      className={classes.dialog}
      open={isOpenDialog}
      maxWidth='xs'
      title={renderTitleDialog}
      footer={schoolYears.length > 0 && renderFooterDialog}
    >
      <Box mt={2}>
        {schoolYears.length === 0 ? (
          <Typography variant='bodyMedium'>{t('common:empty')}</Typography>
        ) : (
          <TblRadio
            values={schoolYearList}
            value={schoolYearTmp || schoolYearSelected}
            onChange={onChangeSchoolYear}
            row={false}
            itemWidth={{ sm: 12 }}
          />
        )}
      </Box>
    </TblDialog>
  );
}

FilterSchoolYearSetting.propTypes = {
  classes: PropTypes.shape({
    closeButton: PropTypes.any,
    dialog: PropTypes.any,
    root: PropTypes.any,
  }),
  isOpenDialog: PropTypes.any,
  schoolYears: PropTypes.array,
  setOpenDialog: PropTypes.func,
};

FilterSchoolYearSetting.defaultProps = {
  schoolYears: [],
};

export default withStyles(styled)(FilterSchoolYearSetting);
