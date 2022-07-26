import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import map from 'lodash/map';

import Typography from '@mui/material/Typography';
import withStyles from '@mui/styles/withStyles';

import TblButton from 'components/TblButton';
import TblDialog from 'components/TblDialog';
import TblIconButton from 'components/TblIconButton';
import TblRadio from 'components/TblRadio';

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
    '& .MuiDialogActions-root': {
      justifyContent: 'flex-end',
      paddingTop: '10px',
    },
  },
  closeButton: {
    position: 'absolute',
    right: spacing(2),
    top: spacing(2),
    color: palette.grey[500],
  },
});

function FilterSchoolYearDialog({
  classes,
  isOpenDialog,
  setOpenDialog,
  schoolYears,
  schoolYearSelected,
  setSchoolYearSelected,
}) {
  const { t } = useTranslation(['myTasks', 'common']);
  const [schoolYearTmp, setSchoolYearTmp] = useState(null);

  const onChangeSchoolYear = (event) =>
    setSchoolYearTmp(Number(event.target.value));

  const onApply = () => {
    setOpenDialog(false);
    if (schoolYears.length) {
      setSchoolYearSelected(Number(schoolYearTmp || schoolYearSelected));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  const onClose = () => {
    setOpenDialog(false);
    // delay 1s to rollback previous schoolYear, avoid not render UI smoothly
    setTimeout(() => {
      setSchoolYearTmp(schoolYearSelected);
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  const renderTitleDialog = useMemo(
    () => (
      <React.Fragment>
        <Typography variant='bodyMedium' component='p'>
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
    [setOpenDialog]
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

  const schoolYearList = useCallback(
    map(schoolYears, (item) => ({ ...item, value: item.id, label: item.name })),
    [schoolYears]
  );

  return (
    <TblDialog
      className={classes.dialog}
      open={isOpenDialog}
      maxWidth='xs'
      title={renderTitleDialog}
      footer={schoolYears.length > 0 && renderFooterDialog}
    >
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
    </TblDialog>
  );
}

FilterSchoolYearDialog.propTypes = {
  classes: PropTypes.object,
  isOpenDialog: PropTypes.bool,
  setOpenDialog: PropTypes.func,
  schoolYears: PropTypes.array,
  setSchoolYearSelected: PropTypes.func,
  schoolYearSelected: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

FilterSchoolYearDialog.defaultProps = {
  schoolYears: [],
};

export default withStyles(styled)(FilterSchoolYearDialog);
