importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.1/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyBDhPUWUOfYQDQHsobZADtTEYV6cPGxNbM",
    authDomain: "fir-tutorials-f8963.firebaseapp.com",
    projectId: "fir-tutorials-f8963",
    storageBucket: "fir-tutorials-f8963.firebasestorage.app",
    messagingSenderId: "520486593564",
    appId: "1:520486593564:web:ace03c7bc8c80f918e6bd9",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message: ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/android-chrome-192x192.png',  // Customize the icon path
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
