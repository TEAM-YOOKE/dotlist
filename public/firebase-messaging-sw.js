importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging.js');

// importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
// importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDBPvpFgDU6uKDnpTTmdddxx2fnec0IIRM",
  authDomain: "yookie-wqzrfr.firebaseapp.com",
  projectId: "yookie-wqzrfr",
  storageBucket: "yookie-wqzrfr.appspot.com",
  messagingSenderId: "671633688922",
  appId: "1:671633688922:web:d952f60f52d6aa037e4b63"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message: ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/android-chrome-192x192.png', 
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
