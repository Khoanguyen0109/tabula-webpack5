import { ROUTE_AUTH } from 'shared/Auth/constantsRoute';

import { removeToken } from 'utils';

const defaultError = 'Something went wrong. Please try again later.';
function handleErrorsFromServer(errors) {
  switch (errors.status) {
    case 401:
      removeToken();
      window.location.href = window.location.origin + ROUTE_AUTH.LOGIN;
      break;
    case 404:
      // window.location.href = `${window.location.origin}/404`;
      return errors.response;
    case 400:
    case 422:
      return errors.response;
    case 403:
      return errors;
    case 500:
      return {
        message: defaultError
      };
    default:
      return {
        message: defaultError
      };
  }
}

export default handleErrorsFromServer;
