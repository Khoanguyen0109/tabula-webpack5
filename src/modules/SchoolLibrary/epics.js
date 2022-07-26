import { makeAjaxRequest } from 'utils/ajax';

import { ofType } from 'redux-observable';
import { of } from 'rxjs';
import { catchError, mergeMap, switchMap } from 'rxjs/operators';

import schoolLibraryActions from './actions';
import { END_POINT, actions } from './constants';

const getCourseTemplateListSchoolLibraryEpic = (action$) =>
  action$.pipe(
    ofType(actions.GET_COURSE_TEMPLATE_LIST_SCHOOL_LIBRARY),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.get_course_template_list_school_library.method,
        END_POINT.get_course_template_list_school_library.url(
          action.payload.organizationId,
          action.payload.urlParams
        )
      ).pipe(
        mergeMap((data) => of(
            schoolLibraryActions.getCourseTemplateListSchoolLibrarySuccess({
              isBusy: false,
              schoolTemplateList: data.response.data,
              totalCourseTemplate: data.response.total,
            })
          )),
        catchError((error) => of(
            { type: 'GLOBAL_ERROR', payload: { error } },
            schoolLibraryActions.getCourseTemplateListSchoolLibraryFailed({
              isBusy: false,
            })
          ))
      )
    )
  );

export default [
  getCourseTemplateListSchoolLibraryEpic
];
