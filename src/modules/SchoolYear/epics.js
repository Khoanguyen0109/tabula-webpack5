import { ofType } from 'redux-observable';
import { of } from 'rxjs';
import { catchError, flatMap, mergeMap, switchMap } from 'rxjs/operators';

import { makeAjaxRequest } from '../../utils/ajax';

import schoolYearActions from './actions';
import { END_POINT, actions } from './constants';

const getSchoolYearListEpic = (action$) =>
  action$.pipe(
    ofType(actions.GET_SCHOOL_YEAR_LIST),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.get_school_year_list.method,
        END_POINT.get_school_year_list.url(
          action.payload.id,
          action.payload.urlParams
        )
      ).pipe(
        mergeMap((data) => {
          if (data.response.errors) {
            return schoolYearActions.getSchoolYearListFailed({
              error: data.response.errors,
              isBusy: false,
            });
          }
          const schoolYearList = data.response.schoolYears;
          return of(
            schoolYearActions.getSchoolYearListSuccess({
              schoolYearList,
              isBusy: false,
            })
          );
        }),
        catchError((error) =>
          of(
            { type: 'GLOBAL_ERROR', payload: { error } },
            schoolYearActions.getSchoolYearListFailed({
              error: error.response.errors,
              errorCode: error.status,
              isBusy: false,
            })
          )
        )
      )
    )
  );

const createSchoolYearEpic = (action$) =>
  action$.pipe(
    ofType(actions.CREATE_SCHOOL_YEAR),
    mergeMap((action) =>
      makeAjaxRequest(
        END_POINT.create_school_year.method,
        END_POINT.create_school_year.url(action.payload.orgId),
        action.payload.schoolYear
      ).pipe(
        mergeMap((data) => {
          if (data.response.errors) {
            return schoolYearActions.createSchoolYearSuccess({
              createSchoolYearFailed: data.response.errors,
            });
          }
          return of(
            schoolYearActions.createSchoolYearSuccess({
              createSchoolYearSuccess: true,
              schoolYearDetail: data.response.schoolYear,
              // schoolYearValidation: data?.response?.validate
            })
          );
        }),
        catchError((error) =>
          of(
            { type: 'GLOBAL_ERROR', payload: { error } },
            schoolYearActions.createSchoolYearFailed({
              createSchoolYearFailed: error.response.errors,
            })
          )
        )
      )
    )
  );

const getSchoolYearInformation = (action$) =>
  action$.pipe(
    ofType(actions.GET_SCHOOL_YEAR_INFORMATION),
    mergeMap((action) =>
      makeAjaxRequest(
        END_POINT.get_school_year_information.method,
        END_POINT.get_school_year_information.url(
          action.payload.orgId,
          action.payload.schoolYearId,
          action.payload.urlParams
        )
      ).pipe(
        mergeMap((data) => {
          if (data.response.errors) {
            return schoolYearActions.getSchoolYearInformationFailed({
              getSchoolYearInformationFailed: data.response.errors,
            });
          }
          return of(
            schoolYearActions.getSchoolYearInformationSuccess({
              getSchoolYearInformationSuccess: true,
              schoolYearDetail: data.response.schoolYear,
              // schoolYearValidation: data?.response?.validate
            })
          );
        }),
        catchError((error) =>
          of(
            { type: 'GLOBAL_ERROR', payload: { error } },
            schoolYearActions.getSchoolYearInformationFailed({
              getSchoolYearInformationFailed: error.response.errors,
            })
          )
        )
      )
    )
  );

const updateSchoolYearInformation = (action$) =>
  action$.pipe(
    ofType(actions.UPDATE_SCHOOL_YEAR_INFORMATION),
    mergeMap((action) =>
      makeAjaxRequest(
        END_POINT.update_school_year_information.method,
        END_POINT.update_school_year_information.url(
          action.payload.orgId,
          action.payload.schoolYearId,
          action.payload.urlParams
        ),
        action.payload.schoolYear
      ).pipe(
        mergeMap((data) => {
          if (data.response.errors) {
            return schoolYearActions.updateSchoolYearInformationFailed({
              updateSchoolYearInformationFailed: data.response.errors,
              subcodeErrorUpdateSchoolYear: data?.response?.errors?.subcode,
            });
          }
          // console.log(data.response);
          return of(
            schoolYearActions.updateSchoolYearInformationSuccess({
              updateSchoolYearInformationSuccess: true,
              schoolYearDetail: data.response.schoolYear,
              subcodeErrorUpdateSchoolYear: null,
              // termsGradingPeriodsList: data.response.schoolYear.terms,
              // schoolYearValidation: data?.response?.validate
            }),
            schoolYearActions.getSchoolYearValidation({
              orgId: action.payload.orgId,
              schoolYearId: action.payload.schoolYearId,
            })
          );
        }),
        catchError((error) =>
          of(
            schoolYearActions.updateSchoolYearInformationFailed({
              updateSchoolYearInformationFailed: error.response,
              subcodeErrorUpdateSchoolYear: error?.response?.errors?.subcode,
            })
          )
        )
      )
    )
  );

const deleteSchoolYearDraftEpic = (action$, state$) =>
  action$.pipe(
    ofType(actions.DELETE_SCHOOL_YEAR_DRAFT),
    mergeMap((action) =>
      makeAjaxRequest(
        END_POINT.delete_school_year_draft.method,
        END_POINT.delete_school_year_draft.url(
          action.payload.orgId,
          action.payload.schoolYearId
        )
      ).pipe(
        mergeMap(() => {
          const schoolYearList = state$.value.SchoolYear.schoolYearList.filter(
            (schoolYear) => schoolYear.id !== action.payload.schoolYearId
          );
          return of(
            schoolYearActions.deleteSchoolYearDraftSuccess({
              deleteSchoolYearDraftSuccess: true,
              schoolYearList,
            })
          );
        }),
        catchError((error) =>
          of(
            schoolYearActions.deleteSchoolYearDraftFailed({
              deleteSchoolYearDraftFailed: error.response.errors,
            })
          )
        )
      )
    )
  );
const getTermsGradingPeriodsListEpic = (action$) =>
  action$.pipe(
    ofType(actions.GET_TERMS_GRADING_PERIODS_LIST),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.get_terms_grading_periods_list.method,
        END_POINT.get_terms_grading_periods_list.url(
          action.payload.orgId,
          action.payload.schoolYearId
        )
      ).pipe(
        mergeMap((data) => {
          if (data.response.errors) {
            return schoolYearActions.getTermsGradingPeriodsListFailed({
              error: data.response.errors,
              isBusy: false,
            });
          }
          const termsGradingPeriodsList = data.response.schoolYear.terms;
          const schoolYearStatus = data.response.schoolYear.status;
          return of(
            schoolYearActions.getTermsGradingPeriodsListSuccess({
              termsGradingPeriodsList,
              schoolYearStatus,
              isBusy: false,
            })
          );
        }),
        catchError((error) =>
          of(
            schoolYearActions.getTermsGradingPeriodsListFailed({
              error: error.response.errors,
              errorCode: error.status,
              isBusy: false,
            })
          )
        )
      )
    )
  );

const updateTermsEpic = (action$) =>
  action$.pipe(
    ofType(actions.UPDATE_TERMS),
    mergeMap((action) =>
      makeAjaxRequest(
        END_POINT.update_terms.method,
        END_POINT.update_terms.url(
          action.payload.orgId,
          action.payload.schoolYearId,
          action.payload.termId,
          action.payload.urlParams
        ),
        action.payload.termInfo
      ).pipe(
        mergeMap((data) => {
          if (data.response.errors) {
            return schoolYearActions.updateTermsFailed({
              updateTermsFailed: data.response.errors,
            });
          }
          return of(
            schoolYearActions.updateTermsSuccess({
              updateTermsSuccess: true,
              termsGradingPeriodsList: data.response.schoolYear.terms,
            })
          );
        }),
        catchError((error) =>
          of(
            schoolYearActions.updateTermsFailed({
              updateTermsFailed: error.response?.errors,
            })
          )
        )
      )
    )
  );

const updateGradingPeriodsEpic = (action$) =>
  action$.pipe(
    ofType(actions.UPDATE_GRADING_PERIODS),
    mergeMap((action) =>
      makeAjaxRequest(
        END_POINT.update_grading_periods.method,
        END_POINT.update_grading_periods.url(
          action.payload.orgId,
          action.payload.schoolYearId,
          action.payload.termId,
          action.payload.urlParams
        ),
        action.payload.gradingPeriods
      ).pipe(
        mergeMap((data) => {
          if (data.response.errors) {
            return schoolYearActions.updateGradingPeriodsFailed({
              updateGradingPeriodsFailed: data.response.errors,
            });
          }
          return of(
            schoolYearActions.updateGradingPeriodsSuccess({
              // updateSchoolYearInformationSuccess: true,
              updateTermsSuccess: true,
              termsGradingPeriodsList: data.response.schoolYear.terms,
            })
          );
        }),
        catchError((error) =>
          of(
            schoolYearActions.updateGradingPeriodsFailed({
              updateGradingPeriodsFailed: error.response,
            })
          )
        )
      )
    )
  );

const getSchoolYearSchedulesEpic = (action$) =>
  action$.pipe(
    ofType(
      actions.GET_SCHOOL_YEAR_SCHEDULES,
      actions.SET_SCHEDULE_SUCCESS,
      actions.COPY_AND_PASTE_A_WEEK_SUCCESS
    ),
    flatMap((action) =>
      makeAjaxRequest(
        END_POINT.get_school_year_schedules.method,
        END_POINT.get_school_year_schedules.url(
          action.payload.orgId,
          action.payload.schoolYearId,
          action.payload.urlParams
        )
      ).pipe(
        mergeMap((data) => {
          if (data.response.errors) {
            return schoolYearActions.getSchoolYearSchedulesFailed({
              error: data.response.errors,
              isFetchingSchedules: false,
            });
          }
          return of(
            schoolYearActions.getSchoolYearSchedulesSuccess({
              schedules: data?.response?.terms,
              // validate: data?.response?.validate,
              isFetchingSchedules: false,
            })
          );
        }),
        catchError((error) =>
          of(
            schoolYearActions.getSchoolYearSchedulesFailed({
              // error: error.response.errors,
              errorCode: error.status,
              isFetchingSchedules: false,
            })
          )
        )
      )
    )
  );

const createTimeSlotEpic = (action$) =>
  action$.pipe(
    ofType(actions.CREATE_TIME_SLOT),
    mergeMap((action) =>
      makeAjaxRequest(
        END_POINT.create_time_slot.method,
        END_POINT.create_time_slot.url(
          action.payload.orgId,
          action.payload.dailyTemplateId
        ),
        action.payload.timeSlot
      ).pipe(
        mergeMap((data) => {
          if (data.response.errors) {
            return schoolYearActions.createTimeSlotSuccess({
              createTimeSlotFailed: data.response.errors,
            });
          }
          return of(
            schoolYearActions.createTimeSlotSuccess({
              createTimeSlotSuccess: true,
            }),
            schoolYearActions.getSchoolYearDailyTemplate({
              orgId: action.payload.orgId,
              schoolYearId: action.payload.schoolYearId,
              urlParams: action.payload?.urlParams,
            })
          );
        }),
        catchError((error) =>
          of(
            schoolYearActions.createTimeSlotFailed({
              createTimeSlotFailed: error.response.errors,
            })
          )
        )
      )
    )
  );

const createdDailyTemplateEpic = (action$) =>
  action$.pipe(
    ofType(actions.CREATE_DAILY_TEMPLATE),
    mergeMap((action) =>
      makeAjaxRequest(
        END_POINT.create_daily_template.method,
        END_POINT.create_daily_template.url(
          action.payload.orgId,
          action.payload.schoolYearId
        ),
        action.payload.dailyTemplate
      ).pipe(
        mergeMap(() =>
          of(
            schoolYearActions.createDailyTemplateSuccess({
              isCreateDailyTemplateSuccess: true,
              isLoadingCreateDailyTemplate: false,
            }),
            schoolYearActions.getSchoolYearDailyTemplate({
              orgId: action.payload.orgId,
              schoolYearId: action.payload.schoolYearId,
              urlParams: action.payload?.urlParams,
            })
          )
        ),
        catchError((error) =>
          of(
            schoolYearActions.createDailyTemplateFailed({
              createDailyTemplateError: error.response.errors,
              isLoadingCreateDailyTemplate: false,
            })
          )
        )
      )
    )
  );

const updateTimeSlotEpic = (action$) =>
  action$.pipe(
    ofType(actions.UPDATE_TIME_SLOT),
    mergeMap((action) =>
      makeAjaxRequest(
        END_POINT.update_time_slot.method,
        END_POINT.update_time_slot.url(
          action.payload.orgId,
          action.payload.dailyTemplateId,
          action.payload.periodId
        ),
        action.payload.timeSlot
      ).pipe(
        mergeMap((data) => {
          if (data.response.errors) {
            return schoolYearActions.updateTimeSlotSuccess({
              updateTimeSlotFailed: data?.response?.errors,
            });
          }
          return of(
            schoolYearActions.updateTimeSlotSuccess({
              updateTimeSlotSuccess: true,
            }),
            schoolYearActions.getSchoolYearDailyTemplate({
              orgId: action.payload.orgId,
              schoolYearId: action.payload.schoolYearId,
              urlParams: action.payload?.urlParams,
            })
          );
        }),
        catchError((error) =>
          of(
            schoolYearActions.updateTimeSlotFailed({
              updateTimeSlotFailed: error?.response?.errors,
            })
          )
        )
      )
    )
  );

const getSchoolYearDailyTemplateEpic = (action$) =>
  action$.pipe(
    ofType(actions.GET_SCHOOL_YEAR_DAILY_TEMPLATE),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.get_daily_template.method,
        END_POINT.get_daily_template.url(
          action.payload.orgId,
          action.payload.schoolYearId,
          action.payload.urlParams
        )
      ).pipe(
        mergeMap((data) => {
          if (data.response.errors) {
            return of(
              schoolYearActions.getSchoolYearDailyTemplateFailed({
                isFetchingDaily: false,
              })
            );
          }
          // console.log(value.SchoolYear)
          // const dailyTemplates = [...data.response.items];
          // console.log(dailyTemplates === value.dailyTemplates);
          return of(
            schoolYearActions.getSchoolYearDailyTemplateSuccess({
              dailyTemplates: data.response.items,
              isFetchingDaily: false,
            })
          );
        }),
        catchError((error) =>
          of(
            schoolYearActions.getSchoolYearDailyTemplateFailed({
              error: error.response.errors,
              isFetchingDaily: false,
            })
          )
        )
      )
    )
  );
const deletePeriodEpic = (action$) =>
  action$.pipe(
    ofType(actions.DELETE_SCHOOL_YEAR_PERIOD),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.delete_period.method,
        END_POINT.delete_period.url(
          action.payload.orgId,
          action.payload.templateId,
          action.payload.periodId
        )
      ).pipe(
        mergeMap(() =>
          // if (data.response.errors) {
          //   return of(schoolYearActions.deleteSchoolYearPeriodFailed({isDeletingPeriod: false}));
          // }
          of(
            schoolYearActions.deleteSchoolYearPeriodSuccess({
              isDeletingPeriod: false,
              deleteSchoolYearPeriodSuccess: true,
            }),
            schoolYearActions.getSchoolYearDailyTemplate({
              orgId: action.payload.orgId,
              schoolYearId: action.payload.schoolYearId,
            })
          )
        ),
        catchError((error) =>
          of(
            schoolYearActions.deleteSchoolYearPeriodFailed({
              error: error.response.errors,
              isDeletingPeriod: false,
              deleteSchoolYearPeriodFailed: error.response.errors,
            })
          )
        )
      )
    )
  );

const updateDailyTemplateEpic = (action$) =>
  action$.pipe(
    ofType(actions.UPDATE_SCHOOL_YEAR_TEMPLATE),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.update_template.method,
        END_POINT.update_template.url(
          action.payload.orgId,
          action.payload.schoolYearId,
          action.payload.templateId
        ),
        { ...action.payload }
      ).pipe(
        mergeMap((data) => {
          if (data.response.errors) {
            return of(
              schoolYearActions.updateSchoolYearTemplateFailed({
                isUpdatingTemplate: false,
              })
            );
          }
          return of(
            schoolYearActions.updateSchoolYearTemplateSuccess({
              isUpdatingTemplate: false,
              updateSchoolYearTemplateSuccess: true,
            }),
            schoolYearActions.getSchoolYearDailyTemplate({
              orgId: action.payload.orgId,
              schoolYearId: action.payload.schoolYearId,
            })
          );
        }),
        catchError((error) =>
          of(
            schoolYearActions.updateSchoolYearTemplateFailed({
              error: {
                ...error.response.errors,
                subcode: error.response.subcode,
              },
              isUpdatingTemplate: false,
              updateSchoolYearTemplateFailed: {
                ...error.response.errors,
                subcode: error.response.subcode,
                templateId: action.payload.templateId,
              },
            })
          )
        )
      )
    )
  );

const setScheduleEpic = (action$) =>
  action$.pipe(
    ofType(actions.SET_SCHEDULE),
    mergeMap((action) =>
      makeAjaxRequest(
        END_POINT.set_schedule.method,
        END_POINT.set_schedule.url(
          action.payload.orgId,
          action.payload.schoolYearId
        ),
        action.payload.params
      ).pipe(
        mergeMap((data) => {
          if (data.response.errors) {
            return schoolYearActions.setScheduleFailed(data.response.errors);
          }
          return of(
            schoolYearActions.setScheduleSuccess({
              orgId: action.payload.orgId,
              schoolYearId: action.payload.schoolYearId,
              urlParams: action.payload.urlParams,
              isSetScheduleSuccess: true,
              isSettingSchedule: false,
            })
          );
        }),
        catchError((error) =>
          of(
            schoolYearActions.setScheduleFailed({
              error: error?.response?.errors,
              isSettingSchedule: false,
            })
          )
        )
      )
    )
  );

const copyAndPasteAWeekEpic = (action$) =>
  action$.pipe(
    ofType(actions.COPY_AND_PASTE_A_WEEK),
    mergeMap((action) =>
      makeAjaxRequest(
        END_POINT.copy_and_paste_a_week.method,
        END_POINT.copy_and_paste_a_week.url(
          action.payload.orgId,
          action.payload.schoolYearId
        ),
        action.payload.params
      ).pipe(
        mergeMap((data) => {
          if (data.response.errors) {
            return of(
              schoolYearActions.copyAndPasteAWeekFailed({
                error: data.response.errors,
                isCopingAndPastingAWeek: false,
              })
            );
          }
          return of(
            schoolYearActions.copyAndPasteAWeekSuccess({
              orgId: action.payload.orgId,
              schoolYearId: action.payload.schoolYearId,
              urlParams: action.payload.urlParams,
              isSetScheduleSuccess: true,
              isCopingAndPastingAWeek: false,
            })
          );
        }),
        catchError((error) =>
          of(
            schoolYearActions.copyAndPasteAWeekFailed({
              error: error?.response?.errors,
              isCopingAndPastingAWeek: false,
            })
          )
        )
      )
    )
  );

const schoolYearValidationEpic = (action$) =>
  action$.pipe(
    ofType(actions.GET_SCHOOL_YEAR_VALIDATION),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.get_school_year_validation.method,
        END_POINT.get_school_year_validation.url(
          action.payload.orgId,
          action.payload.schoolYearId
        )
      ).pipe(
        mergeMap((data) =>
          of(
            schoolYearActions.getSchoolYearValidationSuccess({
              schoolYearValidation: data.response.validate,
              schoolYearStatus: data.response.status,
            })
          )
        )
      )
    )
  );

const getSettingTermsAndGradingPeriodsEpic = (action$) =>
  action$.pipe(
    ofType(actions.GET_SETTING_TERMS_AND_GRADING_PERIODS),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.get_setting_terms_and_grading_periods.method,
        END_POINT.get_setting_terms_and_grading_periods.url(
          action.payload.orgId,
          action.payload.schoolYearId
        )
      ).pipe(
        mergeMap((data) => {
          if (data.response.errors) {
            return schoolYearActions.getSettingTermsAndGradingPeriodsFailed({
              getSettingTermsAndGradingPeriodsFailed: data.response.errors,
            });
          }
          return of(
            schoolYearActions.getSettingTermsAndGradingPeriodsSuccess({
              getSettingTermsAndGradingPeriodsSuccess: true,
              settingTerms: data?.response?.terms,
              settingGradingPeriods: data?.response?.gradingPeriods,
            })
          );
        }),
        catchError((error) =>
          of(
            schoolYearActions.getSettingTermsAndGradingPeriodsFailed({
              getSettingTermsAndGradingPeriodsFailed: error.response.errors,
            })
          )
        )
      )
    )
  );
const getTermsBySchoolYearEpic = (action$) =>
  action$.pipe(
    ofType(actions.GET_TERMS_BY_SCHOOL_YEAR),
    switchMap((action) =>
      makeAjaxRequest(
        END_POINT.get_terms_by_school_year.method,
        END_POINT.get_terms_by_school_year.url(
          action.payload.orgId,
          action.payload.schoolYearId
        )
      ).pipe(
        mergeMap((data) =>
          of(
            schoolYearActions.getTermsBySchoolYearSuccess({
              termsList: data?.response?.terms,
              getTermsBySchoolYearSuccess: true,
            })
          )
        )
      )
    )
  );

const updateSettingTermsAndGradingPeriodsEpic = (action$) =>
  action$.pipe(
    ofType(actions.UPDATE_SETTING_TERMS_AND_GRADING_PERIODS),
    mergeMap((action) =>
      makeAjaxRequest(
        END_POINT.update_setting_terms_and_grading_periods.method,
        END_POINT.update_setting_terms_and_grading_periods.url(
          action.payload.orgId,
          action.payload.schoolYearId
        ),
        action.payload.settingData
      ).pipe(
        mergeMap((data) => {
          if (data.response.errors) {
            return schoolYearActions.updateSettingTermsAndGradingPeriodsFailed({
              updateSettingTermsAndGradingPeriodsFailed: data.response.errors,
            });
          }
          return of(
            schoolYearActions.updateSettingTermsAndGradingPeriodsSuccess({
              updateSettingTermsAndGradingPeriodsSuccess: true,
            }),
            schoolYearActions.getSettingTermsAndGradingPeriods({
              orgId: action.payload.orgId,
              schoolYearId: action.payload.schoolYearId,
            }),
            schoolYearActions.getSchoolYearValidation({
              orgId: action.payload.orgId,
              schoolYearId: action.payload.schoolYearId,
            }),
            schoolYearActions.getTermsGradingPeriodsList({
              orgId: action.payload.orgId,
              schoolYearId: action.payload.schoolYearId,
            })
          );
        }),
        catchError((error) =>
          of(
            schoolYearActions.updateSettingTermsAndGradingPeriodsFailed({
              updateSettingTermsAndGradingPeriodsFailed: error.response.errors,
            })
          )
        )
      )
    )
  );

const updateSchoolYearStatusEpic = (action$) =>
  action$.pipe(
    ofType(actions.UPDATE_SCHOOL_YEAR_STATUS),
    mergeMap((action) =>
      makeAjaxRequest(
        END_POINT.update_school_year_information.method,
        END_POINT.update_school_year_information.url(
          action.payload.orgId,
          action.payload.schoolYearId,
          action.payload.urlParams
        ),
        action.payload.schoolYear
      ).pipe(
        mergeMap((data) => {
          if (data.response.errors) {
            return schoolYearActions.updateSchoolYearStatusFailed({
              updateSchoolYearStatusFailed: data.response.errors,
            });
          }
          return of(
            schoolYearActions.updateSchoolYearStatusSuccess({
              updateSchoolYearStatusSuccess: true,
              schoolYearDetail: data.response.schoolYear,
            }),
            schoolYearActions.getSchoolYearValidation({
              orgId: action.payload.orgId,
              schoolYearId: action.payload.schoolYearId,
            })
          );
        }),
        catchError((error) =>
          of(
            schoolYearActions.updateSchoolYearStatusFailed({
              updateSchoolYearStatusFailed: error.response,
            })
          )
        )
      )
    )
  );

export default [
  createSchoolYearEpic,
  getSchoolYearListEpic,
  getSchoolYearInformation,
  updateSchoolYearInformation,
  deleteSchoolYearDraftEpic,
  getTermsGradingPeriodsListEpic,
  getSchoolYearSchedulesEpic,
  updateTermsEpic,
  updateGradingPeriodsEpic,
  getSchoolYearDailyTemplateEpic,
  deletePeriodEpic,
  updateDailyTemplateEpic,
  createTimeSlotEpic,
  updateTimeSlotEpic,
  createdDailyTemplateEpic,
  schoolYearValidationEpic,
  setScheduleEpic,
  copyAndPasteAWeekEpic,
  getSettingTermsAndGradingPeriodsEpic,
  updateSettingTermsAndGradingPeriodsEpic,
  getTermsBySchoolYearEpic,
  updateSchoolYearStatusEpic,
];
