import React from 'react';
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { app } from '../firebase'; // Make sure the path to your firebase.js file is correct
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice.js';

const OAuth = () => {
  const dispatch = useDispatch();

  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photoURL: result.user.photoURL,
        }),
      });
      const data = await res.json();
      dispatch(signInSuccess(data));
    } catch (error) {
      console.error('Error during sign-in:', error.message);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleClick}
      className="p-3 text-center text-white bg-red-700 rounded-lg shadow-lg hover:opacity-95 uppercase"
    >
      Sign in With Google
    </button>
  );
};

export default OAuth;
