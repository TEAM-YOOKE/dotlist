import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// import { getAnalytics } from "firebase/analytics";

// const firebaseConfig = {
//     apiKey: "AIzaSyBDhPUWUOfYQDQHsobZADtTEYV6cPGxNbM",
//     authDomain: "fir-tutorials-f8963.firebaseapp.com",
//     projectId: "fir-tutorials-f8963",
//     storageBucket: "fir-tutorials-f8963.firebasestorage.app",
//     messagingSenderId: "520486593564",
//     appId: "1:520486593564:web:ace03c7bc8c80f918e6bd9",
//     measurementId: "G-RBY9L9V334"
//   };
const firebaseConfig = {
  apiKey: import.meta.env.VITE_apiKey,
  authDomain: import.meta.env.VITE_authDomain,
  projectId: import.meta.env.VITE_projectId,
  storageBucket: import.meta.env.VITE_storageBucket,
  messagingSenderId: import.meta.env.VITE_messagingSenderId,
  appId: import.meta.env.VITE_appId,
  measurementId: import.meta.env.VITE_measurementId,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app);
