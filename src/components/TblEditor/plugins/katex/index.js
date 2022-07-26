const KATEX_HTML_TAG = ['MATH', 'SEMANTICS', 'MROW', 'ANNOTATION', 'MSUP', 'MN', 'SVG', 'G', 'PATH', 'RECT'];
const KATEX_ATTRIBUTES = ['XMLNS', 'ENCODING', 'CONTENTEDITABLE', 'STYLE', 'WIDTH', 'HEIGHT', 'D', 'viewBox', 'preserveAspectRatio'];
const KATEX_CLASSES = ['katex-wrapper', 'katex', 'katex-html', 'base', 'mord', 'strut', 'msupsub',
  'vlist', 'vlist-t', 'vlist-r', 'pstrut', 'sizing', 'reset-size6', 'size3', 'mtight',
  'svg-align', 'hide-tail', 'd', 'mop', 'op-symbol', 'mtable', 'col-align', 'arraycolsep',
  'col-align-c', 'vlist-t2', 'vlist-s', 'delimsizing', 'size4', 'mclose', 'nulldelimiter', 'minner',
  'mopen', 'frac-line', 'mrel', 'x-arrow', 'stretchy', 'halfarrow-right', 'halfarrow-left', 'frac-line',
  'mbin', 'mspace', 'nulldelimiter', 'mfrac', 'mathnormal'
];
export default class KatexPlugin {

  getName() {
    return 'Katex';
  }

  initialize(editor) {
    this.editor = editor;
    this.eventDisposer = editor.addDomEventHandler({
      copy: this.onExtract(false),
      blur: this.onBlur,
      cut: this.onExtract(true),
    });
  }
  onBlur = () => {
    if (this.katexWrapper) {
      this.katexWrapper.classList.remove('selected');
      this.katexWrapper = null;
    }
  }

  onExtract(isCut) {
    var _this = this;
    return function (event) {
      if (_this.editor) {
        // get whatever the current selection range is
        var selectionRange = _this.editor.getSelectionRange();
        if (selectionRange && !selectionRange.collapsed) {
          var clipboardEvent = event;
          var copyFragment = _this.editor.getSelectionRange().cloneContents();
          var containerDiv = _this.editor.getDocument().createElement('div');
          var haveKatex = copyFragment.querySelectorAll('span.katex');
          if (haveKatex.length) {
            // // Leverage script execution policy on CEDs to try and prevent XSS
            containerDiv.contentEditable = 'true';
            containerDiv.appendChild(copyFragment);
            // put it on the clipboard
            clipboardEvent.clipboardData.setData('text/html', containerDiv.innerHTML);
            clipboardEvent.clipboardData.setData('text/plain', containerDiv.innerText);
            // if it's cut, delete the contents
            if (isCut) {
              _this.editor.getSelectionRange().deleteContents();
            }
            event.preventDefault();
          }
        }
      }
    };
  };

  dispose() {
    this.eventDisposer();
    this.eventDisposer = null;
    this.editor = null;
  }

  getEditor() {
    return this.editor;
  }

  refCallback = (ref) => {
    this.katex = ref;
  };

  isArrowKey = (event) => {
    if (event && (event.keyCode === 37 || event.keyCode === 38 || event.keyCode === 39 || event.keyCode === 40)) {
      return true;
    }
    return false;
  }

  onPluginEvent(event) {
    const element = this.editor.getElementAtCursor();
    if (element && element.querySelectorAll('.katex-wrapper')) {
      if (event && event.rawEvent && event.rawEvent.keyCode === 36) {
        this.editor.select(element.parent || element, 0);
      } else if (event && event.rawEvent && event.rawEvent.keyCode === 35) {
        this.editor.select(element.parent || element, -1);
      }
    }
    if (this.isArrowKey(event.rawEvent)) {
      const element = this.editor.getElementAtCursor();
      if (element && element.closest('.katex-wrapper')) {
        const parent = element.closest('.katex-wrapper');
        if (event.rawEvent.keyCode === 39) {
          if (element.classList.contains('placeholder')) {
            this.editor.select(parent, -2);
          } else {
            this.editor.select(parent, -1);
          }
        } else if (event.rawEvent.keyCode === 37) {
          this.editor.select(parent, 0);
        }
      }
    }

    if (event.eventType === 9 /* BeforePaste */) {
      const sanitizingOption_1 = event.sanitizingOption;
      sanitizingOption_1.additionalAllowedTags.push(...KATEX_HTML_TAG);
      sanitizingOption_1.additionalAllowAttributes.push(...KATEX_ATTRIBUTES);
      sanitizingOption_1.additionalAllowedCssClasses.push(...KATEX_CLASSES);
    } else if (event.eventType === 4 /* Mousedown */) {
      const rawEvent = event.rawEvent;
      const target = rawEvent.target;
      this.katexWrapper = target.closest('.katex-wrapper');
      if (this.katexWrapper) {
        // this.katexWrapper.classList.add('selected');
        // const range = createRange(this.katexWrapper, this.katexWrapper);
        // range.selectNode(this.katexWrapper);
        // console.log(range);
        // selection.addRange(range);
      }
    }
  }
}
