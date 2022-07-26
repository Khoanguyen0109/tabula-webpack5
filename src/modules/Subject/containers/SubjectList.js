import React from 'react';
import { connect } from 'react-redux';

import trim from 'lodash/trim';

import Box from '@mui/material/Box';

import TblTable from 'components/TblTable';

import { PropTypes } from 'prop-types';

import subjectActions from '../actions';

class SubjectList extends React.PureComponent {
  componentDidMount() {
    this.getSubjectList();
  }

  getSubjectList = () => {
    const { currentUser } = this.props;
    this.props.getSubjectList({
      orgId: currentUser.organizationId,
      isLoadingGetSubjectList: true,
    });
  };

  render() {
    const { t, subjectList, isLoadingGetSubjectList, onOpenEditDialog } = this.props;
    // const renderContextMenu = (record, t, callback) => {
    //   return (
    //     <MenuItem onClick={() => {onOpenEditDialog(record); if (callback) {callback();} }}>
    //       {t('common:edit')}
    //     </MenuItem>
    //   );
    // };
    const columns = [
      {
        title: t('common:name'),
        dataIndex: 'subjectName',
        key: 'subjectName',
        render: (text) => (
          <div className='text-ellipsis'>{trim(text)}</div>
        ),
      },
      // {
      //   key: 'action',
      //   align: 'right',
      //   contextMenu: (record, callback) => renderContextMenu(record, t, callback)
      // }
    ];

    return (
      <Box mt={2}>
        <TblTable
          columns={columns}
          rows={subjectList}
          isBusy={isLoadingGetSubjectList}
          viewDetail={(row) => onOpenEditDialog(row)}
        />
      </Box>
    );
  }
}

SubjectList.propTypes = {
  t: PropTypes.func,
  subjectList: PropTypes.array,
  isLoadingGetSubjectList: PropTypes.bool,
  currentUser: PropTypes.object,
  getSubjectList: PropTypes.func,
  onOpenEditDialog: PropTypes.func
};

const mapStateToProps = (state) => ({
  currentUser: state.Auth.currentUser,
  subjectList: state.Subject.subjectList,
  isLoadingGetSubjectList: state.Subject.isLoadingGetSubjectList,
});

const mapDispatchToProps = (dispatch) => ({
  getSubjectList: (payload) => dispatch(subjectActions.getSubjectList(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SubjectList);
