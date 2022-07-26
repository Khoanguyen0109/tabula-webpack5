import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { Box } from '@mui/system';
import { DataGridPro, useGridApiRef } from '@mui/x-data-grid-pro';
import { LicenseInfo } from '@mui/x-license-pro';

import { mapStatusWithHotKey } from 'modules/MyCourses/components/GradeBook/Cell/utils';

import { isNil, isNumber } from 'lodash';
import { isTermOver7Days } from 'modules/Grader/utils';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import PropTypes from 'prop-types';

import { SUBMISSION_METHOD } from '../../../../../shared/MyCourses/constants';
import { float2Decimal } from '../../../../../utils';
import useDidMountEffect from '../../../../../utils/customHook/useDidMoutEffect';
import myCourseActions from '../../../actions';
import GradeCell from '../../../components/GradeBook/Cell/GradeCell';
import GradeInputCell from '../../../components/GradeBook/Cell/GradeInputCell';
import AssignmentHeader from '../../../components/GradeBook/Header/AssignmentHeader';
import LoadingOverlay from '../../../components/GradeBook/LoadingOverlay';
import NoDataColumn from '../../../components/GradeBook/NoDataCoumn';
import NoDataGrid from '../../../components/GradeBook/NoDataGrid';
import { STUDENT_PROGRESS_STATUS } from '../../../constants';
import {
  canEditPinnedColumns,
  pinnedColumns,
  renderDefaultColumns,
} from '../columns';
import AssignmentDetail from '../DetailPopup/AssignmentDetail';
import QuizDetail from '../DetailPopup/QuizDetail';

import useStyles from './styled';

LicenseInfo.setLicenseKey(
  'bd32c34657ca84bc5b39a937c2c7bdc2T1JERVI6MzU0MjksRVhQSVJZPTE2NzMxMTM1MDAwMDAsS0VZVkVSU0lPTj0x'
);

const AVAILABLE_KEY_CODE = [
  'ArrowRight',
  'ArrowLeft',
  'ArrowUp',
  'ArrowDown',
  'Tab',
  'Enter',
];
function GradeGrid(props) {
  const { searchValue, sortModel, setSortModel, currentTerm } = props;
  const params = useParams();
  const { courseId } = params;
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const overTerm7day = isTermOver7Days(currentTerm);
  const dispatch = useDispatch();
  const apiRef = useGridApiRef();
  const { t } = useTranslation('myCourses');
  const [sortBy, setSortBy] = useState('lastName');
  const [cellSelected, setCellSelected] = useState();
  const defaultColumn = renderDefaultColumns(t, sortBy, onSortByName);
  const [columns, setColumns] = useState(defaultColumn);
  const isFetchingGradeBook = useSelector(
    (state) => state.AllCourses.isFetchingGradeBook
  );
  const gradeBookColumn = useSelector(
    (state) => state.AllCourses.gradeBookColumn
  );

  const mcDoActionSuccess = useSelector(
    (state) => state.AllCourses.mcDoActionSuccess
  );
  const mcDoActionFailed = useSelector(
    (state) => state.AllCourses.mcDoActionFailed
  );
  const currentCellUpdate = useSelector(
    (state) => state.AllCourses.currentCellUpdate
  );
  const mcDoActionFailedMessage = useSelector(
    (state) => state.AllCourses.mcDoActionFailedMessage
  );
  const gradeBookRow = useSelector((state) => state.AllCourses.gradeBookRow);
  const mcCalculateOverallCourseGradeSuccess = useSelector(
    (state) => state.AllCourses.mcCalculateOverallCourseGradeSuccess
  );

  const noDataColum = gradeBookColumn.length === 0 && gradeBookRow.length > 0;

  function onSortByName(name) {
    setSortBy(name);
    setSortModel([
      {
        field: name,
        sort: 'asc',
      },
    ]);
  }

  const onOpenCelDetail = (cell) => {
    setCellSelected(cell);
    dispatch(
      myCourseActions.mcGradeBookSetState({
        currentCellUpdate: cell,
      })
    );
  };
  useDidMountEffect(() => {
    const isDisableGradeBook = isTermOver7Days(currentTerm);
    dispatch(
      myCourseActions.mcGradeBookSetState({
        isDisableGradeBook,
      })
    );
  }, [currentTerm]);
  const mapHeader = (columns) => {
    let canEditable = true;
    if (isTermOver7Days(currentTerm)) {
      canEditable = false;
    }

    return columns.map((column) => {
      // eslint-disable-next-line unused-imports/no-unused-vars
      const { id, ...rest } = column;
      let canEditableQuizColumn = true;
      if (
        column.masterQuiz &&
        column.executeTime &&
        canEditable &&
        moment.utc().isBefore(moment.utc(column.classSessionEndTime))
      ) {
        canEditableQuizColumn = false;
      }
      return {
        ...rest,
        // id: parseInt(column.formatId),
        field: column.formatId.toString(),
        editable: canEditableQuizColumn,
        disableColumnMenu: true,
        width: 160,
        // tabIndex: -1,
        // valueGetter: (params)=> columns.id,
        hideSortIcons: true,
        sortable: false,
        renderHeader: (params) => (
          <AssignmentHeader
            field={params.field}
            width={params.colDef.width}
            apiRef={apiRef}
            activityName={
              (column.masterAssignment?.assignmentName ||
                column.masterQuiz?.quizName ||
                column.name) ??
              ''
            }
            totalPossiblePoint={
              (column.masterAssignment?.totalPossiblePoints ||
                column.masterQuiz?.totalPossiblePoints) ??
              ''
            }
            canEditable={canEditable}
            canEditableQuizColumn={canEditableQuizColumn}
            quizExecuteTime={column.classSessionEndTime}
          />
        ),
        renderCell: (params) => (
          <GradeCell {...params} onOpenCelDetail={onOpenCelDetail} />
        ),
        renderEditCell: (params) => (
          <GradeInputCell {...params} onOpenCelDetail={onOpenCelDetail} />
        ),
      };
    });
  };

  const cellEditable = (params) => {
    const defaultColumNotEditable = canEditPinnedColumns.left.includes(
      params.field
    );
    const nullSubmission = !!!params.value || !!!params.formattedValue;
    if (defaultColumNotEditable || overTerm7day || nullSubmission) {
      return false;
    }
    return true;
  };

  useDidMountEffect(() => {
    apiRef.current.applySorting();
  }, [sortBy]);

  useDidMountEffect(() => {
    if (gradeBookColumn.length > 0) {
      setColumns([...defaultColumn, ...mapHeader(gradeBookColumn)]);
      // console.log('api', apiRef.current.getPinnedColumns());
    } else {
      setColumns(defaultColumn);
    }
  }, [gradeBookColumn, sortModel, sortBy, t]);

  useDidMountEffect(() => {
    if (mcDoActionSuccess && currentCellUpdate) {
      apiRef.current.setEditCellValue(currentCellUpdate);
      apiRef.current.setCellMode(
        currentCellUpdate.id,
        currentCellUpdate.field,
        'view'
      );
      dispatch(
        myCourseActions.mcGradeBookSetState({
          mcEditSubmissionStatusSuccess: false,
          mcDoActionSuccess: false,
        })
      );
      if (!isNil(currentCellUpdate.value?.overallGrade)) {
        dispatch(
          myCourseActions.mcCalculateOverallCourseGrade({
            courseId,
            termId: currentTerm.id,
            data: {
              studentId: currentCellUpdate.value.studentId,
            },
            mcCalculateOverallCourseGradeSuccess: null,
          })
        );
      }
    }
  }, [mcDoActionSuccess]);

  useDidMountEffect(async () => {
    if (mcDoActionFailed && currentCellUpdate) {
      delete currentCellUpdate.value.tempValue;
      delete currentCellUpdate.value.overallGrade;
      if (mcDoActionFailedMessage?.message) {
        enqueueSnackbar(mcDoActionFailedMessage.message, { variant: 'error' });
      }
      await apiRef.current.setEditCellValue({
        id: currentCellUpdate.id,
        field: currentCellUpdate.field,
        value: { ...currentCellUpdate.value },
      });
      await apiRef.current.commitCellChange({
        id: currentCellUpdate.id,
        field: currentCellUpdate.field,
      });

      apiRef.current.setCellMode(
        currentCellUpdate.id,
        currentCellUpdate.field,
        'view'
      );
      dispatch(
        myCourseActions.mcGradeBookSetState({
          mcDoActionFailed: false,
          mcDoActionFailedMessage: undefined,
        })
      );
    }
  }, [mcDoActionFailed]);

  useDidMountEffect(() => {
    // NOTE: This keep on change overall grade
  }, [mcCalculateOverallCourseGradeSuccess]);

  function renderInput(value) {
    if (value) {
      if (isNumber(value.overallGrade)) {
        return value.overallGrade;
      }
      switch (value.status) {
        case STUDENT_PROGRESS_STATUS.TURN_IN:
          return 't';
        case STUDENT_PROGRESS_STATUS.LATE_TURN_IN:
          return 'l';
        case STUDENT_PROGRESS_STATUS.MISSING:
          return 'm';
        // case STUDENT_PROGRESS_STATUS.MISSED:
        //   return 'd';
        case STUDENT_PROGRESS_STATUS.NOT_TURN_IN:
          return '';
        default:
          return '';
        // break;
      }
    }

    return '';
  }
  const changeStatus = useCallback(
    async (params, status) => {
      const { id, field, value } = params;
      if (value.status === STUDENT_PROGRESS_STATUS.MISSED) {
        return enqueueSnackbar(
          t('unable_to_change_status_when_graded_or_missed'),
          { variant: 'error' }
        );
      }
      dispatch(
        myCourseActions.mcEditSubmissionStatus({
          submissionId: value.id,
          courseId,
          data: {
            newStatus: status,
          },
        })
      );
      await apiRef.current.setEditCellValue({
        id,
        field,
        value: { ...value, status },
      });
    },
    [apiRef, courseId, dispatch, enqueueSnackbar, t]
  );

  const handleCellClick = React.useCallback(
    (params) => {
      const isEditable = apiRef.current.isCellEditable(params);
      if (isEditable) {
        try {
          const { id, field, value } = params;

          apiRef.current.setEditCellValue({
            id,
            field,
            value: { ...value, tempValue: renderInput(value) },
          });
        } catch (error) {
        }
      }
    },
    [apiRef]
  );

  const handleCellEditCommit = React.useCallback(
    async (params) => {
      const { id, field, value } = params;
      const tempValue = value.tempValue;
      if (tempValue || tempValue === '' || tempValue === 0) {
        if (
          value.overallGrade &&
          (tempValue === '' || Number(tempValue) === value.overallGrade) &&
          !value.gradeWeightCriteriaId
        ) {
          return apiRef.current.setCellMode(id, field, 'view');
        }
        try {
          dispatch(
            myCourseActions.mcGradeBookSetState({
              currentCellUpdate: params,
            })
          );
          if (value.gradeWeightCriteriaId) {
            dispatch(
              myCourseActions.mcInputStudentParticipation({
                courseId,
                termId: currentTerm.id,
                data: {
                  overallGrade: tempValue,
                  studentId: value.studentId,
                  gradeWeightCriteriaId: value.gradeWeightCriteriaId,
                },
              })
            );
            return apiRef.current.setEditCellValue({
              id,
              field,
              value: {
                ...value,
                overallGrade: tempValue === '' ? '' : parseFloat(tempValue),
              },
            });
          }
          if (tempValue.toString().match(float2Decimal)) {
            //check unchanged value
            if (tempValue === value.overallGrade) {
              return apiRef.current.setCellMode(id, field, 'view');
            }
            if (value.shadowQuizId) {
              dispatch(
                myCourseActions.mcInputOverallGradeTest({
                  courseId,
                  quizSubmissionId: value.id,
                  shadowQuizId: value.shadowQuizId,
                  data: {
                    overallGrade: tempValue,
                    studentId: value.studentId,
                  },
                })
              );
            } else if (value.shadowAssignmentId) {
              dispatch(
                myCourseActions.mcInputOverallGrade({
                  courseId,
                  progressId: value.id,
                  shadowAssignmentId: value.shadowAssignmentId,
                  data: {
                    overallGrade: tempValue,
                    studentId: value.studentId,
                  },
                })
              );
            }
            return apiRef.current.setEditCellValue({
              id,
              field,
              value: { ...value, overallGrade: parseFloat(tempValue) },
            });
          } else if (isNil(value.overallGrade)) {
            //check unchanged value
            if (
              value.status === STUDENT_PROGRESS_STATUS.MISSED ||
              tempValue.toLowerCase() ===
                mapStatusWithHotKey[value.status]?.hotKey
            ) {
              return apiRef.current.setCellMode(id, field, 'view');
            }

            switch (tempValue.toLowerCase()) {
              case 't':
                changeStatus(params, STUDENT_PROGRESS_STATUS.TURN_IN);
                break;
              case 'l':
                changeStatus(params, STUDENT_PROGRESS_STATUS.LATE_TURN_IN);
                break;
              case 'm':
                changeStatus(params, STUDENT_PROGRESS_STATUS.MISSING);
                break;
              // case 'd':
              //   changeStatus(params, STUDENT_PROGRESS_STATUS.MISSED);
              //   break;
              case '':
                changeStatus(params, STUDENT_PROGRESS_STATUS.NOT_TURN_IN);
                break;
              default:
                break;
            }
          }
          // return apiRef.current.setCellMode(id, field, 'view');
        } catch (error) {
        }
      } else {
        return apiRef.current.setCellMode(id, field, 'view');
      }
    },
    [apiRef, changeStatus, courseId, currentTerm.id, dispatch]
  );

  useEffect(
    () =>
      apiRef.current.subscribeEvent(
        'cellModeChange',
        (params, event) => {
          event.defaultMuiPrevented = true;
        },
        { isFirst: false }
      ),
    [apiRef]
  );

  useEffect(
    () => () => {
      dispatch(
        myCourseActions.mcGradeBookSetState({
          gradeBookColumn: [],
          gradeBookRow: [],
        })
      );
    },
    [apiRef, dispatch]
  );

  return (
    <Box className={classes.root}>
      <DataGridPro
        classes={{
          cell: classes.cell,
          'cell--editable': classes.editableCell,
          columnHeaders: classes.columnHeaders,
          columnHeader: classes.columnHeader,
          columnHeaderTitle: classes.columnHeaderTitle,
          'pinnedColumns--left': classes.pinnedColumnsLeft,
          virtualScrollerRenderZone: classes.virtualScrollerRenderZone,
          iconButtonContainer: classes.iconButtonContainer,
          'columnHeader--sorted': classes.columnHeaderSorted,
          'columnHeader--sortable': classes.columnHeaderSortable,
          row: classes.row,
        }}
        rowHeight={40}
        headerHeight={60}
        hideFooter
        apiRef={apiRef}
        pinnedColumns={pinnedColumns}
        // initialState={{
        //   pinnedColumns: pineColumn,
        // }}
        rows={gradeBookRow}
        columns={columns}
        showCellRightBorder
        showColumnRightBorder
        components={{
          NoRowsOverlay: () => <NoDataGrid searchValue={searchValue} />,
          LoadingOverlay: LoadingOverlay,
        }}
        sortingOrder={['asc', 'desc']}
        sortModel={sortModel}
        onSortModelChange={(model) => {
          setSortModel(model);
        }}
        isCellEditable={cellEditable}
        loading={isFetchingGradeBook}
        disableSelectionOnClick={false}
        onCellEditCommit={handleCellEditCommit}
        // onCellClick={handleCellClick}
        onCellEditStart={handleCellClick}
        onCellKeyDown={async (params, event) => {
          const { id, field, value, colDef } = params;
          /// Can only
          if (
            (event.key === 'Backspace' || event.key === 'Delete') &&
            colDef.field !== 'studentName' &&
            colDef.field !== 'overallCourseGrade'
          ) {
            event.defaultMuiPrevented = true;
            apiRef.current.setEditCellValue({
              id,
              field,
              value: { ...value, tempValue: '' },
            });
            apiRef.current.setCellMode(id, field, 'edit');
            return;
          }
          if (
            (colDef?.masterAssignment?.submissionMethod ===
              SUBMISSION_METHOD.ONLINE ||
              !!colDef.masterQuiz ||
              colDef.gradeWeightId) &&
            !/^[0-9]$/i.test(event.key) &&
            !AVAILABLE_KEY_CODE.includes(event.key)
          ) {
            event.defaultMuiPrevented = true;
            return;
          }
        }}
        disableColumnReorder
        // {...pagination}
      />
      {noDataColum && (
        <Box className={classes.noActivities}>
          <NoDataColumn />
        </Box>
      )}

      {cellSelected && (
        <>
          <AssignmentDetail
            open={cellSelected && cellSelected.colDef.masterAssignment}
            cellSelected={cellSelected}
            onClose={() => setCellSelected(null)}
            disableOverallGrade={overTerm7day}
          />

          <QuizDetail
            open={cellSelected && cellSelected.colDef.masterQuiz}
            cellSelected={cellSelected}
            onClose={() => setCellSelected(null)}
            disableOverallGrade={overTerm7day}
          />
        </>
      )}
    </Box>
  );
}

GradeGrid.propTypes = {
  currentTerm: PropTypes.number,
  searchValue: PropTypes.string,
  setSortModel: PropTypes.func,
  sortModel: PropTypes.object,
};

export default GradeGrid;
