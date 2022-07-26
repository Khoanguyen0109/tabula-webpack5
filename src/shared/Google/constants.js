import { objectToParams } from 'utils';

export const actions = {
  GET_GOOGLE_OAUTH_URL: 'GET_GOOGLE_OAUTH_URL',
  GET_GOOGLE_OAUTH_URL_SUCCESS: 'GET_GOOGLE_OAUTH_URL_SUCCESS',
  GET_GOOGLE_OAUTH_URL_FAILED: 'GET_GOOGLE_OAUTH_URL_FAILED',

  GET_GOOGLE_TOKEN: 'GET_GOOGLE_TOKEN',
  GET_GOOGLE_TOKEN_SUCCESS: 'GET_GOOGLE_TOKEN_SUCCESS',
  GET_GOOGLE_TOKEN_FAILED: 'GET_GOOGLE_TOKEN_FAILED',

  GET_GOOGLE_FILE: 'GET_GOOGLE_FILE',
  GET_GOOGLE_FILE_SUCCESS: 'GET_GOOGLE_FILE_SUCCESS',
  GET_GOOGLE_FILE_FAILED: 'GET_GOOGLE_FILE_FAILED',

  UPLOAD_GOOGLE_MEDIA: 'UPLOAD_GOOGLE_MEDIA',
  UPLOAD_GOOGLE_MEDIA_SUCCESS: 'UPLOAD_GOOGLE_MEDIA_SUCCESS',
  UPLOAD_GOOGLE_MEDIA_FAILED: 'UPLOAD_GOOGLE_MEDIA_FAILED',

  GOOGLE_SET_STATE: 'GOOGLE_SET_STATE',
};

export const END_POINT = {
  get_google_oauth_url: {
    method: 'GET',
    url: (urlParams) =>
      `${
        process.env.REACT_APP_API_URL
      }/organization/third-party/google-oauth-url?${objectToParams(urlParams)}`,
  },
  get_google_token: {
    method: 'GET',
    url: `${process.env.REACT_APP_API_URL}/organization/third-party/google-access-token`,
  },
  get_google_file: {
    method: 'GET',
    url: (fileId, urlParams) =>
      `https://www.googleapis.com/drive/v3/files/${fileId}?${objectToParams(
        urlParams
      )}`,
  },
  upload_google_media: {
    method: 'POST',
    url: () => `${process.env.REACT_APP_API_URL}/media/google-files/upload`,
  }
};

export const GOOGLE_SUB_CODE = {
  SOME_THING_WENT_WRONG: '1',
  NOT_ENOUGH_PERMISSION: '2',
  EMAIL_MISS_MATCH: '3',
  ACCOUNT_ALREADY_EXISTS: '4',
  CAN_NOT_COPY_FILE: 5
};

export const GOOGLE_ACTION = {
  PICKER: 'picker',
  VIEW: 'view',
  USE_AS_TEMPLATE: 'use_as_template',
  DOWNLOAD: 'download',
  TURN_IN_GOOGLE_FILE: 'turn_in_google_file'
};

export const GOOGLE_FILE_TYPE_SUPPORT_VIEW = [
  // 'https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.google-apps.form',
  'https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.google-apps.drawing',
  'https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.google-apps.document',
  'https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.google-apps.presentation',
  'https://drive-thirdparty.googleusercontent.com/16/type/application/vnd.google-apps.spreadsheet',
];

export const GOOGLE_FILES_SUPPORTED = {
  GOOGLE_DOC: 'application/vnd.google-apps.document',
  GOOGLE_SHEET: 'application/vnd.google-apps.spreadsheet',
  GOOGLE_PRESENTATION: 'application/vnd.google-apps.presentation',
  GOOGLE_DRAWING: 'application/vnd.google-apps.drawing'
};

export const isGoogleFileSupported = (mineType) => Object.values(GOOGLE_FILES_SUPPORTED).includes(mineType);

export const GOOGLE_DOWNLOAD_MINE_TYPE = {
  GOOGLE_DOCUMENT: 'application/pdf', //pdf
  GOOGLE_DOC: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', //docx
  GOOGLE_SHEET: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', //xlsx
  GOOGLE_PRESENTATION: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', //pptx
  GOOGLE_DRAWING: 'image/jpeg' //pdf
};