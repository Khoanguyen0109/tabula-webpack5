import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import Box from '@mui/material/Box';

import TblButton from 'components/TblButton';
import TblTooltip from 'components/TblTooltip';

import PropTypes from 'prop-types';

import { COURSE_STATUS, TYPE_OF_CREATE } from '../constants';

const FormActions = React.memo((props) => {
  const { t } = useTranslation(['myCourses', 'common']);
  const {
    disabled,
    isCreate,
    onCloseDrawer,
    createAsDraft,
    createAndPublish,
    typeOfCreate,
    havePermissionPublish,
    isViewOnly,
  } = props;
  const showCreateAmdPublish = isCreate && havePermissionPublish;
  const basicInfo = useSelector((state) => state.MyCourses?.basicInfo);
  const isCourseDraft = basicInfo?.status === COURSE_STATUS.DRAFT;
  return (
    <>
      <TblButton variant='outlined' color='primary' onClick={onCloseDrawer}>
        {t('common:cancel')}
      </TblButton>
      {!!!isViewOnly && (
        <Box display='flex' flexDirection='row'>
          <TblButton
            variant={!showCreateAmdPublish ? 'contained' : 'outlined'}
            color='primary'
            type='submit'
            onClick={createAsDraft}
            disabled={disabled}
            isShowCircularProgress={
              disabled && typeOfCreate === TYPE_OF_CREATE.CREATE_AS_DRAFT
            }
          >
            {!isCreate ? t('common:save') : t('myCourses:create_as_draft')}
          </TblButton>

          {showCreateAmdPublish && (
            <Box ml={2}>
              <TblTooltip
                disableHoverListener={!isCourseDraft}
                title={t('require_publish_course')}
                placement='top'
                arrow
              >
                <span>
                  <TblButton
                    variant='contained'
                    color='primary'
                    onClick={createAndPublish}
                    disabled={disabled || isCourseDraft}
                    isShowCircularProgress={
                      disabled &&
                      typeOfCreate === TYPE_OF_CREATE.CREATE_AND_PUBLISH
                    }
                  >
                    {t('create_and_publish')}
                  </TblButton>
                </span>
              </TblTooltip>
            </Box>
          )}
        </Box>
      )}
    </>
  );
});

FormActions.propTypes = {
  createAndPublish: PropTypes.func,
  createAsDraft: PropTypes.func,
  disabled: PropTypes.bool,
  havePermissionPublish: PropTypes.bool,
  isCreate: PropTypes.bool,
  isDisabled: PropTypes.bool,
  onCloseDrawer: PropTypes.func,
  typeOfCreate: PropTypes.string,
  isViewOnly: PropTypes.bool,
};
FormActions.defaultProps = {
  isViewOnly: false,
};
export default FormActions;
