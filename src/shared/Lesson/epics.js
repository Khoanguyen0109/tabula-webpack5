import { makeAjaxRequest } from 'utils/ajax';

import { ofType } from 'redux-observable';
import { of } from 'rxjs';
import { catchError, mergeMap, switchMap } from 'rxjs/operators';

import myCoursesActions from './actions';
import { END_POINT, actions } from './constants';
import { getQueueUpdate } from './utils';

const createNewLessonEpic = (action$) =>
  action$.pipe(
    ofType(actions.CREATE_NEW_LESSON),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.create_new_lesson.method,
        END_POINT.create_new_lesson.url(
          action.payload.orgId,
          action.payload.courseId,
          action.payload.unitId
        ),
        action.payload.lesson
      ).pipe(
        mergeMap((data) => of(
            myCoursesActions.createNewLessonSuccess({
              isCreateNewLessonSuccess: true,
              isCreatingLesson: false,
              lessonDetail: data?.response?.lesson,
            })
          )),
        catchError((error) => of(
            { type: 'GLOBAL_ERROR', payload: { error } },
            myCoursesActions.createNewLessonFailed({
              error: error?.response?.errors,
              isCreatingLesson: false,
            })
          ))
      )
    )
  );

const editLessonEpic = (action$) =>
  action$.pipe(
    ofType(actions.EDIT_LESSON),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.edit_lesson.method,
        END_POINT.edit_lesson.url(
          action.payload.orgId,
          action.payload.courseId,
          action.payload.unitId,
          action.payload.lessonId
        ),
        action.payload.lesson
      ).pipe(
        mergeMap((data) => of(
            myCoursesActions.editLessonSuccess({
              isEditLessonSuccess: true,
              isEditingLesson: false,
              queueUpdate: getQueueUpdate(data?.response?.courseDayIds),
            })
          )),
        catchError((error) => of(
            { type: 'GLOBAL_ERROR', payload: { error } },
            myCoursesActions.editLessonFailed({
              error: error?.response?.errors,
              isEditingLesson: false,
            })
          ))
      )
    )
  );

const getLessonDetailEpic = (action$) =>
  action$.pipe(
    ofType(actions.GET_LESSON_DETAIL),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.get_lesson_detail.method,
        END_POINT.get_lesson_detail.url(
          action.payload.orgId,
          action.payload.courseId,
          action.payload.unitId,
          action.payload.lessonId
        )
      ).pipe(
        mergeMap((data) => of(
            myCoursesActions.getLessonDetailSuccess({
              lessonDetail: data?.response?.lesson,
              isFetchingLessonDetail: false,
            })
          )),
        catchError((error) => of(
            { type: 'GLOBAL_ERROR', payload: { error } },
            myCoursesActions.getLessonDetailFailed({
              error: error?.response?.errors,
              isFetchingLessonDetail: false,
            })
          ))
      )
    )
  );

export default [
  createNewLessonEpic,
  getLessonDetailEpic,
  editLessonEpic
];
