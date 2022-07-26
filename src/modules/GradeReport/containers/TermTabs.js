import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import TabPanelUnstyled from '@mui/base/TabPanelUnstyled';
import TabsListUnstyled from '@mui/base/TabsListUnstyled';
import TabsUnstyled from '@mui/base/TabsUnstyled';
import TabUnstyled from '@mui/base/TabUnstyled';
import { Skeleton, Typography } from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

import useDidMountEffect from 'utils/customHook/useDidMoutEffect';

import clsx from 'clsx';
import { getIndexOfTermAndGradingPeriod } from 'modules/MyCourses/utils';
import PropTypes from 'prop-types';

// material-ui
import TermDetail from './TermDetail';

const useStyles = makeStyles((theme) => ({
  root: {},
  tabList: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'space-between',
    '& .Mui-selected': {
      color: 'white',
      backgroundColor: theme.newColors.primary[500],
    },
  },
  tab: {
    cursor: 'pointer',
    color: theme.newColors.gray[400],
    backgroundColor: 'transparent',
    maxWidth: theme.spacing(20),
    borderRadius: '180px',
    padding: theme.spacing(0.5, 1.5),
    border: 'none',
    '&:hover': {},

    tabUnstyledClasses: {
      color: 'red',
    },
  },
}));

const TermTabs = (props) => {
  const { courseSelected } = props;
  const classes = useStyles();

  const basicInfo = useSelector((state) => state.MyCourses?.basicInfo);
  const [termList, setTermList] = useState([]);
  const [tabSelected, setTabSelected] = useState(0);

  useDidMountEffect(() => {
    setTermList([]);
  }, [courseSelected]);

  useDidMountEffect(() => {
    setTermList(basicInfo.terms);
    const { indexTerm } = getIndexOfTermAndGradingPeriod(basicInfo.terms) || {};
    if (indexTerm !== -1) {
      setTabSelected(indexTerm);
    }
  }, [basicInfo]);
  const onChange = (event, newValue) => {
    setTabSelected(newValue);
  };
  if (termList.length === 0) {
    return <Skeleton height={400} />;
  }
  return (
    <TabsUnstyled
      className={classes.root}
      onChange={onChange}
      value={tabSelected}
    >
      <TabsListUnstyled className={classes.tabList}>
        {termList.map((term, index) => {
          const { termName } = term;
          return (
            <TabUnstyled
              value={index}
              className={clsx(classes.tab, 'text-ellipsis')}
            >
              <Typography sx={{ with: '100%' }} variant='labelLarge'>
                {termName}
              </Typography>
            </TabUnstyled>
          );
        })}
      </TabsListUnstyled>
      {termList.map((term, index) => (
          <TabPanelUnstyled value={index}>
            <TermDetail courseSelected={courseSelected} term={term} />
          </TabPanelUnstyled>
        ))}
    </TabsUnstyled>
  );
};

TermTabs.propTypes = {
  courseSelected: PropTypes.shape({
    id: PropTypes.number
  })
};

export default TermTabs;
