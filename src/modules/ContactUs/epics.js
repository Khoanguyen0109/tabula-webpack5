import { ofType } from 'redux-observable';
import { of } from 'rxjs';
import { catchError, mergeMap, switchMap } from 'rxjs/operators';

import { makeAjaxRequest } from '../../utils/ajax';

import contactUsActions from './actions';
import { END_POINT, actions } from './constants';
// import authActions from 'shared/Auth/actions';

const sendFeedbackEpic = (action$) =>
  action$.pipe(
    ofType(actions.SEND_FEEDBACK),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.send_feedback.method,
        END_POINT.send_feedback.url(),
        action.payload.data
      ).pipe(
        mergeMap(() => of(
            contactUsActions.sendFeedbackSuccess({
              sendFeedbackSuccess: true,
            })
          )),
        catchError((error) => of(
            contactUsActions.sendFeedbackFailed({
              error: error?.response?.errors,
              sendFeedbackFailed: true,
            })
          ))
      )
    )
  );

export default [sendFeedbackEpic];
