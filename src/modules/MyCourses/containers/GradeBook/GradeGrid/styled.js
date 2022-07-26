import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'relative',
    height: `calc(100vh - ${theme.spacing(45)})`,
    width: '100%',
    marginBottom: theme.spacing(4),

    '& .student-header': {
      overflow: 'visible',
      '& .MuiDataGrid-columnHeaderTitleContainer': {
        overflow: 'visible',
      },
      borderBottom: 'none !important',

    },
    '& .MuiDataGrid-pinnedColumnHeaders--left': {
      overflow: 'visible',
      zIndex: 20,
      boxShadow: 'none !important',
    },
    '& .css-nzg111-MuiDataGrid-pinnedColumns': {
      boxShadow: 'none !important',
    },
    '& .MuiDataGrid-root': {
      borderRadius: theme.borderRadius.default,
      '& .MuiDataGrid-row--lastVisible': {
        '& .MuiDataGrid-cell': {
          borderColor: 'rgba(224, 224, 224, 1) !important'

        }
      },
      '& .MuiDataGrid-columnHeaderTitleContainerContent': {
        overflow: 'visible'
      }

    },
    '& .MuiDataGrid-virtualScrollerContent': {
      '& .Mui-hovered': {
        backgroundColor: '#E0EDFF !important',
      },
    },
    '& .MuiDataGrid-cell:focus': {
      outline: 'rgb(25, 118, 210) solid 1px !important',
      zIndex: 19,
    },
    '& .MuiDataGrid-columnHeader:focus': {
      outline: 'none !important',
    },
    '& .MuiDataGrid-columnHeader:focus-within': {
      outline: 'none !important',
    },
    '& .MuiDataGrid-main': {
      borderRadius: theme.borderRadius.default,
    },

  },
  columnHeaders: {
    overflow: 'visible',
    backgroundColor: '#f8f9fa',
    zIndex: 10,
  },
  pinnedColumnsLeft: {
    overflow: 'visible',
  },
  columnHeader: {
    backgroundColor: theme.newColors.gray[50],
    padding: `${0 }!important`,
    borderBottom: '1px solid rgba(224, 224, 224, 1)',
  },
  columnHeaderTitle: {
    color: theme.newColors.gray[800],
    fontSize: theme.fontSize.normal,
    fontWeight: theme.fontWeight.semi,
    padding: theme.spacing(1),
  },
  row: {
    borderTop: '1px solid rgba(224, 224, 224, 1) !important',
  },

  cell: {
    width: '100% !important',
    color: theme.newColors.gray[800],
    fontSize: theme.fontSize.normal,
    fontWeight: theme.fontWeight.normal,
    padding: `${0 } !important`,
    // borderRight: '1px solid rgba(224, 224, 224, 1)',
    '& .MuiInputBase-root': {
      color: theme.newColors.gray[800],
    },
  },
  editableCell: {
    padding: `${0 }!important`,
    '& .MuiInputBase-root': {
      // margin: theme.spacing(1),
      height: '100%',
      width: '100%',
      '& input': {
        margin: theme.spacing(1),
      },
    },
  },
  virtualScrollerRenderZone: {
    '& .MuiDataGrid-cell': {
      width: '100% !important',
      display: 'none',
    },
    '& .MuiDataGrid-cell--withRenderer': {
      display: 'flex !important',
    },
  },
  noActivities: {
    position: 'absolute',
    top: '30%',
    right: '35%',
    zIndex: theme.zIndex.drawer,
  },
  headerWithLock: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  maxWidthHidden: {
    maxWidth: '80%',
    overflow: 'hidden',
  },
  iconButtonContainer: {
    visibility: 'visible',
    
  },
  columnHeaderSortable: {
    '& .MuiSvgIcon-root': {
      opacity: `${0.5 } !important`,
    },
  },
  columnHeaderSorted: {
    '& .MuiSvgIcon-root': {
      opacity: `${1 } !important`,
    },
  },
}));

export default useStyles;
