import { ofType } from 'redux-observable';
import { of } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';

import { makeAjaxRequest } from '../../utils/ajax';

import ImportActions from './actions';
import { END_POINT, actions } from './constants';
import { IMPORT_STATUS } from './utils';

const getImportQueueStudentAndGuardianEpic = (action$ , state$) => action$.pipe(
    ofType(actions.GET_IMPORT_QUEUE_STUDENT_AND_GUARDIAN),
    mergeMap((action) => makeAjaxRequest(
        END_POINT.get_import_queue_student_and_guardian.method,
        END_POINT.get_import_queue_student_and_guardian.url(
          action.payload.orgId
        )
      ).pipe(
        mergeMap((data) => {
          const importKey = state$.value.Import.importKey;
          return of(
            ImportActions.getImportQueueStudentAndGuardianSuccess({
              importLogs: data.response.logs,
              importProgress: data.response.progress,
              importStatus: data.response.status,
              importKey: data.response.keys.length >0 ? data.response.keys[0]: importKey
            })
          );
        }),
        catchError(() => of(ImportActions.getImportQueueStudentAndGuardianFailed({
            importLogs: [],
            importStatus: IMPORT_STATUS.START_IMPORT,

          })))
      ))
  );

const getImportQueueStudentAndGuardianProgressEpic = (action$) => action$.pipe(
    ofType(actions.GET_IMPORT_QUEUE_STUDENT_AND_GUARDIAN_PROGRESS),
    mergeMap((action) => makeAjaxRequest(
        END_POINT.get_import_queue_student_and_guardian_progress.method,
        END_POINT.get_import_queue_student_and_guardian_progress.url(
          action.payload.orgId,
          action.payload.importKey
        )
      ).pipe(
        mergeMap((data) => of(
            ImportActions.getImportQueueStudentAndGuardianProgressSuccess({
              importLogs: data.response.logs,
              importStatus: data.response?.status ?? IMPORT_STATUS.DONE,
            })
          )),
        catchError(() => of(
            ImportActions.getImportQueueStudentAndGuardianProgressFailed({
              importStatus: IMPORT_STATUS.FAILED,
              importLogs: [{
                status: IMPORT_STATUS.FAILED
              }]
            })
          ))
      ))
  );
export default [
  getImportQueueStudentAndGuardianEpic,
  getImportQueueStudentAndGuardianProgressEpic
];
