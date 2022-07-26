import React from 'react';
import { useTranslation } from 'react-i18next';

import { Box, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';

// import PerfectScrollbar from 'react-perfect-scrollbar';
import TblGoogleFile from 'components/TblGoogleFile';

import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  root: {},
  scrollBar: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    marginBottom: theme.spacing(2),
    // maxheight: 4 google file
    maxHeight: (props) =>
      props.itemOnView ? theme.spacing(6 * props.itemOnView) : null,
  },
  emptyContent: {
    color: theme.newColors.gray[700],
    marginLeft: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
}));
function TblGoogleFileList(props) {
  const classes = useStyles(props);
  const { t } = useTranslation('google');
  const {
    list,
    hasPermission,
    onRemove,
    onChangeChooseTemplate,
    onUseTemplate,
    useTemplateLoading,
    disableUseTemplate,
    disabled,
  } = props;
  return (
    // <PerfectScrollbar className={classes.scrollBar}>
    <Box>
      {list.length <= 0 ? (
        <Typography className={classes.emptyContent} variant='bodyMedium'>
          {t('no_google_document')}
        </Typography>
      ) : (
        list.map((item) => (
            <TblGoogleFile
              hasPermission={hasPermission}
              onRemove={onRemove}
              key={item.sourceId}
              file={{
                ...item,
                name: item.originalName,
                icon: item?.iconLink,
                mineType: item.mimetype,
              }}
              onChangeChooseTemplate={onChangeChooseTemplate}
              onUseTemplate={onUseTemplate}
              useTemplateLoading={useTemplateLoading}
              disableUseTemplate={disableUseTemplate}
              disabled={disabled}
            />
          ))
      )}
    </Box>
    // </PerfectScrollbar>
  );
}

TblGoogleFileList.propTypes = {
  disableUseTemplate: PropTypes.func,
  hasPermission: PropTypes.bool,
  itemOnView: PropTypes.number,
  list: PropTypes.array,
  onChangeChooseTemplate: PropTypes.func,
  onRemove: PropTypes.func,
  onUseTemplate: PropTypes.func,
  useTemplateLoading: PropTypes.bool,
  disabled: PropTypes.bool
};

TblGoogleFileList.defaultProps = {
  list: [],
  itemOnView: 4,
};

export default TblGoogleFileList;
