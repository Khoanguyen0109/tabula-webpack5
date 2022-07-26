import React from 'react';
import { useTranslation } from 'react-i18next';

import ClickAwayListener from '@mui/material/ClickAwayListener';
import ListSubheader from '@mui/material/ListSubheader';
import MenuItem from '@mui/material/MenuItem';

import TblSelect from 'components/TblSelect';

import useGetCourseDayListBySection from 'modules/MyCourses/utils/useHooks/useGetCourseDayListBySection';

import PropTypes from 'prop-types';
function SelectDateBySection({ sectionId, fieldName, fieldValue, handleChangeDueTimeOfSection, isSubmit, startTime }) {
  const { t } = useTranslation(['myCourses', 'common', 'dialog']);
  const courseDays = useGetCourseDayListBySection({ sectionId, startTime });

  return (
    <>
      <TblSelect
        name={fieldName}
        value={Number(fieldValue)}
        onChange={(e) =>
          handleChangeDueTimeOfSection(e.target.value)
        }
        errorMessage={isSubmit && !!!fieldValue ? t('common:required_message') : ''}
        error={isSubmit && !!!fieldValue}
      >
        {courseDays?.map((semester, semesterIndex) => [
          <>{semester?.dates?.length ? <ClickAwayListener mouseEvent={false}>
            <ListSubheader color='primary' disableSticky>
              {semester?.termName}
            </ListSubheader>
          </ClickAwayListener>: <></>}</>,
          semester?.dates?.map((courseDay, courseDayIndex) => (
            <MenuItem
              value={Number(courseDay?.id)}
              key={[semesterIndex, courseDayIndex]}
            >
              {courseDay?.courseDayName}
            </MenuItem>
          )),
        ])}
      </TblSelect>
    </>
  );
}

SelectDateBySection.propTypes = {
  updateMasterItem: PropTypes.func,
  sectionId: PropTypes.number,
  fieldName: PropTypes.string,
  fieldValue: PropTypes.number,
  isSubmit: PropTypes.bool,
  handleChangeDueTimeOfSection: PropTypes.func, 
  startTime: PropTypes.string
};

SelectDateBySection.defaultProps = {
  updateMasterItem: () => { }
};

export default SelectDateBySection;
