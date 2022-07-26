import handleErrorsFromServer from 'utils/handleErrors';
import { downloadFile } from 'utils/index';

import { ofType } from 'redux-observable';
import { of } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';

import { makeAjaxRequest } from '../../utils/ajax';

import commonActions from './actions';
import { END_POINT, actions } from './constants';

const downloadEpic = (action$) => action$.pipe(
    ofType(actions.DOWNLOAD),
    mergeMap((action) => makeAjaxRequest(
        END_POINT.download.method,
        END_POINT.download.url(),
        action.payload.param
      ).pipe(
        mergeMap((data) => {
          downloadFile(data.response.url);
          return of({
            type: 'NO_THING',
          });
        }),
        catchError((error) => {
          const errorResponse = handleErrorsFromServer(error);
          return of(commonActions.downloadFailed(errorResponse));
        })
      ))
  );

const getLinkToViewEpic = (action$) => action$.pipe(
    ofType(actions.GET_LINK_TO_VIEW),
    mergeMap((action) => makeAjaxRequest(
        END_POINT.get_link_to_view.method,
        END_POINT.get_link_to_view.url(),
        action.payload.param
      ).pipe(
        mergeMap((data) => of(
            commonActions.getLinkToViewSuccess({
              ...data.response,
              fileInformation: action.payload.param,
              isFetchingFile: false
            })
          )),
        catchError((error) => {
          const errorResponse = handleErrorsFromServer(error);
          return of(commonActions.getLinkToViewFailed(errorResponse));
        })
      ))
  );

export default [downloadEpic, getLinkToViewEpic];
