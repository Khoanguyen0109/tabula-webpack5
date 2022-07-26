import React from 'react';

import isEmpty from 'lodash/isEmpty';
import merge from 'lodash/merge';
import startCase from 'lodash/startCase';

import withStyles from '@mui/styles/withStyles';

import PropTypes from 'prop-types';
import { getFormatState, rotateElement } from 'roosterjs-editor-api';
import { QueryScope } from 'roosterjs-editor-types';

import OtherOptions from './modals/OtherOptions';
import RibbonButton from './RibbonButton';
import ribbonButtons from './ribbonButtons';
import RibbonIcons from './RibbonIcons';
import styles from './RibbonStyles';
// let styles = require('./Ribbon.css');

class Ribbon extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDropDownShown: false
    };
  }
  onMore = () => {
    this.setState((prevState) => ({ isDropDownShown: !prevState.isDropDownShown }));
  }

  onRotateImage = () => {
    const editor = this.props.plugin.getEditor();
    const images = editor.queryElements('img', QueryScope.InSelection);
    if (images.length > 0) {
      rotateElement(editor, images[0], 45);
    }
  };

  onSave = () => {
    let editor = this.props.plugin.getEditor();
    let w = window.open();
    w.document.write(editor.getContent());

  };
  onChange = () => {
    let editor = this.props.plugin.getEditor();
    if (this.props.validation) {
      this.props.validation(editor.getContent());
    }
  }

  onClear = () => {
    let editor = this.props.plugin.getEditor();
    editor.addUndoSnapshot(() => {
      editor.setContent('');
    });
  };

  render() {
    const { classes, customButtons, ...rest } = this.props;
    const plugin = this.props.plugin;
    if (!plugin) {
      return null;
    }
    const editor = plugin.getEditor();
    const format = editor && getFormatState(editor);
    const {
      heading1, heading2,
      bold, italic, underline, strikethrough,
      formular2, insertLink, table, insertImage,
      alignLeft, alignRight, alignCenter,
      bullet, numbering, blockQuote,
      clearFormat, textColor, highlightColor,
      ...otherBtn
    } = merge(ribbonButtons, customButtons);
    const buttons = [
      { heading1, heading2 },
      { bold, italic, underline, strikethrough, textColor, highlightColor },
      { formular2, insertLink, table, insertImage },
      { bullet, numbering, blockQuote },
      { clearFormat }
    ];

    const styleTextAlign = editor?.getBlockTraverser()?.scoper?.block?.element?.style?.textAlign || 'left';
    const IcnAlign = RibbonIcons[`IcnAlign${startCase(styleTextAlign)}`];

    return (
      <div className={`${classes.ribbon } ${ this.props.className || ''}`}>
        {buttons.map((group, index) => (
            <React.Fragment key={index}>
              {Object.keys(group).map((key, idx) => (
                  <React.Fragment key={key}>
                    {index === 3 && idx === 0 && (
                      <OtherOptions
                        IconButton={IcnAlign}
                        buttons={{ alignLeft, alignCenter, alignRight }}
                        plugin={plugin}
                        format={format}
                        title={'Alignment'}
                        {...rest}
                      />
                    )}
                    <RibbonButton
                      plugin={plugin}
                      format={format}
                      button={group[key]}
                      {...rest}
                    />
                  </React.Fragment>
                ))}
              {index < buttons.length - 1 && <div className={classes.line} />}
            </React.Fragment>
          ))}
        {!isEmpty(otherBtn) && <span className={classes.textButton}>
          <OtherOptions
            IconButton={RibbonIcons.IcnMore}
            buttons={otherBtn}
            plugin={plugin}
            format={format}
            {...rest}
          />
        </span>}
      </div>
    );
  }
}
Ribbon.propTypes = {
  plugin: PropTypes.object,
  ribbonButtons: PropTypes.array,
  classes: PropTypes.object,
  customButtons: PropTypes.object,
  validation: PropTypes.func,
  className: PropTypes.any
};
Ribbon.defaultProps = {
  customButtons: {}
};
export default withStyles(styles)(Ribbon);