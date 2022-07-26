import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';

import TblSwitch from 'components/TblSwitch';
import TblTable from 'components/TblTable';
import TblTooltip from 'components/TblTooltip';

import { size } from 'lodash';
import { PropTypes } from 'prop-types';

import { ROUTE_MANAGE_COURSE_TEMPLATE } from '../constantsRoute';

function CourseTemplateList(props) {
  // NOTE: get contexts
  // const { t } = useTranslation(['myCourses', 'common', 'error']);
  // const classes = useStyles();
  const isBusy = useSelector((state) => state.ManageCourseTemplate.isBusy);
  const [sort, setSort] = useState({});
  const schoolSetting = useSelector(
    (state) => state.ManageCourseTemplate.schoolSetting
  );
  const [rows, setRows] = useState([]);
  const {
    t,
    total,
    search,
    onChangePage,
    params: { limit, subjectIds },
    history,
    onOpenDialogPublish,
    onOpenDialogDelete,
    onSort,
  } = props;
  const schoolTemplateList = useSelector(
    (state) => state.ManageCourseTemplate?.courseTemplateList || []
  );
  const handleClickSort = useCallback(
    ({ fieldSort }) => {
      let sortType = '';
      if (sort.fieldSort === fieldSort) {
        sortType = sort.sortType === 'asc' ? 'desc' : 'asc';
      } else {
        sortType = 'asc';
      }
      setSort({ fieldSort, sortType });
      onSort({ sort: { fieldSort, sortType } });
    },
    [onSort, sort]
  );
  const columns = useMemo(() => {
    let showPublishDistrict = undefined;
    if (schoolSetting?.allowPublishDistrict) {
      showPublishDistrict = {
        title: t('common:publish_in_district_library'),
        dataIndex: 'publishedDistrictLibrary',
        key: 'publishedDistrictLibrary',
        width: '16%',
        render: (text, record) => (
          <Box pl={1}>
            <TblSwitch
              checked={record?.publishedDistrictLibrary?.status}
              disabled={record?.publishedDistrictLibrary?.status}
              onChange={(e) => onOpenDialogPublish(e, record, true)}
            />
          </Box>
        ),
      };
    }
    return [
      {
        title: t('common:template_name'),
        dataIndex: 'templateName',
        key: 'templateName',
        titleIcon:
          sort.fieldSort !== 'templateName'
            ? 'icon-icn_sort_arrow_off'
            : sort.sortType === 'asc'
              ? 'icon-icn_sort_arrow_up'
              : 'icon-icn_sort_arrow_down',
        titleIconAction: () => handleClickSort({ fieldSort: 'templateName' }),
        width: showPublishDistrict ? '27%' : '43%',
        render: (text) => <div className='text-ellipsis'>{text}</div>,
      },
      {
        title: t('common:subject'),
        dataIndex: 'subject',
        key: 'subject',
        width: '15%',
        render: (text) => <div className='text-ellipsis'>{text}</div>,
      },
      {
        title: t('common:author'),
        dataIndex: 'author',
        key: 'author',
        width: '20%',
        titleIcon:
          sort.fieldSort !== 'author'
            ? 'icon-icn_sort_arrow_off'
            : sort.sortType === 'asc'
              ? 'icon-icn_sort_arrow_up'
              : 'icon-icn_sort_arrow_down',
        titleIconAction: () => handleClickSort({ fieldSort: 'author' }),
        render: (text) => <div className='text-ellipsis'>{text}</div>,
      },
      {
        title: t('common:publish_in_school_library'),
        dataIndex: 'publishedSchoolLibrary',
        key: 'publishedSchoolLibrary',
        width: '16%',
        render: (text, record) => (
          <Box pl={1}>
            <TblSwitch
              checked={record?.publishedSchoolLibrary?.status}
              onChange={(e) => onOpenDialogPublish(e, record, false)}
            />
          </Box>
        ),
      },
      showPublishDistrict,
      {
        key: 'action',
        align: 'left',
        title: t('common:action'),
        contextMenu: (record, callback) => (
          <TblTooltip
            disableHoverListener={
              !(
                record?.publishedDistrictLibrary?.status ||
                record?.publishedSchoolLibrary?.status
              )
            }
            title={t('manageCourseTemplate:unable_tooltip')}
          >
            <Box>
              <MenuItem
                disabled={
                  record?.publishedDistrictLibrary?.status ||
                  record?.publishedSchoolLibrary?.status
                }
                onClick={() => {
                  history.push(
                    ROUTE_MANAGE_COURSE_TEMPLATE.COURSE_TEMPLATE_DETAIL(
                      record.id
                    )
                  );
                }}
              >
                {t('common:edit_template')}
              </MenuItem>

              <MenuItem
                disabled={
                  record?.publishedDistrictLibrary?.status ||
                  record?.publishedSchoolLibrary?.status
                }
                onClick={(e) => {
                  if (callback) callback();
                  onOpenDialogDelete(e, record);
                }}
              >
                {t('common:delete_template')}
              </MenuItem>
            </Box>
          </TblTooltip>
        ),
      },
    ].filter(Boolean);
  }, [
    handleClickSort,
    history,
    onOpenDialogDelete,
    onOpenDialogPublish,
    schoolSetting.allowPublishDistrict,
    sort.fieldSort,
    sort.sortType,
    t,
  ]);
  useEffect(() => {
    if (schoolTemplateList) {
      const convertRows = schoolTemplateList.map((schoolTemplate) => ({
          templateName: schoolTemplate.templateName,
          subject: schoolTemplate.subject.subjectName,
          author: `${schoolTemplate.author.firstName} ${schoolTemplate.author.lastName}`,
          status: schoolTemplate.status,
          id: schoolTemplate.id,
          publishedSchoolLibrary: schoolTemplate.publishedSchoolLibrary,
          publishedDistrictLibrary: schoolTemplate.publishedDistrictLibrary,
        }));
      setRows(convertRows);
    }
  }, [schoolTemplateList]);

  const emptySearch = !!search || size(subjectIds);

  return (
    <Box>
      <TblTable
        columns={columns}
        pagination
        isBusy={isBusy}
        onChangePage={onChangePage}
        rows={rows}
        borderCell
        rowsPerPage={limit}
        total={total}
        delta={295}
        scrollInline={true}
        emptySearch={emptySearch}
        viewDetail={(row) =>
          history.push(
            ROUTE_MANAGE_COURSE_TEMPLATE.COURSE_TEMPLATE_DETAIL(row.id)
          )
        }
      />
    </Box>
  );
}

CourseTemplateList.propTypes = {
  history: PropTypes.func,
  onChangePage: PropTypes.func,
  onOpenDialogDelete: PropTypes.func,
  onOpenDialogPublish: PropTypes.func,
  onSort: PropTypes.func,
  params: PropTypes.object,
  search: PropTypes.string,
  t: PropTypes.func,
  total: PropTypes.number
};

export default CourseTemplateList;
