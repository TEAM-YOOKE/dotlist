import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
// import * as serviceWorkerRegistration from './serviceWorkerRegistration';

// serviceWorkerRegistration.register();

import { Provider } from "react-redux";
import store from "./reducers";

import { messaging } from './firebase.js';

navigator.serviceWorker
  .register('/firebase-messaging-sw.js')
  .then((registration) => {
    messaging.useServiceWorker(registration);
    console.log('Service Worker registered successfully:', registration);
  })
  .catch((error) => {
    console.error('Service Worker registration failed:', error);
  });


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>

    <App />
    </Provider>
  </StrictMode>,
)
