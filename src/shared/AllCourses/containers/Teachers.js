/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import differenceBy from 'lodash/differenceBy';

import Add from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Skeleton from '@mui/material/Skeleton';
import makeStyles from '@mui/styles/makeStyles';

import TblConfirmDialog from 'components/TblConfirmDialog';
import TblInputLabel from 'components/TblInputLabel';

import { COURSE_MANAGER } from 'utils/roles';

import { AuthDataContext } from 'AppRoute/AuthProvider';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { checkPermission } from 'utils';

import allCoursesActions from '../actions';
import AddAssistantTeachers from '../components/AddAssistantTeachersDialog';
import AddPrimaryTeacher from '../components/AddPrimaryTeacherDialog';
import TeacherCard from '../components/TeacherCard';

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
    padding: '19px 16px',
    color: theme.mainColors.primary1[0],
    justifyContent: 'center',
    fontSize: theme.fontSize.normal,
  },
  action: {
    minWidth: 80,
    background: theme.newColors.gray[100],
    color: theme.mainColors.gray[6],
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
  gridListTile: {
    padding: '0 18px 8px 0 !important',
    overflow: 'hidden',
  },
}));
const allCoursesSelector = (state) => state.AllCourses;
const ROLES_UPDATE = [COURSE_MANAGER];
function AddCard(props) {
  // NOTE: get contexts
  const classes = useStyles();
  // const { t } = useTranslation(['allCourses', 'common', 'error']);
  return (
    <Card
      className={classes.rootAddCard}
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

const renderSkeletonTeacherCard = (t) => <>
    <Box mr={3}>
      <Grid xs={6} item>
        <Box mb={1}>
          <TblInputLabel required>
            {t('common:primary_teacher')}
          </TblInputLabel>
        </Box>
        <Skeleton variant='rectangular' height={80} />
      </Grid>
    </Box>
    <Box mt={5}>
      <Grid xs={6} item>
        <Box mb={1}>
          <TblInputLabel>
            {t('common:assistant_teacher')}
          </TblInputLabel>
        </Box>
        <Skeleton variant='rectangular' height={80} />
      </Grid>
    </Box>
  </>;

function Teachers(props) {
  // NOTE: get contexts
  const { t } = useTranslation(['allCourses', 'common', 'error']);
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const {
    primaryTeacher,
    assistantTeachers,
    updateTeacherInfoSuccess,
    teachers,
    isBusy,
    isBusyGetTeacherOfCourse,
  } = useSelector(allCoursesSelector);
  const authContext = useContext(AuthDataContext);
  const hasPermission = checkPermission(authContext.currentUser, ROLES_UPDATE);
  const { organizationId } = authContext.currentUser;
  const courseId = props.match.params.courseId;
  const dispatch = useDispatch();
  const showNotification = useCallback(() => enqueueSnackbar(t('common:change_saved'), {
      variant: 'success',
    }));
  const [
    visibleAddPrimaryTeacherDialog,
    setVisibleAddPrimaryTeacherDialog,
  ] = useState(false);

  const [confirm, setConfirm] = useState({
    show: false,
    message: '',
    action: null,
  });

  const getTeachers = useCallback(() => {
    dispatch(
      allCoursesActions.getTeachers({
        id: organizationId,
        isBusyGetTeachers: true,
      })
    );
  }, [dispatch, organizationId]);

  useEffect(() => {
    getTeachers();
  }, [getTeachers]);

  const removeAssistantTeacher = (data) => {
    dispatch(
      allCoursesActions.updateTeachersInCourse({
        orgId: organizationId,
        courseId,
        isBusy: true,
        data: {
          teachingAssistants: data,
        },
      })
    );
  };

  const toggleAddPrimaryTeacherDialog = (value = false) => {
    setVisibleAddPrimaryTeacherDialog(value);
  };

  const [
    visibleAddAssistantTeachersDialog,
    setvisibleAddAssistantTeachersDialog,
  ] = useState(false);

  const toggleAddAssistantTeachersDialog = (value = false) => {
    setvisibleAddAssistantTeachersDialog(value);
  };

  useEffect(() => {
    if (updateTeacherInfoSuccess) {
      toggleAddPrimaryTeacherDialog();
      toggleAddAssistantTeachersDialog();
      getTeacherOfCourse();
      showNotification();
    }
    dispatch(
      allCoursesActions.allCoursesSetState({
        updateTeacherInfoSuccess: false,
      })
    );
  }, [updateTeacherInfoSuccess]);

  const getTeacherOfCourse = useCallback(() => {
    dispatch(
      allCoursesActions.getTeacherOfCourse({
        orgId: organizationId,
        courseId,
        urlParams: {
          attribute: 'teacher',
        },
        isBusyGetTeacherOfCourse: true,
      })
    );
  }, [dispatch, organizationId]);

  useEffect(() => {
    getTeacherOfCourse();
  }, [getTeacherOfCourse]);
  return isBusyGetTeacherOfCourse ? (
    renderSkeletonTeacherCard(t)
  ) : (
    <Box className={classes.root}>
      {visibleAddPrimaryTeacherDialog && (
        <AddPrimaryTeacher
          authContext={authContext}
          isVisible={visibleAddPrimaryTeacherDialog}
          toggleDialog={toggleAddPrimaryTeacherDialog}
          location={props.location}
          teachers={teachers}
          isBusy={isBusy}
          primaryTeacher={primaryTeacher}
        />
      )}
      {visibleAddAssistantTeachersDialog && hasPermission && (
        <AddAssistantTeachers
          authContext={authContext}
          isVisible={visibleAddAssistantTeachersDialog}
          toggleDialog={toggleAddAssistantTeachersDialog}
          location={props.location}
          primaryTeacher={primaryTeacher}
          teachers={differenceBy(teachers, assistantTeachers, 'id')}
          assistantTeachers={assistantTeachers}
        />
      )}
      {confirm.show && (
        <TblConfirmDialog
          open={confirm.show}
          cancelText={t('common:cancel')}
          okText={t('common:remove')}
          title={t('common:confirmation')}
          message={confirm.message}
          progressing={isBusy}
          onCancel={() => {
            setConfirm({
              show: false,
            });
          }}
          onConfirmed={() => {
            removeAssistantTeacher(
              assistantTeachers
                .filter((teacher) => teacher.id !== confirm.selectedItem.id)
                ?.map((t) => t.id)
            );
            setConfirm({
              show: false,
            });
          }}
        />
      )}
      <Box mr={3}>
        <Grid xs={6} item>
          <Box mb={1}>
            <TblInputLabel required>
              {t('common:primary_teacher')}
            </TblInputLabel>
          </Box>
          {!primaryTeacher && hasPermission ? (
            <AddCard
              addCardTitle={t('add_primary_teacher')}
              onClick={() => toggleAddPrimaryTeacherDialog(true)}
            />
          ) : (
            <TeacherCard
              item={primaryTeacher}
              iconAction={hasPermission}
              handleAction={() => toggleAddPrimaryTeacherDialog(true)}
            />
          )}
        </Grid>
      </Box>
      <Box mt={5}>
        <Box mb={1}>
          <TblInputLabel>
            {t('common:assistant_teacher')}
          </TblInputLabel>
        </Box>
        <ImageList
          cellHeight='auto'
          cols={2}
          spacing={24}
          className={classes.gridList}
        >
          {assistantTeachers?.map((secondTeacher) => (
            <ImageListItem
              key={secondTeacher.id}
              cols={1}
              className={classes.gridListTile}
            >
              <TeacherCard
                item={secondTeacher}
                iconAction={hasPermission ? <DeleteOutlineIcon /> : null}
                handleAction={() =>
                  setConfirm({
                    show: true,
                    message: (
                      <Trans i18nKey='remove_question'>
                        Remove <strong>{secondTeacher.name}</strong> from this
                        course?
                      </Trans>
                    ),
                    selectedItem: secondTeacher,
                  })
                }
              />
            </ImageListItem>
          ))}
        </ImageList>
      </Box>
      {hasPermission &&
        <Box mt={2.5}>
          <Grid container>
            <Grid xs={4} item>
              <AddCard
                addCardTitle={t('add_assistant_teachers')}
                onClick={() => toggleAddAssistantTeachersDialog(true)}
              />
            </Grid>
          </Grid>
        </Box>
      }
    </Box>
  );
}

Teachers.propTypes = {
  location: PropTypes.object,
  match: PropTypes.object,
  authContext: PropTypes.object,
};
AddCard.propTypes = {
  addCardTitle: PropTypes.string,
  onClick: PropTypes.func,
};

export default Teachers;
