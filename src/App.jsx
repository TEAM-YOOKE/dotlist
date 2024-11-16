import { useEffect, useState, useCallback } from "react";
import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./pages/login";
import UserRoute from "./routes/UserRoute";
import Todos from "./pages/todos";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { useDispatch } from "react-redux";
import { Toaster } from "react-hot-toast";
import { messaging } from "./firebase.js";
import { onMessage } from "firebase/messaging";

function App() {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  // Request permission to show notifications
  const requestPermission = useCallback(async () => {
    try {
      if (Notification.permission !== "granted") {
        const permission = await Notification.requestPermission();
        console.log(`Notification permission: ${permission}`);
      } else {
        console.log("Notification permission already granted.");
      }
    } catch (error) {
      console.error("Unable to get notification permission:", error);
    }
  }, []);

  // Handle Auth State Changes
  useEffect(() => {
    setLoading(true);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
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

    return () => unsubscribe(); // Cleanup on unmount
  }, [dispatch]);

  // Setup Notifications and Service Worker
  useEffect(() => {
    requestPermission();

    // Register Service Worker
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .getRegistration("/firebase-messaging-sw.js")
        .then((registration) => {
          if (!registration) {
            navigator.serviceWorker
              .register(`/firebase-messaging-sw.js`)
              .then((registration) =>
                console.log("Service Worker registered:", registration)
              )
              .catch((err) =>
                console.error("Service Worker registration failed:", err)
              );
          } else {
            console.log("Service Worker already registered.");
          }
        });
    }

    // Handle foreground messages
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("Message received in foreground:", payload);
      const { title, body } = payload.notification;
      if (title && body) {
        new Notification(title, { body });
      }
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [requestPermission]);

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
