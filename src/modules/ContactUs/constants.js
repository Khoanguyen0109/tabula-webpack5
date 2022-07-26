export const actions = {
  CONTACT_US_SET_STATE: 'CONTACT_US_SET_STATE',

  SEND_FEEDBACK: 'SEND_FEEDBACK',
  SEND_FEEDBACK_SUCCESS: 'SEND_FEEDBACK_SUCCESS',
  SEND_FEEDBACK_FAILED: 'SEND_FEEDBACK_FAILED',
};

export const END_POINT = {
  send_feedback: {
    url: () => `${process.env.REACT_APP_API_URL}/organizations/feedback`,
    method: 'POST',
  },
};
