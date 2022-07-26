import React from 'react';

import OverallCell from '../../components/GradeBook/Cell/OverallCell';
import StudentNameCell from '../../components/GradeBook/Cell/StudentName';
import StudentNameHeader from '../../components/GradeBook/Header/StudentNameHeader';

const renderDefaultColumns = (t, sortByName, onSortByName) => [
    {
      field: 'id',
      headerName: 'No.',
      hide: true,
    },
    { field: 'firstName', headerName: 'First name', hide: true },
    { field: 'lastName', headerName: 'Last name', hide: true },
    {
      field: 'studentName',
      headerName: 'Student Name',
      width: 200,
      // valueGetter: getFullName,
      renderCell: StudentNameCell,
      headerClassName: 'student-header',
      renderHeader: (params) => (
        <StudentNameHeader
          params={params}
          sortByName={sortByName}
          onSortByName={onSortByName}
        />
      ),
      sortComparator: (v1, v2, param1, param2) => {
        const name1 = param1.api.getCellValue(param1.id, sortByName);
        const name2 = param2.api.getCellValue(param2.id, sortByName);
        return name1.localeCompare(name2);
      },

      editable: false,
      disableColumnMenu: true,
    },
    {
      field: 'overallCourseGrade',
      headerName: 'Overall Grade',
      editable: false,
      width: 120,
      align: 'center',
      disableColumnMenu: true,
      hideSortIcons: true,
      renderCell: (params) => <OverallCell {...params} />,
      sortable: false,
    },

  ];

const pinnedColumns = {
  left: ['id', 'studentName', 'overallCourseGrade', 'overallValue'],
};

const canEditPinnedColumns = {
  left: ['id', 'studentName']
};

export { renderDefaultColumns, pinnedColumns, canEditPinnedColumns };
