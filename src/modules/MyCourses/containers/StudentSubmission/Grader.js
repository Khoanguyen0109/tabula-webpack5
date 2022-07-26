import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import findIndex from 'lodash/findIndex';
import compose from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import GetAppIcon from '@mui/icons-material/GetApp';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import withStyles from '@mui/styles/withStyles';
import withTheme from '@mui/styles/withTheme';

import PreviewFile from 'components/PreviewFile';
import TblActivityIcon from 'components/TblActivityIcon/icon';
import TblDialog from 'components/TblDialog';
import TblIconButton from 'components/TblIconButton';
import UserInfoCard from 'components/TblSidebar/UserInfoCard';
import { expandStatus as TblStatus } from 'components/TblStatus';

import { COURSE_ITEM_TYPE } from 'utils/constants';
import { getMaterialIconByExt } from 'utils/getMaterialIconByExt';

import CommonActions from 'shared/Common/actions';

import { withSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { splitNameAndExtension } from 'utils';

import MyCoursesActions from '../../actions';
import {
  STATUS_STUDENT_ASSIGNMENT_IN_SUBMISSION_LIST,
  STUDENT_PROGRESS_STATUS,
} from '../../constants';

const styles = (theme) => ({
  title: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(2.5, 3),
    boxShadow: '0 2px 6px 0 rgba(0, 0, 0, 0.16)',
  },
  closeButton: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  graderContentContainer: {
    display: 'flex',
  },
  previewFileContainer: {
    width: 'calc(100vw - 377px)',
    overflow: 'auto',
    height: 'calc(100vh - 80px)',
  },
  fileSubmissionContainer: {
    width: theme.spacing(39),
    '& .student-information': {
      height: theme.spacing(15),
      padding: theme.spacing(3, 0, 2, 3),
      '& .avatar': {
        width: theme.spacing(6),
        height: theme.spacing(6),
      },
    },
    '& .file-submission-list': {
      padding: theme.spacing(2, 3),
      height: `calc(100% - ${theme.spacing(15)})`,
      backgroundColor: theme.newColors.gray[100],
    },
  },
  navigationContainer: {
    width: theme.spacing(7.125),
    padding: theme.spacing(3, 1.5),
    borderLeft: `1px solid ${theme.newColors.gray[300]}`,
  },
  fileSubmissionItem: {
    height: theme.spacing(5.5),
    padding: theme.spacing(1.25, 1),
    cursor: 'pointer',
    borderRadius: theme.spacing(1),
    '&:hover': {
      backgroundColor: theme.newColors.gray[300],
      '& .icon': {
        '&.download-icon': {
          visibility: 'visible',
        },
      },
    },
    '& .icon': {
      fontSize: theme.fontSizeIcon.medium,
      display: 'flex',
      justifyContent: 'center',
      '&.download-icon': {
        visibility: 'hidden',
      },
    },
    '& .file-name': {
      marginLeft: theme.spacing(1),
      maxWidth: theme.spacing(20),
    },
  },
  selectedItem: {
    backgroundColor: theme.openColors.white,
    color: theme.mainColors.primary2[0],
  },
  noneText: {
    color: theme.newColors.gray[700],
  },
});

class Grader extends React.PureComponent {
  state = {
    selectedAttachment: {},
    currentStudentIndex: -1,
    studentId: -1,
    graderInfo: {},
    shadowAssignmentId: -1,
  };

  static getDerivedStateFromProps(props, state) {
    let newState = {};
    if (!isEqual(props.graderInfo, state.graderInfo)) {
      const currentStudentIndex = findIndex(
        props.studentList,
        (obj) => obj.studentId === props.graderInfo?.studentId
      );
      Object.assign(newState, {
        currentStudentIndex:
          currentStudentIndex > -1 ? currentStudentIndex + 1 : 1,
        graderInfo: props.graderInfo,
        studentId: props.graderInfo?.studentId,
        shadowAssignmentId: props.graderInfo?.shadowAssignmentId,
      });
    }
    if (!isEmpty(newState)) {
      return newState;
    }
    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    const { open, mcGetGraderDetailSuccess, graderDetail, error } = this.props;
    if (
      (open && open !== prevProps.open) ||
      prevState.currentStudentIndex !== this.state.currentStudentIndex
    ) {
      this.getGraderDetail();
      this.props.resetFilePreview();
    }
    if (prevProps.isFetchingGraderDetail) {
      if (mcGetGraderDetailSuccess) {
        this.initialSelectedAttachment(graderDetail);
      }
      if (!isEmpty(error)) {
        this.props.enqueueSnackbar(error.message, { variant: 'error' });
      }
    }
  }

  initialSelectedAttachment = (graderDetail) => {
    const gradedSubmissionsFile = graderDetail?.studentSubmittedFiles || [];
    if (gradedSubmissionsFile && gradedSubmissionsFile.length > 0) {
      this.handleSelectFileSubmission(gradedSubmissionsFile[0]);
    }
  };

  handleSelectFileSubmission = (item) => {
    this.setState({ selectedAttachment: item }, () => {
      this.getLinkToView(item);
    });
  };

  getGraderDetail = () => {
    const {
      graderInfo,
      getGraderDetail,
      currentUser: { organizationId },
      courseId,
    } = this.props;
    const { shadowAssignmentId } = this.state;
    const studentId =
      this.state.studentId !== -1
        ? this.state.studentId
        : graderInfo?.studentId;
    const shadowId =
      shadowAssignmentId !== -1
        ? shadowAssignmentId
        : graderInfo?.shadowAssignmentId;
    if (graderInfo?.shadowAssignmentId && studentId) {
      getGraderDetail({
        orgId: organizationId,
        courseId,
        shadowId,
        studentId,
        isFetchingGraderDetail: true,
        graderDetail: {},
        error: {},
      });
    }
  };

  getLinkToView = (item) => {
    const payload = {
      filename: item.filename,
      originalname: item.originalName,
      mimetype: item.mimetype,
    };
    this.props.getLinkToView({ param: payload });
  };

  downloadFile = (item) => {
    const payload = {
      filename: item.filename,
      originalname: item.originalName,
      mimetype: item.mimetype,
    };
    this.props.download({ param: payload });
  };

  onNextPreViewFile = (currentAttachment) => {
    const { graderDetail } = this.props;
    const gradedSubmissionsFile = graderDetail?.studentSubmittedFiles || [];
    if (gradedSubmissionsFile && gradedSubmissionsFile.length) {
      const currentIndex = findIndex(
        gradedSubmissionsFile,
        (attachment) => attachment.id === currentAttachment.id
      );
      if (currentIndex < gradedSubmissionsFile.length - 1) {
        this.handleSelectFileSubmission(
          gradedSubmissionsFile[currentIndex + 1]
        );
      }
    }
  };

  onPreviousPreViewFile = (currentAttachment) => {
    const { graderDetail } = this.props;
    const gradedSubmissionsFile = graderDetail?.studentSubmittedFiles || [];
    if (gradedSubmissionsFile && gradedSubmissionsFile.length) {
      const currentIndex = findIndex(
        gradedSubmissionsFile,
        (attachment) => attachment.id === currentAttachment.id
      );
      if (currentIndex > 0) {
        this.handleSelectFileSubmission(
          gradedSubmissionsFile[currentIndex - 1]
        );
      }
    }
  };

  onNextStudent = () => {
    const { currentStudentIndex } = this.state;
    const { studentList } = this.props;
    const graderInfo = studentList?.[currentStudentIndex];
    const studentId = graderInfo?.studentId;
    const shadowAssignmentId = graderInfo?.shadowAssignmentId;
    this.setState({
      currentStudentIndex: currentStudentIndex + 1,
      studentId,
      shadowAssignmentId,
    });
  };

  onPreviousStudent = () => {
    const { currentStudentIndex } = this.state;
    const { studentList } = this.props;
    const graderInfo = studentList?.[currentStudentIndex - 2];
    const studentId = graderInfo?.studentId;
    const shadowAssignmentId = graderInfo.shadowAssignmentId;
    this.setState({
      currentStudentIndex: currentStudentIndex - 1,
      studentId,
      shadowAssignmentId,
    });
  };

  onClose = () => {
    this.setState({ graderInfo: {} }, () => {
      if (this.props.onClose) {
        this.props.onClose();
      }
      this.props.resetFilePreview();
    });
  };

  renderFileSubmissionItems = (list = []) => {
    const { classes, isFetchingGraderDetail, t } = this.props;
    const { selectedAttachment } = this.state;
    if (isFetchingGraderDetail) {
      return (
        <>
          <Box mt={0.5}>
            <Skeleton
              variant='rectangular'
              animation='wave'
              width={264}
              height={44}
            />
          </Box>
          <Box mt={0.5}>
            <Skeleton
              variant='rectangular'
              animation='wave'
              width={264}
              height={44}
            />
          </Box>
        </>
      );
    }
    if (list.length > 0) {
      return list.map((item) => (
        <Box
          mt={0.5}
          display='flex'
          alignItems='center'
          justifyContent='space-between'
          key={item.id}
          className={`${classes.fileSubmissionItem} ${
            selectedAttachment.id === item.id ? classes.selectedItem : ''
          }`}
          onClick={() => this.handleSelectFileSubmission(item)}
        >
          <Box display='flex' alignItems='center'>
            <div className='icon'>
              {getMaterialIconByExt(splitNameAndExtension(item?.originalName))}
            </div>
            <div className='file-name'>
              <Typography component='div' variant='bodyMedium' color='inherit'>
                <Box className='text-ellipsis'>
                  {splitNameAndExtension(item?.originalName, 'name')}
                </Box>
              </Typography>
            </div>
            <div>{splitNameAndExtension(item?.originalName, 'extension')}</div>
          </Box>
          <div
            className='icon download-icon'
            onClick={() => this.downloadFile(item)}
          >
            <GetAppIcon fontSize='inherit' />
          </div>
        </Box>
      ));
    }
    return (
      <div className={classes.noneText}>
        <Typography component='div' variant='bodyMedium' color='inherit'>
          <Box mt={1}>{t('common:none')}</Box>
        </Typography>
      </div>
    );
  };

  render() {
    const {
      open,
      classes,
      t,
      graderDetail,
      theme,
      fileInformation,
      url,
      studentList,
      isFetchingGraderDetail,
    } = this.props;
    const { name, color } =
      STATUS_STUDENT_ASSIGNMENT_IN_SUBMISSION_LIST[graderDetail?.status ?? '0'];
    const statusColors = theme.mainColors.assignmentStatus;
    const { selectedAttachment, currentStudentIndex } = this.state;
    const totalStudentInStudentList = studentList ? studentList.length : 1;
    let status = t(`myCourses:${name}`);
    return (
      <TblDialog
        fullScreen
        open={open}
        onClose={this.onClose}
        title={
          <div className={classes.title}>
            <Box display='flex' alignItems='center' fontSize={24}>
              {/* <BallotRoundedIcon fontSize='inherit' /> */}
              <TblActivityIcon
                type={COURSE_ITEM_TYPE.ASSIGNMENT}
                fontSize='inherit'
              />
              <Box ml={1} width={1}>
                {isFetchingGraderDetail ? (
                  <Skeleton
                    variant='rectangular'
                    animation='wave'
                    width={300}
                    height={38}
                  />
                ) : (
                  graderDetail?.shadowAssignment?.masterAssignment
                    ?.assignmentName ?? t('assignment_name')
                )}
              </Box>
            </Box>
            <div className={classes.closeButton} onClick={this.onClose}>
              <CloseOutlinedIcon fontSize='inherit' />
            </div>
          </div>
        }
      >
        <div className={classes.graderContentContainer}>
          <div className={classes.previewFileContainer}>
            <PreviewFile
              currentFile={selectedAttachment}
              fileType={fileInformation?.mimetype ?? null}
              url={url ? url : ''}
              fileName={fileInformation?.originalname ?? null}
              onNext={this.onNextPreViewFile}
              onPrevious={this.onPreviousPreViewFile}
              isShowFilename
              fileInformation={fileInformation}
            />
          </div>
          <div className={classes.fileSubmissionContainer}>
            <div className='student-information'>
              {isFetchingGraderDetail ? (
                <Box display='flex'>
                  <Skeleton
                    variant='circular'
                    animation='wave'
                    width={48}
                    height={48}
                  />
                  <Box ml={1}>
                    <Skeleton
                      variant='rectangular'
                      animation='wave'
                      width={208}
                      height={48}
                    />
                  </Box>
                </Box>
              ) : (
                <UserInfoCard
                  itemInfo={{
                    name: `${
                      graderDetail?.students?.firstName ?? t('common:student')
                    } ${graderDetail?.students?.lastName ?? t('common:name')}`,
                    email: graderDetail?.students?.email ?? t('common:email'),
                  }}
                />
              )}
              <Box ml={7} mt={1}>
                {isFetchingGraderDetail ? (
                  <Skeleton
                    variant='rectangular'
                    animation='wave'
                    width={90}
                    height={24}
                  />
                ) : (
                  <Box display='flex'>
                    <TblStatus
                      label={status}
                      color={color}
                      background={statusColors[name]}
                    />
                    {graderDetail?.status ===
                      STUDENT_PROGRESS_STATUS.LATE_TURN_IN && (
                      <Box ml={0.5}>
                        <TblStatus
                          label={'Late'}
                          color={theme.palette.primary.main}
                          background={statusColors.in_progress}
                          minWidth={40}
                        />
                      </Box>
                    )}
                  </Box>
                )}
              </Box>
            </div>
            <div className='file-submission-list'>
              <Typography component='div' variant='bodySmall' color='primary'>
                <Box fontWeight='labelLarge.fontWeight'>
                  {t('files_submission')}
                  {this.renderFileSubmissionItems(
                    graderDetail?.studentSubmittedFiles || []
                  )}
                </Box>
              </Typography>
            </div>
          </div>
          <div className={classes.navigationContainer}>
            <TblIconButton
              variant='outlined'
              className={classes.iconButton}
              disabled={currentStudentIndex === 1}
              onClick={this.onPreviousStudent}
            >
              <ArrowDropUpIcon />
            </TblIconButton>
            <Box mt={1} mb={1} width={1} textAlign='center'>
              <Typography component='div' variant='bodyMedium' color='primary'>
                {`${currentStudentIndex}/${totalStudentInStudentList}`}
              </Typography>
            </Box>
            <TblIconButton
              className={classes.iconButton}
              disabled={currentStudentIndex === totalStudentInStudentList}
              onClick={this.onNextStudent}
            >
              <ArrowDropDownIcon />
            </TblIconButton>
          </div>
        </div>
      </TblDialog>
    );
  }
}

Grader.propTypes = {
  classes: PropTypes.object,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  t: PropTypes.func,
  studentList: PropTypes.array,
  graderInfo: PropTypes.object,
  graderDetail: PropTypes.object,
  theme: PropTypes.object,
  fileInformation: PropTypes.object,
  download: PropTypes.func,
  url: PropTypes.string,
  getLinkToView: PropTypes.func,
  getGraderDetail: PropTypes.func,
  currentUser: PropTypes.object,
  courseId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  mcGetGraderDetailSuccess: PropTypes.bool,
  isFetchingGraderDetail: PropTypes.bool,
  resetFilePreview: PropTypes.func,
  error: PropTypes.object,
  enqueueSnackbar: PropTypes.func,
};

const mapStateToProps = (state) => ({
  currentUser: state.Auth.currentUser,
  graderDetail: state.AllCourses.graderDetail,
  url: state.Common.url,
  fileInformation: state.Common.fileInformation,
  mcGetGraderDetailSuccess: state.AllCourses.mcGetGraderDetailSuccess,
  isFetchingGraderDetail: state.AllCourses.isFetchingGraderDetail,
  error: state.AllCourses.error,
});

const mapDispatchToProps = (dispatch) => ({
  getLinkToView: (payload) => dispatch(CommonActions.getLinkToView(payload)),
  download: (payload) => dispatch(CommonActions.download(payload)),
  getGraderDetail: (payload) =>
    dispatch(MyCoursesActions.mcGetGraderDetail(payload)),
  resetFilePreview: () => dispatch(CommonActions.resetFilePreview()),
});

export default compose(
  withTranslation('myCourses', 'common'),
  withStyles(styles),
  connect(mapStateToProps, mapDispatchToProps)
)(withSnackbar(withTheme(Grader)));
