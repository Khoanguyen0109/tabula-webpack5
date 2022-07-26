/* eslint-disable */
// importScripts('lodash/core');
import  cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';
// const _ = require('lodash');
// import _ from 'lodash';
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

  // if (xhr.upload) {
  //   xhr.upload.onprogress = function progress(e) {
  //     if (e.total > 0) {
  //       e.percent = Math.round(e.loaded / e.total) * 100;
  //     }
  //     // option.onProgress(e);
  //   };
  // }

  // const formData = new FormData();

  // if (option.data) {
  //   Object.keys(option.data).forEach(key => {
  //     formData.append(key, option.data[key]);
  //   });
  // }

  // formData.append(option.filename, option.file);

  // xhr.onerror = function error(e) {
  //   // option.onError(e);
  //   self.postMessage({...e, uid: option.uid, event: 'error'})
  // };

  xhr.onload = function onload() {
    // allow success when 2xx status
    if (xhr.status < 200 || xhr.status >= 300) {
      self.postMessage({ ...getBody(xhr), event: 'error', courseDayId: option.courseDayId, updateData: option.updateData})
      // return option.onError(getError(option, xhr), file getBody(xhr));
    } else {
      // console.log(xhr.status, option.method);
      self.postMessage({...getBody(xhr), event: 'success', updateData: option.updateData, courseDayId: option.courseDayId, timeout: option.timeout})
    }
    // option.onSuccess(getBody(xhr), xhr);
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
function generateData(data, columnKey) {
  const cloneData = !isEmpty(data) ? {...data} : { noItems: [] };
  Object.keys(cloneData).forEach(key => {
    cloneData[key].forEach((i, index) => {
      const newItem = {};
      newItem.data = i;
      // newItem.id = uniqueId(`${columnKey}_${i.type || 0}_${i.id}_`);
      newItem.id = `${columnKey}_${i.type || 0}${i.type === 3 ? '-' + i.quizType : ''}_${i.id}`;
      // newItem.id = uniqueId(`${key}_`);
      cloneData[key][index] = newItem;
    });
  });
  return {
    [`${columnKey}`]: { ...cloneData}
  };
};

function getColumnKeys(quoteMap) {
  if (isEmpty(quoteMap)) {
    return ['noItems'];
  }
  return Object.keys(quoteMap).sort();
};
function processData(data, sections) {
  const courseDayData = cloneDeep(data.courseDay);
  const courseDayId = data.courseDayId;
  const masterItem = {};
  const masterColumnKeys = getColumnKeys(courseDayData.items);
  masterItem.columnKeys = masterColumnKeys;
  masterItem.quoteMap = generateData(courseDayData.items, `masterItem-${courseDayId}`);

  const shadowItem = [];

  if (!isEmpty(courseDayData.sectionSchedules)) {
    courseDayData.sectionSchedules.forEach((s, index) => {
      const shadowKey = `shadowItem-${courseDayId}-${s.id}`;
      const newData = {};
      const columnKeys = getColumnKeys(s.items);
      newData.columnKeys = columnKeys;
      newData.data = s;
      newData.quoteMap = generateData(s.items, shadowKey);
      shadowItem.push(newData);
    });
    // Handle for missing
    if (shadowItem) {
      shadowItem.sort((a, b) => {
        return Number(a.data.sectionId) - Number(b.data.sectionId);
      });
    }
    if (shadowItem && sections && shadowItem.length !== sections.length) {
      for(let i = 0; i < sections.length; i++) {
        if (!shadowItem[i]) {
          shadowItem.push({data: {isEmpty: true, sectionId: sections[i]}});
        }
      }
      shadowItem.sort((a, b) => {
        return Number(a.data.sectionId) - Number(b.data.sectionId);
      });
    }
  }
  const processedData = {
    masterItem,
    shadowItem,
    courseDayData
  };
  self.postMessage({processedData, courseDayId});
}
self.onmessage = function(e) {
  if (e.data && e.data.planning) {
    // console.log(e.data);
    sendRequest(e.data.planning);
  } else  if (e.data && e.data.processData) {
    processData(e.data.processData, e.data.sections);
  }
};
