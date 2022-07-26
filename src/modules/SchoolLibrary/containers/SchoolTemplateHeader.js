import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import makeStyles from '@mui/styles/makeStyles';

import TblInputs from 'components/TblInputs';
import TblSelect from 'components/TblSelect';

import { debounce, trim, uniqBy } from 'lodash';
import { PropTypes } from 'prop-types';

const useStyles = makeStyles((theme) => ({
  filter: {
    marginRight: theme.spacing(2),
  },
}));

function SchoolTemplateHeader(props) {
  const { onFilter, t } = props;
  const classes = useStyles();
  const schoolGradeLevel = useSelector((state) => state?.Auth?.schoolGradeLevel ?? []);

  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [initialSearch, setInitialSearch] = useState();

  const subjectsByGrade = useMemo(() => {
    if (selectedGrade === 'all') return uniqBy(schoolGradeLevel.reduce((total, { subjects }) => [...total, ...subjects], []), 'id');
    return schoolGradeLevel.find(({ id }) => selectedGrade === id)?.subjects ?? [];
  }, [schoolGradeLevel, selectedGrade]);

  const onSearch = debounce((value) => {
    onFilter({ search: trim(value) });
  }, 500);

  return (
    <Box style={{ display: 'flex' }}>
      <Box width={'240px'} className={classes.filter}>
        <TblInputs
          value={initialSearch}
          inputSize='medium'
          placeholder={t('common:enter_template_name')}
          hasSearchIcon={true}
          hasClearIcon={true}
          onChange={(e) => {
            e.persist();
            setInitialSearch(e.target.value);
            onSearch(e.target.value);
          }}
        />
      </Box>
      <Box width={'180px'} className={classes.filter}>
        <TblSelect
          placeholder={t('common:select_grade')}
          value={selectedGrade}
          onChange={({ target }) => {
            const { value } = target;
            setSelectedGrade(value);
            setSelectedSubject('all');
            onFilter({
              page: 1,
              limit: 10,
              gradeLevelIds: value !== 'all' ? [value] : [],
              subjectIds: []
            });
          }}
        >
          <MenuItem value={'all'} key={'all'}>All Grades</MenuItem>
          {schoolGradeLevel.map(({ id, name }) => (
              <MenuItem value={id} key={id}>{name}</MenuItem>
            ))}
        </TblSelect>
      </Box>
      <Box width={'180px'} >
        <TblSelect
          placeholder={t('common:select_subject')}
          value={selectedSubject}
          onChange={({ target }) => {
            const { value } = target;
            setSelectedSubject(value);
            onFilter({
              page: 1,
              limit: 10,
              subjectIds: value !== 'all' ? [value] : []
            });
          }}
        >
          <MenuItem value={'all'} key={'all'}>All Subjects</MenuItem>
          {subjectsByGrade.map(({ _id, id, subjectName }) => (
              <MenuItem value={id} key={_id}>{subjectName}</MenuItem>
            ))}
        </TblSelect>
      </Box>
    </Box>
  );
}

SchoolTemplateHeader.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object,
  authContext: PropTypes.object,
  onFilter: PropTypes.func,
  t: PropTypes.func,
};

export default SchoolTemplateHeader;
