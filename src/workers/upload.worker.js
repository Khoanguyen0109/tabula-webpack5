/* eslint-disable */
require('formdata-polyfill');
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

function upload(option) {
  const xhr = new XMLHttpRequest();
  console.log('option', option);
  if (xhr.upload) {
    xhr.upload.onprogress = function progress(e) {
      if (e.total > 0) {
        e.percent = Math.round(e.loaded / e.total) * 100;
      }
      self.postMessage({...e, file: option.file, uid: option.uid, event: 'progress'});
      // option.onProgress(e);
    };
  }

  const formData = new FormData();

  if (option.data) {
    Object.keys(option.data).forEach(key => {
      formData.append(key, option.data[key]);
    });
  }

  formData.append(option.filename, option.file);

  xhr.onerror = function error(e) {
    // option.onError(e);
    self.postMessage({...e, file: option.file, uid: option.uid, event: 'error'})
  };

  xhr.onload = function onload() {
    // allow success when 2xx status
    // see https://github.com/react-component/upload/issues/34
    if (xhr.status < 200 || xhr.status >= 300) {
      return self.postMessage({...getError(option, xhr), file: option.file, uid: option.uid, event: 'error'})
      // return option.onError(getError(option, xhr), file getBody(xhr));
    }
    self.postMessage({...getBody(xhr), file: option.file, uid: option.uid, event: 'success'})
    // option.onSuccess(getBody(xhr), xhr);
  };


  xhr.open('POST', option.action, true);

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
  xhr.send(formData);

  return {
    abort() {
      xhr.abort();
    },
  };
}

self.onmessage = function(e) {
  if (e.data && e.data.file) {
    // console.log(e.data);
    upload(e.data);
  }
};
