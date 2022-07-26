/* eslint-disable no-console */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/7.19.1/firebase-app.js');
importScripts(
  'https://www.gstatic.com/firebasejs/7.19.1/firebase-messaging.js'
);
importScripts(
  'https://www.gstatic.com/firebasejs/7.19.1/firebase-analytics.js'
);

self.addEventListener('fetch', () => {
  const urlParams = new URLSearchParams(location.search);
  self.firebaseConfig = Object.fromEntries(urlParams);
});

const defaultConfig = {
  apiKey: true,
  projectId: true,
  messagingSenderId: true,
  appId: true,
};

self.addEventListener('notificationclick', function (event) {
  console.log('event :>> ', event);
  event.notification.close();
  let redirect_url= '/my-tasks';
  const notify = event.notification.data.FCM_MSG;
  const {data: {notificationId ,seri, step, studentId}} = notify;
  if(['3','5','6'].includes(step)){
    redirect_url = `/my-tasks/guardian/${studentId}`;
  }
  if(event.action ===''){
    switch (seri) {
      case '1':
      case '2':
        return clients.openWindow(
          `${redirect_url}?notificationId=${notificationId}&action=notificationclick`
        );
      default:
        break;
    }
  }
  // if (!event.action) {
    event.waitUntil(
      clients
        .matchAll({ includeUncontrolled: true, type: 'window' })
        .then((clientList) => {
          for (let i = 0; i < clientList.length; i++) {
            const client = clientList[i];
            if (
              client.url.includes(event.target.location.origin) &&
              'focus' in client
            ) {
              client.postMessage({ ...notify });
              return client.focus();
            }
          }
          if (clients.openWindow) {
            clients.openWindow(
              `${redirect_url}?notificationId=${notificationId}`
            );
          }
        })
        .catch((err) => {
          console.log('err :>> ', err);
        })
    );
  // }
  if(event.action !==''){
    return clients.openWindow(
      `${redirect_url}?notificationId=${notificationId}&action=${event.action}`
    );
  }

});

firebase.initializeApp(self.firebaseConfig || defaultConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  console.log('Received background message ', payload);
  // Customize notification here
});
