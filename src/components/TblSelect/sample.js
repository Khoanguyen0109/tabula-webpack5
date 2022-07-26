import React from 'react';

import { Chip } from '@mui/material';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

import { Formik } from 'formik';

import MultiOption from './MultiOption';

import TblSelect from '.';
import TblSelectImprove from './index';

const names = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder',
];

const withLongText = [
  'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum',
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
];

function Basic() {
  const [personName, setPersonName] = React.useState([]);
  const [multi, setMulti] = React.useState([]);

  const handleChange = (event) => {
    setPersonName(event.target.value);
  };

  const handleChangeMulti = (event) => {
    setMulti(event.target.value);
  };

  return (
    <Grid container spacing={3}>
      <Grid item sm={6}>
      <h1>OLD SAMPLE</h1>
        <Typography component={'div'}>
          <h2>Single Select</h2>
          <Formik
            initialValues={{ email: '', password: '' }}
            onSubmit={(values, { setSubmitting }) => {
              setTimeout(() => {
                alert(JSON.stringify(values, null, 2));
                setSubmitting(false);
              }, 400);
            }}
          >
            {({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <TblSelect label={<span>Normal</span>} value={personName} options={names} onChange={handleChange}>
                  <MenuItem value='10'>Ten</MenuItem>
                  <MenuItem value='20'>Twenty</MenuItem>
                </TblSelect>
                <TblSelect
                  required
                  error
                  value={personName}
                  onChange={handleChange}
                  errorMessage={'Error Message'}
                  label='Error'
                  options={names}
                >
                {names.map((name) => (
            <MenuItem value={name}>{name}</MenuItem>
          ))}
                </TblSelect>
                <TblSelect
                  required
                  helperLabel='Helper Text'
                  label='With help text'
                  options={names}
                >
                  <MenuItem value='10'>Ten</MenuItem>
                  <MenuItem value='20'>Twenty</MenuItem>
                </TblSelect>
              </form>
            )}
          </Formik>
          <h2>Multiple Select</h2>
          <Formik
            initialValues={{ email: '', password: '' }}
            onSubmit={(values, { setSubmitting }) => {
              setTimeout(() => {
                alert(JSON.stringify(values, null, 2));
                setSubmitting(false);
              }, 400);
            }}
          >
            {({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <TblSelect
                  required
                  label='Normal'
                  multiple
                  onChange={handleChangeMulti}
                  value={multi}
                  renderValue={(selected) => (
                    <div>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </div>
                  )}
                >
                  {names.map((name) => (
                    <MenuItem key={name} value={name}>
                      {name}
                    </MenuItem>
                  ))}
                </TblSelect>
              </form>
            )}
          </Formik>
        </Typography>
      </Grid>

      <Grid item sm={6}>
      <h1>NEW SAMPLE</h1>

      <h2>Default</h2>

        <TblSelectImprove
          label='New Select'
          error
          errorMessage={'Error Message'}
          placeholder='Please Select...'
          value={personName}
          onChange={handleChange}
          options={names}
        >
          {names.map((name) => (
            <MenuItem value={name}>{name}</MenuItem>
          ))}
        </TblSelectImprove>
        <TblSelectImprove
          label='With Long Text'
          error
          errorMessage={'Error Message'}
          placeholder='Please Select...'
          value={personName}
          onChange={handleChange}
          options={names}
        >
          {withLongText.map((name) => (
            <MenuItem value={name}>{name}</MenuItem>
          ))}
        </TblSelectImprove>
        <TblSelectImprove
          label='No Options'
          placeholder='Please Select...'
          value={personName}
          onChange={handleChange}
         />
        <TblSelectImprove
          label='Multiple'
          multiple
          placeholder='Please Select...'
          value={multi}
          onChange={handleChangeMulti}
        >
          {names.map((name) => (
            <MenuItem value={name}>{name}</MenuItem>
          ))}
        </TblSelectImprove>

        <TblSelectImprove
          label='Multiple with checkbox option'
          multiple
          placeholder='Please Select...'
          value={multi}
          onChange={handleChangeMulti}
          checkboxOption={true}
          options={names}

        />
        <TblSelectImprove
          label='Multiple with chip value option'
          chipValue
          multiple
          placeholder='Please Select...'
          value={multi}
          onChange={handleChangeMulti}
          checkboxOption={true}
          options={names}

        />
       
        <TblSelectImprove
          label='Disable'
          multiple
          placeholder='Please Select...'
          value={multi}
          onChange={handleChangeMulti}
          checkboxOption={true}
          disabled
        >
          {names.map((name) => (
              <MenuItem key={name} value={name}>
                <MultiOption key={name} data={name} selectedList={multi} />
              </MenuItem>
            ))}
        </TblSelectImprove>
        <h2>Small</h2>
        <h4>Default</h4>
        <TblSelectImprove
          small
          multiple
          placeholder='Please Select...'
          value={multi}
          onChange={handleChangeMulti}
          // checkboxOption={true}
        >
          {names.map((name) => (
              <MenuItem value={name}>{name}</MenuItem>
            ))}
        </TblSelectImprove>
        <h4>Small select with checkbox</h4>
        <TblSelectImprove
          small
          multiple
          placeholder='Please Select...'
          value={multi}
          onChange={handleChangeMulti}
          checkboxOption={true}
          options={names}
         />
        <h4>Disable</h4>
        <TblSelectImprove
          small
          multiple
          placeholder='Please Select...'
          value={multi}
          onChange={handleChangeMulti}
          checkboxOption={true}
          disabled
        >
          {names.map((name) => (
              <MenuItem key={name} value={name}>
                <MultiOption key={name} data={name} selectedList={multi} />
              </MenuItem>
            ))}
        </TblSelectImprove>
      </Grid>
    </Grid>
  );
}

export default Basic;
