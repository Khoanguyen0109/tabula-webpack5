export function isSafari() {
  return /constructor/i.test(window.HTMLElement) ||
  (function (p) {
    return p.toString() === '[object SafariRemoteNotification]';
  })(
    !window['safari'] ||
      (typeof safari !== 'undefined' && window['safari'].pushNotification)
  );
}

export function isFirefox() {
  return typeof InstallTrigger !== 'undefined';
}
export function isChrome (){
    return !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
}