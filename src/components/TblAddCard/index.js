import React from 'react';

import Add from '@mui/icons-material/Add';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import makeStyles from '@mui/styles/makeStyles';

import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  rootAddCard: {
    display: 'flex',
    height: 80,
    borderColor: theme.newColors.gray[300],
    borderRadius: 8,
    cursor: 'pointer',
    width: 288,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    // padding: '19px 16px',
    paddingBottom: `${theme.spacing(2)} !important`,
    color: theme.mainColors.primary1[0],
    justifyContent: 'center',
    fontSize: theme.fontSize.normal,
  },
  action: {
    minWidth: 80,
    background: theme.newColors.gray[100],
    color: theme.newColors.gray[600],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addIconOutline: {
    height: theme.spacing(6),
    width: theme.spacing(6),
    border: '2px dashed',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
  },
  addIcon: {
    fontSize: theme.fontSizeIcon.normal,
  },
}));

export default function AddCard(props) {
  // NOTE: get contexts
  const classes = useStyles();
  // const { t } = useTranslation(['allCourses', 'common', 'error']);
  return (
    <Card
      className={`${classes.rootAddCard} ${props.className}`}
      variant='outlined'
      onClick={props.onClick}
    >
      <div className={classes.action}>
        <div className={classes.addIconOutline}>
          <Add className={classes.addIcon} />
        </div>
      </div>
      <CardContent className={classes.content}>
        {props.addCardTitle}
      </CardContent>
    </Card>
  );
}

AddCard.propTypes = {
  onClick: PropTypes.func.isRequired,
  addCardTitle: PropTypes.string,
  className: PropTypes.string
};