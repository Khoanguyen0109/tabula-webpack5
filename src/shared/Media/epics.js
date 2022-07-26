import { makeAjaxRequest } from 'utils/ajax';
import handleErrorsFromServer from 'utils/handleErrors';

import { ofType } from 'redux-observable';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';

import mediaActions from './actions';
import { END_POINT, actions } from './constants';

const fetchImagesEpics = (action$) => action$.pipe(
    ofType(actions.MEDIA_FETCH_IMAGES),
    switchMap(() =>
      makeAjaxRequest(
        END_POINT.fetch_images.method,
        END_POINT.fetch_images.url
      ).pipe(
        map((data) => {
          if (data.response.errors) {
            return mediaActions.mediaFetchImagesFailed({
              error: data.response.errors,
              fetching: false,
            });
          } 
            return mediaActions.mediaFetchImagesSuccess({
              media: data.response,
              fetching: false,
            });
          
        }),
        catchError((error) =>
          of({
            type: actions.MEDIA_FETCH_IMAGES_FAILED,
            payload: error.xhr.response,
            error: true,
          })
        )
      )
    )
  );

const fetchMediaEpics = (action$) => action$.pipe(
    ofType(actions.MEDIA_FETCH, actions.DELETE_MEDIA_SUCCESS),
    mergeMap(() =>
      makeAjaxRequest(
        END_POINT.fetch_media.method,
        END_POINT.fetch_media.url
      ).pipe(
        map((data) => {
          if (data.response.errors) {
            return mediaActions.mediaFetchFailed({
              error: data.response.errors,
              fetching: false,
            });
          } 
            return mediaActions.mediaFetchSuccess({
              media: data.response,
              fetching: false,
            });
          
        }),
        catchError((error) =>
          of({
            type: actions.MEDIA_FETCH_FAILED,
            payload: error.xhr.response,
            error: true,
          })
        )
      )
    )
  );

const deleteMediaEpics = (action$) => action$.pipe(
    ofType(actions.DELETE_MEDIA),
    mergeMap((action) =>
      makeAjaxRequest(
        END_POINT.delete_media.method,
        END_POINT.delete_media.url(action.payload.mediaId)
      ).pipe(
        map((data) => {
          if (data.response.errors) {
            handleErrorsFromServer(data.response);
            return mediaActions.deleteMediaFailed(data.response.errors);
          } 
            return mediaActions.deleteMediaSuccess(data.response);
          
        }),
        catchError((error) => {
          handleErrorsFromServer(error);

          return of({
            type: actions.DELETE_MEDIA_FAILED,
            payload: error.xhr.response,
            error: true,
          });
        })
      )
    )
  );

export default [fetchImagesEpics, fetchMediaEpics, deleteMediaEpics];
