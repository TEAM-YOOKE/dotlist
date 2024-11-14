import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/login";
import UserRoute from "./routes/UserRoute";
import Todos from "./pages/todos";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import { Toaster } from "react-hot-toast";
import { messaging } from './firebase.js';
import { onMessage } from "firebase/messaging";

function App() {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  
// Request permission to show notifications
const requestPermission = async () => {
  if (Notification.permission !== "granted") {
    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        console.log("Notification permission granted.");
      } else {
        console.log("Notification permission denied.");
      }
    } catch (error) {
      console.error("Unable to get permission to notify.", error);
    }
  } else {
    console.log("Notification permission already granted.");
  }
};

useEffect(() => {
  setLoading(true);
  const unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (user) {
      console.log("Logged In user", user);
      dispatch({
        type: "LOGGED_IN_USER",
        payload: {
          email: user.email,
          name: user.displayName,
          id: user.uid,
          token: user.accessToken,
        },
      });
    }
    setLoading(false);
  });
  return () => unsubscribe();
}, [dispatch]);

useEffect(() => {
  requestPermission();

  //Register Service Worker
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register(`/firebase-messaging-sw.js`)
      .then((registration) => {
        console.log("Service Worker registered", registration);
      })
      .catch((err) => console.error("Service Worker registration failed", err));
  }

  // Handle foreground messages
  const unsubscribe = onMessage(messaging, (payload) => {
    console.log("Message received in foreground: ", payload);
    const { title, body } = payload.notification;
    new Notification(title, { body });
  });

  // Cleanup function to avoid memory leaks
  return () => unsubscribe();
}, [messaging]);


 

  const [count, setCount] = useState(0);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/todos",
      element: (
        <UserRoute>
          <Todos />
        </UserRoute>
      ),
    },
  ]);

  return (
    <>
      <Toaster />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
