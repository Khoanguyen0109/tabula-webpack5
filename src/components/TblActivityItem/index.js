import React from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import withStyles from '@mui/styles/withStyles';

import TblIcon from 'components/TblActivityIcon/icon';

import clsx from 'clsx';
import PropTypes from 'prop-types';

const styles = (theme) => ({
  root: {
    padding: theme.spacing(1),
    borderRadius: theme.spacing(1),
    marginBottom: theme.spacing(1),
    backgroundColor: 'white',
    cursor: 'pointer',
    '&:hover': {
      background: theme.newColors.primary[50],
    },
    '& .active': {
      color: theme.newColors.primary[500],
      background: theme.newColors.primary[50],
    },
  },
  active: {
    color: theme.newColors.primary[500],
    background: theme.newColors.primary[50],
  },
  activityName: {
    color: theme.newColors.gray[800],
  },
  defaultIcon: {
    color: theme.newColors.gray[800],
    fontSize: theme.fontSizeIcon.medium,
    cursor: 'pointer',
  },
});

class TblActivityItem extends React.PureComponent {
  onClickItem = () => {
    const { activity } = this.props;
    this.props.handleClickItem(activity);
  };

  render() {
    const { classes, activity, isActiveItem } = this.props;
    const type = activity.itemType;

    const className = `${clsx(classes.defaultIcon, { active: isActiveItem })}`;
    return (
      <Box
        className={clsx(classes.root, { [classes.active]: isActiveItem })}
        key={`activity-${type}-${activity?.id}`}
        onClick={this.onClickItem}
      >
        <Box display='flex'>
          <Box
            className='text'
            display='flex'
            alignSelf='center'
            sx={{ lineHeight: 'normal' }}
            mr={1.5}
          >
            {/* {this.renderActivityIcon(type, isActiveItem)} */}
            <TblIcon type={type} className={className} />
          </Box>
          <Box display='flex' alignSelf='center' width={170}>
            <Typography
              component='span'
              variant='bodyLarge'
              className={`${clsx(classes.activityName, {
                active: isActiveItem,
              })} text-ellipsis`}
            >
              {activity.name}
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }
}

TblActivityItem.propTypes = {
  activeId: PropTypes.string,
  activity: PropTypes.object,
  classes: PropTypes.object,
  handleClickItem: PropTypes.func,
  isActiveItem: PropTypes.bool,
  onClickMoreIcon: PropTypes.func,
  type: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

TblActivityItem.defaultProps = {
  activity: {},
  classes: {},
};

export default withStyles(styles)(TblActivityItem);
