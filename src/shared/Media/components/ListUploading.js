import React from 'react';

import CloseIcon from '@mui/icons-material/Close';
import Icon from '@mui/material/Icon';
import LinearProgress from '@mui/material/LinearProgress';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Tooltip from '@mui/material/Tooltip';
import makeStyles from '@mui/styles/makeStyles';

import TblIconButton from 'components/TblIconButton';

import cutOffFileName from 'utils/cutOffFileName';

import PropTypes from 'prop-types';
import { getIconByExt, humanFileSize } from 'utils';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  item: {
    display: 'block',
    fontSize: theme.fontSize.small,
    '& > div.bottom > span': {
      marginLeft: theme.spacing(5),
      marginTop: theme.spacing(1),
    },
    '& > div.top, & > div.bottom': {
      display: 'flex',
      justifyContent: 'space-between',
      alignContent: 'center',
      '& > span': {
        display: 'flex',
        justifyContent: 'space-between',
        alignContent: 'center',
        alignItems: 'center',
        '& .MuiIcon-root': {
          marginRight: theme.spacing(1.5),
        },
      },
    },
    '& .MuiButtonBase-root': {
      height: theme.spacing(3),
    },
  },
  progress: {
    borderRadius: theme.spacing(0.25),
    width: `calc(100% - ${theme.spacing(5)})`,
    marginTop: theme.spacing(1),
    marginLeft: theme.spacing(5),
  },
}));
function ListUploading({ list, onRemove }) {
  const classes = useStyles();
  return (
    <List className={classes.root}>
      {Object.keys(list).map((key, index) => {
        const item = list[key];
        return (
          <ListItem className={classes.item} key={index}>
            <div className='top'>
              <span>
                <Icon className={getIconByExt(item.name)} />
                <Tooltip placement='top-start' title={item.name}>
                  <span>{cutOffFileName(item.name, 20)}</span>
                </Tooltip>
              </span>{' '}
              <TblIconButton onClick={onRemove(key)} size='small'>
                <CloseIcon size='inherit' />
              </TblIconButton>
            </div>
            <LinearProgress
              className={classes.progress}
              variant='determinate'
              color='secondary'
              value={item.percent}
            />
            <div className='bottom'>
              <span>
                {item.percent < 100 ? `${item.percent}%` : 'Completed'}
              </span>
              <span>{humanFileSize(item.size)}</span>
            </div>
          </ListItem>
        );
      })}
    </List>
  );
}
ListUploading.propTypes = {
  list: PropTypes.array,
  onRemove: PropTypes.array,
  classes: PropTypes.object,
};
export default React.memo(ListUploading);
