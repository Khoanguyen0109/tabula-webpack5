import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router';

// import Fade from '@mui/material/Fade';
// import Confirm from 'components/TblConfirmDialog';
// import isEmpty from 'lodash/isEmpty';
import filter from 'lodash/filter';

import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import makeStyles from '@mui/styles/makeStyles';

import TblButton from 'components/TblButton';

import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';

import schoolYearActions from '../actions';
import CreateDailyTemplate from '../components/DailyTemplateAndTimeSlots/CreateDailyTemplate';
import DailyTemplateName from '../components/DailyTemplateAndTimeSlots/DailyTemplateName';
import ModifyTimeSlot from '../components/DailyTemplateAndTimeSlots/ModifyTimeSlot';
import TimeSlotsTable from '../components/DailyTemplateAndTimeSlots/TimeSlotsTable';
// import { isNull } from 'lodash';

const useStyles = makeStyles((theme) => ({
  templateBlock: {
    marginBottom: theme.spacing(5),
  },
  btnBlock: {
    marginBottom: theme.spacing(2),
  },
}));

function DailyTemplateAndTimeSlots(props) {
  // NOTE: get contexts
  const { t } = useTranslation(['schoolYear', 'common', 'error']);
  const { enqueueSnackbar } = useSnackbar();

  // const [isUpdatingTemplate, setUpdating] = setState(true);
  // NOTE: connect redux
  const dispatch = useDispatch();

  const dailyTemplates = useSelector(
    (state) => state.SchoolYear.dailyTemplates
  );
  // const isUpdatingTemplate = useSelector(state => state.SchoolYear.isUpdatingTemplate);
  const isFetchingDaily = useSelector(
    (state) => state.SchoolYear.isFetchingDaily
  );
  const isCreateDailyTemplateSuccess = useSelector(
    (state) => state.SchoolYear.isCreateDailyTemplateSuccess
  );
  const createDailyTemplateError = useSelector(
    (state) => state.SchoolYear.createDailyTemplateError
  );
  const createTimeSlotSuccess = useSelector(
    (state) => state.SchoolYear.createTimeSlotSuccess
  );
  const createTimeSlotFailed = useSelector(
    (state) => state.SchoolYear.createTimeSlotFailed
  );
  const updateTimeSlotFailed = useSelector(
    (state) => state.SchoolYear.updateTimeSlotFailed
  );
  const updateTimeSlotSuccess = useSelector(
    (state) => state.SchoolYear.updateTimeSlotSuccess
  );
  // const error = useSelector(state => state.SchoolYear.error);

  const deleteSchoolYearPeriodFailed = useSelector(
    (state) => state.SchoolYear.deleteSchoolYearPeriodFailed
  );
  const updateSchoolYearTemplateFailed = useSelector(
    (state) => state.SchoolYear.updateSchoolYearTemplateFailed
  );
  const deleteSchoolYearPeriodSuccess = useSelector(
    (state) => state.SchoolYear.deleteSchoolYearPeriodSuccess
  );
  const updateSchoolYearTemplateSuccess = useSelector(
    (state) => state.SchoolYear.updateSchoolYearTemplateSuccess
  );

  const timeSlot = useSelector((state) => state.SchoolYear.timeSlot);
  const classes = useStyles();
  const isLoadingCreateDailyTemplate = useSelector(
    (state) => state.SchoolYear.isLoadingCreateDailyTemplate
  );

  // NOTE: initial states and props
  const { match } = props;
  const [isVisibleCreateDailyTemplate, setIsVisibleCreateDailyTemplate] =
    useState(false);
  const { currentUser } = useSelector((state) => state.Auth);

  const [visibleDialogTimeSlot, setVisibleDialogTimeSlot] = useState(false);
  const [period, setPeriod] = useState(null);

  // NOTE: common functions
  const createTimeSlot = (payload) => {
    const { organizationId } = currentUser;
    const { timeSlot } = payload;
    dispatch(
      schoolYearActions.createTimeSlot({
        orgId: organizationId,
        schoolYearId: match.params.schoolYearId,
        dailyTemplateId: visibleDialogTimeSlot,
        timeSlot,
        urlParams: {
          timezone: currentUser?.timezone,
        },
      })
    );
  };

  const updateTimeSlot = (payload, templateId = null) => {
    const { periodId, timeSlot } = payload;
    dispatch(
      schoolYearActions.updateTimeSlot({
        orgId: currentUser.organizationId,
        dailyTemplateId: templateId ?? visibleDialogTimeSlot,
        schoolYearId: match.params.schoolYearId,
        updateTimeSlotSuccess: null,
        periodId,
        timeSlot,
        urlParams: {
          timezone: currentUser?.timezone,
        },
      })
    );
  };

  const onDeletePeriod = (periodId, templateId) => {
    dispatch(
      schoolYearActions.deleteSchoolYearPeriod({
        orgId: currentUser.organizationId,
        schoolYearId: match.params.schoolYearId,
        templateId,
        periodId,
        isDeletingPeriod: true,
        error: {},
      })
    );
  };

  const onUpdatePeriod = (data) => {
    updateTimeSlot(data.payload, data.templateId);
  };

  const updateTemplate = (name, templateId) => {
    dispatch(
      schoolYearActions.updateSchoolYearTemplate({
        orgId: currentUser.organizationId,
        schoolYearId: match.params.schoolYearId,
        templateName: name,
        templateId,
        isUpdatingTemplate: true,
        urlParams: {
          timezone: currentUser?.timezone,
        },
        error: {},
      })
    );
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const getSchoolYearDailyTemplate = useCallback(() => {
    dispatch(
      schoolYearActions.getSchoolYearDailyTemplate({
        orgId: currentUser.organizationId,
        schoolYearId: match.params.schoolYearId,
        isFetchingDaily: true,
        urlParams: {
          timezone: currentUser?.timezone,
        },
      })
    );
  });

  // NOTE: handle react lifecycle
  const setState = useCallback((values) => {
    dispatch(schoolYearActions.schoolYearSetState(values));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    getSchoolYearDailyTemplate();
    // Component will unmount
    return () => {
      setState({
        dailyTemplates: [],
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      isCreateDailyTemplateSuccess ||
      createTimeSlotSuccess ||
      updateTimeSlotSuccess ||
      updateSchoolYearTemplateSuccess ||
      deleteSchoolYearPeriodSuccess
    ) {
      const objectName = isCreateDailyTemplateSuccess
        ? t('common:daily_template')
        : t('common:time_slot');
      const message =
        isCreateDailyTemplateSuccess || createTimeSlotSuccess
          ? t('common:object_created', { objectName })
          : t('common:change_saved');

      enqueueSnackbar(message, { variant: 'success' });
      if (isCreateDailyTemplateSuccess) {
        toggleDialogDailyTemplate();
      }
      dispatch(
        schoolYearActions.schoolYearSetState({
          isCreateDailyTemplateSuccess: false,
          createTimeSlotSuccess: false,
          updateTimeSlotSuccess: false,
          updateSchoolYearTemplateSuccess: false,
          deleteSchoolYearPeriodSuccess: false,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isCreateDailyTemplateSuccess,
    createTimeSlotSuccess,
    updateTimeSlotSuccess,
    updateSchoolYearTemplateSuccess,
    deleteSchoolYearPeriodSuccess,
  ]);

  // useEffect(() => {
  //   console.log(isDeletingPeriod, 'isDeletingPeriod', error);
  //   if (isDeletingPeriod !== null && !isDeletingPeriod && !isEmpty(error) && error?.subcode === 1) {
  //     enqueueSnackbar(t('error:restriction_of_school_year_toast'), { variant: 'error' });
  //   }
  // }, [enqueueSnackbar, error, isDeletingPeriod, t]);

  useEffect(() => {
    /**
     * NOTE: Fix bug TL-3057
     * REASON: Backend change subcode from 1 to 2
     */
    if (updateTimeSlotFailed?.subcode === 2 && !visibleDialogTimeSlot) {
      const keyArray = Object.keys(timeSlot);
      if (keyArray.length > 0 && ['study', 'studyHall'].includes(keyArray[0])) {
        enqueueSnackbar(
          t('error:restriction_of_school_year', {
            objectName: "time slot's type",
          }),
          { variant: 'error' }
        );
      }
      dispatch(
        schoolYearActions.schoolYearSetState({ updateTimeSlotFailed: null })
      );
    } else if (deleteSchoolYearPeriodFailed?.subcode === 1) {
      enqueueSnackbar(t('error:restriction_of_school_year_toast'), {
        variant: 'error',
      });
      dispatch(
        schoolYearActions.schoolYearSetState({
          deleteSchoolYearPeriodFailed: null,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    updateTimeSlotFailed,
    deleteSchoolYearPeriodFailed,
    updateSchoolYearTemplateFailed,
  ]);

  // NOTE: common functions
  const toggleDialogTimeSlot = (value = false) => {
    setVisibleDialogTimeSlot(value);
    setState({
      createTimeSlotSuccess: false,
      updateTimeSlotSuccess: false,
      createTimeSlotFailed: null,
      updateTimeSlotFailed: null,
    });
  };

  const selectTemplateToAddTimeSlot = (value, period) => (e) => {
    e.preventDefault();
    setVisibleDialogTimeSlot(value);
    setPeriod(period);
  };

  const selectTimeSlot = (value, period) => {
    if (value) {
      dispatch(
        schoolYearActions.schoolYearSetState({
          updateTimeSlotFailed: null,
        })
      );
    }
    setVisibleDialogTimeSlot(value);
    setPeriod(period);
  };

  const toggleDialogDailyTemplate = () => {
    setIsVisibleCreateDailyTemplate(!isVisibleCreateDailyTemplate);
    if (isVisibleCreateDailyTemplate) {
      dispatch(
        schoolYearActions.schoolYearSetState({
          createDailyTemplateError: undefined,
          isCreateDailyTemplateSuccess: undefined,
        })
      );
    }
  };

  const createDailyTemplate = (values) => {
    dispatch(
      schoolYearActions.createDailyTemplate({
        isLoadingCreateDailyTemplate: true,
        orgId: currentUser.organizationId,
        schoolYearId: match.params.schoolYearId,
        dailyTemplate: { ...values },
      })
    );
  };

  const dailyTemplateWithoutHoliday = filter(
    dailyTemplates,
    (item) => !item?.template?.holiday
  );

  return (
    <div>
      <div className={classes.btnBlock}>
        <TblButton
          color='primary'
          variant='contained'
          type='submit'
          onClick={() => toggleDialogDailyTemplate()}
        >
          {t('common:new')}
        </TblButton>
      </div>
      {isVisibleCreateDailyTemplate && (
        <CreateDailyTemplate
          isVisible={isVisibleCreateDailyTemplate}
          toggleDialog={toggleDialogDailyTemplate}
          onSubmit={createDailyTemplate}
          isCreateDailyTemplateSuccess={isCreateDailyTemplateSuccess}
          setState={setState}
          createDailyTemplateError={createDailyTemplateError}
          isLoading={isLoadingCreateDailyTemplate}
        />
      )}
      {visibleDialogTimeSlot && (
        <ModifyTimeSlot
          t={t}
          visibleDialog={visibleDialogTimeSlot}
          toggleDialog={toggleDialogTimeSlot}
          isEdit={!!period}
          timeSlotDetail={period}
          saveData={(payload) =>
            !!period ? updateTimeSlot(payload) : createTimeSlot(payload)
          }
          createTimeSlotSuccess={createTimeSlotSuccess}
          createTimeSlotFailed={createTimeSlotFailed}
          updateTimeSlotSuccess={updateTimeSlotSuccess}
          updateTimeSlotFailed={updateTimeSlotFailed}
        />
      )}
      {isFetchingDaily ? (
        <>
          <Skeleton variant='text' animation='wave' />
          <Skeleton variant='text' animation='wave' />
          <Skeleton variant='text' animation='wave' />
        </>
      ) : (
        dailyTemplateWithoutHoliday.map((template) => (
          <div key={template.template.id} className={classes.templateBlock}>
            <DailyTemplateName
              t={t}
              template={template.template}
              updateTemplate={updateTemplate}
              enqueueSnackbar={enqueueSnackbar}
              error={updateSchoolYearTemplateFailed}
            />
            <TimeSlotsTable
              t={t}
              onDelete={onDeletePeriod}
              onUpdatePeriod={onUpdatePeriod}
              template={template}
              toggleDialogTimeSlot={(period) =>
                selectTimeSlot(template.template.id, period)
              }
            />
            <Typography
              component='a'
              href='#'
              color='secondary'
              onClick={selectTemplateToAddTimeSlot(template.template.id)}
              variant='bodyMedium'
              style={{ marginLeft: '8px' }}
            >
              {t('add_time_slot')}
            </Typography>
          </div>
        ))
      )}
    </div>
  );
}

DailyTemplateAndTimeSlots.propTypes = {
  match: PropTypes.object,
  createDailyTemplate: PropTypes.func,
  currentUser: PropTypes.object,
  schoolYearDetail: PropTypes.object,
  isCreateDailyTemplateSuccess: PropTypes.bool,
  createDailyTemplateError: PropTypes.object,
  authContext: PropTypes.object,
};

export default withRouter(DailyTemplateAndTimeSlots);
