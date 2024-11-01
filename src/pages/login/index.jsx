import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { user } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const roleBasedRedirect = (user) => {
    if (user) {
      navigate("/todos");
    } 
  };

  useEffect(() => {
    if (user && user.token) roleBasedRedirect(user);
  });

  const googleSignIn = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const { user } = result;
      const idTokenResult = await user.getIdTokenResult();

      googleLogin(idTokenResult.token)
        .then((res) => {
          dispatch({
            type: "LOGGED_IN_USER",
            payload: {
              email: res.data.email,
              role: res.data.role,
              name: res.data.name,
              token: idTokenResult.token,
              phoneNumber: res.data.phoneNumber ? res.data.phoneNumber : "",
              _id: res.data._id,
            },
          });
          toast.success(
            `Welcome ${res.data.name.slice(0, res.data.name.indexOf(" "))}`
          );
          roleBasedRedirect(res.data);
          setLoading(false);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      if (error.message === "Firebase: Error (auth/popup-closed-by-user).") {
        setLoading(false);
        return;
      }
      console.log(error.message);
      toast.error(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      
      <form onSubmit={googleSignIn}>
       
      </form>
    </div>
  );
};

export default Login