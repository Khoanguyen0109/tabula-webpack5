import { makeAjaxRequest } from 'utils/ajax';

import { ofType } from 'redux-observable';
import { of } from 'rxjs';
import { catchError, mergeMap, switchMap } from 'rxjs/operators';

import managerCourseTemplateActions from './actions';
import { END_POINT, actions } from './constants';

const createCourseTemplateEpic = (action$) =>
  action$.pipe(
    ofType(actions.CREATE_COURSE_TEMPLATE),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.create_course_template.method,
        END_POINT.create_course_template.url(action.payload.organizationId),
        action.payload.data
      ).pipe(
        mergeMap((data) => of(
            managerCourseTemplateActions.createCourseTemplateSuccess({
              isBusy: false,
              canFetching: true,
              templateDetail: data.response.data,
              enqueueMessage: {
                message: 'Course template created successfully.',
                option: {
                  variant: 'success',
                },
              },
            })
          )),
        catchError((error) => of(
            { type: 'GLOBAL_ERROR', payload: { error } },
            managerCourseTemplateActions.createCourseTemplateFailed({
              isBusy: false,
              enqueueMessage: {
                message: 'Something went wrong, try again.',
                option: {
                  variant: 'error',
                },
              },
            })
          ))
      )
    )
  );

const getCourseTemplateListEpic = (action$) =>
  action$.pipe(
    ofType(actions.GET_COURSE_TEMPLATE_LIST),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.get_course_template_list.method,
        END_POINT.get_course_template_list.url(
          action.payload.organizationId,
          action.payload.urlParams
        )
      ).pipe(
        mergeMap((data) => of(
            managerCourseTemplateActions.getCourseTemplateListSuccess({
              isBusy: false,
              courseTemplateList: data.response.data,
              totalCourseTemplate: data.response.total,
            })
          )),
        catchError((error) => of(
            { type: 'GLOBAL_ERROR', payload: { error } },
            managerCourseTemplateActions.getCourseTemplateListFailed({
              isBusy: false,
            })
          ))
      )
    )
  );

const getSchoolSettingEpic = (action$) =>
  action$.pipe(
    ofType(actions.GET_SCHOOL_SETTING),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.get_school_setting.method,
        END_POINT.get_school_setting.url(action.payload.organizationId)
      ).pipe(
        mergeMap((data) => of(
            managerCourseTemplateActions.getSchoolSettingSuccess({
              schoolSetting: data.response.data,
            })
          )),
        catchError((error) => of(
            { type: 'GLOBAL_ERROR', payload: { error } },
            managerCourseTemplateActions.getSchoolSettingFailed({})
          ))
      )
    )
  );

const getCourseTemplateDetailEpic = (action$) =>
  action$.pipe(
    ofType(actions.GET_COURSE_TEMPLATE_DETAIL),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.get_course_template_detail.method,
        END_POINT.get_course_template_detail.url(
          action.payload.templateId,
          action.payload.organizationId
        )
      ).pipe(
        mergeMap((data) => of(
            managerCourseTemplateActions.getCourseTemplateDetailSuccess({
              templateDetail: data.response.data,
              availableGradeLevel: data.response.data.availableGradeLevel,
              isCurrentTemplatePublished:
                data.response.data.publishedSchoolLibrary?.status ||
                data.response.data.publishedDistrictLibrary?.status,
              isBusy: false,
            })
          )),
        catchError((error) => of(
            { type: 'GLOBAL_ERROR', payload: { error } },
            managerCourseTemplateActions.getCourseTemplateDetailFailed({
              isBusy: false,
            })
          ))
      )
    )
  );

const updateCourseTemplateEpic = (action$) =>
  action$.pipe(
    ofType(actions.UPDATE_COURSE_TEMPLATE),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.update_course_template.method,
        END_POINT.update_course_template.url(
          action.payload.templateId,
          action.payload.organizationId
        ),
        action.payload.data
      ).pipe(
        mergeMap((data) => of(
            managerCourseTemplateActions.updateCourseTemplateSuccess({
              isBusy: false,
              changeSaved: true,
              templateDetail: data.response.data,
            })
          )),
        catchError((error) => of(
            { type: 'GLOBAL_ERROR', payload: { error } },
            managerCourseTemplateActions.updateCourseTemplateFailed({
              isBusy: false,
            })
          ))
      )
    )
  );

const viewTemplateDetailGetTermsEpic = (action$) =>
  action$.pipe(
    ofType(actions.VIEW_TEMPLATE_DETAIL_GET_TERMS),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.view_template_detail_get_terms.method,
        END_POINT.view_template_detail_get_terms.url(
          action.payload.templateId,
          action.payload.organizationId
        )
      ).pipe(
        mergeMap((data) => of(
            managerCourseTemplateActions.viewTemplateDetailGetTermsSuccess({
              viewDetailTermsAndGradingPeriod: data.response.data,
            })
          )),
        catchError((error) => of(
            { type: 'GLOBAL_ERROR', payload: { error } },
            managerCourseTemplateActions.viewTemplateDetailGetTermsFailed({})
          ))
      )
    )
  );

const viewTemplateDetailGetUnitEpic = (action$) =>
  action$.pipe(
    ofType(actions.VIEW_TEMPLATE_DETAIL_GET_UNIT),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.view_template_detail_get_unit.method,
        END_POINT.view_template_detail_get_unit.url(
          action.payload.templateId,
          action.payload.organizationId,
          action.payload.gradingPeriodId
        )
      ).pipe(
        mergeMap((data) => of(
            managerCourseTemplateActions.viewTemplateDetailGetUnitSuccess({
              isBusy: false,
              unitAndTemplateActivities: data.response.data,
            })
          )),
        catchError((error) => of(
            { type: 'GLOBAL_ERROR', payload: { error } },
            managerCourseTemplateActions.viewTemplateDetailGetUnitFailed({
              isBusy: false,
            })
          ))
      )
    )
  );

const publishToSchoolLibraryEpic = (action$) =>
  action$.pipe(
    ofType(actions.PUBLISH_TO_SCHOOL_LIBRARY),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.publish_to_school_library.method,
        END_POINT.publish_to_school_library.url(
          action.payload.templateId,
          action.payload.organizationId
        )
      ).pipe(
        mergeMap(() => of(
            managerCourseTemplateActions.publishToSchoolLibrarySuccess({
              canFetching: true,
              enqueueMessage: {
                message:
                  'Course template published to school library successfully.',
                option: {
                  variant: 'success',
                },
              },
            })
          )),
        catchError((error) => of(
            { type: 'GLOBAL_ERROR', payload: { error } },
            managerCourseTemplateActions.publishToSchoolLibraryFailed({})
          ))
      )
    )
  );

const unPublishToSchoolLibraryEpic = (action$) =>
  action$.pipe(
    ofType(actions.UN_PUBLISH_TO_SCHOOL_LIBRARY),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.un_publish_to_school_library.method,
        END_POINT.un_publish_to_school_library.url(
          action.payload.templateId,
          action.payload.organizationId
        )
      ).pipe(
        mergeMap(() => of(
            managerCourseTemplateActions.unPublishToSchoolLibrarySuccess({
              canFetching: true,
              enqueueMessage: {
                message: 'Course template removed in school library.',
                option: {
                  variant: 'success',
                },
              },
            })
          )),
        catchError((error) => of(
            { type: 'GLOBAL_ERROR', payload: { error } },
            managerCourseTemplateActions.unPublishToSchoolLibraryFailed({})
          ))
      )
    )
  );

const publishToDistrictLibraryEpic = (action$) =>
  action$.pipe(
    ofType(actions.PUBLISH_TO_DISTRICT_LIBRARY),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.publish_to_district_library.method,
        END_POINT.publish_to_district_library.url(
          action.payload.templateId,
          action.payload.organizationId
        )
      ).pipe(
        mergeMap(() => of(
            managerCourseTemplateActions.publishToDistrictLibrarySuccess({
              canFetching: true,
              enqueueMessage: {
                message:
                  'Course template published to district library successfully.',
                option: {
                  variant: 'success',
                },
              },
            })
          )),
        catchError((error) => of(
            { type: 'GLOBAL_ERROR', payload: { error } },
            managerCourseTemplateActions.publishToDistrictLibraryFailed({})
          ))
      )
    )
  );

const deleteCourseTemplateEpic = (action$) =>
  action$.pipe(
    ofType(actions.DELETE_COURSE_TEMPLATE),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.delete_course_template.method,
        END_POINT.delete_course_template.url(
          action.payload.templateId,
          action.payload.organizationId
        )
      ).pipe(
        mergeMap(() => of(
            managerCourseTemplateActions.deleteCourseTemplateSuccess({
              canFetching: true,
              enqueueMessage: {
                message: 'Course template deleted successfully.',
                option: {
                  variant: 'success',
                },
              },
            })
          )),
        catchError((error) => of(
            { type: 'GLOBAL_ERROR', payload: { error } },
            managerCourseTemplateActions.deleteCourseTemplateFailed({
              isBusy: false,
            })
          ))
      )
    )
  );

export default [
  createCourseTemplateEpic,
  getCourseTemplateListEpic,
  getSchoolSettingEpic,
  getCourseTemplateDetailEpic,
  updateCourseTemplateEpic,
  viewTemplateDetailGetTermsEpic,
  viewTemplateDetailGetUnitEpic,
  publishToSchoolLibraryEpic,
  unPublishToSchoolLibraryEpic,
  publishToDistrictLibraryEpic,
  deleteCourseTemplateEpic,
];
