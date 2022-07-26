import React from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import withStyles from '@mui/styles/withStyles';

import TblInputs from 'components/TblInputs';

import PropTypes from 'prop-types';
import { createLink } from 'roosterjs-editor-api';
import { removeLink } from 'roosterjs-editor-api';

import InputSingleActions from '../../../utils/InputSingleActions';
import { ButtonTitleEnum } from '../constants';
import EditorButton from '../EditorButton';
import { ReactComponent as IcnLinkOffRounded } from '../images/icn_unlink.svg';

import styles from './styled';

class InsertLink extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      url: props.url,
      displayText: props.displayText,
    };
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onOk = () => {
    const { url, displayText } = this.state;
    this.props.onDismiss();
    createLink(this.props.editor, url, null, displayText);
  };

  onRemoveLink = () => {
    this.props.onDismiss();
    removeLink(this.props.editor);
  };
  render() {
    const { classes } = this.props;
    const { url, displayText } = this.state;
    return (
      <Grid container className={classes.root} style={{ width: 368 }}>
        <Grid item sm={6} className={classes.inputContainer}>
          <TblInputs
            name='url'
            label={'URL'}
            value={url}
            placeholder={'Enter URL'}
            onChange={this.onChange}
            noneMarginBottom={true}
          />
        </Grid>
        <Grid item sm={6} className={classes.inputContainer}>
          <TblInputs
            name='displayText'
            label={'DisplayText'}
            value={displayText}
            placeholder={'Enter Text'}
            onChange={this.onChange}
            noneMarginBottom={true}
          />
        </Grid>
        <Box mt={1} ml={1}>
          <EditorButton
            title={ButtonTitleEnum.REMOVE_LINK}
            svgIconComponent={IcnLinkOffRounded}
            handleClick={this.onRemoveLink}
          />
        </Box>
        <InputSingleActions
          className={classes.formActions}
          open={true}
          handleSave={this.onOk}
          handleCancel={this.props.onDismiss}
        />
      </Grid>
    );
  }
}

InsertLink.propTypes = {
  classes: PropTypes.object,
  editor: PropTypes.any,
  onDismiss: PropTypes.func,
  url: PropTypes.string,
  displayText: PropTypes.string,
};

const FormLink = withStyles(styles)(InsertLink);

export default function renderInsertLinkDialog(editor, onDismiss) {
  let a = editor?.getElementAtCursor('a[href]');
  return (
    <FormLink
      editor={editor}
      onDismiss={onDismiss}
      url={a ? a.href : ''}
      displayText={a ? a.innerText : ''}
    />
  );
}
