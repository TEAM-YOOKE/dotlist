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
  

// Request permission to show notifications
const requestPermission = async () => {
  try {
    await Notification.requestPermission();
    console.log("Notification permission granted.");
  } catch (error) {
    console.error("Unable to get permission to notify.", error);
  }
};

useEffect(() => {
  onMessage(messaging, (payload) => {
    console.log("Message received in foreground: ", payload);
    // Display notification
    const { title, body } = payload.notification;
    new Notification(title, { body });
  });
  requestPermission();
}, []);

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
