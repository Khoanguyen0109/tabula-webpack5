import React from 'react';
import { useTranslation } from 'react-i18next';

import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Tooltip } from '@mui/material';
import Box from '@mui/material/Box';
import makeStyles from '@mui/styles/makeStyles';

import TblGoogleLabel from 'components/TblGoogleFile/TblGoogleLable';
import TblGooglePicker from 'components/TblGooglePicker';

import PropTypes from 'prop-types';

import TblGoogleFileList from '../../../components/TblGoogleFileList';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(1),
  },
  labelWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: theme.spacing(1),
  },
  tooltip: {
    color: theme.newColors.gray[700],
  },

  note: {
    color: theme.newColors.gray[800],
    fontSize: theme.fontSize.normal,
  },
  scrollBar: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    // maxheight: 4 google file
    maxHeight: theme.spacing(6.5 * 4),
    '&:last-child': {
      boxShadow: 'none',
    },
  },
}));

function GoogleAttachment(props) {
  const classes = useStyles();
  const { t } = useTranslation();
  const {
    hasPermission,
    initialValues,
    onAdd,
    onChange,
    maxItems,
    onChangeChooseTemplate,
    disabled,
  } = props;
  const maxItemCanBeSelected = maxItems - initialValues.length;

  const onRemove = (sourceId) => {
    const index = initialValues.findIndex((file) => file.sourceId === sourceId);
    initialValues.splice(index, 1);
    // const filterList = initialValues.filter((f) => f.sourceId !== sourceId);
    onChange(initialValues);
  };

  return (
    <Box className={classes.root}>
      <Box className={classes.labelWrapper}>
        <TblGoogleLabel />
        {onChangeChooseTemplate && !disabled && (
          <Tooltip title={t('google:only_1_file_is_selected_as_template')}>
            <InfoOutlinedIcon className={classes.tooltip} />
          </Tooltip>
        )}
      </Box>
      <Box mb={3} />
      <TblGooglePicker
        maxItemCanBeSelected={maxItemCanBeSelected}
        isEmptyList={initialValues.length === 0}
        hasPermission={hasPermission}
        onChange={onAdd}
        disabled={disabled}
      />
      <Box mb={2} />
      {initialValues.length > 0 && (
        <TblGoogleFileList
          list={initialValues}
          hasPermission={hasPermission}
          onRemove={onRemove}
          onChangeChooseTemplate={onChangeChooseTemplate}
          disabled={disabled}
        />
      )}
    </Box>
  );
}

GoogleAttachment.propTypes = {
  hasPermission: PropTypes.bool,
  initialValues: PropTypes.array,
  maxFile: PropTypes.number,
  maxItemCanBeSelected: PropTypes.func,
  maxItems: PropTypes.number,
  onAdd: PropTypes.func,
  onChange: PropTypes.func,
  onChangeChooseTemplate: PropTypes.func,
  disabled: PropTypes.bool,
};

export default GoogleAttachment;
GoogleAttachment.defaultProps = {
  initialValues: [],
  maxFile: 10,
  disabled: false,
};
