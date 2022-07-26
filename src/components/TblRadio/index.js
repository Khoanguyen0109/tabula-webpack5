import React from 'react';

import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import SvgIcon from '@mui/material/SvgIcon';
import makeStyles from '@mui/styles/makeStyles';
import { Box } from '@mui/system';

import TblInputLabel from 'components/TblInputLabel';

import { ReactComponent as RadioUnselected } from 'assets/images/icn_radio.svg';
import { ReactComponent as RadioSelected } from 'assets/images/icn_radio_checked.svg';
import { PropTypes } from 'prop-types';

// import styles from './styles';

const RadioOutline = <SvgIcon component={RadioUnselected} />;
const RadioChecked = <SvgIcon component={RadioSelected} />;

const useStyles = makeStyles((theme) => ({
  root: {
    // minWidth: '124px', //to make align vertical item - example: master assignment drawer
    '& .MuiRadio-root': {
      padding: 8,
      marginLeft: 8,
    },
  },
  formControl: {
    width: '100%',
  },
  icon: {
    borderRadius: '50%',
    width: 16,
    height: 16,
  },
  checkedIcon: {},
  label: {
    fontSize: theme.fontSize.normal,
  },
}));

export function StyledRadio(props) {
  // const classes = useStyles();

  return (
    <Radio
      checkedIcon={RadioChecked}
      icon={RadioOutline}
      // disableRipple
      // color='default'
      // checkedIcon={<span className={clsx(classes.icon, classes.checkedIcon)} />}
      // icon={<span className={classes.icon} />}
      {...props}
    />
  );
}
export default function TblRadio(props) {
  const {
    row,
    label,
    values,
    name,
    value,
    containerStyle = {
      direction: 'row',
      justify: 'center',
      alignItems: 'center',
    },
    itemWidth = { sm: 6 },
    disabled,
    ...rest
  } = props;
  const classes = useStyles();

  // const [value, setValue] = React.useState(values && values[0]?.value);
  const handleChange = (event) => {
    props.onChange && props.onChange(event);
  };
  return (
    <Box className={classes.formControl}>
      {label && (
        <TblInputLabel htmlFor={name} component='legend'>
          {label}
        </TblInputLabel>
      )}
      <RadioGroup
        id={name}
        name={name}
        value={value?.toString()}
        onChange={handleChange}
        row={row}
        {...rest}
      >
        <Grid container {...containerStyle}>
          {values?.map((item, i) => (
              <Grid {...itemWidth} item key={i}>
                <FormControlLabel
                  disabled={disabled}
                  classes={{ label: classes.label, root: classes.root }}
                  value={item?.value?.toString()}
                  control={<StyledRadio />}
                  label={item?.label}
                />
              </Grid>
            ))}
        </Grid>
      </RadioGroup>
    </Box>
  );
}

TblRadio.propTypes = {
  row: PropTypes.bool,
  onChange: PropTypes.func,
  label: PropTypes.string,
  values: PropTypes.array,
  name: PropTypes.string,
  value: PropTypes.any,
  containerStyle: PropTypes.object,
  itemWidth: PropTypes.object,
  disabled: PropTypes.bool,
};

TblRadio.defaultProps = {
  row: true,
  disabled: false,
};
