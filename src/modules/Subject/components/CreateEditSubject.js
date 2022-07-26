/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';

import isEmtpy from 'lodash/isEmpty';
import isNil from 'lodash/isNil';

import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import Box from '@mui/material/Box';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';

import TblButton from 'components/TblButton';
import TblDialog from 'components/TblDialog';
import TblIconButton from 'components/TblIconButton';
import TblInputLabel from 'components/TblInputLabel';
import TblInputs from 'components/TblInputs';

import MediaWithReducer from 'shared/Media/containers';

import clsx from 'clsx';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
// import reducer from 'shared/Media/reducers';

// const MediaWithReducer = withReducer('Media', reducer)(Media);

const useStyles = makeStyles((theme) => ({
  uploadBox: {
    backgroundColor: theme.newColors.gray[100],
    width: 240,
    // cursor: 'pointer',
    border: `1px solid ${theme.newColors.gray[300]}`,
    borderRadius: theme.spacing(1),
    height: 160,
    '& .edit-icon': {
      display: 'none',
    },
    '&.create:hover': {
      display: 'none',
    },
    // '&:hover': {
    //   display: 'flex',
    //   position: 'relative',
    //   '&::before': {
    //     display: 'block',
    //     content: '""',
    //     textAlign: 'center',
    //     top: -1,
    //     left: 0,
    //     right: 0,
    //     bottom: -1,
    //     position: 'absolute',
    //     opacity: 0.64,
    //     borderRadius: theme.spacing(1),
    //     backgroundColor: theme.mainColors.tertiary[0],
    //   },
    //   '& .edit-icon': {
    //     position: 'absolute',
    //     display: 'block',
    //     color: theme.newColors.gray[50],
    //   },
    // },
    '& .MuiButtonBase-root': {
      border: `2px dashed ${theme.mainColors.gray[6]}`,
    },
    '& .MuiCardMedia-root': {
      height: 159,
      width: '100%',
      borderRadius: theme.spacing(1),
      backgroundSize: 'cover',
    },
  },
  errorBox: {
    border: `1px solid ${theme.palette.error.main}`,
  },
  errorMessage: {
    color: theme.palette.error.main,
    paddingLeft: theme.spacing(1),
    '&: first-letter': {
      textTransform: 'capitalize',
    },
  },
  flexEnd: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row-reverse',
  },
}));

function CreateEditSubject(props) {
  const {
    t,
    createNewSubject,
    editSubject,
    subjectInfo,
    createNewSubjectFailed,
    isVisibleDialog,
    toggleDialog,
    isCreateNewSubjectSuccess,
    editSubjectFailed,
    isEditSubjectSuccess,
  } = props;
  const [openMedia, setOpenMedia] = useState(false);
  const [image, selectImage] = useState(null);
  const subjectSchema = Yup.object().shape({
    subjectName: Yup.string().trim().required(t('common:required_message')),
    mediaId: Yup.string().required(t('common:required_message')),
  });
  const initialValues = { subjectName: subjectInfo?.subjectName ?? '' };
  if (subjectInfo.image) {
    initialValues.mediaId = 0;
  }
  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema: subjectSchema,
    validateOnChange: true,
    validateOnBlur: false,
    onSubmit: (values) => {
      const payload = values;
      if (image) {
        payload.mediaId = image.id;
      }
      payload.subjectName = payload.subjectName.trim();
      // Trick code when edit subject. We don't have media id
      if (payload.mediaId === 0) {
        delete payload.mediaId;
      }
      if (!isEmtpy(subjectInfo)) {
        editSubject(payload);
      } else {
        createNewSubject(payload);
      }
    },
  });

  const {
    values: { subjectName },
    errors,
    touched,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    resetForm,
  } = formik;
  useEffect(() => {
    (async () => {
      if (
        (!isNil(createNewSubjectFailed) &&
          createNewSubjectFailed.subcode === 409) ||
        (!isNil(editSubjectFailed) && editSubjectFailed.subcode === 409)
      ) {
        // Trick code when edit subject. We don't have media id
        await setFieldValue('mediaId', 0);
        setFieldError('subjectName', t('common:this_name_already_exists'));
      }
    })();
  }, [createNewSubjectFailed, editSubjectFailed]);
  useEffect(() => {
    if (subjectInfo.images) {
      const img = {
        url: `${process.env.REACT_APP_API_MEDIA}/images/${subjectInfo.images.filename}`,
      };
      selectImage(img);
    }
  }, [subjectInfo]);
  useEffect(() => {
    if (isCreateNewSubjectSuccess || isEditSubjectSuccess) {
      resetForm();
    }
  }, [isCreateNewSubjectSuccess, isEditSubjectSuccess]);
  const classes = useStyles();
  const onMediaClose = () => {
    setOpenMedia(false);
  };

  const handleMediaSelect = (m) => {
    selectImage(m);
    setFieldValue('mediaId', m.id);
  };

  return (
    <TblDialog
      open={isVisibleDialog}
      fullWidth={true}
      onClose={() => {
        toggleDialog();
        formik.handleReset();
      }}
      // title={!isEmtpy(subjectInfo) ? t('edit_subject') : t('new_subject')}
      title={t('common:view_subject_detail')}
      footer={
        <>
          {/* <TblButton
            size='medium' variant='outlined' color='primary'
            onClick={() => toggleDialog(false)}
          >
            {t('common:cancel')}
          </TblButton> */}
          <Box className={classes.flexEnd}>
            <TblButton
              // disabled={isBusy}
              // isShowCircularProgress={isBusy}
              size='medium'
              variant='contained'
              color='primary'
              // onClick={formik.handleSubmit}
              onClick={() => toggleDialog(false)}
            >
              {/* {!isEmtpy(subjectInfo) ? t('common:save') : t('common:create')} */}
              {t('common:close')}
            </TblButton>
          </Box>
        </>
      }
    >
      <MediaWithReducer
        visible={openMedia}
        onClose={onMediaClose}
        onSelect={handleMediaSelect}
        accept='image/*'
        mediaType='image'
      />
      <form onSubmit={formik.handleSubmit}>
        <TblInputs
          name='subjectName'
          disabled
          required
          label={t('subject_name')}
          type='text'
          error={!!(errors.subjectName && touched.subjectName)}
          errorMessage={
            !!(errors.subjectName && touched.subjectName)
              ? errors.subjectName
              : false
          }
          inputProps={{ maxLength: 254 }}
          value={subjectName}
          onChange={(e) => {
            formik.handleChange(e);
            setFieldTouched('subjectName', true);
          }}
        />
        <TblInputLabel className='Mui-required'>
          {t('default_image')}
          <span
            aria-hidden='true'
            className='MuiFormLabel-asterisk MuiInputLabel-asterisk'
          >
             *
          </span>
        </TblInputLabel>
        <Box
          display='flex'
          alignContent='center'
          // onClick={() => setOpenMedia(true)}
          justifyContent='center'
          alignItems='center'
          className={clsx(classes.uploadBox, {
            [classes.errorBox]: errors.mediaId,
          })}
        >
          {!image ? (
            <TblIconButton>
              <AddIcon />
            </TblIconButton>
          ) : (
            <CardMedia image={image.url} />
          )}
          <EditIcon className='edit-icon' />
        </Box>
        {errors.mediaId && (
          <Typography variant='bodySmall' className={classes.errorMessage}>
            {errors.mediaId}
          </Typography>
        )}
      </form>
    </TblDialog>
  );
}

CreateEditSubject.propTypes = {
  isBusy: PropTypes.bool,
  t: PropTypes.func,
  createNewSubject: PropTypes.func,
  editSubject: PropTypes.func,
  subjectInfo: PropTypes.func,
  createNewSubjectFailed: PropTypes.object,
  isVisibleDialog: PropTypes.bool,
  toggleDialog: PropTypes.func,
  isCreateNewSubjectSuccess: PropTypes.bool,
  isEditSubjectSuccess: PropTypes.bool,
  editSubjectFailed: PropTypes.object,
};

export const CreateEditSubjectWrapper = React.memo(CreateEditSubject);
