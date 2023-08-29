import React from "react";
import { useGoogleLogin } from "react-google-login";

const GoogleLogin = () => {
  const clientId = process.env.REACT_ALL_GOOGLE_CLIENT_ID;

  const onSuccess = (res) => {
    console.log("Login Success: currentUser:", res.profileobj);
    // refreshTokenSetup(res)
  };
  const onFailure = (res) => {
    console.log("Login failed: res", res);
  };

  const { signIn } = useGoogleLogin({
    onSuccess,
    onFailure,
    clientId,
    isSignedIn: true,
    accessType: "offline",
  });
  //   const signInTesst = () => {
  //     console.log("hello world");
  //   };
  return (
    <div>
      <button onClick={signIn} className="button">
        <span className="buttonText">Sign in with Google</span>
      </button>
    </div>
  );
};

export default GoogleLogin;
