import React from 'react';
import { useTranslation } from 'react-i18next';
import PerfectScrollbar from 'react-perfect-scrollbar';

import isEmpty from 'lodash/isEmpty';
import trim from 'lodash/trim';

import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import makeStyles from '@mui/styles/makeStyles';

import EmptyContent from 'components/EmptyContent';
import TblCheckBox from 'components/TblCheckBox';
import TblInputLabel from 'components/TblInputLabel';

import PropTypes from 'prop-types';

import UserInfoCard from '../../../components/TblSidebar/UserInfoCard';
// import { camelCase } from 'lodash';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: 598,
    maxHeight: 'calc(100vh - 435px)',
    '& .MuiListItem-button:hover': {
      background: theme.newColors.gray[300],
    },
  },
  inputRoot: {
    borderBottom: `1px solid ${theme.newColors.gray[300]}`,
  },
  positionStart: {
    padding: theme.spacing(1, 0.5, 1, 1),
    fontSize: theme.fontSizeIcon.medium,
    color: theme.mainColors.primary1[0],
    marginRight: 0,
  },
  inputSearch: {
    fontSize: theme.fontSize.normal,
    color: theme.newColors.gray[700],
    padding: '11px 0 11px 0',
  },
  listTitle: {
    display: 'flex',
    marginTop: theme.spacing(1),
  },
  title: {
    padding: 0,
  },
  selectedNumber: {
    padding: 0,
    marginLeft: 'auto',
  },
  checkBoxList: {
    border: `1px solid ${theme.newColors.gray[300]}`,
    borderRadius: 8,
    maxHeight: 'calc(100vh - 395px)',
    overflow: 'hidden'
  },
}));

function CheckBoxList(props) {
  const classes = useStyles();
  const [checked, setChecked] = React.useState([]);
  const { t } = useTranslation(['allCourses', 'common', 'error']);
  const [itemsList, setItemsList] = React.useState(props.itemsList);
  const { checkBoxListTitle } = props;
  // console.log(findIndex(props.itemsList, item => {return item}));

  // React.useEffect(() => { //fix search => check => reset list
  //   setItemsList(props.itemsList);
  // }, [props.itemsList]);

  const handleToggle = (item, e) => {
    const currentIndex = checked.findIndex((t) => t.id === item.id);
    const newChecked = [...checked];
    const isChecked = e?.target?.checked ?? e;
    if (isChecked && currentIndex === -1) {
      newChecked.push(item);
    } else if (!isChecked && currentIndex !== -1) {
      newChecked.splice(currentIndex, 1);
    } else {
      return;
    }
    setChecked(newChecked);
    props.updateData(newChecked);
  };

  const onSearch = (e) => {
    const value = trim(e.target.value.toLowerCase());
    if (isEmpty(value)) {
      setItemsList(props.itemsList);
    } else {
      const filteredTeacher = props.itemsList.filter(
        (item) => item.name.toLowerCase().indexOf(value) !== -1
      );
      setItemsList(filteredTeacher);
    }
  };

  return (
    <>
      <div className={classes.listTitle}>
        <TblInputLabel className={classes.title}>
          {checkBoxListTitle}
        </TblInputLabel>
        <TblInputLabel className={classes.selectedNumber}>
          {checked?.length} {t('selected')}
        </TblInputLabel>
      </div>
      <Box className={classes.checkBoxList}>
        <Input
          fullWidth
          classes={{ input: classes.inputSearch, root: classes.inputRoot }}
          startAdornment={
            <InputAdornment
              position='start'
              classes={{ positionStart: classes.positionStart }}
            >
              <span className={'icon-icn_search'} />
            </InputAdornment>
          }
          disableUnderline
          placeholder={t('common:search')}
          onChange={onSearch}
        />
        {itemsList?.length ? (
          <PerfectScrollbar>
            <List dense className={classes.root}>
              {itemsList?.map((item) => {
                // const labelId = `TblCheckBox-list-secondary-label-${value}`;
                const isChecked = !!checked.find((checkedItem) => checkedItem.id === item.id);
                return (
                  <ListItem key={item.id} button for={item.id} onClick={() => handleToggle(item, !isChecked)}>
                    <UserInfoCard itemInfo={item} />
                    <ListItemSecondaryAction>
                      <TblCheckBox
                        edge='end'
id={item.id}
                        onChange={(e) => handleToggle(item, e)}
                        // checked={checked.includes(item.id)}
                        checked={isChecked}
                      // inputProps={{ 'aria-labelledby': labelId }}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                );
              })}
            </List>
          </PerfectScrollbar>
        ) : (
          <EmptyContent subTitle={t('common:no_data')} />
        )}
      </Box>
    </>
  );
}

export default React.memo(CheckBoxList);

CheckBoxList.propTypes = {
  selectedItems: PropTypes.array,
  itemsList: PropTypes.array,
  updateData: PropTypes.func,
  checkBoxListTitle: PropTypes.string,
};
CheckBoxList.defaultProps = {
  checkBoxListTitle: 'Available Items',
};
