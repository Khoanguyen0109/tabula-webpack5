import { ajax } from 'rxjs/ajax';

export const makeAjaxRequest = (
  method = 'GET',
  url,
  payload,
  upload,
  ignoreUserAgent,
  token
) => {
  let request_url = url;
  let accessToken = '';
  if (!token) {
    accessToken = localStorage.getItem('access_token');
  } else {
    accessToken = token;
  }

  let headers = {
    'Content-Type': 'application/json'
  };
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }
  if (upload) {
    return ajax({
      method: method,
      url: `${request_url}`,
      crossDomain: true,
      body: payload.data
    });
  }
  if (method === 'GET') {
    return ajax({
      method: 'GET',
      url: `${request_url}`,
      crossDomain: true,
      headers: Object.assign(headers, {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }),
      responseType: 'json'
    });
  }
  return ajax({
    method: method,
    url: `${request_url}`,
    crossDomain: true,
    headers: headers,
    body: payload,
    responseType: 'json'
  });
};
