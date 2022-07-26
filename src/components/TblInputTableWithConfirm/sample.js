import React, { PureComponent } from 'react';

import Tooltip from '@mui/material/Tooltip';

import TblButton from 'components/TblButton';
import TblInputs from 'components/TblInputs';

import { Field, Form, Formik } from 'formik';

export default class Sample extends PureComponent {
  render() {
    return (
      <div className='pickers'>
        <Formik
          initialValues={{ date: null, dateAuto: null, time: null, timeAuto: null }}
          onSubmit={(values, { setSubmitting }) => {
            alert(JSON.stringify(values, null, 2));
            setSubmitting(false);
          }}
        >
          {({ isSubmitting, setFieldValue }) => (
              <Form>
                <h1>Text Field</h1>
                <Field as={TblInputs}
                  name='email1'
                  label={
                    <div style={{ display: 'contents' }}>Email
                      <Tooltip title='Add' placement='top'>
                        <span className='icon-icn_check' />
                      </Tooltip>
                    </div>}
                  required
                  type='email'
                  placeholder='Email'
                  errorMessage='Error Msg'
                  error
                  helperLabel='Helper Label'
                />

                <Field as={TblInputs}
                  name='email2'
                  label='Email Auto Save'
                  required
                  type='email'
                  singleSave
                  placeholder='Email Auto Save'
                  errorMessage='Error Msg'
                  inputType='text'
                />

                <Field as={TblInputs}
                  name='name1'
                  label='Name'
                  type='email'
                  placeholder='Email' />

                <Field as={TblInputs}
                  name='name2'
                  label='Name Auto Save'
                  type='email'
                  singleSave
                  placeholder='Email Auto Save'
                />

                <h1>Date Time Picker</h1>

                <Field as={TblInputs}
                  name='dateAuto'
                  singleSave
                  inputType='date'
                  label='Masked timepicker'
                  required
                  onChange={(value) => {
                    setFieldValue('dateAuto', value);
                  }}
                />
                <Field as={TblInputs}
                  name='date'
                  inputType='date'
                  label='Masked timepicker'
                  mask='__:__ _M'
                  required
                  onChange={(value) => {
                    setFieldValue('date', value);
                  }}
                />

                <Field as={TblInputs}
                  name='timeAuto'
                  inputType='time'
                  label='Masked timepicker'
                  placeholder='08:00 AM'
                  mask='__:__ _M'
                  required
                  onChange={(value) => {
                    setFieldValue('timeAuto', value);
                  }}
                />
                <Field as={TblInputs}
                  name='time'
                  inputType='time'
                  label='Masked timepicker'
                  placeholder='08:00 AM'
                  mask='__:__ _M'
                  required
                  onChange={(value) => {
                    setFieldValue('time', value);
                  }}
                />

                <TblButton type='submit' disabled={isSubmitting} size='medium' variant='contained' color='primary'>
                  Submit
                  </TblButton>
              </Form>
            )}
        </Formik>
      </div>
    );
  }
}
