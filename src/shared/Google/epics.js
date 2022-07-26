import { ofType } from 'redux-observable';
import { of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { catchError, mergeMap } from 'rxjs/operators';

import { makeAjaxRequest } from '../../utils/ajax';

import googleActions from './actions';
import { END_POINT, GOOGLE_ACTION, actions } from './constants';
import { removeGoogleToken, setGoogleToken } from './utils';

const getGoogleOauthUrlEpic = (action$) => action$.pipe(
    ofType(actions.GET_GOOGLE_OAUTH_URL),
    mergeMap((action) => makeAjaxRequest(
        END_POINT.get_google_oauth_url.method,
        END_POINT.get_google_oauth_url.url(action.payload.urlParams)
      ).pipe(
        mergeMap((data) => {
          window.open(data.response.url, '_blank' ,'opener');
          return of(
            googleActions.getGoogleOauthUrlSuccess({
              getGoogleOauthUrlSuccess: true,
            })
          );
        }),
        catchError(() => of(
            googleActions.getGoogleOauthUrlFailed({
              getGoogleOauthUrlFailed: true,
            })
          ))
      ))
  );

const getGoogleTokenEpic = (action$) => action$.pipe(
    ofType(actions.GET_GOOGLE_TOKEN),
    mergeMap((action) => makeAjaxRequest(
        END_POINT.get_google_token.method,
        END_POINT.get_google_token.url
      ).pipe(
        mergeMap((data) => {
          const { googleAccessToken, expiryDate } = data.response;
          setGoogleToken(googleAccessToken, expiryDate);
          return of(
            googleActions.getGoogleTokenSuccess({
              getGoogleTokenSuccess: true,
            })
          );
        }),
        catchError(() => {
          removeGoogleToken();
          return of(
            googleActions.getGoogleTokenFailed({
              getGoogleTokenFailed: true,
              messageOauthPopup:
                action.payload.messageFailed ||
                action.payload.messageOauthPopup,
              openOauthPopup: true,
            })
          );
        })
      ))
  );

const getGoogleFileEpic = (action$) => action$.pipe(
    ofType(actions.GET_GOOGLE_FILE),
    mergeMap((action) => ajax({
        method: END_POINT.get_google_file.method,
        url: END_POINT.get_google_file.url(action.payload.fileId, {
          fields: '*',
          key: process.env.REACT_APP_GOOGLE_DRIVE_API_KEY,
        }),
        crossDomain: true,
      }).pipe(
        mergeMap((data) => of(
            googleActions.getGoogleFileSuccess({
              getGoogleFileSuccess: true,
              googleFile: data.response,
            })
          )),
        catchError(() => {
          removeGoogleToken();
          return of(
            googleActions.getGoogleFileFailed({
              getGoogleFileFailed: true,
              googleFile: {
                id: action.payload.fileId,
              },
              onAction: GOOGLE_ACTION.VIEW,
            })
          );
        })
      ))
  );

const uploadGoogleMediaEpic = (action$) => action$.pipe(
    ofType(actions.UPLOAD_GOOGLE_MEDIA),
    mergeMap((action) => makeAjaxRequest(
        END_POINT.upload_google_media.method,
        END_POINT.upload_google_media.url(),
        action.payload
      ).pipe(
        mergeMap((data) => of(googleActions.uploadGoogleMediaSuccess({
            googleFilesUploaded: data.response.data
          }))),
        catchError(() => {
          removeGoogleToken();
          return of(googleActions.uploadGoogleMediaFailed({}));
        })
      ))
  );

export default [
  getGoogleOauthUrlEpic,
  getGoogleTokenEpic,
  getGoogleFileEpic,
  uploadGoogleMediaEpic,
];
