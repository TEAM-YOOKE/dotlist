import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../firebase";
import toast from "react-hot-toast";
import googleLogo from "../../assets/googleLogo.svg";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

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

  // Firebase Google Sign-In handler
  const googleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const { user } = result;

      if (user) {
        handleUserLogin(user);
        navigate("/todos");
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle user login by saving user data to state and Firestore
  const handleUserLogin = async (user) => {
    const userDoc = doc(db, "users", user.uid);
    const userSnap = await getDoc(userDoc);

    if (!userSnap.exists()) {
      await setDoc(userDoc, {
        email: user.email,
        name: user.displayName,
        id: user.uid,
        token: user.accessToken,
        todos: [],
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
        token: user.accessToken,
      },
    });
    toast.success(`Welcome ${user.displayName}`);
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
    <div className="login-container flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl text-white font-semibold mb-6">Login</h2>

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
  );
};

export default Login;
