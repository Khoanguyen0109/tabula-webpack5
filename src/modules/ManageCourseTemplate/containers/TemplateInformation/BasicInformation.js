/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import trim from 'lodash/trim';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import Box from '@mui/material/Box';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Skeleton from '@mui/material/Skeleton';
import makeStyles from '@mui/styles/makeStyles';

import TblIconButton from 'components/TblIconButton';
import TblInputLabel from 'components/TblInputLabel';
import TblInputs from 'components/TblInputs';
import TblSelect from 'components/TblSelect';

import MediaWithReducer from 'shared/Media/containers';

import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import * as Yup from 'yup';

const useStyles = makeStyles((theme) => ({
  root: {},
  cardMedia: {
    width: theme.spacing(30),
    height: theme.spacing(20),
    borderRadius: theme.spacing(1),
    border: `1px solid ${theme.mainColors.gray[4]}`,
  },
  mediaBox: {
    width: theme.spacing(30),
    height: theme.spacing(20),
    position: 'relative',
    '& .MuiIconButton-root': {
      position: 'absolute',
      top: 0,
      right: 0,
      margin: theme.spacing(0.5,0.5),
    },
  },
}));
function BasicInformation(props) {
  const { t } = useTranslation(['allCourses', 'common', 'error']);

  // NOTE: connect redux
  const {
    isBusy,
    templateDetail,
    updateBasicInfo,
    availableGradeLevel,
    isDisable,
  } = props;
  const { templateName, subject, gradeLevel, author } = templateDetail;
  // NOTE: styles
  const classes = useStyles();

  const [courseImage, setCourseImage] = useState('');
  const [openMedia, setOpenMedia] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const onMediaClose = () => {
    setOpenMedia(false);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClickMore = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMediaSelect = (m) => {
    if (m) {
      updateBasicInfo({
        courseImageId: m.id,
      });
      setCourseImage(m.filename);
      handleClose();
    }
  };
  useEffect(() => {
    if (!!templateDetail) {
      setCourseImage(
        templateDetail?.image?.url ||
          templateDetail?.subject?.images?.url
      );
    }
  }, [templateDetail]);
  const validationSchema = Yup.object()
    .nullable()
    .shape({
      name: Yup.string().trim().required(t('common:required_message')),
    });
  const formik = useFormik(
    {
      initialValues: {
        name: templateDetail.templateName || '',
        gradeLevel: gradeLevel?.id,
      },
      validationSchema: validationSchema,
      enableReinitialize: true,
      validateOnChange: true,
      validateOnBlur: false,
      keepDirtyOnReinitialize: false,
    },
    [templateDetail]
  );
  const {
    values: { name },
    errors,
    setFieldValue,
    setFieldTouched,
  } = formik;
  return (
    <div className={classes.root}>
      {/* {showGeneralError && <Grid xs={12} sm={8}>
        <Alert severity='error'>
          {t('error:general_error')}
        </Alert>
      </Grid>} */}
      {/* fix bug show something when wrong when publish failed in basic information tab */}
      {isBusy && (
        <Grid item xs={12}>
          <Grid item xs={8}>
            <Skeleton variant='text' height='50px' animation='wave' />
          </Grid>
          <Grid item xs={8}>
            <Skeleton variant='text' height='50px' animation='wave' />
          </Grid>
          <Grid item xs={4}>
            <Skeleton
              variant='rectangular'
              height='160px'
              width='240px'
              animation='wave'
            />
          </Grid>
        </Grid>
      )}

      {!isBusy && (
        <form onSubmit={(e) => e.preventDefault()}>
          <Grid container spacing={0}>
            <Grid item xs={12} sm={8}>
              <TblInputs
                name='name'
                disabled={isDisable}
                singleSave
                required
                label={t('Course Template Name')}
                type='text'
                error={!!errors.name}
                errorMessage={errors.name ? <div>{errors.name}</div> : false}
                inputProps={{ maxLength: 255 }}
                value={name}
                onChange={(e) => {
                  setFieldValue('name', e.target.value);
                  setFieldTouched('name', true);
                }}
                onAbort={() => {
                  setFieldValue('name', templateName);
                }}
                onSave={() => {
                  if (!!!errors.name && trim(name) !== templateName) {
                    updateBasicInfo({
                      templateName: trim(name),
                    });
                  }
                }}
              />
            </Grid>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Box mb={1}>
              <TblSelect
                disabled={isDisable}
                label={t('Grade Level')}
                required
                value={Number(gradeLevel?.id)}
                onChange={(e) => {
                  const gradeLevel = availableGradeLevel?.filter(
                    (i) => i.id === e.target.value
                  );
                  const { id } = gradeLevel[0];
                  updateBasicInfo({
                    gradeLevelId: id,
                  });
                }}
              >
                {availableGradeLevel?.map((item, index) => (
                    <MenuItem value={item.id} key={index}>
                      {item.name}
                    </MenuItem>
                  ))}
              </TblSelect>
            </Box>
          </Grid>
          <MediaWithReducer
            visible={openMedia}
            onClose={onMediaClose}
            onSelect={handleMediaSelect}
            accept='image/*'
            mediaType='image'
          />
          <Grid item xs={12} sm={8}>
            <Box mb={1}>
              <TblInputs
              name='subject'
                label={t('subject')}
                required
                disabled={true}
                value={subject?.subjectName}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Box mb={1}>
              <TblInputs
                name='author'
                singleSave
                required
                label={t('Author')}
                type='text'
                disabled={true}
                value={`${author.firstName} ${author.lastName}`}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Box>
              <TblInputLabel disabled={isDisable}>
                {t('course_image')}
              </TblInputLabel>
              <Box className={classes.mediaBox}>
                <CardMedia
                  disabled={isDisable}
                  component='div'
                  onClick={() => !isDisable && setOpenMedia(true)}
                  className={classes.cardMedia}
                  image={courseImage}
                />

                {!isDisable && (
                  <Box>
                    <TblIconButton onClick={handleClickMore}>
                      <MoreVertIcon />
                    </TblIconButton>
                    <Menu
                      id='simple-menu'
                      anchorEl={anchorEl}
                      keepMounted
                      open={Boolean(anchorEl)}
                      onClose={handleClose}
                    >
                      <MenuItem onClick={() => setOpenMedia(true)}>
                        {t('change_image')}
                      </MenuItem>
                    </Menu>
                  </Box>
                )}
              </Box>
            </Box>
          </Grid>
        </form>
      )}
    </div>
  );
}

export default BasicInformation;

BasicInformation.propTypes = {
  templateDetail: PropTypes.object,
  isBusy: PropTypes.bool,
  updateBasicInfo: PropTypes.func,
  availableGradeLevel: PropTypes.array,
  isDisable: PropTypes.bool,
};
