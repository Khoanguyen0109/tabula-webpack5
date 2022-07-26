export const ButtonTitleEnum = {
  HEADING1: 'Heading 1',
  HEADING2: 'Heading 2',
  BOLD: 'Bold',
  ITALIC: 'Italic',
  UNDERLINED: 'Underlined',
  BULLET: 'Bullets',
  NUMBERING: 'Numbering',
  QUOTE: 'Quote',
  ALIGN_LEFT: 'Align Left',
  ALIGN_RIGHT: 'Align Right',
  ALIGN_CENTER: 'Align Center',
  INSERT_LINK: 'Insert Hyperlink',
  TABLE: 'Show Table Options',
  INSERT_IMAGE: 'Insert Inline Image',
  STRIKE_THROUGH: 'Strike Through',
  FORMULA: 'Formula',
  CLEAR_FORMAT: 'Remove Formatting',
  REMOVE_LINK: 'Remove Hyperlink',
  TEXT_COLOR: 'Text Color',
  HIGHLIGHT_COLOR: 'Highlight Color'
};

export const hexToRGB = (h) => {
  let r = 0, g = 0, b = 0;

  // 3 digits
  if (h.length === 4) {
    r = `0x${ h[1] }${h[1]}`;
    g = `0x${ h[2] }${h[2]}`;
    b = `0x${ h[3] }${h[3]}`;

    // 6 digits
  } else if (h.length === 7) {
    r = `0x${ h[1] }${h[2]}`;
    g = `0x${ h[3] }${h[4]}`;
    b = `0x${ h[5] }${h[6]}`;
  }

  return `rgb(${ +r }, ${ +g }, ${ +b })`;
};

export const hexAToRGBA = (h) => {
  let r = 0, g = 0, b = 0/*, a = 1 */;

  if (h.length === 5) {
    r = `0x${ h[1] }${h[1]}`;
    g = `0x${ h[2] }${h[2]}`;
    b = `0x${ h[3] }${h[3]}`;
    // a = '0x' + h[4] + h[4];

  } else if (h.length === 9) {
    r = `0x${ h[1] }${h[2]}`;
    g = `0x${ h[3] }${h[4]}`;
    b = `0x${ h[5] }${h[6]}`;
    // a = '0x' + h[7] + h[8];
  }

  return `rgba(${ +r }, ${ +g }, ${ +b }, ${ 1 })`;
};