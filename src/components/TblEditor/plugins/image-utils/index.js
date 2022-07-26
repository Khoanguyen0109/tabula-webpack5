import { contains, getTagOfNode, toArray } from 'roosterjs-editor-dom';

export default class MathJaxPlugin {

  getName() {
    return 'ImageUtils';
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

  getSelectedImage = function (div) {
    var divWithImage = div || this.alignmentDiv;
    return divWithImage ? divWithImage.getElementsByTagName('IMG')[0] : null;
  };

  onPluginEvent(e) {
    if (e.eventType === 4 /* MouseDown */) {
      var event_1 = e.rawEvent;
      var target = (event_1.srcElement || event_1.target);
      if (getTagOfNode(target) === 'IMG') {
        var parent_1 = target.parentNode;
        var elements = parent_1
          ? toArray(parent_1.querySelectorAll('img'))
          : [];
        if (elements.indexOf(target) < 0) {
          return;
        }
        target.contentEditable = 'false';
        if (this.currentImg && this.currentImg !== target) {
          this.hideAlignment();
        }
        if (!this.alignmentDiv) {
          this.showAlignment(target);
        }
      }
      else if (this.alignmentDiv && !contains(this.alignmentDiv, target)) {
        this.hideAlignment();
      }
    }
  }

  showAlignment = (image) => {
    this.alignmentDiv = this.createAlignmentDiv(image);
    this.currentImg = image;
    image.contentEditable = 'false';
  }

  hideAlignment = () => {
    var parent = this.alignmentDiv && this.alignmentDiv.parentNode;
    if (parent) {
      this.removeAlignmentDiv(this.alignmentDiv);
      this.alignmentDiv = null;
    }
    this.currentImg = null;
  }

  removeAlignmentDiv = function (div) {
    var _this = this;
    if (this.editor && this.editor.contains(div)) {
      [div.previousSibling, div.nextSibling].forEach(function (comment) {
        if (comment && comment.nodeType === 8 /* Comment */) {
          _this.editor.deleteNode(comment);
        }
      });
      this.editor.deleteNode(div);
    }
  };

  createAlignmentDiv = (target) => {
    var document = this.editor.getDocument();
    var alignmentDiv = document.createElement('DIV');
    var alignLeft = document.createElement('button');
    var alignCenter = document.createElement('button');
    var alignRight = document.createElement('button');
    var imageLeft = require('../ribbon/svg/alignleft.svg');
    var imageCenter = require('../ribbon/svg/aligncenter.svg');
    var imageRight = require('../ribbon/svg/aligncenter.svg');
    var imageL = document.createElement('IMG');
    var imageC = document.createElement('IMG');
    var imageR = document.createElement('IMG');
    imageL.width = '32';
    imageL.height = '32';
    imageC.width = '32';
    imageC.height = '32';
    imageR.width = '32';
    imageR.height = '32';
    imageL.src = imageLeft;
    alignLeft.appendChild(imageL);
    alignmentDiv.appendChild(alignLeft);
    imageC.src = imageCenter;
    alignCenter.appendChild(imageC);
    alignmentDiv.appendChild(alignCenter);
    imageR.src = imageRight;
    alignRight.appendChild(imageR);
    alignmentDiv.appendChild(alignRight);
    var position = target.getBoundingClientRect();
    alignmentDiv.style.position = 'absolute';
    alignmentDiv.style.top = 0;
    alignmentDiv.style.left = `${(position.right / 2) - 150 }px`;
    alignmentDiv.style.zIndex = 999;
    var parent = target.parentNode;
    parent.insertBefore(alignmentDiv, target);
    return alignmentDiv;
  }
}
