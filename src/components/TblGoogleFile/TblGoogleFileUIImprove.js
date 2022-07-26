import React from 'react';
import { useTranslation } from 'react-i18next';

import CancelIcon from '@mui/icons-material/Cancel';
import { Box, Switch, Tooltip, Typography } from '@mui/material';
import { makeStyles, withStyles } from '@mui/styles';

import TblButton from 'components/TblButton';
import TblIconButton from 'components/TblIconButton';

import clsx from 'clsx';
import PropTypes from 'prop-types';

import { GOOGLE_FILE_TYPE_SUPPORT_VIEW } from '../../shared/Google/constants';
import TblGoogleView from '../TblGoogleView';
import WithFullScreen from '../TblGoogleView/WithFullScreen';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    minHeight: theme.spacing(6),
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing(1),
    boxShadow: 'inset 0px -1px 0px rgba(0, 0, 0, 0.07)',
    '&:last-child': {
      boxShadow: 'none',
    },
  },
  nameGroup: {
    display: 'flex',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  name: {
    color: theme.newColors.gray[900],
    width: theme.spacing(40),
  },
  icon: {
    width: theme.spacing(2.5),
    height: theme.spacing(2.5),
    marginRight: theme.spacing(1),
  },
  btnGroup: {
    display: 'flex',
  },
  useTemplateGroup: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing(3.25),
  },
  useTemplateBtn: {},
  useTemplateTxt: {
    color: (props) =>
      props.isTemplate ? theme.newColors.gray[900] : theme.newColors.gray[600],
  },
  removeBtn: {
    color: `${theme.newColors.gray[500] }!important`,
  },
}));

const useStylesBootstrap = makeStyles((theme) => ({
  arrow: {
    fontSize: 5,
    color: theme.palette.common.black,
  },
  tooltip: {
    padding: theme.spacing(1),
    fontSize: theme.fontSize.normal,
    borderRadius: theme.borderRadius.default,
    backgroundColor: theme.palette.common.black,
  },
}));

function BootstrapTooltip(props) {
  const classes = useStylesBootstrap();

  return <Tooltip arrow classes={classes} {...props} />;
}

const IOSSwitch = withStyles((theme) => ({
  root: {
    width: theme.spacing(4.5),
    height: theme.spacing(2.25),
    padding: 0,
  },
  switchBase: {
    height: theme.spacing(2.25),
    width: theme.spacing(2.25),
    padding: 0,
    '&$checked': {
      transform: 'translateX(18px)',
      color: theme.palette.common.white,
      '& + $track': {
        backgroundColor: theme.customColors.primary1.light[1],
        opacity: 1,
        border: 'none',
      },
    },
    '&$focusVisible $thumb': {
      color: theme.customColors.primary1.light[1],
      border: '2px solid #fff',
    },
  },
  thumb: {
    width: theme.spacing(1.75),
    height: theme.spacing(1.75),
  },
  track: {
    borderRadius: theme.spacing(2),
    backgroundColor: theme.newColors.gray[400],
    transition: theme.transitions.create(['background-color', 'border']),
  },
  checked: {},
  focusVisible: {},
}))(({ classes, ...props }) => (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      props
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      {...props}
    />
  ));

function TblGoogleFileUIImprove(props) {
  const {
    openFile,
    open,
    onClose,
    onRemove,
    hasPermission,
    sourceId,
    mineType,
    url,
    icon,
    name,
    id,
    isTemplate,
    onChangeChooseTemplate,
    onUseTemplate,
    onUseFileAsTemplate,
    disabled,
  } = props;
  const classes = useStyles(props);
  const { t } = useTranslation();
  const canBeTemplate =
    !!onChangeChooseTemplate && GOOGLE_FILE_TYPE_SUPPORT_VIEW.includes(icon);
  return (
    <Box className={classes.root}>
      <Box className={classes.nameGroup} onClick={openFile}>
        <img className={classes.icon} src={icon} alt='doc-icon' />
        <Typography
          variant='bodyMedium'
          className={clsx(classes.name, 'text-ellipsis')}
        >
          {name}{' '}
        </Typography>
      </Box>
      <Box className={classes.btnGroup}>
        {canBeTemplate && !disabled && (
          <Box className={classes.useTemplateGroup}>
            <Box mr={2}>
              <Typography variant='bodyMedium' className={classes.useTemplateTxt}>
                {t('google:use_as_template')}{' '}
              </Typography>
            </Box>
            <IOSSwitch
              checked={isTemplate}
              onChange={() => {
                onChangeChooseTemplate(sourceId);
              }}
            />
          </Box>
        )}
        {!!onUseTemplate && isTemplate && (
          <TblButton
            color='primary'
            variant='contained'
            size='small'
            onClick={() => onUseFileAsTemplate(id, sourceId)}
            isShowCircularProgress={props.useTemplateLoading}
            disabled={props.disableUseTemplate}
          >
            {t('google:use_template')}
          </TblButton>
        )}
        {onRemove && !disabled && (
          <BootstrapTooltip title={t('common:remove')} placement='top'>
            <span>
              <TblIconButton
                className={classes.removeBtn}
                disabled={!hasPermission}
                onClick={() => onRemove(sourceId)}
              >
                <CancelIcon />
              </TblIconButton>
            </span>
          </BootstrapTooltip>
        )}
      </Box>
      <WithFullScreen open={open} onClose={onClose}>
        <TblGoogleView url={url} sourceId={sourceId} mineType={mineType} />
      </WithFullScreen>
    </Box>
  );
}

TblGoogleFileUIImprove.propTypes = {
  disableUseTemplate: PropTypes.bool,
  hasPermission: PropTypes.bool,
  icon: PropTypes.string,
  id: PropTypes.any,
  iframeSrc: PropTypes.string,
  isTemplate: PropTypes.bool,
  mineType: PropTypes.string,
  name: PropTypes.string,
  onChangeChooseTemplate: PropTypes.func,
  onClose: PropTypes.func,
  onRemove: PropTypes.func,
  onUseFileAsTemplate: PropTypes.func,
  onUseTemplate: PropTypes.func,
  open: PropTypes.bool,
  openFile: PropTypes.func,
  sourceId: PropTypes.string,
  url: PropTypes.string,
  useTemplateLoading: PropTypes.bool,
  disabled: PropTypes.bool,
};

TblGoogleFileUIImprove.defaultProps = {
  disabled: false,
};

export default TblGoogleFileUIImprove;
