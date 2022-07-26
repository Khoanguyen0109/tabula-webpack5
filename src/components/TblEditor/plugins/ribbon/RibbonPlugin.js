// import {  EditorPlugin } from 'roosterjs-editor-core';
import { PluginEventType } from 'roosterjs-editor-types';

export default class RibbonPlugin {

  getName() {
    return 'Ribbon';
  }

  initialize(editor) {
    this.editor = editor;
  }

  dispose() {
    this.editor = null;
  }

  getEditor() {
    return this.editor;
  }

  refCallback = (ref) => {
    this.ribbon = ref;
  };

  onPluginEvent(event) {
    if (!this.ribbon) {
      return;
    }
    const { props: { onClickInside }, onChange } = this.ribbon || {};
    const isContentChange =
      event.eventType === PluginEventType.KeyUp ||
      event.eventType === PluginEventType.ContentChanged;
    const { MouseDown, MouseUp, PendingFormatStateChanged } = PluginEventType;
    const eventNeedToForceUpdate = [MouseDown, MouseUp, PendingFormatStateChanged];

    if (eventNeedToForceUpdate.includes(event.eventType) || isContentChange) {
      this.ribbon.forceUpdate();
    }
    if (
      this.editor && this.editor.hasFocus() && onClickInside && isContentChange
    ) {
      const content = this.editor.getContent() || '';
      onClickInside(event);
      onChange(content);
    }
  }
}
