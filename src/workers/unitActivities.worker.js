/* eslint-disable */

function getError(option, xhr) {
  const msg = `cannot ${option.method} ${option.action} ${xhr.status}'`;
  const err = new Error(msg);
  err.status = xhr.status;
  err.method = option.method;
  err.url = option.action;
  return err;
}

function getBody(xhr) {
  const text = xhr.responseText || xhr.response;
  if (!text) {
    return text;
  }

  try {
    return JSON.parse(text);
  } catch (e) {
    return text;
  }
}

function getUnitActivities(option) {
  const xhr = new XMLHttpRequest();
  self.postMessage({...option, uid: option.uid, event: 'progress'});

  xhr.onerror = function error(e) {
    // option.onError(e);
    self.postMessage({...e, uid: option.uid, event: 'error'})
  };

  xhr.onload = function onload() {
    // allow success when 2xx status
    // see https://github.com/react-component/upload/issues/34
    if (xhr.status < 200 || xhr.status >= 300) {
      return self.postMessage({...getError(option, xhr), uid: option.uid, event: 'error'})
      // return option.onError(getError(option, xhr), file getBody(xhr));
    }
    self.postMessage({...getBody(xhr), uid: option.uid, event: 'success'})
    // option.onSuccess(getBody(xhr), xhr);
  };


  xhr.open('GET', option.action, true);

  // Has to be after `.open()`. See https://github.com/enyo/dropzone/issues/179
  // if (option.withCredentials && 'withCredentials' in xhr) {
  // xhr.withCredentials = true;
  // }

  const headers = option.headers || {};

  // when set headers['X-Requested-With'] = null , can close default XHR header
  // see https://github.com/react-component/upload/issues/33
  if (headers['X-Requested-With'] !== null) {
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  }

  for (const h in headers) {
    if (headers.hasOwnProperty(h) && headers[h] !== null) {
      xhr.setRequestHeader(h, headers[h]);
    }
  }
  xhr.send();

  return {
    abort() {
      xhr.abort();
    },
  };
}

self.onmessage = function(e) {
  if (e && e.data) {
    getUnitActivities(e.data);
  }
};
