import React, { PureComponent } from 'react';

import Box from '@mui/material/Box';

import TblButton from 'components/TblButton';
import TblInputs from 'components/TblInputs';

import { Field, Form, Formik } from 'formik';

export default class Sample extends PureComponent {
  onAbort = () => () => {};

  onSave = () => () => {};

  render() {
    return (
      <div>
        <h1>NEW SAMPLE</h1>

        <h1>Simple Input</h1>
        <TblInputs />
        <h1>Single Save Input</h1>
        <TblInputs
          singleSave
          label='Label'
          onAbort={this.onAbort()}
          onSave={this.onSave()}
          helperLabel='Helper Label'
        />
        <TblInputs
          singleSave
          label='Disable'
          onAbort={this.onAbort()}
          onSave={this.onSave()}
          helperLabel='Helper Label'
          disabled
        />
        <TblInputs
          singleSave
          required
          label='Label'
          onAbort={this.onAbort()}
          onSave={this.onSave()}
          helperLabel='Helper Label'
        />
        <TblInputs
          singleSave
          required
          label='Label'
          onAbort={this.onAbort()}
          onSave={this.onSave()}
        />
        <TblInputs
          singleSave
          required
          label='Label'
          onAbort={this.onAbort()}
          onSave={this.onSave()}
          errorMessage='This field is required'
        />
        <TblInputs
          singleSave
          required
          label='Label'
          onAbort={this.onAbort()}
          onSave={this.onSave()}
          helperLabel='Helper Label'
        />
        <TblInputs
          singleSave
          required
          label='Label'
          onAbort={this.onAbort()}
          onSave={this.onSave()}
          helperLabel='Helper Label'
        />

        <TblInputs
          singleSave
          name='date'
          inputType='date'
          label='Masked date picker'
          placeholder='08:00 AM'
          required
          onChange={() => {}}
        />
        <TblInputs
          singleSave
          name='date'
          inputType='date'
          disabled
          label='Masked date picker Disable'
          placeholder='08:00 AM'
          required
          onChange={() => {}}
        />

        <TblInputs
          singleSave
          name='time'
          inputType='time'
          label='Masked time picker'
          placeholder='08:00 AM'
          required
          onChange={() => {}}
        />
        <TblInputs
          // inputProps={{ ref: input => this.searchInput = input }}
          inputSize='medium'
          placeholder='With search Icon'
          hasSearch={true}
        />

        <Formik
          initialValues={{
            date: null,
            dateAuto: null,
            time: null,
            timeAuto: null,
          }}
          onSubmit={(values, { setSubmitting }) => {
            alert(JSON.stringify(values, null, 2));
            setSubmitting(false);
          }}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form>
              <h1>Form</h1>
              <Field
                as={TblInputs}
                name='email1'
                label='Label'
                required
                type='email'
                placeholder='Email'
                errorMessage='Error Msg'
                error
                helperLabel='Helper Label'
              />

              <Field
                as={TblInputs}
                name='name1'
                label='Name'
                type='email'
                placeholder='Email'
              />

              <Field
                as={TblInputs}
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
              <Field
                as={TblInputs}
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
              <Box mt={2}>
                <TblButton
                  type='submit'
                  disabled={isSubmitting}
                  size='medium'
                  variant='contained'
                  color='primary'
                >
                  Submit
                </TblButton>
              </Box>
            </Form>
          )}
        </Formik>
      </div>
    );
  }
}
