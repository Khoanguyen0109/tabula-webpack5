/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router';

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

import { COURSE_MANAGER, TEACHER } from 'utils/roles';

import MediaWithReducer from 'shared/Media/containers';

import { useFormik } from 'formik';
import subjectActions from 'modules/Subject/actions';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { checkPermission } from 'utils';
import * as Yup from 'yup';

import allCoursesActions from '../actions';

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
const ROLES_UPDATE = [COURSE_MANAGER, TEACHER];
function BasicInformation(props) {
  // NOTE: get contexts
  const { t } = useTranslation(['allCourses', 'common', 'error']);
  const { enqueueSnackbar } = useSnackbar();

  // NOTE: connect redux
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const basicInfo = useSelector((state) => state.AllCourses?.basicInfo);
  const subjectList = useSelector((state) => state.Subject?.subjectList);
  const getBasicInfoSuccess = useSelector(
    (state) => state.AllCourses?.getBasicInfoSuccess
  );
  const updateBasicInfoSuccess = useSelector(
    (state) => state.AllCourses?.updateBasicInfoSuccess
  );
  const updateStatus = useSelector((state) => state.AllCourses?.updateStatus);

  const getBasicInfoFailed = useSelector(
    (state) => state.AllCourses?.getBasicInfoFailed
  );
  const updateBasicInfoFailed = useSelector(
    (state) => state.AllCourses?.updateBasicInfoFailed
  );

  // NOTE: styles
  const classes = useStyles();

  // NOTE: initial states and props
  // const [showGeneralError, setShowGeneralError] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const { authContext } = props;
  const {
    organizationId,
    organization: { timezone },
  } = authContext.currentUser;
  const courseId = match.params.courseId;

  const { courseName, subject } = basicInfo;
  const [courseImage, setCourseImage] = useState('');
  const { permission } = props;
  // NOTE: handle with form formik
  const validationSchema = Yup.object()
    .nullable()
    .shape({
      name: Yup.string().trim().required(t('common:required_message')),
    });

  const formik = useFormik({
    initialValues: {
      name: courseName,
    },
    validationSchema: validationSchema,
    validateOnChange: true,
    validateOnBlur: false,
  });

  const {
    values: { name },
    errors,
    setFieldValue,
    setFieldTouched,
    resetForm,
  } = formik;

  // NOTE: common functions
  const showNotification = useCallback(() => enqueueSnackbar(t('common:change_saved'), {
      variant: 'success',
    }));

  const updateBasicInfo = useCallback(
    (payload) => {
      dispatch(
        allCoursesActions.updateBasicInfo({
          orgId: organizationId,
          updateStatus: false,
          courseId,
          data: payload,
        })
      );
    },
    [dispatch, organizationId, courseId, timezone]
  );

  // NOTE: handle react lifecycle
  useEffect(() => {
    dispatch(
      subjectActions.getSubjectList({
        orgId: organizationId,
      })
    );
  }, []);

  useEffect(() => {
    if (getBasicInfoSuccess && basicInfo.courseName) {
      resetForm();
      setShowSkeleton(false);
    }
  }, [getBasicInfoSuccess, basicInfo]);
  useEffect(() => {
    if (!!basicInfo) {
      setCourseImage(
        basicInfo?.courseImage || basicInfo?.subject?.images?.filename
      );
      setFieldValue('name', basicInfo?.courseName);
    }
  }, [basicInfo]);

  useEffect(() => {
    if (updateBasicInfoSuccess) {
      dispatch(
        allCoursesActions.allCoursesSetState({
          updateBasicInfoSuccess: false,
        })
      );
      if (!updateStatus) {
        showNotification();
      }
    }
  }, [updateBasicInfoSuccess]); //dispatch, showNotification,

  useEffect(() => {
    if (getBasicInfoFailed || updateBasicInfoFailed) {
      // setShowGeneralError(true);
    }
  }, [getBasicInfoFailed, updateBasicInfoFailed]);
  const useSubjectImage = () => {
    updateBasicInfo({
      mediaId: basicInfo.subject.images.id,
    });
    handleClose();
  };
  const [openMedia, setOpenMedia] = useState(false);
  // const [image, selectImage] = useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClickMore = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const onMediaClose = () => {
    setOpenMedia(false);
  };

  const handleMediaSelect = (m) => {
    // selectImage(m);
    // setFieldValue('mediaId', m.id);
    if (m) {
      updateBasicInfo({
        mediaId: m.id,
      });
      setCourseImage(m.filename);
      handleClose();
    }
  };
  const hasPermission = checkPermission(
    permission || authContext.currentUser,
    ROLES_UPDATE
  );
  return (
    <div className={classes.root}>
      {/* {showGeneralError && <Grid xs={12} sm={8}>
        <Alert severity='error'>
          {t('error:general_error')}
        </Alert>
      </Grid>} */}
      {/* fix bug show something when wrong when publish failed in basic information tab */}
      {showSkeleton && (
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

      {!showSkeleton && (
        <form onSubmit={(e) => e.preventDefault()}>
          <Grid container spacing={0}>
            <Grid item xs={12} sm={8}>
              <TblInputs
                name='name'
                singleSave
                required
                label={t('course_name')}
                type='text'
                error={!!errors.name}
                errorMessage={errors.name ? <div>{errors.name}</div> : false}
                inputProps={{ maxLength: 254 }}
                value={name}
                disabled={!hasPermission}
                onChange={(e) => {
                  setFieldValue('name', e.target.value);
                  setFieldTouched('name', true);
                }}
                onAbort={() => {
                  setFieldValue('name', courseName);
                }}
                onSave={() => {
                  if (!!!errors.name && trim(name) !== courseName) {
                    updateBasicInfo({
                      courseName: trim(name),
                    });
                  }
                }}
              />
            </Grid>
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
              <TblSelect
                label={t('subject')}
                required
                disabled={!hasPermission}
                value={Number(subject?.id)}
                onChange={(e) => {
                  const subject = subjectList?.filter(
                    (i) => i.id === e.target.value
                  );
                  const { id, image } = subject[0];
                  setCourseImage(image);
                  updateBasicInfo({
                    subjectId: id,
                  });
                }}
              >
                {subjectList?.map((item, index) => (
                    <MenuItem value={item.id} key={index}>
                      {item.subjectName}
                    </MenuItem>
                  ))}
              </TblSelect>
            </Box>
          </Grid>
          <Grid item xs={12} sm={8}>
            <Box>
              <TblInputLabel>{t('course_image')}</TblInputLabel>
              <Box className={classes.mediaBox}>
                <CardMedia
                  component='div'
                  onClick={() => (hasPermission ? setOpenMedia(true) : false)}
                  className={classes.cardMedia}
                  image={`${process.env.REACT_APP_API_MEDIA}/thumbnail/${courseImage}`}
                />
                {hasPermission && (
                  <TblIconButton onClick={handleClickMore}>
                    <MoreVertIcon />
                  </TblIconButton>
                )}
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
                  <MenuItem onClick={useSubjectImage}>
                    {t('use_subject_image')}
                  </MenuItem>
                </Menu>
              </Box>
            </Box>
          </Grid>
        </form>
      )}
    </div>
  );
}

BasicInformation.propTypes = {
  location: PropTypes.object,
  permission: PropTypes.object,
  authContext: PropTypes.object,
};

export default BasicInformation;
