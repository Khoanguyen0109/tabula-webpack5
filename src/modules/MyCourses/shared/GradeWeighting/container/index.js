import React from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import debounce from 'lodash/debounce';
import flowRight from 'lodash/flowRight';
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import trim from 'lodash/trim';
import uniqueId from 'lodash/uniqueId';

import CancelIcon from '@mui/icons-material/Cancel';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import withStyles from '@mui/styles/withStyles';

import TblConfirmDialog from 'components/TblConfirmDialog';
import TblIconButton from 'components/TblIconButton';
import TblIndicator from 'components/TblIndicator';
import TblInputs from 'components/TblInputs';
import TblSelect from 'components/TblSelect';
import TblTableForm from 'components/TblTableForm';
import TblTooltip from 'components/TblTooltip';

import { TEACHER } from 'utils/roles';

import {
  COURSE_STATUS,
  UPDATE_COURSE_SUBCODE,
} from 'shared/MyCourses/constants';

import { AuthDataContext } from 'AppRoute/AuthProvider';
import cloneDeep from 'lodash-es/cloneDeep';
import MyCoursesActions from 'modules/MyCourses/actions';
import { TabNameEnumTeacher } from 'modules/MyCourses/constants';
import { withSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { checkPermission } from 'utils';

import { GRADE_WEIGHT_TYPE } from '../../../constants';

// import withReducer from 'components/withReducer';

const ROLES_UPDATE = [TEACHER];
const styles = (theme) => ({
  root: {
    minWidth: theme.spacing(70),
    '& .description-table': {
      paddingLeft: 8,
      fontWeight: theme.fontWeight.semi,
      color: theme.palette.primary.main,
      fontSize: theme.fontSize.small,
    },
    '& .help-text': {
      fontSize: 12,
      paddingLeft: 8,
      marginBottom: theme.spacing(2),
    },
    '& .MuiTableContainer-root': {
      overflowX: 'hidden',
    },
  },
});

const LIMIT_OF_PARTICIPATION_TYPE = 5;
class GradeWeighting extends React.PureComponent {
  static contextType = AuthDataContext;

  constructor(props) {
    super(props);
    this.state = {
      gradeWeight: [],
      selectOpen: false,
      isVisibleErrorModal: false,
      errorMessage: '',
      deleteGradeWeight: null,
      isVisibleDeleteParticipationModal: false,
    };
    this.getGradeWeight();
  }

  static getDerivedStateFromProps(props, state) {
    const newState = {};
    if (
      !state.selfUpdate &&
      isEmpty(state.gradeWeight) &&
      props.gradeWeight &&
      !isEqual(props.gradeWeight, state.gradeWeight)
    ) {
      const cloneProps = cloneDeep(props);
      newState.gradeWeight = cloneProps.gradeWeight.map((grade) => grade);
    }
    if (isEmpty(newState)) {
      return null;
    }
    return newState;
  }

  componentDidUpdate(prevProps) {
    const { match, currentUser, error, t } = this.props;
    const { organizationId } = currentUser;
    if (
      this.props.updateGradeWeightSuccess &&
      this.props.updateGradeWeightSuccess !== prevProps.updateGradeWeightSuccess
    ) {
      const { location } = this.props;
      const searchParams = new URLSearchParams(location.search);
      if (searchParams.get('active') === TabNameEnumTeacher.INFORMATION.name) {
        this.props.getCourseValidation({
          orgId: organizationId,
          courseId: match.params.courseId,
        });
      }
      this.props.enqueueSnackbar(this.props.t('common:change_saved'), {
        variant: 'success',
      });
    }
    /** fix bug TL-3017:
     * Trace result: Grade weight state is not updated from props after saving successfully
     * Solution: get gradeweight again after saving successfully and update gradeweight state
     * Clone deep props*/
    if (this.props.mcGetGradeWeightSuccess) {
      const cloneProps = cloneDeep(this.props);
      this.setState({ gradeWeight: cloneProps.gradeWeight || [] });
      this.props.gradeWeightingSetState({ mcGetGradeWeightSuccess: false });
    }
    /** */
    if (
      this.props.error &&
      !isEmpty(this.props.error) &&
      error.subcode !==
        UPDATE_COURSE_SUBCODE.DELETE_GRADE_WEIGHT_CATEGORY_FAILED
    ) {
      this.props.enqueueSnackbar(this.props.error.message, {
        variant: 'error',
      });
      this.props.gradeWeightingSetState({ error: null });
    }

    if (
      this.props?.error?.subcode ===
      UPDATE_COURSE_SUBCODE.DELETE_GRADE_WEIGHT_CATEGORY_FAILED
    ) {
      this.setState({
        isVisibleErrorModal: true,
        errorMessage: (
          <Box fontSize={15}>
            <Box>{t('error:message_failed_save')}</Box>
            <Box>
              {t('error:can_not_delete_grade_weight', {
                gradeCategoryName: this.state.deleteGradeWeight?.name,
              })}
            </Box>
          </Box>
        ),
      });
      this.props.gradeWeightingSetState({ error: null });
      this.getGradeWeight();
    }
  }

  // componentWillUnmount() {
  //   this.props.myCoursesSetState({ gradeWeight: [] });
  // }

  getGradeWeight = () => {
    const { match, currentUser } = this.props;
    const { organizationId } = currentUser;
    this.props.getGradeWeight({
      orgId: organizationId,
      courseId: match.params.courseId,
    });
  };

  saveGrade = debounce(() => {
    const { match, currentUser } = this.props;
    const { gradeWeight } = this.state;
    const { organizationId } = currentUser;
    const newGradeWeight = gradeWeight.filter(
      (g) => g.weight && g.name && g.type
    );
    this.props.updateGradeWeight({
      orgId: organizationId,
      courseId: match.params.courseId,
      updateGradeWeightSuccess: false,
      error: {},
      criterias: newGradeWeight.map((grade) => {
        const updateGrade = { ...grade, name: trim(grade.name) };
        const { id, weight, ...newGrade } = updateGrade;
        if (typeof id === 'string') {
          return { weight: Number(weight), ...newGrade };
        }
        return { weight: Number(weight), ...updateGrade };
      }),
    });
  }, 200);

  addRecord = (e) => {
    e.preventDefault();
    const { gradeWeight } = this.state;
    const lastItem = gradeWeight && gradeWeight[gradeWeight?.length - 1];
    if (
      lastItem &&
      (lastItem?.name === '' || lastItem?.type === '' || !lastItem?.weight)
    ) {
      return;
    }
    const total =
      gradeWeight?.reduce((total, grade) => total + Number(grade.weight), 0) ||
      0;
    gradeWeight.push({
      id: uniqueId('row_'),
      name: '',
      type: '',
      weight: total < 100 ? 100 - total : 0,
    });
    this.setState({ gradeWeight: [...gradeWeight] });
  };

  removeRowAction = (record) => {
    const { gradeWeight } = this.state;
    const newGradeWeight = gradeWeight.filter((i) => i.id !== record.id);
    this.setState(
      {
        gradeWeight: newGradeWeight.length ? [...newGradeWeight] : [],
        selfUpdate: true,
        deleteGradeWeight: record,
      },
      () => {
        if (!isNaN(record.id)) {
          this.saveGrade();
        }
      }
    );
  };
  removeRow = (record) => () => {
    if (record.type === GRADE_WEIGHT_TYPE.PARTICIPATION) {
      this.setState({
        isVisibleDeleteParticipationModal: true,
        deleteGradeWeight: record,
      });
      return;
    }
    this.removeRowAction(record);
  };

  handleChange = (record, name, disableParticipation) => (e) => {
    const { gradeWeight } = this.state;
    // record[name] = e.target.value;
    gradeWeight.forEach((grade) => {
      if (grade.id === record.id) {
        if (name === 'weight' && !isNaN(e.target.value)) {
          grade[name] = Math.round(e.target.value * 100) / 100;
        } else {
          //TL-4605 Disable participation select when reach the maximum participation
          if (
            disableParticipation &&
            name === 'type' &&
            e.target.value === GRADE_WEIGHT_TYPE.PARTICIPATION
          ) {
            return;
          }
          grade[name] = e.target.value;
        }
      }
    });
    this.setState({ gradeWeight: [...gradeWeight] }, () => {
      if (name === 'type') {
        this.validateData(record)();
      }
    });
  };

  onOpenSelect = () => {
    this.setState({
      selectOpen: true,
    });
  };
  onSelectClose = () => {
    this.setState({
      selectOpen: false,
    });
  };

  validateData = (record) => () => {
    const { gradeWeight } = this.state;
    const newRecord = { ...record, name: trim(record.name) };
    if (
      !newRecord.weight ||
      Number(newRecord.weight) > 100 ||
      !newRecord.type ||
      !trim(newRecord.name)
    ) {
      return;
    }
    const total = gradeWeight.reduce(
      (total, grade) => total + Number(grade.weight),
      0
    );

    if (isEqual(gradeWeight, this.props.gradeWeight)) {
      return;
    }
    if (total > 100) {
      return;
    }
    this.saveGrade();
  };

  render() {
    const { /*classes, */ t, classes, permission, currentUser, basicInfo } =
      this.props;
    const { gradeWeight, selectOpen } = this.state;

    const total = gradeWeight
      ? Number(
          gradeWeight?.reduce(
            (total, grade) => total + Number(grade.weight || 0),
            0
          )
        ).toFixed(2)
      : 0;

    const numberOfParticipationType = gradeWeight.filter(
      (item) => item.type === 2
    ).length;

    const hasPermission = checkPermission(
      permission || currentUser,
      ROLES_UPDATE
    );

    const hasPermissionUpdate =
      hasPermission && basicInfo.status === COURSE_STATUS.DRAFT;

    const columns = [
      {
        title: t('myCourses:category'),
        dataIndex: 'name',
        cursor: true,
        width: '30%',
        key: 'name',
        disabled: !hasPermissionUpdate,
        render: (text, record) => (
          <TblInputs
            value={text}
            disabled={!hasPermissionUpdate}
            inputProps={{ maxLength: 254 }}
            onBlur={this.validateData(record)}
            onChange={this.handleChange(record, 'name')}
            placeholder={t('myCourses:enter_category')}
            noneBorder={true}
          />
        ),
      },
      {
        title: t('myCourses:type'),
        dataIndex: 'type',
        cursor: true,
        width: '30%',
        key: 'type',
        disabled: !hasPermissionUpdate,
        render: (text, record) => {
          const isNewRow = record.id.toString().includes('row_');
          const disableParticipation =
            selectOpen &&
            (isNewRow
              ? numberOfParticipationType >= LIMIT_OF_PARTICIPATION_TYPE
              : numberOfParticipationType >= LIMIT_OF_PARTICIPATION_TYPE &&
                record.type !== GRADE_WEIGHT_TYPE.PARTICIPATION);
          return (
            <TblSelect
              onChange={this.handleChange(record, 'type', disableParticipation)}
              value={text}
              disabled={!isNewRow || !hasPermissionUpdate}
              placeholder={t('common:select')}
              hasBoxShadow={false}
              onOpen={() => this.onOpenSelect()}
              onClose={() => this.onSelectClose()}
            >
              <MenuItem value={GRADE_WEIGHT_TYPE.ASSIGNMENT}>
                {t('myCourses:assignment', { count: 2 })}
              </MenuItem>

              <MenuItem
                sx={{
                  '&.Mui-disabled': {
                    pointerEvents: 'auto',
                  },
                }}
                disabled={disableParticipation}
                value={GRADE_WEIGHT_TYPE.PARTICIPATION}
              >
                <TblTooltip
                  disableHoverListener={!disableParticipation}
                  title={t('myCourses:max_number_of_participation')}
                  placement='top'
                  arrow
                >
                  <div>{t('myCourses:participation')}</div>
                </TblTooltip>
              </MenuItem>

              <MenuItem value={GRADE_WEIGHT_TYPE.TEST}>
                {t('myCourses:test', { count: 2 })}
              </MenuItem>
            </TblSelect>
          );
        },
      },
      {
        title: `${t('myCourses:weight')} (%)`,
        dataIndex: 'weight',
        cursor: true,
        width: '30%',
        disabled: !hasPermissionUpdate,
        key: 'weight',
        render: (text, record) => (
          <TblInputs
            value={text}
            type='text'
            inputType='number'
            disabled={!hasPermissionUpdate}
            onBlur={this.validateData(record)}
            onChange={this.handleChange(record, 'weight')}
            placeholder={t('myCourses:enter_weight')}
            decimalScale={2}
            noneBorder={true}
            isAllowed={(values) => {
              const { floatValue, formattedValue } = values;
              return (
                formattedValue === '' || (floatValue <= 100 && floatValue > 0)
              );
            }}
          />
        ),
      },
      {
        title: t('action'),
        cursor: true,
        // width: '50px',
        key: 'action',
        hide: true,
        render: (text, record) =>
          hasPermissionUpdate ? (
            <TblIconButton onClick={this.removeRow(record)}>
              <CancelIcon fontSize='small' />
            </TblIconButton>
          ) : null,
      },
    ];
    return (
      <Grid className={classes.root}>
        {!!hasPermission && (
          <Box mb={2.5}>
            <TblIndicator content={t('myCourses:explain_grade_weighting')} />
          </Box>
        )}
        <Typography variant='bodyMedium' className='description-table'>
          {t('myCourses:grade_weight_details')}
        </Typography>
        <TblTableForm columns={columns} rows={gradeWeight} />
        <Box display='flex' width='100%' mt={2} ml={1}>
          <Box style={{ width: '59%' }}>
            {hasPermissionUpdate ? (
              <Typography
                component='a'
                href='#'
                color='secondary'
                onClick={this.addRecord}
                variant='bodyMedium'
              >
                {t('common:add_another_row')}
              </Typography>
            ) : (
              <Box width='60%' />
            )}
          </Box>

          <Box>
            <Typography
              style={{ width: '50%' }}
              color={total > 100 ? 'error' : ''}
            >
              {t('myCourses:total')}: {total}%
            </Typography>
            <Typography variant='bodySmall'>
              {t('myCourses:total_weight_description')}
            </Typography>
          </Box>

          <div/>
        </Box>
        <TblConfirmDialog
          open={this.state.isVisibleErrorModal}
          title={t('common:error')}
          cancelText={t('common:cancel')}
          hiddenConfirmButton
          message={this.state.errorMessage}
          fullWidth
          onCancel={() =>
            this.setState({
              isVisibleErrorModal: false,
            })
          }
        />
        <TblConfirmDialog
          open={this.state.isVisibleDeleteParticipationModal}
          title={t('common:confirmation')}
          cancelText={t('common:cancel')}
          message={t('common:confirm_delete_participation_category')}
          fullWidth
          onCancel={() =>
            this.setState({
              isVisibleDeleteParticipationModal: false,
            })
          }
          okText={t('common:delete')}
          onConfirmed={() => {
            this.removeRowAction(this.state.deleteGradeWeight);
            this.setState({
              isVisibleDeleteParticipationModal: false,
            });
          }}
        />
      </Grid>
    );
  }
}
GradeWeighting.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object,
  currentUser: PropTypes.shape({
    organizationId: PropTypes.number,
  }),
  enqueueSnackbar: PropTypes.func,
  error: PropTypes.object,
  getCourseValidation: PropTypes.func,
  getGradeWeight: PropTypes.func,
  gradeWeight: PropTypes.array,
  location: PropTypes.shape({
    search: PropTypes.string,
  }),
  match: PropTypes.object,
  mcGetGradeWeightSuccess: PropTypes.bool,
  myCoursesSetState: PropTypes.func,
  permission: PropTypes.bool,
  t: PropTypes.func,
  updateGradeWeight: PropTypes.func,
  updateGradeWeightSuccess: PropTypes.bool,
  gradeWeightingSetState: PropTypes.func,
  basicInfo: PropTypes.object,
};

const mapStateToProps = (state) => ({
  currentUser: state.Auth.currentUser,
  gradeWeight: state.MyCourses.gradeWeight,
  updateGradeWeightSuccess: state.MyCourses.updateGradeWeightSuccess,
  mcGetGradeWeightSuccess: state.MyCourses.mcGetGradeWeightSuccess,
  error: state.MyCourses.error,
  permission: state.MyCourses?.permission,
  basicInfo: state.AllCourses.basicInfo,
});

const mapDispatchToProps = (dispatch) => ({
  getGradeWeight: (payload) =>
    dispatch(MyCoursesActions.mcGetGradeWeight(payload)),
  updateGradeWeight: (payload) =>
    dispatch(MyCoursesActions.mcUpdateGradeWeight(payload)),
  getCourseValidation: (payload) =>
    dispatch(MyCoursesActions.getCourseValidation(payload)),
  gradeWeightingSetState: (payload) =>
    dispatch(MyCoursesActions.gradeWeightingSetState(payload)),
  myCoursesSetState: (payload) =>
    dispatch(MyCoursesActions.myCoursesSetState(payload)),
});

export default flowRight(
  // withReducer('GradeWeighting', reducers, null , epic),
  connect(mapStateToProps, mapDispatchToProps),
  withSnackbar,
  withTranslation(),
  withRouter,
  withStyles(styles, { withTheme: true })
)(GradeWeighting);
