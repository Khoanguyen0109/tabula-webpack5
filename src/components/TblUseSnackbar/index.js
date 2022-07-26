import React, {useEffect} from 'react';
import { useTranslation } from 'react-i18next';

import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';

function TblUseSnackbar(props) {
  const { t } = useTranslation(['common']);
  const { enqueueSnackbar } = useSnackbar();

  const message = props?.message ?? t('common:change_saved');
  const options = props?.options ?? { variant: 'success', };
  
  useEffect(() => {
    enqueueSnackbar(message, options);
  }, [enqueueSnackbar, message, options]);

  return <></>;
}

TblUseSnackbar.propTypes = {
  message: PropTypes.any,
  options: PropTypes.any
};

export default TblUseSnackbar;
