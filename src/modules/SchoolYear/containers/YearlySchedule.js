import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import findLast from 'lodash/findLast';
import isEmpty from 'lodash/isEmpty';

import Box from '@mui/material/Box';
import withStyles from '@mui/styles/withStyles';

import EmptyContent from 'components/EmptyContent';
import TblContextMenu from 'components/TblContextMenu';
import TblExpansionPanel from 'components/TblExpansionPanel';

import { AuthDataContext } from 'AppRoute/AuthProvider';
import { withSnackbar } from 'notistack';
import PropTypes from 'prop-types';

import schoolYearActions from '../actions';
import GradingPeriodList from '../components/YearlySchedule/GradingPeriodList';
import YearlyScheduleSkeleton from '../components/YearlySchedule/Skeleton';

const styles = (theme) => ({
  contextMenuItem: {
    display: 'flex',
    flex: 1,
    maxWidth: '100%',
  },
  contextMenuLabel: {
    flex: 1,
    // maxWidth: '80%',
    maxWidth: '200px',
    whiteSpace: 'nowrap',
    overflow: ' hidden !important',
    textOverflow: 'ellipsis',
  },
  contextMenuColorRight: {
    height: theme.spacing(3),
    width: theme.spacing(3),
    borderRadius: theme.spacing(0.5),
  },
  headerMenu: {
    color: theme.mainColors.tertiary[7],
    fontSize: theme.fontSize.small,
    fontWeight: theme.fontWeight.semi,
  },
  resetSchedule: {
    color: theme.mainColors.red[0],
    paddingTop: theme.spacing(1),
  },
});

class YearlySchedule extends React.PureComponent {
  static contextType = AuthDataContext;
  constructor(props) {
    super(props);

    this.state = {
      panels: [],
      contextMenu: {},
    };
  }

  componentDidMount() {
    /**
     * @functionoverview Get yearly schedule of current school year only once.
     */
    const {
      organizationId,
      organization: { timezone },
    } = this.context.currentUser;
    this.props.getSchoolYearSchedules({
      orgId: organizationId,
      schoolYearId: this.props.schoolYearId,
      urlParams: { timezone },
      isFetchingSchedules: true,
    });
    this.props.getSchoolYearDailyTemplate({
      orgId: organizationId,
      schoolYearId: this.props.schoolYearId,
      isFetchingDaily: true,
      urlParams: {
        timezone,
      },
    });
  }

  componentWillUnmount() {
    // reset schedule, dailytemplates prevent render when componnent mount again
    this.props.schoolYearSetState({
      schedules: [],
      dailyTemplates: [],
      error: {},
    });
  }

  componentDidUpdate(prevProps) {
    const {
      isSetScheduleSuccess,
      enqueueSnackbar,
      t,
      resetSchoolYearReducer,
      error,
    } = this.props;
    if (isSetScheduleSuccess) {
      enqueueSnackbar(t('common:change_saved'), { variant: 'success' });
      resetSchoolYearReducer({ isSetScheduleSuccess: false });
    }
    if (
      !isEmpty(error) &&
      (prevProps.isSettingSchedule || prevProps.isCopingAndPastingAWeek)
    ) {
      let errorMessage = '';
      switch (error?.subcode) {
        case 1:
          errorMessage = error.message;
          break;
        case 4:
          errorMessage = t('error:restriction_of_school_year_toast');
          break;
        default:
          errorMessage = t('error:general_error');
          break;
      }
      enqueueSnackbar(errorMessage, { variant: 'error' });
    }
  }

  /**
   * Generate expansion panels when schedules changed.
   * @param {object} schedules - Yearly schedules of current school year
   * @setState {array} - panels
   */
  generatePanels = () => {
    const { schedules } = this.props;
    let panels = [];
    if (!isEmpty(schedules)) {
      for (let key in schedules) {
        panels.push({
          title: key,
          children: (
            <GradingPeriodList
              scrollClass='scroll-here'
              openCopyMenu={this.openCopyMenu}
              onClickSchedule={this.handleClickSchedule}
              termName={key}
              gradingPeriods={schedules[key]}
            />
          ),
        });
      }
    }
    return panels;
  };

  handleClickSchedule = (event, schedule) => {
    this.setState({
      contextMenu: {
        event: { currentTarget: event, times: new Date().getTime() },
        schedule,
      },
    });
  };

  setSchedule = (item) => {
    const {
      organizationId,
      organization: { timezone },
    } = this.context.currentUser;
    const {
      contextMenu: { schedule },
    } = this.state;
    this.props.setSchedule({
      orgId: organizationId,
      schoolYearId: this.props.schoolYearId,
      params: {
        gradingPeriodId: schedule.gradingPeriodId,
        gradingDailyTemplateId: schedule.gradingDailyTemplateId,
        dailyTemplateId: item?.template?.id || null,
      },
      urlParams: { timezone },
      error: {},
      isSettingSchedule: true,
    });
  };

  generateContextMenu = () => {
    const { classes, t, dailyTemplates } = this.props;
    const {
      contextMenu: { isWeekMenu, schedule },
      weekCopied,
      selectedWeek,
    } = this.state;
    let content = [];
    if (isWeekMenu) {
      content = [
        {
          content: (
            <Box className={classes.contextMenuItem}>{t('copy_schedule')}</Box>
          ),
          onClick: this.onCopyWeek,
          value: selectedWeek,
        },
        {
          content: (
            <Box className={classes.contextMenuItem}>{t('paste_schedule')}</Box>
          ),
          onClick: this.copyAndPasteAWeek,
          value: selectedWeek,
          disabled: isEmpty(weekCopied),
        },
      ];
    } else {
      dailyTemplates.map(
        (item, index) =>
          (content[index] = {
            content: (
              <Box className={classes.contextMenuItem}>
                <div className={classes.contextMenuLabel}>
                  {item.template.templateName}
                </div>
                <div
                  className={classes.contextMenuColorRight}
                  style={{ backgroundColor: item.template.color }}
                />
              </Box>
            ),
            onClick: this.setSchedule,
            value: item,
          })
      );
      content.splice(0, 0, {
        content: (
          <Box className={classes.headerMenu}>
            {`${t('select_template')}...`}
          </Box>
        ),
        header: true,
        disabled: true,
      });
      if (schedule?.dailyTemplateId) {
        content.push({
          content: (
            <Box className={classes.resetSchedule}>{t('common:reset')}</Box>
          ),
          divider: true,
          value: {},
          onClick: this.setSchedule,
        });
      }
    }

    return content;
  };

  openCopyMenu = (event, selectedWeek) => {
    this.setState({
      contextMenu: {
        event: { currentTarget: event, times: new Date().getTime() },
        isWeekMenu: true,
      },
      selectedWeek,
    });
  };

  onCopyWeek = (weekCopied) => {
    this.setState({ weekCopied });
  };

  copyAndPasteAWeek = (selectedWeek) => {
    const { weekCopied } = this.state;
    const {
      organizationId,
      organization: { timezone },
    } = this.context.currentUser;
    let generateWeekForPaste = selectedWeek.week.map((day) => {
      const weekCopy = findLast(
        weekCopied?.week,
        (item) => day.dayofweek === item.dayofweek
      );
      day.dailyTemplateId = weekCopy ? weekCopy?.dailyTemplateId : null;
      return day;
    });

    // generateWeekForPaste = filter(selectedWeek.week, day => day.date);

    this.props.copyAndPasteAWeek({
      orgId: organizationId,
      schoolYearId: this.props.schoolYearId,
      params: { [selectedWeek.weekNumber]: generateWeekForPaste },
      urlParams: { timezone },
      isCopingAndPastingAWeek: true,
    });
  };

  renderContent = () => {
    const { schedules } = this.props;
    const keysOfSchedule = Object.keys(schedules);
    if (keysOfSchedule.length > 1) {
      return <TblExpansionPanel unMountOnExit panels={this.generatePanels()} />;
    }
    return (
      <GradingPeriodList
        scrollClass='scroll-here'
        hiddenGradingPeriodName
        openCopyMenu={this.openCopyMenu}
        onClickSchedule={this.handleClickSchedule}
        termName={keysOfSchedule[0]}
        gradingPeriods={schedules[keysOfSchedule[0]]}
      />
    );
  };

  render() {
    const { contextMenu } = this.state;
    const { isFetchingSchedules, schedules, t } = this.props;
    return (
      <Box width='100%'>
        <TblContextMenu
          element={contextMenu.event}
          menus={this.generateContextMenu()}
          scrollClass='scroll-here'
        />
        {isFetchingSchedules ? (
          <YearlyScheduleSkeleton />
        ) : isEmpty(schedules) ? (
          <EmptyContent
            subTitle={t('schedule_empty_message')}
            className='style1'
            width='auto'
          />
        ) : (
          this.renderContent()
        )}
      </Box>
    );
  }
}

YearlySchedule.propTypes = {
  schoolYearId: PropTypes.number,
  dailyTemplates: PropTypes.array,
  isFetchingSchedules: PropTypes.bool,
  getSchoolYearSchedules: PropTypes.func,
  setSchedule: PropTypes.func,
  schedules: PropTypes.object,
  classes: PropTypes.object,
  isSetScheduleSuccess: PropTypes.bool,
  enqueueSnackbar: PropTypes.func,
  resetSchoolYearReducer: PropTypes.func,
  t: PropTypes.func,
  getSchoolYearDailyTemplate: PropTypes.func,
  schoolYearSetState: PropTypes.func,
  copyAndPasteAWeek: PropTypes.func,
  isSettingSchedule: PropTypes.bool,
  error: PropTypes.object,
  isCopingAndPastingAWeek: PropTypes.bool,
};

const mapStateToProps = (state) => ({
  dailyTemplates: state.SchoolYear.dailyTemplates,
  schedules: state.SchoolYear.schedules,
  isFetchingSchedules: state.SchoolYear.isFetchingSchedules,
  isSetScheduleSuccess: state.SchoolYear.isSetScheduleSuccess,
  error: state.SchoolYear.error,
  isSettingSchedule: state.SchoolYear.isSettingSchedule,
  isCopingAndPastingAWeek: state.SchoolYear.isCopingAndPastingAWeek,
});

const mapDispatchToProps = (dispatch) => ({
  schoolYearSetState: (payload) =>
    dispatch(schoolYearActions.schoolYearSetState(payload)),
  getSchoolYearSchedules: (payload) =>
    dispatch(schoolYearActions.getSchoolYearSchedules(payload)),
  setSchedule: (payload) => dispatch(schoolYearActions.setSchedule(payload)),
  resetSchoolYearReducer: (payload) =>
    dispatch(schoolYearActions.resetSchoolYearReducer(payload)),
  copyAndPasteAWeek: (payload) =>
    dispatch(schoolYearActions.copyAndPasteAWeek(payload)),
  getSchoolYearDailyTemplate: (payload) =>
    dispatch(schoolYearActions.getSchoolYearDailyTemplate(payload)),
});
const YearlyScheduleStyled = withStyles(styles)(YearlySchedule);
const YearlyScheduleStyledExport = withSnackbar(
  withTranslation(['schoolYear', 'auth', 'common'])(
    connect(mapStateToProps, mapDispatchToProps)(YearlyScheduleStyled)
  )
);
export default React.memo(YearlyScheduleStyledExport);
