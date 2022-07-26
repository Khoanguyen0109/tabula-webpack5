// Implement by Nghia Nguyen
import React, { useState } from 'react';
import NumberFormat from 'react-number-format';

import PropTypes from 'prop-types';

//https://github.com/s-yadav/react-number-format
import { INPUT_TYPE } from './utils';

const FORMAT = {
  phone: '###-###-##############',
};

const FormatNumberInput = React.forwardRef((props, ref) => {
  const [value, setValue] = useState();
  const { onChange, inputType, format, ...rest } = props;
  const handleOnChange = (values) => {
    setValue(values.formattedValue);
    if (onChange) {
      onChange({
        target: {
          name: props.name,
          // Comment because all the input number cannot input float value.
          value:
            inputType === INPUT_TYPE.PHONE
              ? values.value
              : parseFloat(values.value, 10),
          // value: values.value,
        },
      });
    }
  };

  return (
    <NumberFormat
      getInputRef={ref}
      value={value}
      onValueChange={handleOnChange}
      format={format || FORMAT[inputType]}
      {...rest}
    />
  );
});
export default FormatNumberInput;

FormatNumberInput.propTypes = {
  name: PropTypes.string,
  inputType: PropTypes.string,
  onChange: PropTypes.func,
  inputRef: PropTypes.any,
  format: PropTypes.string,
};
