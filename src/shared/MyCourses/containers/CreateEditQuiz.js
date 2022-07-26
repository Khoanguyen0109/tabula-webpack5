import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import compose from 'lodash/flowRight';
import fromPairs from 'lodash/fromPairs';
import isEmpty from 'lodash/isEmpty';
import trim from 'lodash/trim';

import { Typography } from '@mui/material';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import ListSubheader from '@mui/material/ListSubheader';
import MenuItem from '@mui/material/MenuItem';
import Skeleton from '@mui/material/Skeleton';

import TblButton from 'components/TblButton';
import TblDrawer from 'components/TblDrawer';
import TblEditor from 'components/TblEditor';
import TblIndicator from 'components/TblIndicator';
import TblInputs from 'components/TblInputs';
import TblRadio from 'components/TblRadio';
import TblSelect from 'components/TblSelect';
import TblTour from 'components/TblTour';
import TourContent from 'components/TblTour/TourContent';

import { COURSE_ITEM_TYPE, MAX_GOOGLE_UPLOAD_FILES } from 'utils/constants';

import MediaWithReducer from 'shared/Media/containers';
import { QUIZ_TYPE } from 'shared/MyCourses/constants';
import LinkedContents from 'shared/MyCourses/containers/LinkedContents';

import TimeToCompleteTourImage from 'assets/images/timeToComplete.png';
import { isAfter } from 'date-fns/esm';
import { Field, Form, Formik } from 'formik';
import { delay } from 'lodash-es';
import myCoursesActions from 'modules/MyCourses/actions';
import myProfileActions from 'modules/MyProfile/actions';
import { withSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { replaceHTMLTag } from 'utils';
import * as Yup from 'yup';

import { QUIZ_STATUS } from '../../../modules/MyCourses/constants';
import { convertTimezone } from '../../../utils/time';
import Attachment from '../../Attachments/Attachment';
import { filterGoogleFileSelected } from '../../Google/utils';
import { USER_BEHAVIOR } from '../../User/constants';
import AddGradeWeightingPopup from '../components/AddGradeWeightingPopup';
import AdvanceOptions from '../components/AdvanceOptions';
import QuizDueTimeDialog from '../components/DueTimeDialog/QuizDueTimeDialog';
import FormActions from '../components/FormActions';
import FormSkeleton from '../components/FormSkeleton';
import GoogleAttachment from '../components/GoogleAttachment';
import { TYPE_OF_CREATE } from '../constants';
import {
  checkPermissionCreateAndPublish,
  getTimeItems,
  hoursForTimeToComplete,
  validMinMaxInput,
} from '../utils';

// const MediaWithReducer = withReducer('Media', reducer)(Media);
class CreateEditQuiz extends React.PureComponent {
  state = {
    isVisible: false,
    isVisibleMedia: false,
    mediaType: 'image',
    acceptType: 'image/*',
    fetchingQuizInfo: false,
    isCreating: false,
    linkContents: {
      assignmentLinkIds: [],
      lessonLinkIds: [],
      quizLinkIds: [],
    },
    quizType: '',
    typeOfCreate: 0,
    visiblePublishDialog: false,
    openTour: false,
    openAdvance: false,
    openGradeWeighting: false,
  };

  drawerRef = React.createRef(null);

  timeItems = getTimeItems(15, 1, 1);

  static getDerivedStateFromProps(props, state) {
    const newState = {};
    if (
      isEmpty(props.currentQuiz) &&
      props.quizId &&
      !props.quizType &&
      !state.fetchingQuizInfo
    ) {
      newState.fetchingQuizInfo = true;
    } else {
      newState.quizType = props?.currentQuiz?.quizType ?? props?.quizType;
      newState.fetchingQuizInfo = false;
    }
    if (
      props.currentQuiz &&
      !isEmpty(props.currentQuiz) &&
      state.fetchingQuizInfo
    ) {
      newState.quizType = props.currentQuiz.quizType;
      newState.fetchingQuizInfo = false;
    }
    if (isEmpty(props.currentQuiz) && !isEmpty(props.error)) {
      newState.quizType = props?.currentQuiz?.quizType ?? props?.quizType;
      newState.fetchingQuizInfo = false;
    }
    if (props.error && !isEmpty(props.error) && state.isCreating) {
      newState.isCreating = false;
    }
    if (isEmpty(newState)) {
      return null;
    }
    return newState;
  }

  componentDidMount() {
    const {
      currentUser: { organizationId },
      courseId,
      quizId,
      isVisible,
    } = this.props;
    if (isVisible) {
      this.props.getGradeWeight({
        orgId: organizationId,
        courseId,
      });
    }

    if (quizId) {
      this.getQuizInfo();
    }
  }

  componentDidUpdate(prevProps) {
    const {
      currentUser: { organizationId, settings },
      courseId,
    } = prevProps;
    const {
      unitId,
      quizInfo,
      updateMasterItem,
      error,
      t,
      getCourseItemByUnit,
      isVisible,
      quizType,
      currentQuiz,
      gradeWeight,
    } = this.props;
    const haveCreated = settings?.behavior?.includes(
      USER_BEHAVIOR.HAVE_CREATED_ANNOUNCE_QUIZ
    );

    if (isVisible && quizType === QUIZ_TYPE.ANNOUNCED && !haveCreated) {
      delay(() => {
        this.setState({
          openTour: true,
        });
      }, 700);
    }
    if (
      prevProps.gradeWeight !== this.props.gradeWeight &&
      isEmpty(currentQuiz) &&
      !!this.formikRef
    ) {
      //NOTE: Auto select grade weighting category when just one value TL-3330
      const gradeWeightQuiz =
        gradeWeight &&
        gradeWeight.length > 0 &&
        gradeWeight.filter((item) => item.type === COURSE_ITEM_TYPE.QUIZ);
      if (gradeWeightQuiz && gradeWeightQuiz.length === 1) {
        this.formikRef.setFieldValue(
          'gradeWeightCriteriaId',
          gradeWeightQuiz[0]?.id
        );
      }
      if (gradeWeightQuiz?.length === 0) {
        this.formikRef.setFieldValue('gradeWeightCriteriaId', undefined);
      }
    }
    if (!prevProps.createQuizSuccess && this.props.createQuizSuccess) {
      this.props.enqueueSnackbar(
        this.props.t('common:object_created', {
          objectName:
            quizType === QUIZ_TYPE.ANNOUNCED
              ? t('common:announce_quiz')
              : t('common:pop_quiz'),
        }),
        { variant: 'success' }
      );
      switch (this.state.typeOfCreate) {
        case TYPE_OF_CREATE.CREATE_AS_DRAFT:
          this.onCloseDrawer();
          break;
        case TYPE_OF_CREATE.CREATE_AND_PUBLISH:
          this.setState({
            visiblePublishDialog: true,
            isCreating: false,
          });
          this.props.myCoursesSetState({
            error: null,
            createQuizSuccess: false,
            editQuizSuccess: false,
            gradeWeight: [],
          });
          this.props.onClose();
          if (this.formikRef) {
            this.formikRef.resetForm();
          }
          break;
        default:
          break;
      }
    }
    if (!prevProps.editQuizSuccess && this.props.editQuizSuccess) {
      this.props.enqueueSnackbar(this.props.t('common:change_saved'), {
        variant: 'success',
      });
      this.onCloseDrawer();
    }

    if (this.props.isVisible && this.props.isVisible !== prevProps.isVisible) {
      this.getQuizInfo();
      this.props.getGradeWeight({
        orgId: organizationId,
        courseId,
      });
    }
    // if (this.props.error && !isEmpty(this.props.error) && !isEqual(this.props.error, prevProps.error)) {
    //   this.props.enqueueSnackbar(this.props.error.message, {variant: 'error'});
    // }
    if (
      !prevProps.editQuizSuccess &&
      this.props.editQuizSuccess &&
      quizInfo?.page === 'plan' &&
      unitId
    ) {
      if (updateMasterItem && (quizInfo?.planned || quizInfo?.courseDayId)) {
        updateMasterItem(
          quizInfo?.courseDayId ?? quizInfo?.executeDateId,
          'none',
          unitId
        );
      }
      if (getCourseItemByUnit && !quizInfo?.planned) {
        getCourseItemByUnit();
      }
    }
    //NOTE: Fix bug TL-3117
    switch (error?.subcode) {
      case 2:
        if (this.formikRef) {
          this.formikRef.setFieldError(
            'numberOfDays',
            t('error_only_expanding_deadline')
          );
        }
        break;
      case 1:
        if (this.formikRef) {
          this.formikRef.setFieldError('allowRetake', error.message);
        }
        break;
      default:
        break;
    }
  }

  getQuizInfo = () => {
    const {
      currentUser: { organizationId },
      courseId,
      unitId,
      quizId,
    } = this.props;
    if (quizId) {
      this.props.getQuiz({ orgId: organizationId, courseId, unitId, quizId });
    }
  };

  onOpenDrawer = () => {
    this.setState({ isVisible: true });
  };

  onCloseDrawer = () => {
    // this.setState({ isVisible: false });
    //NOTE: Reset gradeWeight when closing the drawer to fix bug TL-2936
    this.props.myCoursesSetState({
      currentQuiz: null,
      error: null,
      createQuizSuccess: false,
      editQuizSuccess: false,
      gradeWeight: [],
    });
    this.setState({ isCreating: false, openAdvance: false });
    this.props.onClose();
    if (this.formikRef) {
      this.formikRef.resetForm();
    }
  };

  onCloseDialog = () => {
    this.setState({
      visiblePublishDialog: false,
    });
  };

  handleMediaSelect = (media) => {
    const { mediaCallback, mediaAction, editorSelected } = this.state;
    if (mediaAction === 'insertImage' && editorSelected && mediaCallback) {
      mediaCallback(editorSelected, media.url);
    }
    this.setState({ mediaCallback: null });
  };

  onMediaClose = () => {
    if (this.drawerRef) {
      this.drawerRef.current.classList.toggle('overlayed');
    }
    this.setState({ isVisibleMedia: false, mediaCallback: null });
  };

  insertImage = (editor, value, insertImageFunc) => {
    if (this.drawerRef) {
      this.drawerRef.current.classList.toggle('overlayed');
    }
    this.setState({
      isVisibleMedia: true,
      mediaCallback: insertImageFunc,
      mediaAction: 'insertImage',
      editorSelected: editor,
    });
  };

  getInitialValues = () => {
    let keyArray = [
      'quizName',
      'studyTips',
      'totalPossiblePoints',
      'timeToComplete',
      'gradeType',
      'allowRetake',
      'numberOfDays',
      'maxRetakes',
      'percentCredit',
      'gradeWeightCriteriaId',
      'googleFiles',
      'status',
      'attachments',
    ];
    const { currentQuiz } = this.props;
    const { quizType } = this.state;
    let initialValues = {
      allowRetake: false,
      gradeType: 1,
      quizType,
      gradeWeightCriteriaId: '',
      numberOfDays: 90,
      linkContents: [],
      quizName: '',
      studyTips: '',
      totalPossiblePoints: null,
      timeToComplete: null,
      googleFiles: [],
      status: null,
      attachments: [],
    };

    if (currentQuiz && !isEmpty(currentQuiz)) {
      if (quizType === QUIZ_TYPE.ANNOUNCED) {
        keyArray.push('studyEffort');
      }
      const quizData = fromPairs(
        keyArray.map((item) => [item, currentQuiz?.[item]])
      );
      return { ...initialValues, ...quizData };
    }
    return { ...initialValues };
  };

  onSubmit = (values) => {
    const {
      quizId,
      createQuiz,
      editQuiz,
      currentUser: { organizationId },
      courseId,
      unitId,
      currentQuiz,
      t,
    } = this.props;
    let { linkContents, googleFiles, ...payload } = values;
    if (
      payload.totalPossiblePoints !== currentQuiz?.totalPossiblePoints &&
      currentQuiz?.shadowQuizzes?.length &&
      currentQuiz?.shadowQuizzes?.every(
        (shadowQuiz) => shadowQuiz.status !== QUIZ_STATUS.DRAFT
      )
    ) {
      this.formikRef.setFieldError(
        'totalPossiblePoints',
        t('can_not_update_quiz_total_possible_points')
      );
      return false;
    }
    this.setState({ isCreating: true });
    // cast value to boolean
    payload.allowRetake = !!payload.allowRetake;
    if (payload.gradeWeightCriteriaId) {
      payload.gradeWeightCriteriaId = Number(payload.gradeWeightCriteriaId);
    } else {
      delete payload.gradeWeightCriteriaId;
    }
    payload.quizName = payload.quizName?.trim();
    // payload.description = payload.description?.trim();
    payload.studyTips = payload.studyTips?.trim();
    //NOTE: Reopen TL-2972 comment to fix it
    // if (isNaN(payload.totalPossiblePoints)) {
    //   payload = omit(payload, ['totalPossiblePoints']);
    // }
    // if (isNaN(payload.timeToComplete)) {
    //   payload = omit(payload, ['timeToComplete']);
    // }
    // if (isNaN(payload.studyEffort)) {
    //   payload = omit(payload, ['studyEffort']);
    // }
    const attachments = {
      mediaId: values.attachments?.map((file) => file.id) || [],
    };
    if (!quizId) {
      createQuiz({
        orgId: organizationId,
        unitId,
        courseId,
        quiz: { ...payload },
        linkContents,
        googleFiles,
        attachments,
        createQuizSuccess: false,
      });
    } else {
      editQuiz({
        orgId: organizationId,
        unitId,
        quizId,
        courseId,
        quiz: { ...payload },
        editQuizSuccess: false,
        linkContents,
        googleFiles,
        attachments,
      });
    }
  };
  onChangeLinkContents = (linkContents, setFieldValue) => {
    setFieldValue('linkContents', linkContents);
  };

  handleChange = (fieldName, value) => {
    if (this.formikRef) {
      this.formikRef.setFieldValue(fieldName, value);
      this.formikRef.setFieldTouched(fieldName, true);
    }
  };
  updateBehavior = () => {
    const { currentUser, updateMyProfile } = this.props;
    const { settings } = currentUser;
    settings.behavior.push(USER_BEHAVIOR.HAVE_CREATED_ANNOUNCE_QUIZ);
    const payload = { settings };
    this.setState({
      openTour: false,
    });
    updateMyProfile(payload);
  };

  render() {
    const {
      t,
      currentQuiz,
      unitId,
      isVisible,
      gradeWeight,
      error,
      quizId,
      permission,
      isViewOnly,
      courseId,
      match,
    } = this.props;
    const havePermissionPublish = checkPermissionCreateAndPublish(permission);
    const {
      isVisibleMedia,
      acceptType,
      mediaType,
      quizType,
      fetchingQuizInfo,
      isCreating,
      visiblePublishDialog,
      typeOfCreate,
      openTour,
      openAdvance,
      openGradeWeighting,
    } = this.state;
    const allowRetakeValues = [
      {
        value: 1,
        label: t('common:yes'),
      },
      {
        value: 0,
        label: t('common:no'),
      },
    ];
    const validationSchema = Yup.object().shape({
      quizName: Yup.string().trim().required(t('common:required_message')),
      quizType: Yup.number(),
      gradeType: Yup.number(),
      // description: Yup.string().trim().nullable(),
      allowRetake: Yup.boolean(),
      studyTips: Yup.mixed().test(
        'is-required',
        t('common:required_message'),
        (value) => !!trim(replaceHTMLTag(value))
      ),
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
      studyEffort: Yup.mixed().when('quizType', {
        is: QUIZ_TYPE.ANNOUNCED,
        then: Yup.mixed().test(
          'is-required',
          t('common:required_message'),
          (value) => !!value
        ),
      }),
      numberOfDays: Yup.mixed().when('allowRetake', {
        is: true,
        then: Yup.mixed().test(
          'is-required',
          t('common:required_message'),
          (value) => !!value
        ),
      }),
      gradeWeightCriteriaId: Yup.string()
        .nullable()
        .required(t('common:required_message')),
      maxRetakes: Yup.mixed().when('allowRetake', {
        is: true,
        then: Yup.mixed()
          .test('is-required', t('common:required_message'), (value) => !!value)
          .test(
            'is-greater',
            t('myCourses:error_set_max_retake_lower'),
            (value) => {
              const today = new Date();
              // TL-4589

              const havePublishShadow =
                currentQuiz &&
                currentQuiz.shadowQuizzes.some(
                  (shadow) =>
                    (shadow.status === QUIZ_STATUS.PUBLISHED &&
                      isAfter(
                        new Date(convertTimezone(today)),
                        new Date(convertTimezone(new Date(shadow.executeTime)))
                      )) ||
                    shadow.status === QUIZ_STATUS.CLOSED
                );
              return havePublishShadow
                ? Number(value) >= currentQuiz.maxRetakes
                : true;
            }
          ),
      }),
      percentCredit: Yup.mixed().when('allowRetake', {
        is: true,
        then: Yup.mixed().test(
          'is-required',
          t('common:required_message'),
          (value) => !!value
        ),
      }),
      linkContents: Yup.object().nullable(),
    });

    const tourConfig = [
      {
        selector: '[data-tut="reactour__studyEffort"]',
        content: () => (
          <TourContent
            image={TimeToCompleteTourImage}
            label={t('tour:study_effort')}
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

    return (
      <>
        {/* {isVisibleMedia && */}
        <MediaWithReducer
          visible={isVisibleMedia}
          onClose={this.onMediaClose}
          onSelect={this.handleMediaSelect}
          accept={acceptType}
          mediaType={mediaType}
        />
        {/* } */}
        <Formik
          innerRef={(node) => (this.formikRef = node)}
          initialValues={this.getInitialValues()}
          validationSchema={validationSchema}
          enableReinitialize={true}
          validateOnChange={false}
          validateOnBlur={true}
          onSubmit={this.onSubmit}
        >
          {({
            values,
            errors,
            touched,
            setFieldValue,
            handleSubmit,
            submitCount,
          }) => {
            const disableEditField =
              [
                QUIZ_STATUS.PUBLIC,
                QUIZ_STATUS.PUBLIC_VISIBLE,
                QUIZ_STATUS.PUBLISHED,
                QUIZ_STATUS.CLOSED,
              ].includes(values?.status) || isViewOnly;
            return (
              <TblDrawer
                ref={this.drawerRef}
                open={isVisible}
                anchor={'right'}
                title={
                  fetchingQuizInfo ? (
                    <Skeleton variant='text' />
                  ) : !isEmpty(currentQuiz) ? (
                    currentQuiz?.quizName
                  ) : // t('create_a_quiz_type', {
                  // quizType:
                  quizType === QUIZ_TYPE.POP ? (
                    t('create_a_pop_quiz')
                  ) : (
                    t('create_a_test')
                  )
                  // })
                }
                footer={
                  <FormActions
                    isCreate={!!!quizId}
                    disabled={isCreating}
                    onCloseDrawer={this.onCloseDrawer}
                    isViewOnly={isViewOnly}
                    createAsDraft={() => {
                      this.setState(
                        {
                          typeOfCreate: 0,
                        },
                        () => handleSubmit(values)
                      );
                    }}
                    createAndPublish={() => {
                      this.setState(
                        {
                          typeOfCreate: 1,
                        },
                        () => handleSubmit(values)
                      );
                    }}
                    typeOfCreate={typeOfCreate}
                    havePermissionPublish={havePermissionPublish}
                  />
                }
              >
                {fetchingQuizInfo ? (
                  <FormSkeleton />
                ) : (
                  <Form>
                    {!isEmpty(error) && ![1, 2].includes(error?.subcode) && (
                      <Box mb={2}>
                        <Alert severity='error'>{error?.message}</Alert>
                      </Box>
                    )}
                    {!isViewOnly && (
                      <Box mt={-2} mb={2}>
                        <TblIndicator
                          content={t('unable_to_update_course_activity')}
                        />
                      </Box>
                    )}
                    <Grid container spacing={3}>
                      <Grid item xs={9}>
                        <Field
                          name='quizName'
                          as={TblInputs}
                          label={
                            quizType === QUIZ_TYPE.POP
                              ? t('pop_quiz_name')
                              : t('quiz_name')
                          }
                          disabled={isViewOnly}
                          required
                          inputProps={{ maxLength: 254 }}
                          error={
                            !!(
                              errors.quizName &&
                              (touched.quizName || submitCount)
                            )
                          }
                          errorMessage={
                            !!(
                              errors.quizName &&
                              (touched.quizName || submitCount)
                            )
                              ? errors.quizName
                              : false
                          }
                          onChange={(e) =>
                            this.handleChange('quizName', e.target.value)
                          }
                        />
                        {/* <Box mt={2}>
                      <Field
                        name='description'
                        as={TblInputs}
                        label={t('quiz_description')}
                        multiline
                        rows={3}
                        placeholder={t('quiz_description')}
                      />
                    </Box> */}
                        {/**NOTE: Section 4 in TL-3330 */}
                        <Box mt={2}>
                          <Field
                            as={TblEditor}
                            name='studyTips'
                            label={t('common:description')}
                            placeholder={t('quiz_description_placeholder')}
                            required
                            disabled={isViewOnly}
                            customButtons={{
                              insertImage: {
                                onClick: this.insertImage,
                              },
                            }}
                            onChange={(content) => {
                              const trimValue = replaceHTMLTag(content);
                              if (touched.studyTips || trimValue || quizId) {
                                this.handleChange('studyTips', content);
                              }
                              if (!trimValue) {
                                this.handleChange('studyTips', '');
                              }
                            }}
                            onBlur={() => {}}
                            defaultValue={values.studyTips}
                            error={{
                              hasError: !!(
                                errors.studyTips &&
                                (touched.studyTips || submitCount)
                              ),
                              errorMessage: !!(
                                errors.studyTips &&
                                (touched.studyTips || submitCount)
                              )
                                ? errors.studyTips
                                : '',
                            }}
                         
                          />
                        </Box>
                        <Box mt={3.5}>
                          <Typography variant='labelLarge'>
                            {t('common:attachments')}
                          </Typography>
                        </Box>
                        <Box mt={3.5}>
                          <GoogleAttachment
                            disabled={isViewOnly}
                            initialValues={values.googleFiles}
                            maxItems={MAX_GOOGLE_UPLOAD_FILES}
                            onChange={(googleFiles) =>
                              setFieldValue('googleFiles', googleFiles)
                            }
                            onAdd={(googleAttachmentsSelected) => {
                              const uniqSelected = filterGoogleFileSelected(
                                values.googleFiles,
                                googleAttachmentsSelected
                              );
                              setFieldValue('googleFiles', uniqSelected);
                            }}
                          />
                        </Box>
                        {!isViewOnly && (
                          <Box mt={3.5}>
                            <Attachment
                              files={values.attachments}
                              initialAttachments={values.googleFiles}
                              updateData={(file) =>
                                setFieldValue('attachments', file)
                              }
                            />
                          </Box>
                        )}
                        {!isViewOnly && (
                          <Box mt={3.5}>
                            <LinkedContents
                              viewOnly={isViewOnly}
                              courseActivityInfo={currentQuiz}
                              subtitle={t('choose_courses_activities', {
                                type: 'Quiz',
                              })}
                              initialLinkedContents={currentQuiz?.linkContents}
                              courseIdProp={courseId || match?.params?.courseId}
                              updateData={(linkContents) =>
                                this.onChangeLinkContents(
                                  linkContents,
                                  setFieldValue
                                )
                              }
                              unit={{ id: unitId }}
                            />
                          </Box>
                        )}
                      </Grid>
                      <Grid item xs={3}>
                        <Field
                          disabled={disableEditField}
                          as={TblInputs}
                          name='totalPossiblePoints'
                          label={t('total_possible_points')}
                          inputType='number'
                          value={values.totalPossiblePoints}
                          decimalScale={2}
                          onChange={(e) =>
                            this.handleChange(
                              'totalPossiblePoints',
                              Number(e.target.value)
                            )
                          }
                          isAllowed={validMinMaxInput(10000)}
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
                          required
                        />
                        <Box mt={2}>
                          <Field
                            disabled={disableEditField}
                            as={TblInputs}
                            name='timeToComplete'
                            label={t('time_to_complete_mins')}
                            helperLabel={t(
                              'myCourses:explain_time_to_complete'
                            )}
                            value={values.timeToComplete}
                            onChange={(e) =>
                              this.handleChange(
                                'timeToComplete',
                                Number(e.target.value)
                              )
                            }
                            inputType='number'
                            //NOTE: Improvement for TL-3328
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
                        </Box>
                        {quizType === QUIZ_TYPE.ANNOUNCED && (
                          <Box mt={2} data-tut='reactour__studyEffort'>
                            <TblSelect
                              disabled={disableEditField}
                              required
                              label={t('study_effort')}
                              name='studyEffort'
                              onChange={(e) =>
                                this.handleChange(
                                  'studyEffort',
                                  Number(e.target.value)
                                )
                              }
                              placeholder={t('common:select')}
                              autoWidth={false}
                              value={values?.studyEffort || null}
                              error={
                                !!(
                                  errors.studyEffort &&
                                  (touched.studyEffort || submitCount)
                                )
                              }
                              errorMessage={
                                !!(
                                  errors.studyEffort &&
                                  (touched.studyEffort || submitCount)
                                )
                                  ? errors.studyEffort
                                  : false
                              }
                            >
                              {this.timeItems?.map((item, index) =>
                                item?.title ? (
                                  <ListSubheader
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
                            </TblSelect>
                          </Box>
                        )}
                        <Box mt={2}>
                          <Field
                            disabled={disableEditField}
                            name='gradeWeightCriteriaId'
                            as={TblSelect}
                            required
                            value={values.gradeWeightCriteriaId}
                            label={t('grade_weighting_category')}
                            placeholder={t('common:select')}
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
                            addFunc={() =>
                              this.setState({ openGradeWeighting: true })
                            }
                          >
                            {gradeWeight
                              ? gradeWeight
                                  ?.filter(
                                    (gw) => gw.type === COURSE_ITEM_TYPE.QUIZ
                                  )
                                  ?.map((item) => (
                                    <MenuItem
                                      value={item.id}
                                      key={item.id}
                                      // ListItemClasses={{ root: classes.menuGradeWeight }}
                                    >
                                      {item.name}
                                    </MenuItem>
                                  ))
                              : currentQuiz?.gradeWeightCriteria && (
                                  <MenuItem
                                    value={currentQuiz?.gradeWeightCriteria.id}
                                    key={currentQuiz?.gradeWeightCriteria.id}
                                  >
                                    {currentQuiz?.gradeWeightCriteria.name}
                                  </MenuItem>
                                )}
                          </Field>
                        </Box>
                        <AdvanceOptions
                          open={openAdvance}
                          onClose={() =>
                            this.setState({ openAdvance: !openAdvance })
                          }
                        >
                          <Box mt={2}>
                            <Field
                              disabled={disableEditField}
                              name='gradeType'
                              as={TblSelect}
                              label={t('grade_type')}
                              placeholder={t('common:select')}
                              value={values.gradeType}
                              onChange={(e) =>
                                this.handleChange(
                                  'gradeType',
                                  Number(e.target.value)
                                )
                              }
                            >
                              <MenuItem value={1}>
                                {t('myCourses:graded')}
                              </MenuItem>
                              <MenuItem value={0}>
                                {t('myCourses:non_graded')}
                              </MenuItem>
                            </Field>
                          </Box>
                          <Box mt={2}>
                            <Field
                              name='allowRetake'
                              as={TblRadio}
                              disabled={disableEditField}
                              values={allowRetakeValues}
                              label={t('allow_retake')}
                              onChange={(e) =>
                                this.handleChange(
                                  'allowRetake',
                                  Number(e.target.value)
                                )
                              }
                              value={Number(values?.allowRetake)}
                            />
                          </Box>
                          <Box className='errorText'>
                            {!!(errors.allowRetake && touched.allowRetake)
                              ? errors.allowRetake
                              : false}
                          </Box>
                          {!!values?.allowRetake && (
                            <>
                              <Box mt={2}>
                                <Field
                                  as={TblInputs}
                                  disabled={disableEditField}
                                  name='numberOfDays'
                                  label={t('number_of_days')}
                                  inputType='number'
                                  decimalScale={0}
                                  value={values.numberOfDays}
                                  onChange={(e) =>
                                    this.handleChange(
                                      'numberOfDays',
                                      Number(e.target.value)
                                    )
                                  }
                                  isAllowed={validMinMaxInput(100)}
                                  // error={!!(errors.numberOfDays && (touched.numberOfDays || submitCount))}
                                  errorMessage={
                                    !!(
                                      errors.numberOfDays &&
                                      (touched.numberOfDays || submitCount)
                                    )
                                      ? errors.numberOfDays
                                      : false
                                  }
                                  required
                                />
                              </Box>
                              <Box mt={2}>
                                <Field
                                  as={TblInputs}
                                  disabled={disableEditField}
                                  name='maxRetakes'
                                  value={values.maxRetakes}
                                  label={t('max_retakes')}
                                  onChange={(e) =>
                                    this.handleChange(
                                      'maxRetakes',
                                      Number(e.target.value)
                                    )
                                  }
                                  inputType='number'
                                  required
                                  decimalScale={0}
                                  isAllowed={validMinMaxInput(100)}
                                  error={
                                    !!(
                                      errors.maxRetakes &&
                                      (touched.maxRetakes || submitCount)
                                    )
                                  }
                                  errorMessage={
                                    !!(
                                      errors.maxRetakes &&
                                      (touched.maxRetakes || submitCount)
                                    )
                                      ? errors.maxRetakes
                                      : false
                                  }
                                  // validate={(value) => {
                                  //   console.log('value', value);
                                  //   const havePublishShadow = currentQuiz.shadowQuizzes.some(shadow => shadow.status === QUIZ_STATUS.PUBLISHED);
                                  //   console.log('object :>> ', havePublishShadow);
                                  //   console.log('object',  Number(value) < currentQuiz.maxRetakes);
                                  //   const errMsg = havePublishShadow &&  Number(value) < currentQuiz.maxRetakes && currentQuiz.allowRetake
                                  //     ? t('myCourses:error_set_max_retake_lower')
                                  //     : '';
                                  //   console.log('errMsg', errMsg);
                                  //   setFieldError('maxRetakes', errMsg);
                                  //   setFieldTouched('maxRetakes', true);
                                  // }}                                  required
                                />
                              </Box>
                              <Box mt={2}>
                                <Field
                                  as={TblInputs}
                                  disabled={disableEditField}
                                  name='percentCredit'
                                  label={`${t('percent_credit')} (%)`}
                                  decimalScale={2}
                                  inputType='number'
                                  value={values.percentCredit}
                                  onChange={(e) =>
                                    this.handleChange(
                                      'percentCredit',
                                      Number(e.target.value)
                                    )
                                  }
                                  isAllowed={validMinMaxInput(10000)}
                                  // error={!!(errors.percentCredit && (touched.percentCredit || submitCount))}
                                  errorMessage={
                                    !!(
                                      errors.percentCredit &&
                                      (touched.percentCredit || submitCount)
                                    )
                                      ? errors.percentCredit
                                      : false
                                  }
                                  required
                                />
                              </Box>
                            </>
                          )}
                        </AdvanceOptions>
                      </Grid>
                    </Grid>
                  </Form>
                )}
              </TblDrawer>
            );
          }}
        </Formik>
        {visiblePublishDialog && currentQuiz && (
          <QuizDueTimeDialog
            visible={visiblePublishDialog}
            toggleCloseDialog={this.onCloseDialog}
            quizType={quizType}
          />
        )}

        <AddGradeWeightingPopup
          open={openGradeWeighting}
          onClose={() => this.setState({ openGradeWeighting: false })}
        />
        {
          !isViewOnly &&
          <TblTour
            steps={tourConfig}
            isOpen={openTour}
            lastStepNextButton={
              <TblButton onClick={this.updateBehavior}>
                {t('tour:benefits_acknowledged')}
              </TblButton>
            }
          />
        }
      </>
    );
  }
}

CreateEditQuiz.propTypes = {
  quizInfo: PropTypes.object,
  quizId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  error: PropTypes.object,
  currentQuiz: PropTypes.object,
  orgId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  t: PropTypes.func,
  onClose: PropTypes.func,
  getGradeWeight: PropTypes.func,
  isVisible: PropTypes.bool,
  editQuizSuccess: PropTypes.bool,
  createQuizSuccess: PropTypes.bool,
  gradeWeight: PropTypes.array,
  unitId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  courseId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  currentUser: PropTypes.object,
  quizType: PropTypes.number,
  createQuiz: PropTypes.func,
  getQuiz: PropTypes.func,
  enqueueSnackbar: PropTypes.func,
  myCoursesSetState: PropTypes.func,
  editQuiz: PropTypes.func,
  updateMasterItem: PropTypes.func,
  getCourseItemByUnit: PropTypes.func,
  updateMyProfile: PropTypes.func,
  permission: PropTypes.array,
  quizViewData: PropTypes.object,
  isViewOnly: PropTypes.bool,
  match: PropTypes.object,
};

CreateEditQuiz.defaultProps = {
  isViewOnly: false,
};

const mapStateToProps = (state, ownProps) => ({
  currentUser: state.Auth.currentUser,
  gradeWeight: state.AllCourses?.gradeWeight,
  createQuizSuccess: state.AllCourses?.createQuizSuccess,
  editQuizSuccess: state.AllCourses?.editQuizSuccess,
  currentQuiz: state.AllCourses?.currentQuiz || ownProps.quizViewData,
  error: state.AllCourses?.error,
  permission: state.AllCourses?.permission,
});
const mapDispatchToProps = (dispatch) => ({
  getGradeWeight: (payload) =>
    dispatch(myCoursesActions.mcGetGradeWeight(payload)),
  createQuiz: (payload) => dispatch(myCoursesActions.mcCreateQuiz(payload)),
  myCoursesSetState: (payload) =>
    dispatch(myCoursesActions.myCoursesSetState(payload)),
  getQuiz: (payload) => dispatch(myCoursesActions.mcGetQuiz(payload)),
  editQuiz: (payload) => dispatch(myCoursesActions.mcEditQuiz(payload)),
  updateMyProfile: (payload) =>
    dispatch(myProfileActions.updateMyProfile(payload)),
});
export default compose(
  withTranslation(['myCourses', 'common'], { withRef: true }),
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
  withSnackbar
)(CreateEditQuiz);
