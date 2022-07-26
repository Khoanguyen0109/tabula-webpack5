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

function sendRequest(option) {
  const xhr = new XMLHttpRequest();
  xhr.onerror = function error(e) {
    self.postMessage({ ...e, file: option.file, uid: option.uid, event: 'error' })
  };
  xhr.onload = function onload() {
    // allow success when 2xx status
    // see https://github.com/react-component/upload/issues/34
    if (xhr.status < 200 || xhr.status >= 300) {
      return self.postMessage({ ...getError(option, xhr), file: option.file, uid: option.uid, event: 'error' })
    }
    self.postMessage({ ...getBody(xhr), event: 'success', sectionSchedulesId: option.sectionSchedulesId, timeout: option.timeout })
  };


  xhr.open(option.method, option.action, true);

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
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  for (const h in headers) {
    if (headers.hasOwnProperty(h) && headers[h] !== null) {
      xhr.setRequestHeader(h, headers[h]);
    }
  }
  if (option.payload) {
    xhr.send(JSON.stringify(option.payload));
  } else {
    xhr.send();
  }

  return {
    abort() {
      xhr.abort();
    },
  };
}

self.onmessage = function (e) {
  if (e.data && e.data.payload) {
    sendRequest(e.data.payload);
  }
};
