import React from 'react';

import Grid from '@mui/material/Grid';
import withStyles from '@mui/styles/withStyles';

import TblInputs from 'components/TblInputs';

import PropTypes from 'prop-types';
import { insertTable } from 'roosterjs-editor-api';

import InputSingleActions from '../../../utils/InputSingleActions';

import styles from './styled';

class TableOptions extends React.PureComponent {
  state = {
    cols: '',
    rows: ''
  }
  onInsertTable = () => {
    this.props.onDismiss();
    const { cols, rows } = this.state;
    if (cols > 0 && rows > 0) {
      insertTable(this.props.editor, cols, rows);
    }
  };
  isAllowedInput = (values) => {
    const { floatValue, formattedValue } = values;
    return formattedValue === '' || floatValue > 0;
  }
  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }
  render() {
    const { classes } = this.props;
    const { cols, rows } = this.state;
    return (
      <Grid container className={classes.root} style={{ width: 320 }}>
        <Grid item sm={6} className={classes.inputContainer}>
          <TblInputs
            name='cols'
            label={'Columns'}
            placeholder={'Columns'}
            inputType='number'
            decimalScale={0}
            isAllowed={this.isAllowedInput}
            value={cols}
            onChange={this.onChange}
            noneMarginBottom={true}
          />
        </Grid>
        <Grid item sm={6} className={classes.inputContainer}>
          <TblInputs
            name='rows'
            label={'Rows'}
            placeholder={'Rows'}
            decimalScale={0}
            isAllowed={this.isAllowedInput}
            value={rows}
            onChange={this.onChange}
            noneMarginBottom={true}
          />
        </Grid>
        <InputSingleActions
          className={classes.formActions}
          open={true}
          handleSave={this.onInsertTable}
          handleCancel={this.props.onDismiss}
        />
      </Grid>
    );
  }
}
TableOptions.propTypes = {
  classes: PropTypes.object,
  editor: PropTypes.object,
  onDismiss: PropTypes.func
};
TableOptions.defaultProps = {

};
const FormTable = withStyles(styles)(TableOptions);

export default function renderTableOptions(editor, onDismiss) {
  return <FormTable editor={editor} onDismiss={onDismiss} />;
}
