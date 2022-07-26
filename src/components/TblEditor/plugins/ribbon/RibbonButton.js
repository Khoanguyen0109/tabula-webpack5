import React from 'react';

import upperCase from 'lodash/upperCase';

import withStyles from '@mui/styles/withStyles';

import PropTypes from 'prop-types';
import { insertImage } from 'roosterjs-editor-api';
import { Browser } from 'roosterjs-editor-dom';

import { ButtonTitleEnum } from './constants';
import EditorButton from './EditorButton';
import styles from './RibbonStyles';
class RibbonButton extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isDropDownShown: false,
    };
    this.range = null;
    this.ref = React.createRef();
    this.editorRef = React.createRef();
  }

  handleClickOutside = (e) => {
    if (!this.ref.current.contains(e.target)) {
      this.setState({ isDropDownShown: false }, () =>
        document.removeEventListener('mousedown', this.handleClickOutside)
      );
    }
  };

  checkAlignment = () => {
    const { button, plugin } = this.props;
    const editor = plugin.getEditor();
    if (!editor) {
      return button.title === ButtonTitleEnum.ALIGN_LEFT;
    }
    const styleTextAlign =
      editor.getBlockTraverser()?.scoper?.block?.element?.style?.textAlign ||
      'left';
    const textAlign = ButtonTitleEnum[`ALIGN_${upperCase(styleTextAlign)}`];
    return button.title === textAlign;
  };

  onExecute = (value) => {
    const { button, plugin } = this.props;
    const editor = plugin.getEditor();
    this.onHideDropDown();
    if (button.onClick) {
      button.onClick(editor, value, insertImage);
    }
  };

  onShowDropDown = () => {
    if (Browser.isSafari) {
      this.range = this.props.plugin.getEditor().getSelectionRange();
    }

    if (!this.props.button.preserveOnClickAway) {
      this.getDocument().addEventListener('click', this.onHideDropDown);
    }
    this.setState({ isDropDownShown: true });
  };

  onHideDropDown = () => {
    if (Browser.isSafari) {
      this.props.plugin.getEditor().select(this.range);
    }
    this.getDocument().removeEventListener('click', this.onHideDropDown);
    this.setState({ isDropDownShown: false });
  };

  renderDropDownItems(items, renderer) {
    const { classes, button } = this.props;
    return (
      <div className={classes.dropDown}>
        {Object.keys(items).map((key) =>
          renderer ? (
            <div key={key}>
              {renderer(
                this.props.plugin.getEditor(),
                this.onHideDropDown,
                button
                // key,
                // items[key],
                // this.props.plugin,
                // this.props.format
              )}
            </div>
          ) : (
            <div
              key={key}
              onClick={() => this.onExecute(key)}
              className={classes.dropDownItem}
            >
              {items[key]}
            </div>
          )
        )}
      </div>
    );
  }

  getDocument() {
    return this.props.plugin.getEditor().getDocument();
  }

  handleClick = () => {
    const { button, disabled } = this.props;
    if (disabled) {
      return;
    }
    if (button.dropDownItems) {
      document.addEventListener('mousedown', this.handleClickOutside);
      this.onShowDropDown();
    } else {
      this.onExecute();
    }
  };

  render() {
    const { classes, disabled, button, plugin, format, ...rest } = this.props;
    const editor = plugin.getEditor();
    let checked = !!(
      editor &&
      format &&
      button.checked &&
      button.checked(format, editor)
    );
    let style = {};
    if (
      [
        ButtonTitleEnum.ALIGN_LEFT,
        ButtonTitleEnum.ALIGN_CENTER,
        ButtonTitleEnum.ALIGN_RIGHT,
      ].includes(button.title)
    ) {
      checked = this.checkAlignment(button.title);
    }
    if (button.title === ButtonTitleEnum.TEXT_COLOR) {
      style = { color: format?.textColor };
    } else if (button.title === ButtonTitleEnum.HIGHLIGHT_COLOR) {
      style = { color: format?.backgroundColor };
    }

    return (
      <span
        ref={this.ref}
        className={`${classes.dropDownButton} ${
          disabled ? classes.dropDownButtonDisabled : ''
        }`}
      >
        <EditorButton
          title={button.title}
          checked={checked}
          disabled={disabled}
          svgIconComponent={button.image}
          handleClick={this.handleClick}
          ref={this.editorRef}
          style={style}
          {...rest}
        />
        {button.dropDownItems &&
          this.state.isDropDownShown &&
          this.renderDropDownItems(
            button.dropDownItems,
            button.dropDownRenderer
          )}
      </span>
    );
  }
}
RibbonButton.propTypes = {
  classes: PropTypes.object,
  button: PropTypes.object,
  plugin: PropTypes.object,
  format: PropTypes.object,
  disabled: PropTypes.bool,
  onClicked: PropTypes.func,
};
export default withStyles(styles)(
  React.forwardRef((props, ref) => <RibbonButton {...props} ref={ref} />)
);
