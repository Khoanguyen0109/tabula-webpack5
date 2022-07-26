import React from 'react';

import Box from '@mui/material/Box';

import PropTypes from 'prop-types';

import MeetingTimeTable from './MeetingTimeTable';
import SectionInfo from './SectionInfo';
function Section(props) {
  const {
    t,
    data,
    dailyTemplates,
    deleteSection,
    saveData,
    saveDataFailed,
    hasPermission,
    isUpdatingSectionsAndMeetingTimes,
    disabled,
  } = props;

  return (
    <Box mb={6}>
      <SectionInfo
        t={t}
        data={{
          name: data?.sectionName,
          id: data?.id,
          physicalLocation: data?.physicalLocation,
          url: data?.url,
        }}
        saveData={saveData}
        hasPermission={hasPermission}
        disabled={disabled}
        deleteSection={(sectionId) => deleteSection(sectionId)}
        saveDataFailed={saveDataFailed}
      />
      {data?.meetingTimes?.map((item) => (
        <MeetingTimeTable
          hasPermission={hasPermission}
          t={t}
          data={item}
          dailyTemplates={dailyTemplates}
          saveData={saveData}
          sectionId={data.id}
          saveDataFailed={saveDataFailed}
          setUpdatedData={props.setUpdatedData}
          setCreatedData={props.setCreatedData}
          isUpdatingSectionsAndMeetingTimes={isUpdatingSectionsAndMeetingTimes}
          key={data.id}
          disabled={disabled}
        />
      ))}
    </Box>
  );
}

Section.propTypes = {
  t: PropTypes.func,
  data: PropTypes.object,
  dailyTemplates: PropTypes.array,
  saveData: PropTypes.func,
  hasPermission: PropTypes.bool,
  isUpdatingSectionsAndMeetingTimes: PropTypes.bool,
  deleteSection: PropTypes.func,
  saveDataFailed: PropTypes.shape({
    subcode: PropTypes.number,
    sectionId: PropTypes.number,
  }),
  setUpdatedData: PropTypes.func,
  setCreatedData: PropTypes.func,
  disabled: PropTypes.bool,
};

Section.defaultProps = {
  disabled: false,
};

export default Section;
