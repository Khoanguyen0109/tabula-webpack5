export const actions = {
    MEDIA_SET_STATE: 'MEDIA_SET_STATE',
    MEDIA_FETCH: 'MEDIA_FETCH',
    MEDIA_FETCH_SUCCESS: 'MEDIA_FETCH_SUCCESS',
    MEDIA_FETCH_FAILED: 'MEDIA_FETCH_FAILED',
    MEDIA_FETCH_IMAGES: 'MEDIA_FETCH_IMAGES',
    MEDIA_FETCH_IMAGES_SUCCESS: 'MEDIA_FETCH_IMAGES_SUCCESS',
    MEDIA_FETCH_IMAGES_FAILED: 'MEDIA_FETCH_IMAGES_FAILED',
    MEDIA_DELETE: 'MEDIA_DELETE',
    MEDIA_DELETE_SUCCESS: 'MEDIA_DELETE_SUCCESS',
    MEDIA_DELETE_FAILED: 'MEDIA_DELETE_FAILED'
};

// Define media type, we can add more in the future
export const MEDIA_TYPES = {
    OFFICE: [
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/pdf',
      'application/vnd.oasis.opendocument.text',
      'application/vnd.oasis.opendocument.spreadsheet',
      'application/vnd.oasis.opendocument.presentation',
      'application/rtf'
    ],
    IMAGES: [
      'image/jpg',
      'image/bmp',
      'image/gif',
      'image/jpeg',
      'image/png',
      'image/ico'
    ],
    AUDIO: ['audio/mpeg', 'audio/mp3', 'audio/ogg', 'audio/wav', 'video/ogg', 'audio/x-wav'],
    VIDEO: ['video/mp4', 'video/mpeg', 'video/webm', 'video/x-msvideo'],
    FILE_UPLOADED: 1,
    GOOGLE_DRIVE_FILE: 2
  };
  // Define ext
  export const EXT = {
    OFFICE: ['.doc', '.docx', '.odt', '.xls', '.xlsx', '.ppt', '.pptx', '.pps', '.ods', '.wps', '.wpd', '.pdf', '.rtf'],
    IMAGES: ['.jpg', '.jpeg', '.bmp', '.png', '.ico', '.gif', '.tif', '.tiff', '.svg', '.ps', '.psd', '.ai'],
    AUDIO: ['.mp3', '.ogg', '.wav', '.cda', '.aif', '.mid', '.mpa', '.wma', '.wpl'],
    VIDEO: ['.mp4', '.webm', '.mpg', '.mpeg', '.rm', '.vob', '.swf', '.3g2', '.3gp', '.avi', '.flv', 'h264', '.m4v', '.mov', '.mkv', '.wmv']
  };
  
  export const END_POINT = {
    fetch_images: {
      url: `${process.env.REACT_APP_API_URL}/media/images`,
      method: 'GET'
    },
    fetch_media: {
      url: `${process.env.REACT_APP_API_URL}/media`,
      method: 'GET'
    },
    delete_media: {
      url: (mediaId) => `${process.env.REACT_APP_API_URL}/library/${mediaId}`,
      method: 'DELETE'
    }
  };
