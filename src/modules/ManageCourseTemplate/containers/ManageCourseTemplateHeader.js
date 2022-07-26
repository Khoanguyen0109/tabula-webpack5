import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import uniqBy from 'lodash/uniqBy';

import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import makeStyles from '@mui/styles/makeStyles';

import TblInputs from 'components/TblInputs';
import TblSelect from 'components/TblSelect';

import { PropTypes } from 'prop-types';

const useStyles = makeStyles((theme) => ({
  filter: {
    marginRight: theme.spacing(2),
  },
}));

function ManageCourseTemplateHeader(props) {
  const { t, onSearch, onFilter } = props;
  const classes = useStyles();
  const [search, setSearch] = useState('');
  const [listSubject, setListSubject] = useState([]);
  const [listSelectedSubject, setListSelectedSubject] = useState('all');
  const schoolGradeLevel = useSelector(
    (state) => state.ManageCourseTemplate?.schoolGradeLevel || []
  );
  useEffect(() => {
    let listSubject = [];
    if (schoolGradeLevel.length) {
      schoolGradeLevel.forEach((item) => {
        listSubject = listSubject.concat(item.subjects);
      });
      listSubject = listSubject.concat(listSubject);
      listSubject = uniqBy(listSubject, 'id');
      if (listSubject.length) {
        listSubject.unshift({ id: 'all', subjectName: 'All Subjects' });
      }
      setListSubject(listSubject);
    }
  }, [schoolGradeLevel]);

  const handleChangeMulti = (event) => {
    setListSelectedSubject(event.target.value);
    if (event.target.value === 'all') {
      return onFilter({ subjectIds: '' });
    }
    return onFilter({ subjectIds: [event.target.value] });
  };
  return (
    <Box style={{ display: 'flex' }}>
      <Box width={'240px'} className={classes.filter}>
        <TblInputs
          value={search}
          inputSize='medium'
          placeholder={t('common:enter_template_name')}
          hasSearchIcon={true}
          hasClearIcon={true}
          onChange={(e) => {
            e.persist();
            setSearch(e.target.value);
            onSearch(e);
          }}
        />
      </Box>
      <Box width={'180px'} className={classes.filter}>
        <TblSelect value={listSelectedSubject} onChange={handleChangeMulti}>
          {listSubject.map((subject) => (
            <MenuItem key={subject.id} value={subject.id}>
              {subject.subjectName}
            </MenuItem>
          ))}
        </TblSelect>
      </Box>
    </Box>
  );
}

ManageCourseTemplateHeader.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object,
  authContext: PropTypes.object,
  onSearch: PropTypes.func,
  t: PropTypes.func,
  onFilter: PropTypes.func,
};

export default ManageCourseTemplateHeader;
