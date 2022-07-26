import React, { Suspense, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { Book, LocalLibrary } from '@mui/icons-material';
import ImageIcon from '@mui/icons-material/Image';
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

import clsx from 'clsx';
import { differenceInDays, format, isValid, startOfDay } from 'date-fns';
import { uniqBy } from 'lodash';
import { PropTypes } from 'prop-types';

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
    height: '100%',
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
  },
  rootChip: {
    position: 'absolute',
    top: theme.spacing(1),
    left: theme.spacing(1),
    fontSize: theme.fontSize.medium,
    fontWeight: theme.fontWeight.semi,
    textTransform: 'capitalize',
    opacity: 0.8,
    borderRadius: 8,
    background: '#1F2937',
    color: '#FFFFFF',
  },
  moreIcon: {
    position: 'absolute',
    top: theme.spacing(0.5),
    right: theme.spacing(0.5),
    color: theme.newColors.gray[50],
  },
  rootContent: {
    '&:last-child': {
      paddingBottom: theme.spacing(2),
    },
  },
  cardFooter: {
    fontSize: theme.fontSize.xSmall,
    color: '#6B7280',
  },
  iconContent: {
    display: 'flex',
  },
}));

export default function TemplateCard(props) {
  const classes = useStyles(props);
  const { item } = props;
  const [anchorEl, setAnchorEl] = useState({});
  const [cardRef, setCardRef] = useState(null);
  const { t } = useTranslation([
    'myCourses',
    'schoolLibrary',
    'common',
    'error',
  ]);
  const allSubjects = useSelector((state) =>
    uniqBy(
      (state?.Auth?.schoolGradeLevel ?? []).reduce(
        (total, { subjects }) => [...total, ...subjects],
        []
      ),
      'id'
    )
  );

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

  const renderPublishDay = () => {
    const publishDay = item?.publishedSchoolLibrary?.publishedAt;
    const newDate = new Date(publishDay);
    if (!isValid(newDate)) return null;
    const days = differenceInDays(startOfDay(new Date()), startOfDay(newDate));
    if (!days) return t('common:published_today');
    if (days <= 30)
      return t('common:publish_days_ago', {
        days: `${days} day${days > 1 ? 's' : ''}`,
      });
    return t('common:published_on', {
      fullDate: format(newDate, 'MMM-dd-yyyy'),
    });
  };

  return (
    <Card classes={{ root: classes.rootCard }} ref={(ref) => setCardRef(ref)}>
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
              {!item?.image ? (
                <ImageIcon classes={{ root: classes.rootMedia }} />
              ) : (
                <Image
                  className={classes.image}
                  images={[
                    `${process.env.REACT_APP_API_MEDIA}/thumbnail/${item?.image?.filename}`,
                    `${process.env.REACT_APP_API_MEDIA}/images/${item?.image?.filename}`,
                  ]}
                />
              )}
            </Suspense>
          </IgnoreError>
        </Box>
      </Box>
      <TblIconButton
        onClick={(event) => handleClickMore(item?.id, event)}
        className={classes.moreIcon}
      >
        <span className='icon-icn_more' />
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
      {item?.status && (
        <Chip
          label={
            allSubjects.find(({ _id }) => _id === item?.subject?._id)
              ?.subjectName
          }
          classes={{ root: classes.rootChip }}
        />
      )}
      <CardContent
        classes={{ root: classes.rootContent }}
        onClick={props?.viewDetails}
      >
        <Typography noWrap variant='labelLarge'>
          {item?.templateName}
        </Typography>
        <Box mt={0.5} className={clsx(classes.iconContent)}>
          <Box>
            <LocalLibrary fontSize='small' />
          </Box>
          <Box ml={1}>
            <Typography variant='bodyMedium'>
              {`${item?.author?.firstName} ${item?.author?.lastName}`}
            </Typography>
          </Box>
        </Box>
        <Box mt={0.5} className={clsx(classes.iconContent)}>
          <Box>
            <Book fontSize='small' />
          </Box>
          <Box ml={1}>
            <Typography variant='bodyMedium'>
              {item?.gradeLevel?.name}
            </Typography>
          </Box>
        </Box>
        <Box mt={0.5} classes={{ root: classes.iconContent }}>
          <Typography classes={{ root: classes.cardFooter }} noWrap>
            {renderPublishDay()}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

TemplateCard.propTypes = {
  item: PropTypes.object,
  showStatus: PropTypes.object,
  viewDetails: PropTypes.func,
};

TemplateCard.defaultProps = {
  showStatus: {},
};
