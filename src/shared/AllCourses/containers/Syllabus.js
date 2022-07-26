import React from 'react';
import { connect } from 'react-redux';

import debounce from 'lodash/debounce';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import trim from 'lodash/trim';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';

import TblEditor from 'components/TblEditor';
import TblInputs from 'components/TblInputs';

import { TEACHER } from 'utils/roles';

import MediaWithReducer from 'shared/Media/containers';

import { withSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { checkPermission, replaceHTMLTag } from 'utils';

import allCoursesActions from '../../../modules/MyCourses/actions';

const ROLES_UPDATE = [TEACHER];
class Syllabus extends React.PureComponent {
  constructor(props) {
    super(props);
    const { t } = props;
    this.state = {
      syllabus: {},
      openMedia: false,
      mediaType: 'image',
      acceptType: 'image/*',
      errors: {},
    };
    this.getSyllabus();
    this.requiredFields = {
      description: 1,
      homeworkExpectations: 1,
      participationExpectations: 1,
    };
    this.editorFields = [
      {
        name: 'homeworkExpectations',
        label: t('myCourses:homework_expectations'),
        required: true,
      },
      {
        name: 'participationExpectations',
        label: t('myCourses:participation_expectations'),
        required: true,
      },
      {
        name: 'courseGoals',
        label: t('myCourses:course_goals'),
      },
      {
        name: 'prerequisites',
        label: t('myCourses:prerequisites'),
      },
    ];
    this.editorSelected = null;
    this.buttons = {
      insertImage: {
        onClick: this.insertImage,
      },
    };
  }

  static getDerivedStateFromProps(props, state) {
    const newState = {};
    if (isEmpty(state.syllabus) && !isEqual(props.syllabus, state.syllabus)) {
      newState.syllabus = { ...props.syllabus };
    }
    if (isEmpty(newState)) {
      return null;
    }
    return newState;
  }

  getSyllabus = () => {
    const { match, authContext } = this.props;
    const { organizationId } = authContext.currentUser;
    if (match.params.courseId) {
      this.props.getSyllabus({
        orgId: organizationId,
        courseId: match.params.courseId,
        syllabusFetching: true,
      });
    }
  };

  componentDidUpdate(prevProps) {
    if (
      this.props.updateSyllabusSuccess &&
      this.props.updateSyllabusSuccess !== prevProps.updateSyllabusSuccess
    ) {
      this.props.enqueueSnackbar(this.props.t('common:change_saved'), {
        variant: 'success',
      });
    }
  }

  componentWillUnmount() {
    this.props.setState({ syllabus: null });
  }

  updateSyllabus = () => {};

  onChange = (e) => {
    const { syllabus, errors } = this.state;
    const { t } = this.props;
    syllabus[e.target.name] = e.target.value;
    errors[e.target.name] = '';
    if (!trim(e.target.value)) {
      errors[e.target.name] = t('common:required_message');
    }
    this.setState({ syllabus: { ...syllabus }, errors });
  };

  onEditorChange = (name) => (value) => {
    const { syllabus, errors } = this.state;
    const { t } = this.props;
    syllabus[name] = value;
    const trimValue = replaceHTMLTag(value);
    errors[name] = '';
    if (!trimValue) {
      errors[name] = t('common:required_message');
      this.setState({ syllabus: { ...syllabus }, errors });
    }
  };

  onSave = (name) => () => {
    const { match, authContext, t } = this.props;
    const { organizationId } = authContext.currentUser;
    const { syllabus, errors } = this.state;
    const trimValue = replaceHTMLTag(syllabus[name]);
    if ((!trim(syllabus[name]) || !trimValue) && this.requiredFields[name]) {
      errors[name] = t('common:required_message');
      this.setState({ errors: { ...errors } });
      return;
    }
    if (syllabus[name] !== this.props.syllabus[name]) {
      this.props.updateSyllabus({
        orgId: organizationId,
        courseId: match.params.courseId,
        updateSyllabusSuccess: false,
        syllabus: {
          [name]: syllabus[name],
        },
      });
    }
  };

  onAbort = (name) => () => {
    const { syllabus } = this.state;
    syllabus[name] = this.props.syllabus[name];
    this.setState({ syllabus: { ...syllabus } });
  };

  // insertImage = (callback) => {
  //   // callback();
  //   // console.log(callback);
  //   this.setState({ openMedia: true, mediaCallack: callback, mediaAction: 'insertImage' });
  // }

  // onMediaClose = () => {
  //   this.setState({ openMedia: false, mediaCallack: null });
  // };

  // handleMediaSelect = (media) => {
  //   const { mediaCallack, mediaAction } = this.state;
  //   // console.log(callback);
  //   if (mediaAction === 'insertImage') {
  //     mediaCallack(media.url);
  //   }
  //   this.setState({ mediaCallack: null });
  // };

  onEditorClickInside = (inputRef) => {
    this.editorSelected = inputRef.current.getEditor();
  };

  onSaveEditor = (name) => (event, inputRef) => {
    const content = inputRef.current.getContent();
    const { match, authContext, t } = this.props;
    const { organizationId } = authContext.currentUser;
    const { syllabus, errors } = this.state;
    const trimValue = replaceHTMLTag(content);
    const hasError =
      (!trim(content) || !trimValue) && this.requiredFields[name];
    syllabus[name] = content;
    errors[name] = hasError ? t('common:required_message') : '';
    this.setState({ errors: { ...errors }, syllabus: { ...syllabus } });
    if (hasError) {
      return;
    }
    if (content !== this.props.syllabus[name]) {
      this.setState({ syllabus: { ...syllabus } });
      this.props.updateSyllabus({
        orgId: organizationId,
        courseId: match.params.courseId,
        updateSyllabusSuccess: false,
        syllabus: {
          [name]: content,
        },
      });
    }
  };

  onAbortEditor = (name) => (event, inputRef) => {
    const editor = inputRef.current.getEditor();
    const { syllabus, errors } = this.state;
    syllabus[name] = this.props.syllabus[name];
    errors[name] = '';
    editor.setContent(syllabus[name]);
    this.setState({ syllabus: { ...syllabus }, errors: { ...errors } });
  };

  insertImage = (editor, value, insertImage) => {
    this.editorSelected = editor;
    this.setState({
      openMedia: true,
      mediaAction: 'insertImage',
      mediaCallback: insertImage,
    });
  };

  onMediaClose = () => {
    this.setState({ openMedia: false });
  };

  handleMediaSelect = (media) => {
    const { mediaAction, mediaCallback } = this.state;
    if (mediaAction === 'insertImage' && mediaCallback) {
      mediaCallback(this.editorSelected, media.url);
    }
  };

  render() {
    const { t, syllabusFetching, className, permission, authContext } =
      this.props;
    const { syllabus, errors, openMedia, mediaType, acceptType } = this.state;
    const hasPermission =
      permission === true
        ? true
        : permission === false
        ? false
        : checkPermission(permission || authContext.currentUser, ROLES_UPDATE);
    if (syllabusFetching) {
      return (
        <>
          <Skeleton variant='text' animation='wave' />
          <Skeleton variant='rectangular' height='250px' animation='wave' />
          <Skeleton variant='text' animation='wave' />
        </>
      );
    }

    const { description, officeHours } = syllabus;
    return (
      <Grid container display='flex' direction='column' className={className}>
        <MediaWithReducer
          visible={openMedia}
          onClose={this.onMediaClose}
          onSelect={this.handleMediaSelect}
          accept={acceptType}
          mediaType={mediaType}
        />
        <Box width='100%'>
          <TblInputs
            required
            name='description'
            singleSave
            value={description || ''}
            disabled={!hasPermission}
            onAbort={this.onAbort('description')}
            onSave={this.onSave('description')}
            onChange={this.onChange}
            error={!!errors.description}
            errorMessage={errors.description}
            placeholder={t('myCourses:course_description')}
            label={t('myCourses:course_description')}
            noneMarginBottom={true}
          />
        </Box>
        {this.editorFields.map((item, index) => {
          const { label, name, required } = item;
          return (
            <Box key={index} width='100%' mb={0.5}>
              <TblEditor
                autoSave
                required={required}
                label={label}
                defaultValue={`${syllabus[name] || ''}`}
                height={200}
                disabled={!hasPermission}
                customButtons={this.buttons}
                error={{
                  hasError: !!errors[name],
                  errorMessage: errors[name],
                }}
                handleClickInside={this.onEditorClickInside}
                onSave={this.onSaveEditor(`${name}`)}
                onAbort={this.onAbortEditor(`${name}`)}
                validation={debounce((value) => {
                  const { errors } = this.state;
                  const trimValue = replaceHTMLTag(value);
                  const errMsg =
                    !trimValue && required ? t('common:required_message') : '';
                  errors[name] = errMsg;
                  this.setState({ errors: { ...errors } });
                }, 500)}
              />
            </Box>
          );
        })}
        {/* <Editor
        onChange={this.onEditorChange('homeworkExpectations')}
        required name='homework_expectations'
        insertImage={this.insertImage}
        value={homeworkExpectations}
        readOnly={!hasPermission}
        onAbort={this.onAbort('homeworkExpectations')}
        onSave={this.onSave('homeworkExpectations')}
        errorMessage={errors.homeworkExpectations}
        label={t('myCourses:homework_expectations')} />
      <Editor
        required
        onChange={this.onEditorChange('participationExpectations')}
        value={participationExpectations}
        errorMessage={errors.participationExpectations}
        insertImage={this.insertImage}
        readOnly={!hasPermission}
        onAbort={this.onAbort('participationExpectations')}
        onSave={this.onSave('participationExpectations')}
        name='participation_expectations'
        label={t('myCourses:participation_expectations')}
      />
      <Editor
        onChange={this.onEditorChange('courseGoals')}
        onAbort={this.onAbort('courseGoals')}
        onSave={this.onSave('courseGoals')}
        name='course_goals'
        insertImage={this.insertImage}
        value={courseGoals}
        readOnly={!hasPermission}
        label={t('myCourses:course_goals')}
      />
      <Editor
        name='prerequisites'
        onChange={this.onEditorChange('prerequisites')}
        onAbort={this.onAbort('prerequisites')}
        insertImage={this.insertImage}
        onSave={this.onSave('prerequisites')}
        value={prerequisites}
        readOnly={!hasPermission}
        label={t('myCourses:prerequisites')} /> */}
        <Box width='100%'>
          <TblInputs
            placeholder={t('myCourses:office_hours')}
            singleSave
            name='officeHours'
            onAbort={this.onAbort('officeHours')}
            onSave={this.onSave('officeHours')}
            value={officeHours || ''}
            disabled={!hasPermission}
            onChange={this.onChange}
            label={t('myCourses:office_hours')}
          />
        </Box>
      </Grid>
    );
  }
}
Syllabus.propTypes = {
  t: PropTypes.func,
  syllabusFetching: PropTypes.bool,
  getSyllabus: PropTypes.func,
  setState: PropTypes.func,
  updateSyllabus: PropTypes.func,
  enqueueSnackbar: PropTypes.func,
  updateSyllabusSuccess: PropTypes.bool,
  match: PropTypes.object,
  syllabus: PropTypes.object,
  permission: PropTypes.object,
  className: PropTypes.string,
  authContext: PropTypes.object,
};
const mapStateToProps = (state) => ({
  syllabus:
    state.MyCourses?.syllabus ||
    state.ManageCourseTemplate?.templateDetail?.syllabus,
  syllabusFetching: state.MyCourses?.syllabusFetching,
  updateSyllabusSuccess: state.MyCourses?.updateSyllabusSuccess,
});
const mapDispatchToProps = (dispatch) => ({
  getSyllabus: (payload) => dispatch(allCoursesActions.mcGetSyllabus(payload)),
  setState: (payload) => dispatch(allCoursesActions.myCoursesSetState(payload)),
  updateSyllabus: (payload) =>
    dispatch(allCoursesActions.mcUpdateSyllabus(payload)),
});
export default flowRight(
  connect(mapStateToProps, mapDispatchToProps),
  withSnackbar
)(Syllabus);
