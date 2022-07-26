import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import compose from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import isNil from 'lodash/isNil';
import trim from 'lodash/trim';

import { Typography } from '@mui/material';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';

import TblDrawer from 'components/TblDrawer';
import TblEditor from 'components/TblEditor';
import TblInputs from 'components/TblInputs';
import withReducer from 'components/TblWithReducer';
import FormActions from 'shared/MyCourses/components/FormActions';

import { MAX_GOOGLE_UPLOAD_FILES } from 'utils/constants';
import { TEACHER } from 'utils/roles';

import Attachment from 'shared/Attachments/Attachment';
import googleActions from 'shared/Google/actions';
import lessonActions from 'shared/Lesson/actions';
import MediaWithReducer from 'shared/Media/containers';
import LinkedContents from 'shared/MyCourses/containers/LinkedContents';

import { Field, Form, Formik } from 'formik';
import myCourseActions from 'modules/MyCourses/actions';
import { withSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { checkPermission, replaceHTMLTag } from 'utils';
import * as Yup from 'yup';

import { filterGoogleFileSelected } from '../../Google/utils';
import GoogleAttachment from '../../MyCourses/components/GoogleAttachment';
import LessonDueTimeDialog from '../components/DueTimeDialog/LessonDueTimeDialog';
import FormSkeleton from '../components/FormSkeleton';
import { TYPE_OF_CREATE } from '../constants';
import epics from '../epics';
import reducers from '../reducers';
import { checkPermissionCreateAndPublish } from '../utils';

const ROLES_CREATE_UPDATE = [TEACHER];
class ManageLesson extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isVisibleMedia: false,
      mediaType: 'image',
      acceptType: 'image/*',
      teacherList: [],
      // primaryTeacher: {},
      // assistantTeachers: [],
      linkContents: {
        assignmentLinkIds: [],
        lessonLinkIds: [],
        quizLinkIds: [],
      },
      typeOfCreate: 0,
      isSetLinkContentInTheFirstTime: true,
      visiblePublishDialog: false,
      attachments: [],
    };
  }

  drawerRef = React.createRef(null);

  static getDerivedStateFromProps(props, state) {
    let newState = {};
    if (
      !isEqual(props?.primaryTeacher, state.primaryTeacher) ||
      !isEqual(props?.assistantTeachers, state.assistantTeachers)
    ) {
      const teacherList = []
        .concat(props.primaryTeacher)
        .concat(props.assistantTeachers);
      Object.assign(newState, {
        teacherList,
        primaryTeacher: props.primaryTeacher,
        assistantTeachers: props.assistantTeachers,
      });
    }

    if (
      !isEmpty(props.lessonDetail?.linkContents) &&
      !isEqual(props.lessonDetail?.linkContents, state.linkContents) &&
      state.isSetLinkContentInTheFirstTime
    ) {
      Object.assign(newState, {
        linkContents: props.lessonDetail?.linkContents,
        isSetLinkContentInTheFirstTime: false,
      });
    }
    if (
      !isEmpty(props.lessonDetail?.googlAttachments) &&
      !isEqual(props.lessonDetail?.googlAttachments, state.googlAttachments)
    ) {
      Object.assign(newState, {
        googlAttachments: props.lessonDetail?.googlAttachments,
      });
    }
    return !isEmpty(newState) ? newState : null;
  }

  componentDidUpdate(prevProps) {
    const {
      t,
      error,
      isCreateNewLessonSuccess,
      lessonInfo,
      isEditLessonSuccess,
      unit,
      updateMasterItem,
      getCourseItemByUnit,
    } = this.props;
    if (this.props.isVisible && this.props.isVisible !== prevProps.isVisible) {
      this.getTeachersInCourse();
      this.getLessonDetail();
    }
    if (
      (prevProps.isCreatingLesson && isCreateNewLessonSuccess) ||
      (prevProps.isEditingLesson && isEditLessonSuccess)
    ) {
      if (isEmpty(error)) {
        if (isEmpty(lessonInfo)) {
          this.props.enqueueSnackbar(
            t('common:object_created', { objectName: 'Lesson' }),
            { variant: 'success' }
          );
        } else {
          this.props.enqueueSnackbar(t('common:change_saved'), {
            variant: 'success',
          });
        }
      }
    }
    if (isCreateNewLessonSuccess || isEditLessonSuccess) {
      if (this.props.updateUnit) {
        const { unit } = this.props;
        this.props.updateUnit(unit?.id);
      }
      switch (this.state.typeOfCreate) {
        case TYPE_OF_CREATE.CREATE_AS_DRAFT:
          this.onCloseDrawer();
          break;
        case TYPE_OF_CREATE.CREATE_AND_PUBLISH:
          this.setState({
            visiblePublishDialog: true,
          });
          if (this.formikRef) {
            this.formikRef.resetForm();
          }
          this.props.onCloseDrawer();
          this.props.resetStateLesson({
            error: null,
            isCreateNewLessonSuccess: null,
            isEditLessonSuccess: null,
          });
          break;
        default:
          break;
      }
      this.props.resetStateLesson({
        isCreateNewLessonSuccess: false,
        isEditLessonSuccess: false,
      });
    }
    if (
      prevProps.isEditingLesson &&
      isEditLessonSuccess &&
      lessonInfo?.page === 'plan' &&
      unit?.id
    ) {
      if (
        updateMasterItem &&
        (lessonInfo?.planned || lessonInfo?.courseDayId)
      ) {
        updateMasterItem(
          lessonInfo?.courseDayId ?? lessonInfo?.course_day?.id,
          'none',
          unit?.id
        );
      }
      if (getCourseItemByUnit && !lessonInfo?.planned) {
        getCourseItemByUnit();
      }
    }
  }

  componentWillUnmount() {
    this.props.resetStateLesson({
      isCreateNewLessonSuccess: false,
      isEditLessonSuccess: false,
    });
  }

  getLessonDetail = () => {
    const {
      currentUser: { organizationId },
      courseId,
      lessonInfo,
      unit,
    } = this.props;
    if (
      !isNil(organizationId) &&
      !isNil(courseId) &&
      !isEmpty(unit) &&
      !isEmpty(lessonInfo)
    ) {
      this.props.getLessonDetail({
        orgId: organizationId,
        courseId,
        unitId: unit?.id,
        lessonId: lessonInfo?.id,
        isFetchingLessonDetail: true,
        error: {},
      });
    }
  };

  getTeachersInCourse = () => {
    const {
      currentUser: { organizationId },
      courseId,
    } = this.props;
    if (!!organizationId && !!courseId) {
      this.props.getTeacherOfCourse({
        orgId: organizationId,
        courseId,
        urlParams: {
          attribute: 'teacher',
        },
        isBusyGetTeacherOfCourse: true,
      });
    }
  };

  onCloseDrawer = () => {
    if (this.formikRef) {
      this.formikRef.resetForm();
    }
    this.props.resetStateLesson({ error: {}, lessonDetail: {} });
    this.props.onCloseDrawer();
  };

  onCloseDialog = () => {
    this.setState({
      visiblePublishDialog: false,
    });
  };

  getTeacherListWithoutSelectedTeacher = (id = -1) => {
    const { teacherList } = this.state;
    const newList = teacherList?.filter((item) => item.id !== id);
    return newList;
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
    const { lessonInfo, lessonDetail } = this.props;
    const { primaryTeacher, teacherList } = this.state;
    let initialValues = {
      lessonName: '',
      // description: '',
      lessonContent: '',
      duration: '',
      teacher: !isEmpty(primaryTeacher) ? primaryTeacher : null,
      teachingAssistant: null,
      googleFiles: [],
    };
    if (!isEmpty(lessonInfo) && !isEmpty(lessonDetail)) {
      const teacher =
        teacherList.find((item) => item?.id === lessonDetail?.teacher?.id) ||
        null;
      const teachingAssistant =
        teacherList.find(
          (item) => item?.id === lessonDetail?.teachingAssistant?.id
        ) || null;
      Object.assign(initialValues, {
        ...lessonDetail,
        teacher,
        teachingAssistant,
      });
    }
    return { ...initialValues };
  };

  validMinMaxInput = (values) =>
    values.formattedValue === '' ||
    (values.floatValue > 0 && values.floatValue <= 10000);

  handleSubmit = (values) => {
    const lesson = { ...values };
    const { lessonInfo, unit } = this.props;
    const {
      currentUser: { organizationId },
      courseId,
    } = this.props;
    if (!isEmpty(lessonInfo)) {
      this.props.editLesson({
        orgId: organizationId,
        courseId,
        unitId: unit?.id,
        lessonId: lessonInfo?.id,
        lesson,
        isEditingLesson: true,
        error: {},
      });
    } else {
      this.props.createNewLesson({
        orgId: organizationId,
        courseId,
        unitId: unit?.id,
        lesson,
        isCreatingLesson: true,
        error: {},
      });
    }
  };

  onChangeLinkContents = (linkContents) => {
    this.setState({ linkContents });
  };

  handleChange = (fieldName, value) => {
    if (this.formikRef) {
      this.formikRef.setFieldValue(fieldName, value);
      this.formikRef.setFieldTouched(fieldName, true);
    }
  };
  onAttachFile = (files) => {
    this.setState({
      attachments: files,
    });
  };

  render() {
    const {
      isVisibleMedia,
      acceptType,
      mediaType,
      linkContents,
      visiblePublishDialog,
      typeOfCreate,
    } = this.state;
    const {
      t,
      lessonInfo,
      isCreatingLesson,
      unit,
      error,
      isEditingLesson,
      lessonDetail,
      isVisible,
      isFetchingLessonDetail,
      permission,
      isViewOnly,
      courseId,
    } = this.props;
    const havePermissionPublish = checkPermissionCreateAndPublish(permission);
    const validationSchema = Yup.object().shape({
      lessonName: Yup.string().trim().required(t('common:required_message')),
      duration: Yup.mixed().test(
        'is-required',
        t('common:required_message'),
        (value) => !!value
      ),
      lessonContent: Yup.mixed().test(
        'is-required',
        t('common:required_message'),
        (value) => !!trim(replaceHTMLTag(value))
      ),
    });
    const hasPermission = checkPermission(permission, ROLES_CREATE_UPDATE);
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
          enableReinitialize={true}
          validationSchema={validationSchema}
          validateOnChange={false}
          validateOnBlur={true}
          onSubmit={(values) => {
            const teacherId = values.teacher?.id ?? null;
            const teachingAssistantId = values.teachingAssistant?.id ?? null;
            const newValues = { ...values };
            delete newValues.teacher;
            delete newValues.teachingAssistant;
            const payload = Object.assign(newValues, {
              teacherId,
              teachingAssistantId,
              duration: values.duration ? Number(values.duration) : null,
              lessonName: trim(values.lessonName),
              description:
                replaceHTMLTag(values.description) === ''
                  ? ''
                  : values.description,
              lessonContent:
                replaceHTMLTag(values.lessonContent) === ''
                  ? ''
                  : values.lessonContent,
            });
            this.handleSubmit({
              metadata: payload,
              linkContents,
              googleFiles: values.googleFiles,
              attachments: {
                mediaId: values.attachments?.map((file) => file.id) || [],
              },
            });
          }}
        >
          {({
            values,
            errors,
            touched,
            setFieldValue,
            handleSubmit,
            submitCount,
          }) => (
            <TblDrawer
              ref={this.drawerRef}
              open={isVisible}
              anchor={'right'}
              title={
                isFetchingLessonDetail ? (
                  <Skeleton variant='text' />
                ) : !isEmpty(lessonInfo) ? (
                  lessonInfo?.name
                ) : (
                  t('create_a_lesson')
                )
              }
              footer={
                <FormActions
                  isCreate={isEmpty(lessonInfo)}
                  disabled={isCreatingLesson || isEditingLesson}
                  isViewOnly={isViewOnly}
                  onCloseDrawer={this.onCloseDrawer}
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
              {isFetchingLessonDetail ? (
                <FormSkeleton />
              ) : (
                <Form>
                  {!isEmpty(error) && (
                    <Box mb={2}>
                      <Alert severity='error'>{error?.message}</Alert>
                    </Box>
                  )}
                  <Grid container spacing={3}>
                    <Grid item xs={9}>
                      <Field
                        name='lessonName'
                        as={TblInputs}
                        inputProps={{ maxLength: 254 }}
                        label={t('lesson_name')}
                        required
                        disabled={!hasPermission}
                        error={
                          !!(
                            errors.lessonName &&
                            (touched.lessonName || submitCount)
                          )
                        }
                        errorMessage={
                          !!(
                            errors.lessonName &&
                            (touched.lessonName || submitCount)
                          )
                            ? errors.lessonName
                            : false
                        }
                        onChange={(e) =>
                          this.handleChange('lessonName', e.target.value)
                        }
                      />
                      {/**NOTE: Section 5 in TL-3330 */}
                      <Box mt={2}>
                        <Field
                          disabled={!hasPermission}
                          name='lessonContent'
                          as={TblEditor}
                          label={t('common:description')}
                          required
                          customButtons={{
                            insertImage: {
                              onClick: this.insertImage,
                            },
                          }}
                          defaultValue={values.lessonContent}
                          placeholder={t('lesson_description_placeholder')}
                          error={{
                            hasError: !!(
                              errors.lessonContent &&
                              (touched.lessonContent || submitCount)
                            ),
                            errorMessage: !!(
                              errors.lessonContent &&
                              (touched.lessonContent || submitCount)
                            )
                              ? errors.lessonContent
                              : '',
                          }}
                          onBlur={() => {}}
                          onChange={(content) => {
                            const trimValue = replaceHTMLTag(content);
                            if (
                              touched.lessonContent ||
                              trimValue ||
                              !isEmpty(lessonInfo)
                            ) {
                              this.handleChange('lessonContent', content);
                            }
                            if (!trimValue) {
                              this.handleChange('lessonContent', '');
                            }
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
                          hasPermission={hasPermission}
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
                          disabled={isViewOnly}
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
                            subtitle={t('choose_courses_activities', {
                              type: 'Lesson',
                            })}
                            courseActivityInfo={lessonDetail}
                            unit={unit}
                            initialLinkedContents={lessonDetail?.linkContents}
                            updateData={(linkContents) =>
                              this.onChangeLinkContents(linkContents)
                            }
                            courseIdProp={courseId}
                            viewOnly={!hasPermission}
                          />
                        </Box>
                      )}
                    </Grid>
                    <Grid item xs={3}>
                      {/* <Field
                        keyValue='name'
                        disabled={!hasPermission}
                        forcePopupIcon={hasPermission}
                        name='teacher'
                        as={TblAutocomplete}
                        label={t('teacher')}
                        required
                        options={this.getTeacherListWithoutSelectedTeacher(
                          values.teachingAssistant?.id
                        )}
                        // getOptionLabel={(option) => option?.name ?? ''}
                        onChange={(e, value) => {
                          if (!isNull(value)) setFieldValue('teacher', value);
                        }}
                        // renderInput={(params) => <TextField {...params} placeholder='Select' variant='outlined' />}
                      />
                      <Box mt={2}>
                        <Field
                          keyValue='name'
                          disabled={!hasPermission}
                          name='teachingAssistant'
                          as={TblAutocomplete}
                          forcePopupIcon={hasPermission}
                          label={t('teaching_assistant')}
                          options={this.getTeacherListWithoutSelectedTeacher(
                            values.teacher?.id
                          )}
                          // getOptionLabel={(option) => option?.name ?? ''}
                          onChange={(e, value) =>
                            this.handleChange('teachingAssistant', value)
                          }
                          // renderInput={(params) => <TextField {...params} placeholder='Select' variant='outlined' />}
                        />
                      </Box> */}
                      {/* <Box mt={2}> */}
                      <Field
                        disabled={!hasPermission}
                        name='duration'
                        as={TblInputs}
                        label={t('duration_mins')}
                        inputType='number'
                        decimalScale={0}
                        error={
                          !!(
                            errors.duration &&
                            (touched.duration || submitCount)
                          )
                        }
                        errorMessage={
                          !!(
                            errors.duration &&
                            (touched.duration || submitCount)
                          )
                            ? errors.duration
                            : false
                        }
                        isAllowed={this.validMinMaxInput}
                        required
                        onChange={(e) =>
                          this.handleChange('duration', Number(e.target.value))
                        }
                      />
                      {/* </Box> */}
                    </Grid>
                  </Grid>
                </Form>
              )}
            </TblDrawer>
          )}
        </Formik>

        {visiblePublishDialog && (
          <LessonDueTimeDialog
            visible={visiblePublishDialog}
            toggleCloseDialog={this.onCloseDialog}
          />
        )}
      </>
    );
  }
}

ManageLesson.propTypes = {
  lessonInfo: PropTypes.object,
  currentUser: PropTypes.object,
  createNewLesson: PropTypes.func,
  t: PropTypes.func,
  getTeacherOfCourse: PropTypes.func,
  courseId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isCreateNewLessonSuccess: PropTypes.bool,
  error: PropTypes.object,
  isCreatingLesson: PropTypes.bool,
  enqueueSnackbar: PropTypes.func,
  resetStateLesson: PropTypes.func,
  primaryTeacher: PropTypes.object,
  assistantTeachers: PropTypes.array,
  unit: PropTypes.object,
  getLessonDetail: PropTypes.func,
  lessonDetail: PropTypes.object,
  isEditLessonSuccess: PropTypes.bool,
  isEditingLesson: PropTypes.bool,
  editLesson: PropTypes.func,
  onCloseDrawer: PropTypes.func,
  isVisible: PropTypes.bool,
  updateUnit: PropTypes.func,
  isFetchingLessonDetail: PropTypes.bool,
  permission: PropTypes.object,
  updateMasterItem: PropTypes.func,
  getCourseItemByUnit: PropTypes.func,
  lessonViewData: PropTypes.object,
  isViewOnly: PropTypes.bool,
};

ManageLesson.defaultProps = {
  lessonInfo: {},
  lesson: {},
  isViewOnly: false,
};

const mapStateToProps = (state, ownProps) => ({
  currentUser: state.Auth.currentUser,
  primaryTeacher: state.AllCourses?.primaryTeacher,
  assistantTeachers: state.AllCourses?.assistantTeachers,
  isCreateNewLessonSuccess: state.AllCourses?.isCreateNewLessonSuccess,
  isCreatingLesson: state.AllCourses?.isCreatingLesson,
  error: state.AllCourses?.error,
  lessonDetail: !isEmpty(state.Lesson?.lessonDetail)
    ? state.Lesson?.lessonDetail
    : ownProps.lessonViewData,
  isEditingLesson: state.AllCourses?.isEditingLesson,
  isEditLessonSuccess: state.AllCourses?.isEditLessonSuccess,
  isFetchingLessonDetail: state.AllCourses?.isFetchingLessonDetail,
  permission: state.AllCourses?.permission,
});
const mapDispatchToProps = (dispatch) => ({
  getTeacherOfCourse: (payload) =>
    dispatch(myCourseActions.getTeacherOfCourse(payload)),
  createNewLesson: (payload) =>
    dispatch(lessonActions.createNewLesson(payload)),
  resetStateLesson: (payload) =>
    dispatch(lessonActions.resetStateLesson(payload)),
  getLessonDetail: (payload) =>
    dispatch(lessonActions.getLessonDetail(payload)),
  editLesson: (payload) => dispatch(lessonActions.editLesson(payload)),
  openAuth: (payload) => dispatch(googleActions.getGoogleOauthUrl(payload)),
});

export default compose(
  withReducer('Lesson', reducers, null, epics),
  withTranslation(['myCourses', 'common']),
  connect(mapStateToProps, mapDispatchToProps)
)(withSnackbar(ManageLesson));
