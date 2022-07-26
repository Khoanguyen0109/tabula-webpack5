import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router';

import compact from 'lodash/compact';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import trim from 'lodash/trim';

import { Typography } from '@mui/material';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Skeleton from '@mui/material/Skeleton';
import makeStyles from '@mui/styles/makeStyles';

import TblButton from 'components/TblButton';
import TblDrawer from 'components/TblDrawer';
import TblEditor from 'components/TblEditor';
import TblIndicator from 'components/TblIndicator';
import { InputFieldMemo } from 'components/TblInputs';
import TblRadio from 'components/TblRadio';
import TblSelect from 'components/TblSelect';
import TblTour from 'components/TblTour';
import TourContent from 'components/TblTour/TourContent';
import TblUseSnackbar from 'components/TblUseSnackbar';
import withReducer from 'components/TblWithReducer';

import { COURSE_ITEM_TYPE, MAX_GOOGLE_UPLOAD_FILES } from 'utils/constants';

import Media from 'shared/Media/containers';
import reducer from 'shared/Media/reducers';

import { AuthDataContext } from 'AppRoute/AuthProvider';
import TimeToCompleteTourImage from 'assets/images/timeToComplete.png';
import { useFormik } from 'formik';
import { delay } from 'lodash-es';
import myCoursesActions from 'modules/MyCourses/actions';
import { ASSIGNMENT_STATUS } from 'modules/MyCourses/constants';
import myProfileActions from 'modules/MyProfile/actions';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { replaceHTMLTag, validURL } from 'utils';
import * as Yup from 'yup';

// import TblInputs from 'components/TblInputs';

// import gradeWeightingActions from 'shared/GradeWeighting/actions';

import Attachment from '../../Attachments/Attachment';
import { filterGoogleFileSelected } from '../../Google/utils';
import { USER_BEHAVIOR } from '../../User/constants';
import AssignmentDueTimeDialog from '../components//DueTimeDialog/AssignmentDueTimeDialog';
import AddGradeWeightingPopup from '../components/AddGradeWeightingPopup';
import AdvanceOptions from '../components/AdvanceOptions';
import FormActions from '../components/FormActions';
import FormSkeleton from '../components/FormSkeleton';
import GoogleAttachment from '../components/GoogleAttachment';
import { CREDIT_VALUE, SUBMISSION_METHOD, TYPE_OF_CREATE } from '../constants';
import {
  checkPermissionCreateAndPublish,
  /* getTimeItems ,*/ hoursForTimeToComplete,
  validMinMaxInput,
} from '../utils';

import LinkedContents from './LinkedContents';

// import { ASSIGNMENT_STATUS } from 'modules/MyCourses/constants';

const MediaWithReducer = withReducer('Media', reducer)(Media);

const useStyles = makeStyles((theme) => ({
  content: {
    display: 'flex',
  },
  leftContent: {
    width: '70%',
    marginRight: theme.spacing(4),
  },
  rightContent: {
    width: 288,
  },
  menuGradeWeight: {
    width: 287,
    textOverflow: 'ellipsis',
    display: 'block',
  },
}));
// const myCoursesSelector = (state) => state.AllCourses;

// const timeItems = getTimeItems(15, 1, 1);

function CreateAssignmentDrawer(props) {
  const {
    visible,
    onClose,
    unit,
    assignmentId,
    courseIdProp,
    updateUnit,
    updateMasterItem,
    assignmentInfo,
    // shadowAssignmentInfo,
    unitId,
    getCourseItemByUnit,
    assignmentViewData,
    isViewOnly,
  } = props;

  const classes = useStyles();
  const dispatch = useDispatch();
  const match = useRouteMatch();
  const { t } = useTranslation(['myCourses', 'common', 'tour']);
  const { enqueueSnackbar } = useSnackbar();

  const authContext = useContext(AuthDataContext);
  const { organizationId, settings } = authContext.currentUser;
  const haveCreated = settings?.behavior?.includes(
    USER_BEHAVIOR.HAVE_CREATED_ASSIGNMENT
  );
  const courseId = match.params.courseId || courseIdProp;
  const Adrawer1Ref = React.createRef(null);
  const [drawer1Ref] = useState(Adrawer1Ref);
  const permission = useSelector((state) => state.AllCourses?.permission);
  const havePermissionPublish = checkPermissionCreateAndPublish(permission);
  // const typeOfCreate = useSelector((state) => state.AllCourses?.typeOfCreate);
  const gradeWeight = useSelector((state) => state.AllCourses?.gradeWeight);
  const assignment =
    useSelector((state) => state.AllCourses?.assignment) || assignmentViewData;
  const shadowAssignments = useMemo(
    () => assignment.shadowAssignments ?? {},
    [assignment.shadowAssignments]
  );
  const errorMasterAssignment = useSelector(
    (state) => state.AllCourses?.errorMasterAssignment
  );
  const createNewAssignmentSuccess = useSelector(
    (state) => state.AllCourses?.createNewAssignmentSuccess
  );
  const editMasterAssignmentSuccess = useSelector(
    (state) => state.AllCourses?.editMasterAssignmentSuccess
  );
  const [visiblePublishDialog, setVisiblePublishDialog] = useState(false);
  const [openTour, setOpenTour] = useState(false);
  const [openAdvance, setOpenAdvance] = useState(false);

  const [isFetching, setIsFetching] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [typeOfCreate, setTypeOfCreate] = useState(0);
  const [media, setMedia] = React.useState({});
  const [attachments, setAttachments] = React.useState(
    assignment?.attachments
  );
  const [openGradeWeighting, setOpenGradeWeighting] = useState(false);

  const [linkContents, setLinkContents] = React.useState({
    lessonLinkIds:
      compact(assignment?.linkContents?.map((item) => item.lessonLinkId)) || [],
    assignmentLinkIds:
      compact(assignment?.linkContents?.map((item) => item.assignmentLinkId)) ||
      [],
    quizLinkIds:
      compact(assignment?.linkContents?.map((item) => item.quizLinkId)) || [],
  });

  const submissionMethodValue = [
    {
      value: SUBMISSION_METHOD.ONLINE,
      label: t('submission_type_online'),
    },
    {
      value: SUBMISSION_METHOD.OFFLINE,
      label: t('submission_type_offline'),
    },
  ];

  const validationAssigned = Yup.object().shape({
    assignmentName: Yup.string()
      // .nullable()
      .trim()
      .required(t('common:required_message')),
    requirement: Yup.string()
      .nullable()
      .test(
        'checkRequiredEditor',
        t('common:required_message'),
        function (requirement) {
          // const trimValue = requirement?.replace(/(<([^>]+)>)/gi, '');
          const trimValue = replaceHTMLTag(requirement);
          //NOTE: Fix bug TL-3294
          return !!trim(trimValue);
        }
      ),
    allowLateTurnIn: Yup.boolean(),
    totalPossiblePoints: Yup.mixed().test(
      'is-required',
      t('common:required_message'),
      (value) => !!value
    ),
    timeToComplete: Yup.mixed().test(
      'is-required',
      t('common:required_message'),
      (value) => !!value
    ),
    gradeWeightCriteriaId: Yup.string()
      .nullable()
      .required(t('common:required_message')),
    numberOfDaysAllowLateTurnIn: Yup.mixed().when('allowLateTurnIn', {
      is: true,
      then: Yup.mixed().test(
        'is-required',
        t('common:required_message'),
        (value) => !!value
      ),
    }),
    percentCredit: Yup.mixed().when('allowLateTurnIn', {
      is: true,
      then: Yup.mixed().test(
        'is-required',
        t('common:required_message'),
        (value) => !!value
      ),
    }),
  });

  const onAttachFile = (files) => {
    setAttachments(files);
  };
  const handleConvertBase64Image = async (requirement) => {
    let convertRequirement = requirement;
    const regex = /<img.*?src="(.*?)"/gm;
    let base64Image = null;
    const listBase64Img = [];
    const data = new FormData();

    do {
      base64Image = regex.exec(requirement);
      if (base64Image !== null && !validURL(base64Image[1])) {
        listBase64Img.push(base64Image[1]);
        const binaryStream = await fetch(base64Image[1]).then((res) =>
          res.blob()
        );
        data.append('file', binaryStream, 'unnamed_image');
      }
    } while (base64Image !== null);

    if (listBase64Img.length) {
      const accessToken = localStorage.getItem('access_token');
      const response = await fetch(`${process.env.REACT_APP_API_URL}/upload`, {
        method: 'POST',
        body: data,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.ok) {
        const responseJson = await response.json();
        if (responseJson && responseJson.length) {
          responseJson.forEach((file, index) => {
            convertRequirement = convertRequirement.replace(
              listBase64Img[index],
              file.url
            );
          });
        }
      }
    }
    return convertRequirement;
  };

  const onSubmit = async (values) => {
    const payload = {
      ...values,
      requirement:
        replaceHTMLTag(values.requirement) === '' ? '' : values.requirement,
      assignmentName: trim(values.assignmentName),
      extraCredit: JSON.parse(values.extraCredit),
      submissionMethod: Number(values.submissionMethod),
      allowLateTurnIn: JSON.parse(values.allowLateTurnIn),
      attachments: {
        mediaId: attachments?.map((file) => file.id) || [],
      },
      // fileTypeAccepted: trim(values?.fileTypeAccepted),
      linkContents: linkContents,
    };
    setIsCreating(true);
    payload.requirement = await handleConvertBase64Image(payload.requirement);
    if (isEmpty(assignment)) {
      dispatch(
        myCoursesActions.createNewAssignment({
          orgId: organizationId,
          courseId: courseId,
          unitId: unit?.id,
          isBusy: true,
          data: payload,
        })
      );
    } else {
      dispatch(
        myCoursesActions.editAssignment({
          orgId: organizationId,
          courseId: courseId,
          unitId: unit?.id || unitId,
          assignmentId: assignment?.id,
          isBusy: true,
          data: payload,
        })
      );
    }
  };

  const formik = useFormik({
    initialValues: {
      ...assignment,
      googleFiles: assignment?.googleFiles || [],
      gradeWeightCriteriaId: assignment?.gradeWeightCriteriaId,
      submissionMethod:
        assignment?.submissionMethod || SUBMISSION_METHOD.ONLINE,
      allowLateTurnIn: assignment?.allowLateTurnIn === false ? false : true,
      extraCredit: assignment?.extraCredit || false,
      numberOfDaysAllowLateTurnIn:
        //NOTE: Fix bug TL-3296
        assignment?.numberOfDaysAllowLateTurnIn
          ? Number(assignment?.numberOfDaysAllowLateTurnIn)
          : 90,
      percentCredit:
        assignment?.percentCredit || assignment?.percentCredit === 0
          ? Number(assignment?.percentCredit)
          : 80,
    },
    enableReinitialize: true,
    validationSchema: validationAssigned,
    validateOnChange: false,
    validateOnBlur: true,
    onSubmit: onSubmit,
  });

  const {
    values,
    touched,
    errors,
    setFieldValue,
    setFieldTouched,
    resetForm,
    setFieldError,
    // validateForm,
    submitCount,
    handleSubmit,
    handleBlur,
  } = formik;
  const toggleCloseDrawer = () => {
    resetForm();
    //NOTE: Reset gradeWeight when closing the drawer to fix bug TL-2936
    dispatch(
      myCoursesActions.myCoursesSetState({
        assignment: {},
        errorMasterAssignment: null,
        createNewAssignmentSuccess: false,
        editMasterAssignmentSuccess: false,
        gradeWeight: [],
        isBusy: false,
      })
    );
    setOpenAdvance(false);
    setAttachments([]);
    onClose();
  };

  const toggleCloseDialog = useCallback(() => {
    setVisiblePublishDialog(!visiblePublishDialog);
  }, [visiblePublishDialog]);

  const mcGetGradeWeight = useCallback(() => {
    if (visible)
      dispatch(
        myCoursesActions.mcGetGradeWeight({
          orgId: organizationId,
          courseId: courseId,
        })
      );
  }, [courseId, dispatch, organizationId, visible]);

  const getAssignmentDetail = useCallback(() => {
    if (assignmentId && visible && assignmentId !== assignment.id) {
      setIsFetching(true);
      dispatch(
        myCoursesActions.getAssignmentDetail({
          orgId: organizationId,
          courseId: courseId,
          unitId: unit?.id,
          assignmentId: assignmentId,
        })
      );
    }
  }, [
    assignmentId,
    courseId,
    dispatch,
    organizationId,
    unit,
    visible,
    assignment,
  ]);

  useEffect(() => {
    getAssignmentDetail();
    mcGetGradeWeight();
  }, [getAssignmentDetail, mcGetGradeWeight]);

  useEffect(() => {
    if (visible && !haveCreated) {
      delay(() => {
        setOpenTour(true);
      }, 700);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);
  useEffect(() => {
    //NOTE: Follow TL-3330
    if (isEmpty(assignment)) {
      const gradeWeightAssignment =
        gradeWeight &&
        gradeWeight.length > 0 &&
        gradeWeight.filter((item) => item.type === COURSE_ITEM_TYPE.ASSIGNMENT);
      if (gradeWeightAssignment && gradeWeightAssignment.length === 1) {
        setFieldValue('gradeWeightCriteriaId', gradeWeightAssignment[0]?.id);
      }
      if (gradeWeightAssignment?.length === 0) {
        setFieldValue('gradeWeightCriteriaId', undefined);
      }
    }

    setLinkContents({
      lessonLinkIds:
        assignment?.linkContents?.map((item) => item.lessonLinkId) || [],
      assignmentLinkIds:
        assignment?.linkContents?.map((item) => item.assignmentLinkId) || [],
      quizLinkIds:
        assignment?.linkContents?.map((item) => item.quizLinkId) || [],
    });
    setAttachments(assignment?.attachments);
    if (assignment.id === assignmentId) {
      setIsFetching(false);
    }
    return () => {
      myCoursesActions.myCoursesSetState({
        assignment: {},
        errorMasterAssignment: null,
        createNewAssignmentSuccess: false,
        editMasterAssignmentSuccess: false,
        gradeWeight: [],
        isBusy: false,
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assignment, assignmentId, gradeWeight]);
  useEffect(() => {
    if (errorMasterAssignment) {
      setIsCreating(false);
      switch (errorMasterAssignment.subcode) {
        case 4: //TODO: Need to use Enum constant
          setFieldError(
            'numberOfDaysAllowLateTurnIn',
            t('error_only_expanding_deadline')
          );
          break;
        case 5:
          const initialAllowLate = !!assignment?.allowLateTurnIn;
          enqueueSnackbar(t('myCourses:error_assigned_late'), {
            variant: 'error',
          });
          handleChange('allowLateTurnIn', initialAllowLate);
          break;
        default:
          break;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorMasterAssignment]);

  useEffect(() => {
    if (createNewAssignmentSuccess || editMasterAssignmentSuccess) {
      setIsCreating(false);
      switch (typeOfCreate) {
        case TYPE_OF_CREATE.CREATE_AS_DRAFT:
          toggleCloseDrawer();
          break;
        case TYPE_OF_CREATE.CREATE_AND_PUBLISH:
          setVisiblePublishDialog(true);
          dispatch(
            myCoursesActions.myCoursesSetState({
              errorMasterAssignment: null,
              createNewAssignmentSuccess: false,
              editMasterAssignmentSuccess: false,
              gradeWeight: [],
            })
          );
          setAttachments([]);
          onClose();
          break;
        default:
          break;
      }
      updateUnit && updateUnit(unit?.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    createNewAssignmentSuccess,
    dispatch,
    editMasterAssignmentSuccess,
    toggleCloseDrawer,
    unit,
    updateUnit,
  ]);
  // }, [createNewAssignmentSuccess]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (
      editMasterAssignmentSuccess &&
      assignmentInfo?.page === 'plan' &&
      unitId
    ) {
      if (
        updateMasterItem &&
        (assignmentInfo?.planned || assignmentInfo?.courseDayId)
      ) {
        updateMasterItem(assignmentInfo?.courseDayId, 'none', unitId);
      }
      if (getCourseItemByUnit && !assignmentInfo?.planned) {
        getCourseItemByUnit();
      }
    }
  }, [
    updateMasterItem,
    editMasterAssignmentSuccess,
    assignmentInfo,
    unitId,
    getCourseItemByUnit,
  ]);

  const handleChange = useCallback(
    (fieldName, value) => {
      if (value !== values[fieldName]) {
        setFieldValue(fieldName, value);
        setFieldTouched(fieldName, true);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [values]
  );

  const insertImage = (editor, value, callbackFunc) => {
    if (drawer1Ref) {
      drawer1Ref.current.classList.toggle('overlayed');
    }
    setMedia({
      openMedia: true,
      mediaCallback: {
        editor,
        value,
        insertImage: callbackFunc,
      },
      mediaAction: 'insertImage',
    });
  };
  const onMediaClose = () => {
    if (drawer1Ref) {
      drawer1Ref.current.classList.toggle('overlayed');
    }
    setMedia({ openMedia: false, mediaCallback: {} });
  };

  const handleMediaSelect = React.useCallback(
    (m) => {
      if (media?.mediaAction === 'insertImage') {
        const { editor, insertImage: callback } = media.mediaCallback || {};
        callback(editor, m?.url);
      }
      setMedia({ mediaCallback: {} });
    },
    [media]
  );
  const editorChange = React.useCallback(
    (content) => {
      const trimValue = replaceHTMLTag(content);
      if (touched.requirement || trimValue || assignmentId) {
        handleChange('requirement', content);
      }
      if (!trimValue) {
        handleChange('requirement', '');
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [touched.requirement, assignmentId]
  );

  const onChangeChooseTemplate = async (sourceId) => {
    values.googleFiles.forEach((file) => {
      if (file.sourceId === sourceId) {
        return (file.isTemplate = !file.isTemplate);
      }
      file.isTemplate = false;
    });
    setFieldValue('googleFiles', values.googleFiles);
  };

  const errorMemo = React.useMemo(() => {
    const isTouched = touched.requirement || submitCount;
    return {
      hasError: !!(errors.requirement && isTouched),
      errorMessage: isTouched && errors.requirement ? errors.requirement : '',
    };
  }, [errors.requirement, touched.requirement, submitCount]);

  const editorMemo = React.useMemo(() => 
     (
      <TblEditor
        name='requirement'
        disabled={isViewOnly}
        label={t('common:description')}
        placeholder={t('assignment_description_placeholder')}
        required
        customButtons={{
          insertImage: {
            onClick: insertImage,
          },
        }}
        onChange={editorChange}
        defaultValue={values.requirement}
        error={errorMemo}
      />
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  , [
    values.requirement,
    errors.requirement,
    touched.requirement,
    assignmentId,
    submitCount,
  ]);

  const createAsDraft = async () => {
    if (
      values.totalPossiblePoints !== assignment.totalPossiblePoints &&
      checkAssignedStatus()
    ) {
      setFieldError(
        'totalPossiblePoints',
        t('can_not_update_total_possible_points')
      );
      return false;
    }
    setTypeOfCreate(TYPE_OF_CREATE.CREATE_AS_DRAFT);
    handleSubmit(values);
  };

  const createAndPublish = async () => {
    setTypeOfCreate(TYPE_OF_CREATE.CREATE_AND_PUBLISH);
    handleSubmit(values);
  };
  const updateBehavior = () => {
    settings.behavior.push(USER_BEHAVIOR.HAVE_CREATED_ASSIGNMENT);
    const payload = { settings };
    setOpenTour(false);
    dispatch(myProfileActions.updateMyProfile(payload));
  };
  const tourConfig = [
    {
      selector: '[data-tut="reactour__timeToComplete"]',
      content: () => (
        <TourContent
          image={TimeToCompleteTourImage}
          label={t('tour:time_to_complete')}
          content={t('tour:time_to_complete_content')
            .split('\n')
            .map((line) => (
              <div>{line}</div>
            ))}
        />
      ),
      position: 'left',
    },
  ];
  const checkAssignedStatus = useCallback(() => {
    if (!shadowAssignments || shadowAssignments.length === 0) return false;
    for (let i = 0; i < shadowAssignments.length; i++) {
      if (
        [
          ASSIGNMENT_STATUS.ASSIGNED_LATE,
          ASSIGNMENT_STATUS.CLOSED,
          ASSIGNMENT_STATUS.ASSIGNED,
        ].includes(shadowAssignments[i].status)
      )
        return true;
    }
    return false;
  }, [shadowAssignments]);
  const renderContent = () => {
    const disableEditField =
      [
        ASSIGNMENT_STATUS.ASSIGNED,
        ASSIGNMENT_STATUS.CLOSED,
        ASSIGNMENT_STATUS.ASSIGNED_LATE,
        ASSIGNMENT_STATUS.READY_TO_ASSIGN,
      ].includes(values?.status) || isViewOnly;
    return isFetching ? (
      <FormSkeleton />
    ) : (
      <form>
        {editMasterAssignmentSuccess && <TblUseSnackbar />}
        {createNewAssignmentSuccess && (
          <TblUseSnackbar
            message={t('common:object_created', { objectName: 'Assignment' })}
          />
        )}

        {!isEmpty(errorMasterAssignment) &&
          ![4, 5].includes(errorMasterAssignment?.subcode) && (
            <Box mb={2}>
              <Alert severity='error'>{errorMasterAssignment?.message}</Alert>
            </Box>
          )}
        <div className={classes.content}>
          <div className={classes.leftContent}>
            <MediaWithReducer
              visible={media.openMedia}
              onClose={onMediaClose}
              onSelect={handleMediaSelect}
              accept={media.acceptType}
              mediaType={media.mediaType}
            />

            <Box>
              <InputFieldMemo
                name='assignmentName'
                onBlur={handleBlur}
                required
                disabled={isViewOnly}
                label={t('assignment_name')}
                inputType='text'
                error={
                  !!(
                    errors.assignmentName &&
                    (touched.assignmentName || submitCount)
                  )
                }
                errorMessage={
                  !!(
                    errors.assignmentName &&
                    (touched.assignmentName || submitCount)
                  )
                    ? errors.assignmentName
                    : false
                }
                inputProps={{ maxLength: 254 }}
                value={values?.assignmentName}
                onChange={(e) => handleChange('assignmentName', e.target.value)}
              />
            </Box>
            <Box mt={2}>
              {/**NOTE: Section 3 in TL-3330 */}
              {editorMemo}
            </Box>
            <Box mt={3.5}>
              <Typography variant='labelLarge'>
                {t('common:attachments')}
              </Typography>
            </Box>
            <Box mt={3.5}>
              <GoogleAttachment
                initialValues={values.googleFiles}
                maxItems={MAX_GOOGLE_UPLOAD_FILES}
                onChange={(files) => setFieldValue('googleFiles', files)}
                onChangeChooseTemplate={onChangeChooseTemplate}
                onAdd={(googleAttachmentsSelected) => {
                  const uniqSelected = filterGoogleFileSelected(
                    values.googleFiles,
                    googleAttachmentsSelected
                  );
                  setFieldValue('googleFiles', uniqSelected);
                }}
                disabled={isViewOnly}
              />
            </Box>
            {!isViewOnly && (
              <Box mt={3.5}>
                <Attachment
                  files={attachments}
                  initialAttachments={assignment?.attachments}
                  drawer1Ref={drawer1Ref}
                  updateData={onAttachFile}
                />
              </Box>
            )}
            {/*
              /// NOTE : TL-3826
             <Box mt={2}>
              <InputFieldMemo
                name='fileTypeAccepted'
                label={t('materials_needed')}
                placeholder={null}
                errorMessage={
                  touched.fileTypeAccepted ? errors?.fileTypeAccepted : ''
                }
                onChange={(e) =>
                  handleChange('fileTypeAccepted', e.target.value)
                }
                value={values?.fileTypeAccepted}
              />
            </Box> */}
            {!isViewOnly && (
              <Box mt={3.5}>
                <LinkedContents
                  unit={unit}
                  courseActivityInfo={assignment}
                  initialLinkedContents={assignment?.linkContents}
                  updateData={(linkContents) => setLinkContents(linkContents)}
                  viewOnly={isViewOnly}
                  courseIdProp={courseIdProp || match.params.courseId}
                />
              </Box>
            )}
          </div>
          <div className={classes.rightContent}>
            <Box>
              <InputFieldMemo
                disabled={disableEditField}
                name='totalPossiblePoints'
                required
                label={t('total_possible_points')}
                inputType='number'
                onBlur={handleBlur}
                onChange={(e) =>
                  handleChange('totalPossiblePoints', Number(e.target.value))
                }
                decimalScale={2}
                isAllowed={(values) => {
                  const { floatValue, formattedValue } = values;
                  return (
                    formattedValue === '' ||
                    (floatValue <= 10000 && floatValue > 0)
                  );
                }}
                value={values?.totalPossiblePoints}
                error={
                  !!(
                    errors.totalPossiblePoints &&
                    (touched.totalPossiblePoints || submitCount)
                  )
                }
                errorMessage={
                  !!(
                    errors.totalPossiblePoints &&
                    (touched.totalPossiblePoints || submitCount)
                  )
                    ? errors.totalPossiblePoints
                    : false
                }
              />
            </Box>
            <Box mt={2} data-tut='reactour__timeToComplete'>
              <InputFieldMemo
                name='timeToComplete'
                disabled={disableEditField}
                label={t('time_to_complete_mins')}
                value={values.timeToComplete}
                onBlur={handleBlur}
                onChange={(e) =>
                  handleChange('timeToComplete', Number(e.target.value))
                }
                helperLabel={t('myCourses:explain_time_to_complete')}
                inputType='number'
                decimalScale={0}
                isAllowed={validMinMaxInput(hoursForTimeToComplete)}
                error={
                  !!(
                    errors.timeToComplete &&
                    (touched.timeToComplete || submitCount)
                  )
                }
                errorMessage={
                  !!(
                    errors.timeToComplete &&
                    (touched.timeToComplete || submitCount)
                  )
                    ? errors.timeToComplete
                    : false
                }
                required
              />

              {/*
              /// Time to complete select field
              <TblSelect
                disabled={disableEditField}
                required
                label={t('time_to_complete_mins')}
                name='timeToComplete'
                onChange={(e) =>
                  handleChange('timeToComplete', Number(e.target.value))
                }
                placeholder={t('common:select')}
                autoWidth={false}
                value={values?.timeToComplete}
                error={
                  !!(
                    errors.timeToComplete &&
                    (touched.timeToComplete || submitCount)
                  )
                }
                errorMessage={
                  !!(
                    errors.timeToComplete &&
                    (touched.timeToComplete || submitCount)
                  )
                    ? errors.timeToComplete
                    : false
                }
              >
                {timeItems?.map((item, index) =>
                  item?.title ? (
                    <ListSubheader
                      style={{ pointerEvents: 'none' }}
                      color='primary'
                      disableSticky
                      key={index}
                    >
                      {item?.title}
                    </ListSubheader>
                  ) : (
                    <MenuItem value={item?.value} key={index}>
                      {item?.label}
                    </MenuItem>
                  )
                )}
              </TblSelect> */}
            </Box>
            <Box mt={2}>
              <TblSelect
                disabled={disableEditField}
                required
                label={t('grade_weighting_category')}
                name='gradeWeightCriteriaId'
                onBlur={handleBlur}
                onChange={(e) =>
                  handleChange('gradeWeightCriteriaId', e.target.value)
                }
                placeholder={t('common:select')}
                autoWidth={false}
                value={values?.gradeWeightCriteriaId}
                error={
                  !!(
                    errors.gradeWeightCriteriaId &&
                    (touched.gradeWeightCriteriaId || submitCount)
                  )
                }
                errorMessage={
                  !!(
                    errors.gradeWeightCriteriaId &&
                    (touched.gradeWeightCriteriaId || submitCount)
                  )
                    ? errors.gradeWeightCriteriaId
                    : false
                }
                addFunc={() => setOpenGradeWeighting(true)}
              >
                {gradeWeight
                  ? gradeWeight
                      ?.filter((gw) => gw.type === COURSE_ITEM_TYPE.ASSIGNMENT)
                      ?.map((item) => (
                        <MenuItem
                          value={item.id}
                          key={item.id}
                          // ListItemClasses={{ root: classes.menuGradeWeight }}
                        >
                          {item.name}
                        </MenuItem>
                      ))
                  : assignment?.gradeWeightCriteria && (
                      <MenuItem
                        value={assignment?.gradeWeightCriteria.id}
                        key={assignment?.gradeWeightCriteria.id}
                      >
                        {assignment?.gradeWeightCriteria.name}
                      </MenuItem>
                    )}
              </TblSelect>
            </Box>
            <AdvanceOptions
              open={openAdvance}
              onClose={() => setOpenAdvance(!openAdvance)}
            >
              <Box mt={2}>
                <TblRadio
                  disabled={disableEditField}
                  name='submissionMethod'
                  values={submissionMethodValue}
                  label={t('submission_type')}
                  onChange={(e) =>
                    handleChange('submissionMethod', e.target.value)
                  }
                  value={values?.submissionMethod}
                />
              </Box>
              <Box mt={2}>
                <TblRadio
                  disabled={disableEditField}
                  name='extraCredit'
                  values={CREDIT_VALUE}
                  value={values?.extraCredit}
                  label={t('extra_credit')}
                  onChange={(e) => handleChange('extraCredit', e.target.value)}
                />
              </Box>

              <Box mt={2}>
                <TblRadio
                  disabled={disableEditField}
                  values={CREDIT_VALUE}
                  name='allowLateTurnIn'
                  label={t('allow_late_turn_in_label')}
                  value={values?.allowLateTurnIn}
                  onChange={(e) =>
                    handleChange('allowLateTurnIn', e.target.value)
                  }
                />
              </Box>
              <Box className='errorText'>
                {errorMasterAssignment?.subcode === 4 &&
                  !JSON.parse(values.allowLateTurnIn) &&
                  t('error_only_expanding_deadline')}
              </Box>
              {JSON.parse(values.allowLateTurnIn) && (
                <>
                  <Box mt={2}>
                    <InputFieldMemo
                      disabled={disableEditField}
                      name='numberOfDaysAllowLateTurnIn'
                      required
                      label={t('number_of_days')}
                      inputType='number'
                      error={
                        !!(
                          errors.numberOfDaysAllowLateTurnIn &&
                          (touched.numberOfDaysAllowLateTurnIn || submitCount)
                        )
                      }
                      errorMessage={
                        !!(
                          errors.numberOfDaysAllowLateTurnIn &&
                          (touched.numberOfDaysAllowLateTurnIn || submitCount)
                        )
                          ? errors.numberOfDaysAllowLateTurnIn
                          : false
                      }
                      // errorMessage={
                      //   touched.numberOfDaysAllowLateTurnIn
                      //     ? errors?.numberOfDaysAllowLateTurnIn
                      //     : ''
                      // }
                      onChange={(e) =>
                        handleChange(
                          'numberOfDaysAllowLateTurnIn',
                          Number(e.target.value)
                        )
                      }
                      isAllowed={(values) => {
                        const { floatValue, formattedValue } = values;
                        return (
                          formattedValue === '' ||
                          (floatValue <= 100 && floatValue > 0)
                        );
                      }}
                      value={values?.numberOfDaysAllowLateTurnIn}
                      decimalScale={0}
                    />
                  </Box>
                  <Box mt={2}>
                    <InputFieldMemo
                      disabled={disableEditField}
                      name='percentCredit'
                      required
                      label={`${t('percent_credit')} (%)`}
                      inputType='number'
                      onChange={(e) =>
                        handleChange('percentCredit', Number(e.target.value))
                      }
                      value={values?.percentCredit}
                      error={
                        !!(
                          errors.percentCredit &&
                          (touched.percentCredit || submitCount)
                        )
                      }
                      errorMessage={
                        !!(
                          errors.percentCredit &&
                          (touched.percentCredit || submitCount)
                        )
                          ? errors.percentCredit
                          : false
                      }
                      // errorMessage={
                      //   touched.percentCredit ? errors?.percentCredit : ''
                      // }
                      isAllowed={(values) => {
                        const { floatValue, formattedValue } = values;
                        return (
                          formattedValue === '' ||
                          (floatValue <= 100 && floatValue > 0)
                        );
                      }}
                      decimalScale={2}
                    />
                  </Box>
                </>
              )}
            </AdvanceOptions>
          </div>
        </div>
      </form>
    );
  };
  return (
    <>
      <TblDrawer
        anchor={'right'}
        open={visible}
        onClose={toggleCloseDrawer}
        title={
          isFetching ? (
            <Skeleton variant='text' />
          ) : !isEmpty(assignment) ? (
            assignment?.assignmentName
          ) : (
            t('create_an_assignment')
          )
        }
        ref={drawer1Ref}
        footer={
          <FormActions
            isCreate={!!!assignmentId}
            disabled={isCreating}
            createAsDraft={createAsDraft}
            createAndPublish={createAndPublish}
            onCloseDrawer={toggleCloseDrawer}
            typeOfCreate={typeOfCreate}
            havePermissionPublish={havePermissionPublish}
            isViewOnly={isViewOnly}
          />
        }
      >
        {!isFetching && !isViewOnly && (
          <Box mt={-2} mb={2}>
            <TblIndicator content={t('unable_to_update_course_activity')} />
          </Box>
        )}
        {renderContent()}
      </TblDrawer>
      <AddGradeWeightingPopup
        open={openGradeWeighting}
        onClose={() => setOpenGradeWeighting(false)}
      />
      {
        !isViewOnly &&
        <TblTour
          steps={tourConfig}
          isOpen={openTour}
          lastStepNextButton={
            <TblButton onClick={updateBehavior}>
              {t('tour:benefits_acknowledged')}
            </TblButton>
          }
        />
      }
      {visiblePublishDialog && (
        <AssignmentDueTimeDialog
          visible={visiblePublishDialog}
          assignment={assignment}
          toggleCloseDialog={toggleCloseDialog}
        />
      )}
    </>
  );
}
// CreateAssignmentDrawer.whyDidYouRender=true;
CreateAssignmentDrawer.propTypes = {
  visibleState: PropTypes.bool,
  onClose: PropTypes.func,
  updateUnit: PropTypes.func,
  unit: PropTypes.object,
  assignmentId: PropTypes.number,
  courseIdProp: PropTypes.number,
  visible: PropTypes.bool,
  updateMasterItem: PropTypes.func,
  assignmentInfo: PropTypes.object,
  unitId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  shadowAssignmentInfo: PropTypes.object,
  getCourseItemByUnit: PropTypes.func,
  isViewOnly: PropTypes.bool,
  assignmentViewData: PropTypes.object,
};
CreateAssignmentDrawer.defaultProps = {
  isViewOnly: false,
};

export default React.memo(CreateAssignmentDrawer, isEqual);
