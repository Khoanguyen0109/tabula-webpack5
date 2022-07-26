import React, { useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { Box, Grid, MenuItem, Paper, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import makeStyles from '@mui/styles/makeStyles';

import TblButton from 'components/TblButton';
import TblInputs from 'components/TblInputs';
import TblSelect from 'components/TblSelect';

import { isGuardian, isStudent } from 'utils/roles';

import { USER_BEHAVIOR } from 'shared/User/constants';

import { AuthDataContext } from 'AppRoute/AuthProvider';
import Welcome from 'assets/images/welcome_720.png';
import clsx from 'clsx';
import { useFormik } from 'formik';
import myProfileActions from 'modules/MyProfile/actions';
import moment from 'moment';
import PropTypes from 'prop-types';
import 'react-phone-input-2/lib/style.css';

import { bedtimeArray, wakeUpArray } from '../../MyProfile/utils';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    position: 'relative',
    margin: 'auto',
    boxShadow: 'none',
    maxWidth: theme.spacing(135),
    minHeight: theme.spacing(60),
    '&::before': {
      position: 'absolute',
      top: '-430px',
      right: '-270px',
      content: '""',
      background: theme.openColors.blue[1],
      borderRadius: '50%',
      width: theme.spacing(50),
      height: theme.spacing(50),
    },
    '&::after': {
      position: 'absolute',
      bottom: '-430px',
      left: '-270px',
      content: '""',
      background: theme.openColors.blue[0],
      borderRadius: '50%',
      width: theme.spacing(45),
      height: theme.spacing(45),
    },
  },
  label: {
    position: 'relative',
    fontSize: '30px',
    fontWeight: theme.fontWeight.semi,
    color: theme.newColors.gray[900],
    marginBottom: theme.spacing(5),
  },
  imgWrapper: {
    width: '100%',
    height: '100%',
    minWidth: theme.spacing(55),
    maxWidth: theme.spacing(62),
  },
  img: {
    objectFit: 'contain',
    margin: 'auto',
    width: '100%',
    height: '100%',
  },
  content: {
    position: 'relative',
    color: theme.newColors.gray[800],
    fontWeight: theme.fontWeight.normal,
    fontSize: theme.fontSize.normal,
  },
  btn: {
    color: 'white',
    marginTop: theme.spacing(5),
    backgroundColor: theme.customColors.primary1.main,
    '&:hover': {
      color: 'white',
      backgroundColor: theme.customColors.primary1.dark[1],
    },
    '&:active': {
      backgroundColor: theme.customColors.primary1.dark[2],
    },
  },
  emptyVideo: {
    width: '100%',
    height: '100%',
  },

  languageBtn: {
    color: theme.newColors.gray[600],
    fontSize: theme.fontSize.normal,
    padding: theme.spacing(0.5),
    '&:hover': {
      cursor: 'pointer',
    },
  },
  activeBtn: {
    color: `${theme.customColors.primary1.main }!important`,
  },
}));

const STUDENT_DEMO = 'StudentDemo2.mp4';
const GUARDIAN_DEMO = 'GuardianDemo2.mp4';
const GUARDIAN_DEMO_SPANISH = 'GuardianDemo2_Spanish.mp4';

function OnBoardingProfile(props) {
  const { open, onClose } = props;
  const classes = useStyles();
  const dispatch = useDispatch();
  const { t } = useTranslation('myProfile', 'language');
  const authContext = useContext(AuthDataContext);
  const { currentUser } = authContext;
  const { settings } = currentUser;
  const [page, setPage] = useState(0);
  const bedTimeInReducer = useSelector(
    (state) => state.Auth.currentUser.bedTime
  );
  const wakeupTimeInReducer = useSelector(
    (state) => state.Auth.currentUser.wakeupTime
  );
  const [videoSource, setVideoSource] = useState(STUDENT_DEMO);

  const updateProfile = () => {
    settings.behavior.push(USER_BEHAVIOR.HAVE_SET_UP_PROFILE);
    const payload = {
      phone: values.phone,
      settings,
    };
    if (isStudent(currentUser)) {
      const bedtimeValue = bedtimeArray.find(
        (item) => item.id === values.bedTime
      );
      const wakeUpValue = wakeUpArray.find(
        (item) => item.id === values.wakeupTime
      );
      const bedTimeData = {
        bedTime: bedtimeValue.text,
        wakeUpTime: wakeUpValue.text,
      };
      Object.assign(payload, bedTimeData);
    }
    setPage(page + 1);
    dispatch(myProfileActions.updateMyProfile(payload));
  };

  const formik = useFormik({
    initialValues: {
      phone: '',
      bedTime: isStudent(currentUser) ? 2 : null,
      wakeupTime: isStudent(currentUser) ? 6 : null,
    },
    onSubmit: updateProfile,
  });
  const {
    values,
    setFieldValue,
    handleSubmit,
    // setFieldTouched,
  } = formik;

  const { bedTime, wakeupTime, phone } = values;
  useEffect(() => {
    const bedTimeReducerIndex = bedtimeArray.findIndex((item) =>
      moment(item.text, 'hh:mm a').isSame(
        moment(bedTimeInReducer, 'HH:mm:ss'),
        'minute'
      )
    );
    const wakeupTimeReducerIndex = wakeUpArray.findIndex((item) =>
      moment(item.text, 'hh:mm a').isSame(
        moment(wakeupTimeInReducer, 'HH:mm:ss'),
        'minute'
      )
    );
    if (Number(bedTime) !== bedTimeReducerIndex && bedTimeReducerIndex !== -1) {
      setFieldValue('bedTime', bedTimeReducerIndex);
    }
    if (
      Number(wakeupTime) !== wakeupTimeReducerIndex &&
      wakeupTimeReducerIndex !== -1
    ) {
      setFieldValue('wakeupTime', wakeupTimeReducerIndex);
    }

    if (isStudent(currentUser)) {
      setVideoSource(STUDENT_DEMO);
    }
    if (isGuardian(currentUser)) {
      setVideoSource(GUARDIAN_DEMO);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderLefSide = () => {
    switch (page) {
      case 0:
        return (
          <>
            <Typography className={classes.label} color='primary'>
              {t('welcome_to_tabula')}
            </Typography>
            <Box className={classes.content}>
              {t('welcome_to_tabula_content')}
            </Box>
            <Box mt={2} width={288}>
              <TblInputs
                label={<span>{t('common:phone_number')}</span>}
                value={phone}
                placeholder={'xxx-xxx-xxxx'}
                inputType='phone'
                onChange={(value) => {
                  setFieldValue('phone', value);
                }}
              />
            </Box>
            {isStudent(currentUser) && (
              <>
                <Box mt={3} className={classes.content}>
                  {t('bed_time_instruction')}
                </Box>
                <Box mt={2} display='flex'>
                  <Box width={288}>
                    <TblSelect
                      label={t('bedtime')}
                      value={bedTime}
                      onChange={(e) => setFieldValue('bedTime', e.target.value)}
                    >
                      {bedtimeArray.map((item, index) => (
                        <MenuItem key={index} value={index}>
                          {item?.text}
                        </MenuItem>
                      ))}
                    </TblSelect>
                  </Box>
                  <Box width={288} ml={3}>
                    <TblSelect
                      label={t('wake_up_time')}
                      value={wakeupTime}
                      onChange={(e) =>
                        setFieldValue('wakeupTime', e.target.value)
                      }
                    >
                      {wakeUpArray.map((item, index) => (
                        <MenuItem key={index} value={index}>
                          {item?.text}
                        </MenuItem>
                      ))}
                    </TblSelect>
                  </Box>
                </Box>
              </>
            )}

            <TblButton
              className={classes.btn}
              onClick={handleSubmit}
              size='large'
              variant='contained'
            >
              {t('we_are_all_set')}
            </TblButton>
          </>
        );
      case 1:
        return (
          <Box mt={6}>
            <Typography className={classes.label} color='primary'>
              {t('thank_you')}
            </Typography>
            <Box>{t('thank_you_content')}</Box>
            <Box mt={3}>{t('intro_video')}</Box>
            <TblButton
              className={classes.btn}
              onClick={onClose}
              size='large'
              variant='contained'
            >
              {t('im_ready')}
            </TblButton>
          </Box>
        );
      default:
        break;
    }
  };

  const renderRightSide = () => {
    switch (page) {
      case 0:
        return (
          <Box className={classes.imgWrapper}>
            <img className={classes.img} src={Welcome} alt='' />
          </Box>
        );

      case 1:
        return (
          <>
            <Box mt={6} width={580} height={360}>
              <video className={classes.emptyVideo} controls key={videoSource}>
                <source
                  src={`${process.env.REACT_APP_API_MEDIA}/videos/${videoSource}`}
                  type='video/mp4'
                />
                <source src='movie.ogg' type='video/ogg' />
                Your browser does not support the video tag.
              </video>
            </Box>
            {isGuardian(currentUser) && (
              <Box display='flex' mt={1}>
                <a
                  className={clsx(
                    classes.languageBtn,
                    videoSource === GUARDIAN_DEMO && classes.activeBtn
                  )}
                  onClick={() => setVideoSource(GUARDIAN_DEMO)}
                >
                  {t('language:english')}
                </a>
                <a
                  className={clsx(
                    classes.languageBtn,
                    videoSource === GUARDIAN_DEMO_SPANISH && classes.activeBtn
                  )}
                  onClick={() => setVideoSource(GUARDIAN_DEMO_SPANISH)}
                >
                  {t('language:spanish')}
                </a>
              </Box>
            )}
          </>
        );
      default:
        break;
    }
  };
  return (
    <>
      <Dialog fullScreen open={open}>
        <Paper className={classes.wrapper}>
          <Grid container>
            <Grid item xs={6}>
              <Box className={classes.leftSide}>{renderLefSide()}</Box>
            </Grid>
            <Grid item xs={6}>
              {renderRightSide()}
            </Grid>
          </Grid>
        </Paper>
      </Dialog>
    </>
  );
}

OnBoardingProfile.propTypes = {
  onClose: PropTypes.func,
  open: PropTypes.bool,
};

export default OnBoardingProfile;
