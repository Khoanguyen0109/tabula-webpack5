import * as React from 'react';

import Grid from '@mui/material/Grid';
import withStyles from '@mui/styles/withStyles';

import TblInputs from 'components/TblInputs';

import PropTypes from 'prop-types';

import InputSingleActions from '../../../utils/InputSingleActions';
import { EVENT_TYPE } from '../../mathjax';

import styles from './styled';
class InsertFormula extends React.Component {
  state = {
    formula: '',
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { classes } = this.props;
    const { formula } = this.state;
    return (
      <Grid container className={classes.root} style={{ width: 300 }}>
        <Grid item xs={12} className={classes.inputContainer}>
          <TblInputs
            name='formula'
            label={'Formula'}
            value={formula}
            placeholder={'e=mc^2'}
            onChange={this.onChange}
            noneMarginBottom={true}
          />
        </Grid>
        <InputSingleActions
          className={classes.formActions}
          open={true}
          handleSave={this.onOk}
          handleCancel={this.props.onDismiss}
        />
      </Grid>
    );
  }

  onOk = () => {
    const { editor } = this.props;
    this.props.onDismiss();
    editor.triggerPluginEvent(EVENT_TYPE, { formula: this.state.formula });
  };
}
InsertFormula.propTypes = {
  classes: PropTypes.object,
  editor: PropTypes.any,
  onDismiss: PropTypes.func
};
const FormFormula = withStyles(styles)(InsertFormula);

export default function renderInsertFormulaDialog(editor, onDismiss) {
  return (
    <FormFormula
      editor={editor}
      onDismiss={onDismiss}
    />
  );
}
