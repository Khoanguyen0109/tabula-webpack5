import React, { Suspense, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import ImageIcon from '@mui/icons-material/Image';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';

import IgnoreError from 'components/TblErrorPage/IgnoreError';
import TblIconButton from 'components/TblIconButton';
import Image from 'shared/Media/components/Image';

import { isTeacher } from 'utils/roles';

import clsx from 'clsx';
import { PropTypes } from 'prop-types';

import { COURSE_STATUS } from '../constants';

const useStyles = makeStyles((theme) => ({
  rootCard: {
    boxShadow: '0 0 4px 0 rgba(47, 47, 47, 0.16)',
    borderRadius: theme.spacing(1),
    position: 'relative',
    cursor: 'pointer',
    '&:hover': {
      boxShadow: '0 2px 8px 0 rgba(47, 47, 47, 0.16)',
    },
    width: '100%',

    // [theme.breakpoints.down('sm')]: {
    //   width: 220,
    //   // height: 165,
    // },
    // [theme.breakpoints.up('md')]: {
    //   width: 256,
    //   // height: 192,
    // },
    // [theme.breakpoints.up('lg')]: {
    //   width: 260,
    //   // height: 216,
    // },
    // [theme.breakpoints.up('xl')]: {
    //   width: 280,
    //   // height: 210,
    // },
  },
  rootMedia: {
    color: theme.newColors.gray[300],
    borderBottom: `1px solid ${theme.newColors.gray[300]}`,
    background: theme.newColors.gray[100],
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    overflow: 'hidden',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'top center',
    backgroundSize: '100% 100%',
    // [theme.breakpoints.down('sm')]: {
    //   width: 220,
    //   height: 165,
    // },
    // [theme.breakpoints.up('md')]: {
    //   width: 256,
    //   height: 192,
    // },
    // [theme.breakpoints.up('lg')]: {
    //   width: 288,
    //   height: 216,
    // },
    // [theme.breakpoints.up('xl')]: {
    //   width: 280,
    //   height: 210,
    // },
  },
  rootChip: (props) => ({
    position: 'absolute',
    bottom: theme.spacing(9),
    // [theme.breakpoints.down('sm')]: {
    //   top: '125px',
    // },
    // [theme.breakpoints.up('md')]: {
    //   top: '152px',
    // },
    // [theme.breakpoints.up('lg')]: {
    //   top: '176px',
    // },
    // [theme.breakpoints.up('xl')]: {
    //   top: '170px',
    // },
    left: theme.spacing(1),
    textTransform: 'capitalize',
    fontWeight: theme.fontWeight.semi,

    background:
      props?.item?.status === 1
        ? theme.mainColors.primary2[1]
        : theme.newColors.gray[50],
    color:
      props?.item?.status === 1
        ? theme.newColors.gray[50]
        : theme.newColors.gray[800],
  }),
  cardTitle: (props) => ({
    color:
      props?.item?.status === 1
        ? theme.mainColors.primary1[0]
        : theme.newColors.gray[800],
  }),
  moreIcon: {
    position: 'absolute',
    top: 0,
    right: 0,
    margin: theme.spacing(0.5,0.5),
  },
  rootContent: {
    '&:last-child': {
      paddingBottom: theme.spacing(2),
    },
  },
}));

const courseStatus = (status) => {
  switch (status) {
    case -1:
      return 'Draft';
    case 1:
      return 'Published';
    case 2:
      return 'Archived';
    default:
      return 'Draft';
  }
};

export default function CourseItemCard(props) {
  const classes = useStyles(props);
  const { item, showStatus, dataTut } = props;
  const [anchorEl, setAnchorEl] = useState({});
  const [cardRef, setCardRef] = useState(null);
  const { t } = useTranslation(['myCourses', 'common', 'error']);
  const currentUser = useSelector((state) => state.Auth.currentUser);

  const handleClickMore = (id, event) => {
    setAnchorEl({ ...anchorEl, [id]: event.currentTarget });
  };

  const handleCloseMoreMenu = () => {
    setAnchorEl({});
  };
  let height;
  if (cardRef) {
    // The subject image ratio 3/2
    height = cardRef.offsetWidth / 1.5;
  }

  return (
    <Card
      classes={{ root: classes.rootCard }}
      data-tut={dataTut}
      ref={(ref) => setCardRef(ref)}
    >
      {/* {item?.courseImage ? ( */}
      <Box
        onClick={props?.viewDetails}
        display='flex'
        className={clsx(classes.rootMedia, classes.image)}
        justifyContent='center'
        alignItems='center'
      >
        <Box
          height={height}
          display='flex'
          alignContent='center'
          alignItems='center'
          justifyItems='center'
          justifyContent='center'
        >
          <IgnoreError>
            <Suspense fallback={<CircularProgress />}>
              {!item?.courseImage && !item?.subjectImage?.filename ? (
                <ImageIcon classes={{ root: classes.rootMedia }} />
              ) : (
                <Image
                  className={classes.image}
                  images={[
                    `${process.env.REACT_APP_API_MEDIA}/thumbnail/${
                      item?.courseImage || item?.subjectImage?.filename
                    }`,
                    `${process.env.REACT_APP_API_MEDIA}/images/${item.courseImage}`,
                  ]}
                />
              )}
            </Suspense>
          </IgnoreError>
        </Box>
      </Box>
      {/* ) : (
          <ImageIcon classes={{ root: classes.rootMedia }} />
        )} */}
      <TblIconButton
        aria-haspopup='true'
        onClick={(event) => handleClickMore(item?.id, event)}
        className={classes.moreIcon}
      >
        <MoreVertIcon />
      </TblIconButton>
      <Menu
        id='more-menu'
        anchorEl={anchorEl[item?.id]}
        keepMounted
        open={Boolean(anchorEl[item?.id])}
        onClose={handleCloseMoreMenu}
        classes={{ paper: classes.paper }}
      >
        <MenuItem onClick={props?.viewDetails}>
          {t('common:view_details')}
        </MenuItem>
      </Menu>
      {showStatus &&
        item?.status !== COURSE_STATUS.PUBLISHED &&
        isTeacher(currentUser) && (
          <Chip
            label={courseStatus(item?.status)}
            classes={{ root: classes.rootChip }}
          />
        )}
      <CardContent
        classes={{ root: classes.rootContent }}
        onClick={props?.viewDetails}
      >
        <Typography
          component='div'
          variant='labelLarge'
          noWrap
          classes={{ root: classes.cardTitle }}
        >
          {item?.courseName}
        </Typography>
      </CardContent>
    </Card>
  );
}

CourseItemCard.propTypes = {
  dataTut: PropTypes.string,
  item: PropTypes.object,
  showStatus: PropTypes.object,
  viewDetails: PropTypes.func,
};

CourseItemCard.defaultProps = {
  showStatus: {},
};
