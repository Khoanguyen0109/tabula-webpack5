import { LOCAL_STORAGE } from 'utils/constants';

export const setGoogleToken= ( accessToken , expiredDate) => {
    localStorage.setItem(LOCAL_STORAGE.GOOGLE_ACCESS_TOKEN , accessToken);
    localStorage.setItem(LOCAL_STORAGE.GOOGLE_ACCESS_TOKEN_EXPIRED_DATE, expiredDate);
    return;
};

export const removeGoogleToken = () => {
    localStorage.removeItem(LOCAL_STORAGE.GOOGLE_ACCESS_TOKEN);
    localStorage.removeItem(LOCAL_STORAGE.GOOGLE_ACCESS_TOKEN_EXPIRED_DATE);
};

export const getGoogleToken = () => {
    const googleAccessToken = localStorage.getItem(
        LOCAL_STORAGE.GOOGLE_ACCESS_TOKEN
      );
      const expiredTime = parseInt(
        localStorage.getItem(LOCAL_STORAGE.GOOGLE_ACCESS_TOKEN_EXPIRED_DATE)
      );
    return {googleAccessToken , expiredTime};
};

export const formatGoogleFile = (file) => { 
  file.url = file?.url || file?.webViewLink; 
  file.originalName = file.name;
  file.iconLink = file?.iconLink|| file?.iconUrl;
  file.size = file?.sizeBytes;
  file.sourceId= file.id;
  file.mimetype = file.mimeType;
  file.isTemplate = false;
  delete file.id;
  return file;
};

export const filterGoogleFileSelected = (list , googleFilesSelected) => googleFilesSelected
  .concat(list)
  .filter(
    (thing, index, self) =>
      index ===
      self.findIndex((t) => t.sourceId === thing.sourceId)
  );