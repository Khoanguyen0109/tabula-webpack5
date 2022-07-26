import { insertImage } from 'roosterjs-editor-api';

const { liteAdaptor } = require('mathjax-full/js/adaptors/liteAdaptor.js');
const { RegisterHTMLHandler } = require('mathjax-full/js/handlers/html.js');
const { TeX } = require('mathjax-full/js/input/tex.js');
const { AllPackages } = require('mathjax-full/js/input/tex/AllPackages.js');
const { mathjax } = require('mathjax-full/js/mathjax.js');
const { SVG } = require('mathjax-full/js/output/svg.js');

// Define event type for mathjax

export const EVENT_TYPE = 100;
export default class MathJaxPlugin {

  getName() {
    return 'MathJax';
  }

  initialize(editor) {
    this.adaptor = liteAdaptor();
    this.handler = RegisterHTMLHandler(this.adaptor);
    this.editor = editor;
  }

  dispose() {
    this.handler = null;
    this.adaptor = null;
    this.editor = null;
  }

  getEditor() {
    return this.editor;
  }

  refCallback = (ref) => {
    this.katex = ref;
  };

  onPluginEvent(event) {
    if (event.eventType === EVENT_TYPE && event.formula) {
      const tex = new TeX({ packages: AllPackages.sort().join(', ').split(/\s*,\s*/) });
      const svg = new SVG({ fontCache: 'local' });
      const html = mathjax.document('', { InputJax: tex, OutputJax: svg });
      const node = html.convert(event.formula, {
        display: false,
        em: 16,
        ex: 8,
        containerWidth: 80 * 16
      });
      const nodeHtml = this.adaptor.innerHTML(node);
      this.editor.addUndoSnapshot(() => {
        insertImage(this.editor, `data:image/svg+xml;utf8,${ encodeURIComponent(nodeHtml)}`);
      });
    }
  }
}
