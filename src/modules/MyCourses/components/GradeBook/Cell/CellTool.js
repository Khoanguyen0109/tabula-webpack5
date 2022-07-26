import React from 'react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import {
  Box,
  Menu,
  MenuItem,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';

import PropTypes from 'prop-types';

import TblTooltip from '../../../../../components/TblTooltip';
import { SUBMISSION_METHOD } from '../../../../../shared/MyCourses/constants';

import { disableDropDown, renderStatusOptions } from './utils';

const useStyles = makeStyles((theme) => ({
  icon: {
    color: theme.newColors.gray[700]
  }
}));

function CellTool(props) {
  const classes = useStyles();
  const { t } = useTranslation('myCourses');
  const { params, show, onOpenCelDetail } = props;
  const { id, value, formattedValue, colDef, api, field } = params;
  const submissionMethod = colDef.masterAssignment?.submissionMethod || (colDef.masterQuiz && SUBMISSION_METHOD.QUIZ);
  const isDisableGradeBook = useSelector(
    (state) => state.AllCourses.isDisableGradeBook
  );
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handelChangeSelect = async (value) => {
    await api.setEditCellValue({
      id,
      field,
      value: { ...formattedValue, tempValue: value },
    });
    await api.commitCellChange({ id, field });
    api.setCellMode(id, field, 'view');
  };

  const handleClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (event) => {
    event.stopPropagation();
    setAnchorEl(null);
  };

  return (
    <>
      <TblTooltip
        disableHoverListener={!disableDropDown(submissionMethod, value)}
        title={t('myCourses:grade_detail')}
        placement='top'
        arrow
      >
        <span
          onClick={(e) => {
            e.stopPropagation();
            onOpenCelDetail(params);
          }}
        >
          <Box
            sx={{
              borderRadius: 'inherit',
              pointerEvents: 'none',
              border: 'none',
              backgroundColor: 'transparent',
              padding: '8px 4px 8px 4px',
              lineHeight: 0,
              display: show ? 'block' : 'none',
            }}
          >
            <DescriptionOutlinedIcon className={classes.icon} fontSize='small' />
          </Box>
        </span>
      </TblTooltip>
      
      {submissionMethod === SUBMISSION_METHOD.OFFLINE && !isDisableGradeBook && (
        <>
          <TblTooltip
            disableHoverListener={!disableDropDown(submissionMethod, value)}
            title={t('unable_to_change_status_when_graded_or_missed')}
            placement='top'
            arrow
          >
            <span onClick={(e) => !disableDropDown(submissionMethod, value) && handleClick(e)}>
              <Box

                sx={{
                  borderRadius: 'inherit',
                  pointerEvents: 'none',
                  border: 'none',
                  backgroundColor: 'transparent',
                  padding: '8px 4px 8px 0px',
                  lineHeight: 0,
                  display: show ? 'block' : 'none',
                }}
              >
                <ArrowDropDownIcon className={classes.icon} fontSize='small' />
              </Box>
            </span>
          </TblTooltip>
          <Menu
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            {renderStatusOptions(t, formattedValue, value, colDef).map(
              (item) => (
                <TblTooltip
                  disableHoverListener={!item.disabled}
                  title={item.disabledMessage}
                  placement='right'
                  arrow
                >
                  <span>
                    <MenuItem
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: 160,
                      }}
                      value={item.value}
                      disabled={item.disabled}
                      onClick={() => handelChangeSelect(item.hotKey)}
                    >
                      <Box>{item.label} </Box>
                      <Box>{item.hotKey.toUpperCase()}</Box>
                    </MenuItem>
                  </span>
                </TblTooltip>
              )
            )}
          </Menu>
        </>
      )}
    </>
  );
}

CellTool.propTypes = {
  onOpenCelDetail: PropTypes.func,
  params: PropTypes.shape({
    api: PropTypes.shape({
      commitCellChange: PropTypes.func,
      setCellMode: PropTypes.func,
      setEditCellValue: PropTypes.func
    }),
    colDef: PropTypes.object,
    field: PropTypes.object,
    formattedValue: PropTypes.object,
    id: PropTypes.number,
    value: PropTypes.string
  }),
  show: PropTypes.bool
};

CellTool.defaultProps = {
    show: true
  };
  
export default CellTool;
