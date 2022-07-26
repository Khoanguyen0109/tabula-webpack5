import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import isArray from 'lodash/isArray';
import unionBy from 'lodash/unionBy';

import { Tooltip } from '@mui/material';
import Box from '@mui/material/Box';
import makeStyles from '@mui/styles/makeStyles';

import PreviewFile from 'components/PreviewFile';
import TblButton from 'components/TblButton';
import TblGooglePicker from 'components/TblGooglePicker';
import TblInputLabel from 'components/TblInputLabel';
import withReducer from 'components/TblWithReducer';

import { MAX_UPLOAD } from 'utils/constants';
import useDidMountEffect from 'utils/customHook/useDidMoutEffect';

import commonActions from 'shared/Common/actions';
import googleActions from 'shared/Google/actions';
import Media from 'shared/Media/containers';
import reducer from 'shared/Media/reducers';

import { ReactComponent as AttachmentImage } from 'assets/images/attachment_image.svg';
import clsx from 'clsx';
import myCoursesAction from 'modules/MyCourses/actions';
import { PropTypes } from 'prop-types';

import AttachmentItem from './AttachmentItem';

const MediaWithReducer = withReducer('Media', reducer)(Media);
const useStyles = makeStyles((theme) => ({
  actionLabel: (props) => ({
    // display: 'flex',
    alignItems: ' center',
    marginTop: '10px',
    marginLeft: props?.noMarginLeft ? 0 : '8px',
    display: 'inline-flex', // to make div not larger than its contents, prevent click outside area still happen action
    // color: props.viewOnly
    //   ? theme.mainColors.gray[6]
    //   : theme.mainColors.primary2[0],
    // cursor: props.viewOnly ? 'default' : 'pointer',
  }),
  note: (props) => ({
    color: theme.newColors.gray[800],
    fontSize: theme.fontSize.small,
    marginTop: '8px',
    marginLeft: props?.noMarginLeft ? 0 : '8px',
    textAlign: 'center',
  }),
  errorNote: {
    color: theme.palette.error.main,
  },
  emptyContent: (props) => ({
    marginLeft: props?.noMarginLeft ? 0 : '8px',
    color: theme.newColors.gray[700],
    fontSize: theme.fontSize.normal,
  }),

  selectGGBtn: {
    color: 'rgb(37 143 214)',
    backgroundColor: '#EBF1F9',
    borderRadius: theme.borderRadius.default,
    fontSize: theme.fontSize.normal,
    fontWeight: theme.fontWeight.semi,
  },
  displayBlock: {
    display: 'block !important',
  },
  center: {
    textAlign: 'center',
  },
  width100: {
    width: '100%',
  },
}));
const commonSelector = (state) => state.Common;

function Attachments(props) {
  const dispatch = useDispatch();
  const { initialAttachments } = props;
  const [files, setFiles] = React.useState(initialAttachments || []);
  const [isMaxAttachFile, setIsMaxAttachFile] = React.useState(false);
  const {
    label,
    actionLabel,
    maxFile,
    drawer1Ref,
    emptyContent,
    isViewAndDownload,
    menu,
    updateData,
    viewOnly,
    onClickAttach,
    onClickDeleteFile,
    openMedia,
    download,
    preview,
    noMarginLeft,
    // validateMedia,
    isDisableAction,
  } = props;

  const [open, setOpen] = React.useState(openMedia);
  const { t } = useTranslation(['myCourses', 'common', 'myTasks']);
  const classes = useStyles(props);
  // const drawer1Ref = React.createRef(null);
  const [anchorEl, setAnchorEl] = useState({});
  const [isVisiblePreviewFile, setIsVisiblePreviewFile] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const { url, fileInformation, openPreview } = useSelector(commonSelector);
  const taskDetails = useSelector((state) => state.MyTasks.taskDetails);
  const teacherGoogleConnect = useSelector(
    (state) => state.MyTasks.teacherGoogleConnect
  );
  const googleFilesUploaded = useSelector(
    (state) => state.Google.googleFilesUploaded
  );

  const disableAttachFile = !!viewOnly || files?.length >= 5;
  const disableAttachGoogleFile =
    !!viewOnly || !teacherGoogleConnect || files?.length >= 5;
  const handleClickMore = (recordId, event) => {
    setAnchorEl({ ...anchorEl, [recordId]: event.currentTarget });
  };
  const handleCloseMoreMenu = () => {
    setAnchorEl({});
  };

  const togglePreviewFile = () => {
    setSelectedFile(null);
    setIsVisiblePreviewFile(!isVisiblePreviewFile);
    dispatch(
      commonActions.commonSetState({
        openPreview: false,
      })
    );
  };

  const toggleMedia = (value) => {
    if (files?.length >= 5) {
      return null;
    }
    if (drawer1Ref) {
      drawer1Ref.current.classList.toggle('overlayed');
    }

    if (onClickAttach) {
      onClickAttach(value);
    } else {
      setOpen(value);
    }
  };

  const validateMedia = (list) => {
    const totalMedia = list && list.concat(files || []);
    if (totalMedia && totalMedia.length > 5) {
      return t('additional_information', { max: 5 });
    }
  };
  useEffect(() => {
    setFiles(initialAttachments);
  }, [initialAttachments]);

  useEffect(() => {
    setOpen(openMedia);
  }, [openMedia]);

  useEffect(() => {
    if (taskDetails) {
      dispatch(
        myCoursesAction.checkTeacherGoogleConnect({
          courseId: taskDetails.courseId,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskDetails]);

  useEffect(() => {
    if (files?.length > maxFile) {
      setIsMaxAttachFile(true);
    } else {
      setIsMaxAttachFile(false);
    }
  }, [files, maxFile]);

  useEffect(() => {
    if (openPreview) {
      previewFiles(fileInformation);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openPreview]);

  useDidMountEffect(() => {
    handleMediaSelect(googleFilesUploaded);
    return () => {
      dispatch(
        googleActions.googleSetState({
          googleFilesUploaded: null,
        })
      );
    };
  }, [googleFilesUploaded]);

  const handleMediaSelect = (media) => {
    let data = [];
    data = unionBy(media, files, 'id'); // fix bug 2963
    // data = unionBy(media,files , 'sourceId');
    setFiles(data);
    // setFiles(concat(data, files));

    updateData && updateData(data);
  };

  const previewFiles = (item) => {
    setIsVisiblePreviewFile(true);
    setSelectedFile(item);
    handleCloseMoreMenu();
    const payload = {
      filename: item.filename,
      originalname: item.originalName,
      mimetype: item.mimetype,
    };
    if (preview) {
      preview(item);
    } else {
      dispatch(
        commonActions.getLinkToView({
          param: payload,
          isFetchingFile: true,
        })
      );
    }
  };

  const deleteFile = (item) => {
    handleCloseMoreMenu();
    if (onClickDeleteFile) {
      onClickDeleteFile(item);
    } else {
      setFiles(files.filter((f) => f.id !== item.id));
      updateData && updateData(files.filter((f) => f.id !== item.id));
    }
  };

  const onCloseMedia = () => {
    if (drawer1Ref) {
      drawer1Ref.current.classList.toggle('overlayed');
    }
    if (props.onClose) {
      props.onClose();
    } else {
      setOpen(false);
    }
    handleCloseMoreMenu();
  };

  const onAddGGFiles = (googleAttachmentsSelected) => {
    const data = googleAttachmentsSelected.filter((file) => {
      if (files.find((f) => f.sourceId === file.sourceId)) {
        return false;
      }
      return true;
    });
    dispatch(
      googleActions.uploadGoogleMedia({
        googleFiles: data,
      })
    );
  };
  const renderFiles = () => (
      <Box mt={4}>
        {files && files?.length === 0 && viewOnly ? (
          <div className={classes.emptyContent}>{emptyContent}</div>
        ) : (
          isArray(files) &&
          files?.map((item, index) => (
            <AttachmentItem
              index={index}
              item={item}
              viewOnly={viewOnly}
              previewFiles={previewFiles}
              isViewAndDownload={isViewAndDownload}
              handleClickMore={handleClickMore}
              handleCloseMoreMenu={handleCloseMoreMenu}
              anchorEl={anchorEl}
              menu={menu}
              deleteFile={deleteFile}
              download={download}
              noMarginLeft={noMarginLeft}
              isDisableAction={isDisableAction}
            />
          ))
        )}
      </Box>
    );

  return (
    <>
      <TblInputLabel>{label}</TblInputLabel>
      {actionLabel && (
        <>
          <div className={clsx(classes.center)}>
            <AttachmentImage />
          </div>
          {!isDisableAction && (
            <span>
              <div
                className={clsx(classes.actionLabel, classes.width100)}
                onClick={() => toggleMedia(viewOnly ? false : true)}
              >
                <TblButton
                  className={clsx(classes.selectGGBtn, classes.width100)}
                  disabled={disableAttachFile}
                >
                  {actionLabel}
                </TblButton>
              </div>
              <div
                className={clsx(
                  classes.actionLabel,
                  classes.displayBlock,
                  classes.width100
                )}
              >
                <TblGooglePicker
                  maxItemCanBeSelected={MAX_UPLOAD - files.length}
                  isEmptyList={files.length === 0}
                  onChange={onAddGGFiles}
                  disable={disableAttachGoogleFile}
                >
                  <Tooltip
                    title={
                      !teacherGoogleConnect
                        ? t(
                            'myTasks:teacher_did_not_connect_to_a_google_account'
                          )
                        : ''
                    }
                  >
                    <span>
                      <TblButton
                        className={clsx(classes.selectGGBtn, classes.width100)}
                        disabled={disableAttachGoogleFile}
                      >
                        {t('common:select_gg_drive')}
                      </TblButton>
                    </span>
                  </Tooltip>
                </TblGooglePicker>
              </div>
              <div
                className={clsx(
                  classes.note,
                  isMaxAttachFile ? classes.errorNote : ''
                )}
              >
                {t('common:additional_information', { max: maxFile })}
              </div>
            </span>
          )}
        </>
      )}
      {renderFiles()}

      <MediaWithReducer
        visible={open}
        multiple={true}
        onClose={onCloseMedia}
        mediaType='media'
        onSelect={handleMediaSelect}
        validateFunc={validateMedia}
        max={5}
      />
      {isVisiblePreviewFile && (
        <PreviewFile
          currentFile={selectedFile}
          fileType={selectedFile?.mimetype}
          url={url || ''}
          isFullScreen
          fileName={selectedFile?.originalName || ''}
          onClose={togglePreviewFile}
          fileInformation={fileInformation}
        />
      )}
    </>
  );
}

Attachments.propTypes = {
  actionLabel: PropTypes.string,
  download: PropTypes.func,
  drawer1Ref: PropTypes.shape({
    current: PropTypes.shape({
      classList: PropTypes.shape({
        toggle: PropTypes.func,
      }),
    }),
  }),
  emptyContent: PropTypes.string,
  initialAttachments: PropTypes.array,
  isViewAndDownload: PropTypes.bool,
  label: PropTypes.string,
  maxFile: PropTypes.number,
  menu: PropTypes.array,
  noMarginLeft: PropTypes.bool,
  onClickAttach: PropTypes.func,
  onClickDeleteFile: PropTypes.func,
  onClose: PropTypes.func,
  openMedia: PropTypes.bool,
  preview: PropTypes.func,
  updateData: PropTypes.func,
  viewOnly: PropTypes.bool,
  isDisableAction: PropTypes.bool
};

Attachments.defaultProps = {
  label: 'Attachments',
  actionLabel: 'Add Attachments',
  maxFile: 5,
  emptyContent: 'No Attachments',
  viewOnly: false,
  isDisableAction: false
};
export default Attachments;
