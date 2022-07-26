export const IMPORT_STATE = {
  UPLOAD_FILE: 0,
  // UPLOADING: 1,
  IMPORTING: 1,
  IMPORT_SUCCESS: 2,
};

export const IMPORT_STATUS = {
  START_IMPORT: 0,
  PROCESSING: 1,
  DONE: 2,
  FAILED: 3
};
export const IMPORT_ERROR_CODE = {
  NOT_ACCEPTED_FILE: 0,
  OVER_SIZE_FILE: 1,
};
export const MAX_SIZE_FILE_IMPORT = 10;

export const IMPORT_FILE_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

export const DOWNLOAD_TEMPLATE_LINK =
  'https://tabula-bucket-stg.s3.us-west-2.amazonaws.com/excel/Import_Template.xlsx';
