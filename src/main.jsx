import { onMessage } from "firebase/messaging";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
// import * as serviceWorkerRegistration from './serviceWorkerRegistration';

// serviceWorkerRegistration.register();

import { Provider } from "react-redux";
import store from "./reducers";

import { messaging } from './firebase.js';

// Request permission to show notifications
const requestPermission = async () => {
  try {
    await Notification.requestPermission();
    console.log("Notification permission granted.");
  } catch (error) {
    console.error("Unable to get permission to notify.", error);
  }
};

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register(`/firebase-messaging-sw.js`)
    .then((registration) => {
      console.log("Service Worker registered", registration);
      requestPermission(); // Request notification permission here
    })
    .catch((err) => console.error("Service Worker registration failed", err));
}

// Handle foreground messages
onMessage(messaging, (payload) => {
  console.log("Message received in foreground: ", payload);
  // Display notification
  const { title, body } = payload.notification;
  new Notification(title, { body });
});

// navigator.serviceWorker
//   .register('/firebase-messaging-sw.js')
//   .then((registration) => {
//     messaging.useServiceWorker(registration);
//     console.log('Service Worker registered successfully:', registration);
//   })
//   .catch((error) => {
//     console.error('Service Worker registration failed:', error);
//   });


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <App />
    </Provider>
  </StrictMode>,
)
