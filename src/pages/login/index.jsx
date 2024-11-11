import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import toast from "react-hot-toast";
import logo from "../../assets/logo.svg";
import logoText from "../../assets/logotext.svg";
import googleLogo from "../../assets/googleLogo.svg";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { messaging } from "../../firebase";
import { getToken } from "firebase/messaging";

const db = getFirestore(); // Initialize Firestore outside of component

const Login = () => {
  const { user } = useSelector((state) => ({ ...state }));
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();

  // Redirect if already logged in
  useEffect(() => {
    if (user) navigate("/todos");
  }, [user, navigate]);

  // Request Notification Permission and Get Token
  const requestNotificationPermission = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const userToken = await getToken(messaging, {
        vapidKey: "BK9YG8e3kW5iiPOwVcSPzpJdwa2yFI0rPW34pAM7WktVQmyt1OKmMEo925pQBmVeDU_OSi0NXHhnS68jR8ge5fc",
        serviceWorkerRegistration: registration,
      });
      if (userToken) {
        console.log("Notification Token:", userToken);
        return userToken; // Return token if available
      } else {
        console.log("No registration token available.");
        return null;
      }
    } catch (error) {
      console.error("Error retrieving token", error);
      return null;
    }
  };

  // Handle user login by saving user data to state and Firestore
  const handleUserLogin = async (user, userToken) => {
    const userDoc = doc(db, "users", user.uid);
    const userSnap = await getDoc(userDoc);

    if (!userSnap.exists()) {
      await setDoc(userDoc, {
        email: user.email,
        name: user.displayName,
        id: user.uid,
        authToken: user.accessToken,
        todos: [],
        token: userToken, // Save token here
      });
      console.log("User saved to Firestore");
    } else {
      console.log("User already exists in Firestore");
    }

    // Dispatch user data to Redux store
    dispatch({
      type: "LOGGED_IN_USER",
      payload: {
        email: user.email,
        name: user.displayName,
        id: user.uid,
        authToken: user.accessToken,
      },
    });
    toast.success(`Welcome ${user.displayName}`);
  };

  // Firebase Google Sign-In handler
  const googleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, provider);
      const { user } = result;

      if (user) {
        // Get notification token only after successful login
        // const userToken = await requestNotificationPermission();
        await handleUserLogin(user, userToken); // Pass token as a parameter
        navigate("/todos");
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  // Centralized error handler
  const handleError = (error) => {
    if (error.message === "Firebase: Error (auth/popup-closed-by-user).") {
      return; // Ignore if user closes popup
    }
    console.error("Error:", error.message);
    toast.error("Error logging in. Please try again.");
  };

  return (
    <div className="flex flex-col w-full justify-center gap-40 mt-32 align-middle items-center">
      <div className="flex justify-center align-middle items-center">
        <img src={logo} alt="Logo" />
        <img src={logoText} alt="Logo" />
      </div>

      <div className="login-container flex flex-col gap-4 items-center justify-center">
        <h2 className="text-2xl text-white font-semibold">Login</h2>

        <form onSubmit={googleSignIn} className="flex flex-col items-center">
          <button
            type="submit"
            className="flex items-center gap-2 text-white hover:bg-blue-700 border-2 border-gray-500 rounded-full px-6 py-3 transition-all duration-200"
            disabled={loading}
          >
            <img src={googleLogo} alt="Google Logo" className="w-10 h-10" />
            {loading ? "Loading..." : "Continue with Google"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
