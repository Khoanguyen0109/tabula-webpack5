import React from 'react';
import { useImage } from 'react-image';

import PropTypes from 'prop-types';

export default function Image(props) {
  const { src } = useImage({
    srcList: props.images,
  });
  return (
    <img
      src={src}
      alt=''
      style={{ maxHeight: props.maxHeight }}
      className={props.className}
    />
  );
}

Image.propTypes = {
  images: PropTypes.array,
  className: PropTypes.string,
  maxHeight: PropTypes.number,
};
